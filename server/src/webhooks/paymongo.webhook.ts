import { Request, Response } from 'express';
import PaymentModel from '../models/payment.model';
import RegistrationModel from '../models/registration.model';
import EventModel from '../models/event.model';
import { asyncHandler } from '../utils/utils';
import { NOT_FOUND, OK } from '../constant/http';
import appAssert from '../errors/app-assert';

export const handlePaymongoWebhook = asyncHandler(async (req, res) => {
	const event = req.body;

	if (event.data.attributes.type !== 'checkout_session.payment.paid') {
		res.sendStatus(OK);
		return;
	}

	const session = event.data.attributes.data;
	const registrationId = session.attributes.metadata.registrationId;

	const payment = await PaymentModel.findOne({
		checkoutSessionId: session.id,
	});

	appAssert(payment, NOT_FOUND, 'Payment not found');
	appAssert(payment.status === 'pending', OK, 'Payment already processed');

	await PaymentModel.findByIdAndUpdate(payment._id, {
		status: 'paid',
		paidAt: new Date(),
	});

	await RegistrationModel.findByIdAndUpdate(registrationId, {
		status: 'confirmed',
	});

	await EventModel.findByIdAndUpdate(payment.event, {
		$inc: { registeredCount: 1 },
	});

	res.sendStatus(OK);
});
