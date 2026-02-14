import crypto from 'crypto';
import { Request, Response } from 'express';
import PaymentModel from '../models/payment.model';
import RegistrationModel from '../models/registration.model';
import EventModel from '../models/event.model';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/utils';
import { processSuccessfulPayment } from '../services/paymongo.service';
import { OK } from '../constant/http';
import appAssert from '../errors/app-assert';

export const handlePaymongoWebhook = asyncHandler(async (req, res) => {
	const signature = req.headers['paymongo-signature'] as string;
	const payload = req.body as Buffer;

	// if (!verifyPaymongoSignature(payload, signature)) {
	// 	return res.status(401).json({ message: 'Invalid signature' });
	// }

	const event = JSON.parse(payload.toString());

	appAssert(
		event.data.attributes.type === 'checkout_session.payment.succeeded',
		OK,
		'Payment not found',
	);

	await processSuccessfulPayment(event);

	res.sendStatus(200);
});
