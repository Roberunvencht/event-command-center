import { FRONTEND_URL } from '../constant/env';
import { BAD_REQUEST, NOT_FOUND } from '../constant/http';
import appAssert from '../errors/app-assert';
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

export const verifyCheckoutSession = asyncHandler(async (req, res) => {
	const user = req.user;
	const { registrationId } = req.body;

	appAssert(registrationId, BAD_REQUEST, 'Registration ID is required');

	const registration = await RegistrationModel.findById(registrationId);
	appAssert(registration, NOT_FOUND, 'Registration not found');

	const payment = await PaymentModel.findOne({
		user: user._id,
		registration: registration._id,
	});

	appAssert(payment, NOT_FOUND, 'Payment record not found');

	if (payment.status === 'paid') {
		res.json(new CustomResponse(true, true, 'Payment already confirmed'));
		return;
	}

	const { hasPaid, activeCheckoutUrl } = await checkIfUserAlreadyPaid([
		payment.checkoutSessionId,
	]);

	if (hasPaid) {
		await Promise.all([
			PaymentModel.findByIdAndUpdate(payment._id, {
				status: 'paid',
				paidAt: new Date(),
			}),
			RegistrationModel.findByIdAndUpdate(registration._id, {
				status: 'confirmed',
			}),
		]);

		res.json(new CustomResponse(true, true, 'Payment successful'));
		return;
	}

	res.json(new CustomResponse(true, activeCheckoutUrl, 'Payment pending'));
});
