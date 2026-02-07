import { Request, Response } from 'express';
import { getUserRequestInfo } from '../utils/utils';
import { thirtyDaysFromNow } from '../utils/date';
import { refreshTokenSignOptions, signToken } from '../utils/jwts';
import { setAuthCookie } from '../utils/cookie';
import UserModel, { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT } from '../constant/env';
import SessionModel from '../models/session.model';

export const loginService = async (
	req: Request,
	res: Response,
	user: IUser,
) => {
	try {
		const { ip, userAgent } = getUserRequestInfo(req);
		const userID = user._id as unknown as string;

		// Create session
		const session = await SessionModel.create({
			userID: userID,
			expiresAt: thirtyDaysFromNow(),
			ip: ip || '',
			userAgent: userAgent || '',
		});

		// sign tokens
		const sessionID = session._id as unknown as string;
		const accessToken = signToken({ sessionID, userID });
		const refreshToken = signToken({ sessionID }, refreshTokenSignOptions);
		setAuthCookie({ res, accessToken, refreshToken });

		req.user = user;
		return accessToken;
	} catch (error: any) {
		throw new Error('Login service failed: ' + error.message);
	}
};

type SignupData = {
	name: string;
	email: string;
	password: string; // unhashed password
	googleID?: string;
	profilePicture?: string;
};

export const signupService = async (signupData: SignupData) => {
	try {
		const hashedPassword = await bcrypt.hash(
			signupData.password,
			parseInt(BCRYPT_SALT),
		);
		signupData.password = hashedPassword;

		const user = await UserModel.create(signupData);

		return user;
	} catch (error: any) {
		throw new Error('Signup service failed: ' + error.message);
	}
};
