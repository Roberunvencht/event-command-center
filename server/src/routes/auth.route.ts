import express from 'express';
import {
	forgotPasswordHandler,
	googleCallbackHandler,
	googleLoginHandler,
	loginHandler,
	logoutHandler,
	recaptchaVerify,
	refreshTokenHandler,
	resetPasswordHandler,
	signupHandler,
	verifyAuthHandler,
    updateProfileHandler,
} from '../controllers/auth.controller';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.post('/login', loginHandler);

router.post('/signup', signupHandler);

router.post('/token/verify', verifyAuthHandler);

router.get('/logout', logoutHandler);

router.get('/refresh', refreshTokenHandler);

router.post('/recaptcha/verify', recaptchaVerify);

router.get('/google-calendar', googleLoginHandler);

router.get('/google-calendar/callback', googleCallbackHandler);

router.post('/forgot-password', forgotPasswordHandler);

router.post('/reset-password/:token', resetPasswordHandler);

router.patch('/me', auth, updateProfileHandler);

export default router;
