import mongoose from 'mongoose';
import { FRONTEND_URL } from '../constant/env';
import { BAD_REQUEST, NOT_FOUND } from '../constant/http';
import appAssert from '../errors/app-assert';
import DeviceModel from '../models/device.model';
import EventModel from '../models/event.model';
import PaymentModel from '../models/payment.model';
import RegistrationModel, {
	PopulatedRegistration,
} from '../models/registration.model';
import {
	checkIfUserAlreadyPaid,
	createPaymongoCheckout,
} from '../services/paymongo.service';
import CustomResponse from '../utils/response';
import { asyncHandler } from '../utils/utils';

/**
 * @route POST /api/v1/payment/create
 */
export const createCheckoutSession = asyncHandler(async (req, res) => {
	const { registrationId } = req.body;
	const userId = req.user!._id;

	const registration = await RegistrationModel.findById(registrationId)
		.populate('event')
		.lean<PopulatedRegistration>();
	appAssert(registration, NOT_FOUND, 'Registration not found');

	const { event } = registration;
	const raceCategory = event.raceCategories.find(
		(rc) => rc._id.toString() === registration.raceCategory.toString(),
	);
	appAssert(raceCategory, BAD_REQUEST, 'Race category not found');

	const checkout = await createPaymongoCheckout({
		amount: raceCategory.price,
		successUrl: `${FRONTEND_URL}/client/payment/success/?registrationId=${registration._id}&eventId=${event._id}&userId=${userId}`,
		description: raceCategory.distanceKm + 'km race',
		name: raceCategory.distanceKm + 'km race',
		metadata: {
			registrationId: registration._id.toString(),
			eventId: event._id.toString(),
			userId: req.user._id.toString(),
		},
	});

	const checkoutUrl = checkout.attributes.checkout_url;
	const checkoutID = checkout.id;

	await PaymentModel.create({
		user: userId,
		event: event._id,
		registration: registration._id,
		provider: 'paymongo',
		checkoutSessionId: checkoutID,
		checkoutUrl,
		amount: raceCategory.price,
		currency: 'PHP',
		status: 'pending',
	});

	res.json({ checkoutUrl });
});

/**
 * @route POST /api/v1/payment/verify
 */
export const verifyCheckoutSession = asyncHandler(async (req, res) => {
	const user = req.user;
	const { registrationId } = req.body;

	appAssert(registrationId, BAD_REQUEST, 'Registration ID is required');

	const registration = await RegistrationModel.findOne(
		{
			_id: registrationId,
		},
		null,
	);

	appAssert(registration, NOT_FOUND, 'Registration not found');

	const payment = await PaymentModel.findOne(
		{
			user: user._id,
			registration: registration._id,
		},
		null,
	);

	appAssert(payment, NOT_FOUND, 'Payment record not found');

	// If already paid → exit safely
	if (payment.status === 'paid') {
		res.json(new CustomResponse(true, true, 'Payment already confirmed'));
		return;
	}

	// Check PayMongo
	const { hasPaid, activeCheckoutUrl } = await checkIfUserAlreadyPaid([
		payment.checkoutSessionId,
	]);

	if (!hasPaid) {
		res.json(new CustomResponse(true, activeCheckoutUrl, 'Payment pending'));
		return;
	}

	/**
	 * 🔥 CRITICAL: Atomic payment status update
	 * Only update if status is NOT already paid
	 */
	const updatedPayment = await PaymentModel.findOneAndUpdate(
		{
			_id: payment._id,
			status: { $ne: 'paid' },
		},
		{
			$set: {
				status: 'paid',
				paidAt: new Date(),
			},
		},
		{ new: true },
	);

	// If null → another request already updated it
	if (!updatedPayment) {
		res.json(new CustomResponse(true, true, 'Payment already processed'));
		return;
	}

	/**
	 * Confirm registration (only if still pending)
	 */
	await RegistrationModel.updateOne(
		{
			_id: registration._id,
			status: { $ne: 'confirmed' },
		},
		{
			$set: { status: 'confirmed' },
		},
	);

	/**
	 * Atomic increment of registered count
	 */
	await EventModel.updateOne(
		{
			_id: registration.event as string,
			'raceCategories._id': registration.raceCategory,
		},
		{
			$inc: {
				'raceCategories.$.registeredCount': 1,
			},
		},
	);

	/**
	 * Atomic device assignment
	 */
	const device = await DeviceModel.findOneAndUpdate(
		{
			registration: null,
			isActive: true,
		},
		{
			$set: {
				registration: registration._id,
			},
		},
		{ new: true },
	);

	if (device) {
		await RegistrationModel.updateOne(
			{ _id: registration._id },
			{ $set: { device: device._id } },
		);
	}

	res.json(new CustomResponse(true, true, 'Payment successful'));
});
