import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import CustomResponse from '../utils/response';
import appAssert from '../errors/app-assert';
import { createUserSchema, loginSchema } from '../schemas/user.schema';
import SessionModel from '../models/session.model';
import UserModel from '../models/user.model';

import {
	generateCypto,
	getPasswordResetEmailTemplate,
	hashCrypto,
} from '../utils/utils';
import {
	ONE_DAY_MS,
	ONE_HOUR_FROM_NOW,
	thirtyDaysFromNow,
} from '../utils/date';
import {
	getAccessToken,
	RefreshTokenPayload,
	refreshTokenSignOptions,
	signToken,
	verifyToken,
} from '../utils/jwts';
import {
	cookieOptions,
	getAccessTokenOptions,
	getRefreshTokenOptions,
	REFRESH_PATH,
} from '../utils/cookie';
import {
	BAD_REQUEST,
	CONFLICT,
	NO_CONTENT,
	OK,
	UNAUTHORIZED,
} from '../constant/http';

import { loginService, signupService } from '../services/auth';
import z from 'zod';
import {
	ACCESS_TOKEN_COOKIE_NAME,
	BCRYPT_SALT,
	EMAIL_USER,
	FRONTEND_URL,
	JWT_REFRESH_SECRET_KEY,
	REFRESH_TOKEN_COOKIE_NAME,
} from '../constant/env';
import { AppErrorCodes } from '../constant';
import { sendMail } from '../services/email';
import { oAuth2Client } from '../services/google-client';
import { google } from 'googleapis';

/**
 * @route POST /api/v1/auth/login - Login
 */
export const loginHandler = asyncHandler(async (req, res) => {
	const body = loginSchema.parse(req.body);
	const user = await UserModel.findOne({ email: body.email })
		.populate('adminRole')
		.exec();

	// Check if user exists
	appAssert(user, UNAUTHORIZED, 'Incorrect email or password');

	// Check password
	const match = await bcrypt.compare(body.password, user.password);
	appAssert(match, UNAUTHORIZED, 'Incorrect email or password');

	await loginService(req, res, user);

	res.json(new CustomResponse(true, user.omitPassword(), 'Login successful'));
});

/**
 * @route POST /api/v1/auth/signup - Sign up
 */
export const signupHandler = asyncHandler(async (req, res) => {
	const body = createUserSchema.parse(req.body);

	// check for duplicate email
	const existingUser = await UserModel.findOne({ email: body.email });
	appAssert(!existingUser, CONFLICT, 'Email already used');

	const sameInstitutionalID = await UserModel.findOne({
		institutionalID: body.institutionalID,
	});
	appAssert(!sameInstitutionalID, CONFLICT, 'Institutional ID already used');

	// Check if passwords match
	appAssert(
		body.password === body.confirmPassword,
		BAD_REQUEST,
		'Passwords do not match',
	);

	// create user
	const user = await signupService(body);
	req.user = user;

	res.json(new CustomResponse(true, user.omitPassword(), 'Signup successful'));
});

/**
 * @route GET /api/v1/auth/logout - Logout
 */
export const logoutHandler = asyncHandler(async (req, res) => {
	const accessToken = getAccessToken(req);

	// check if token is present
	appAssert(accessToken, NO_CONTENT, 'No token');

	const { payload } = verifyToken(accessToken);

	if (payload) {
		await SessionModel.findByIdAndDelete(payload.sessionID);
	}

	// clear the cookie
	res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, cookieOptions);
	res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
		...cookieOptions,
		path: REFRESH_PATH,
	});
});

/**
 * @route GET /api/v1/auth/refresh - Refresh token
 */
export const refreshTokenHandler = asyncHandler(async (req, res) => {
	// get the refresh token
	const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;
	appAssert(refreshToken, UNAUTHORIZED, 'No refresh token found');

	// verify the refresh token
	const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
		secret: JWT_REFRESH_SECRET_KEY,
	});

	appAssert(payload, UNAUTHORIZED, 'Token did not return any payload');

	const session = await SessionModel.findById(payload.sessionID);
	const now = Date.now();

	// check if session is valid
	appAssert(session, UNAUTHORIZED, 'Invalid session');

	// check if session is expired
	if (session.expiresAt.getTime() < now) {
		await SessionModel.findByIdAndDelete(session._id);
		appAssert(false, UNAUTHORIZED, 'Session expired');
	}

	// check if session needs refresh
	const sessionNeedsRefresh = session.expiresAt.getTime() - now < ONE_DAY_MS;
	if (sessionNeedsRefresh) {
		session.expiresAt = thirtyDaysFromNow();
		await session.save();
	}

	// create and set the new access token and refresh token
	const newRefreshToken = sessionNeedsRefresh
		? signToken(
				{ sessionID: session._id as unknown as string },
				refreshTokenSignOptions,
			)
		: undefined;

	const accessToken = signToken({
		sessionID: session._id as unknown as string,
		userID: session.userID as unknown as string,
	});

	if (newRefreshToken) {
		res.cookie(
			REFRESH_TOKEN_COOKIE_NAME,
			newRefreshToken,
			getRefreshTokenOptions(),
		);
	}

	res
		.status(OK)
		.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, getAccessTokenOptions())
		.json(new CustomResponse(true, null, 'Token refreshed'));
});

/**
 * @route POST /api/v1/token/verify
 */
export const verifyAuthHandler = asyncHandler(async (req, res) => {
	const token = getAccessToken(req);
	appAssert(
		token,
		UNAUTHORIZED,
		'Token not found',
		AppErrorCodes.InvalidAccessToken,
	);

	// verify the token
	const { error, payload } = verifyToken(token);
	appAssert(
		!error && payload,
		UNAUTHORIZED,
		'Token not verified',
		AppErrorCodes.InvalidAccessToken,
	);

	const user = await UserModel.findById(payload.userID as string).populate(
		'adminRole',
	);
	const session = await SessionModel.findById(payload.sessionID);

	appAssert(
		session && user,
		UNAUTHORIZED,
		'User or session not found',
		AppErrorCodes.InvalidAccessToken,
	);

	const now = Date.now();

	if (session.expiresAt.getTime() < now) {
		await SessionModel.findByIdAndDelete(session._id);
		appAssert(
			false,
			UNAUTHORIZED,
			'Session expired',
			AppErrorCodes.InvalidAccessToken,
		);
	}

	res.status(OK).json(user.omitPassword());
});

/**
 * @route POST /api/v1/auth/recaptcha/verify
 */
export const recaptchaVerify = asyncHandler(async (req, res) => {
	const { recaptchaToken } = req.body;

	// const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
	// appAssert(isRecaptchaValid, BAD_REQUEST, 'Invalid recaptcha token');

	res.status(OK).json(new CustomResponse(true, null, 'Recaptcha verified'));
});

/**
 * @route POST /api/v1/auth/forgot-password
 */
export const forgotPasswordHandler = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const user = await UserModel.findOne({ email });
	appAssert(user, BAD_REQUEST, 'Email not found');

	// generate token
	const resetToken = generateCypto();
	const hashedToken = hashCrypto(resetToken);

	// set token and expiry (1 hour)
	user.resetPasswordToken = hashedToken;
	user.resetPasswordExpires = ONE_HOUR_FROM_NOW;
	await user.save();

	// send email
	const resetURL = `${FRONTEND_URL}/reset-password/${resetToken}`;

	const message = {
		from: `Lapsync" <${EMAIL_USER}>`,
		to: user.email,
		subject: 'Password Reset Request',
		html: getPasswordResetEmailTemplate(resetURL),
	};

	await sendMail(message);

	res.json(new CustomResponse(true, null, 'Reset link has been sent.'));
});

/**
 * @route POST /api/v1/auth/reset-password/:token
 */
export const resetPasswordHandler = asyncHandler(async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	// Hash token to compare with DB
	const hashedToken = hashCrypto((token as string) ?? '');

	const user = await UserModel.findOne({
		resetPasswordToken: hashedToken,
		resetPasswordExpires: { $gt: new Date() },
	});

	appAssert(user, BAD_REQUEST, 'Invalid or expired token');

	// Update password
	const hashedPassword = await bcrypt.hash(password, parseInt(BCRYPT_SALT));
	user.password = hashedPassword;
	user.resetPasswordToken = '';
	user.resetPasswordExpires = undefined;
	await user.save();

	res.json(
		new CustomResponse(true, null, 'Password has been reset successfully'),
	);
});

/**
 * @route GET /api/v1/auth/google-calendar
 */
export const googleCalendarLoginHandler = asyncHandler(async (req, res) => {
	const scopes = [
		'https://www.googleapis.com/auth/calendar.events',
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email',
		'openid',
	];

	const url = oAuth2Client.generateAuthUrl({
		access_type: 'offline', // get refresh token
		scope: scopes,
		prompt: 'consent', // always ask for consent to get refresh token
	});

	res.redirect(url);
});

/**
 * @route GET /api/v1/auth/google-calendar/callback
 */
export const googleCalendarCallbackHandler = asyncHandler(async (req, res) => {
	const code = req.query.code as string;
	appAssert(code, BAD_REQUEST, 'No code provided');

	// Exchange code for tokens
	const { tokens } = await oAuth2Client.getToken(code);
	oAuth2Client.setCredentials(tokens);

	// Get google user info
	const oauth2 = google.oauth2('v2');
	const { data: googleUser } = await oauth2.userinfo.get({
		auth: oAuth2Client,
	});
	appAssert(googleUser, BAD_REQUEST, 'Google user not found');

	let user = req.user;
	if (!user) {
		// no user in req means this is a login attempt via google
		// user = await UserModel.findOne({ email: googleUser.email });
		if (googleUser.email) {
			user = await UserModel.findOne({ googleID: googleUser.email });
		}

		// if no user still, this is a new user signing up via google
		if (!user) {
			const randomPassword = crypto.randomUUID() + 'A1!';
			const userInfo = createUserSchema.parse({
				name: googleUser.name,
				institutionalID: googleUser.email?.split('@')[0],
				email: googleUser.email,
				password: randomPassword,
				confirmPassword: randomPassword,
			});

			user = await signupService({
				...userInfo,
				profilePicture: googleUser.picture ?? '',
			});
		}
	}

	// Save tokens to user
	user.googleCalendarTokens = tokens;
	await user.save();

	await loginService(req, res, user);

	res.redirect(FRONTEND_URL);
});
