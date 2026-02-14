import axios from 'axios';
import { FRONTEND_URL, PAYMONGO_SECRET } from '../constant/env';
import PaymentModel from '../models/payment.model';
import mongoose from 'mongoose';
import RegistrationModel from '../models/registration.model';
import EventModel from '../models/event.model';

type CreateCheckoutParams = {
	amount: number; // PHP
	description: string;
	name: string;
	successUrl?: string;
	cancelUrl?: string;
	metadata?: Record<string, any>;
};

export async function createPaymongoCheckout({
	amount,
	description,
	name,
	successUrl,
	cancelUrl,
	metadata,
}: CreateCheckoutParams) {
	const payload = {
		data: {
			attributes: {
				send_email_receipt: true,
				show_description: true,
				show_line_items: true,

				description,

				success_url: successUrl ?? `${FRONTEND_URL}/client/payment/success`,

				cancel_url: cancelUrl ?? `${FRONTEND_URL}/client/payment/cancel`,

				line_items: [
					{
						currency: 'PHP',
						amount: amount * 100, // centavos
						name,
						quantity: 1,
					},
				],

				payment_method_types: ['gcash', 'paymaya', 'grab_pay', 'card'],

				metadata,
			},
		},
	};

	const response = await axios.post(
		'https://api.paymongo.com/v1/checkout_sessions',
		payload,
		{
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization:
					'Basic ' + Buffer.from(PAYMONGO_SECRET + ':').toString('base64'),
			},
			timeout: 30000,
		},
	);

	return response.data.data;
}

type CheckoutSession = {
	id: string;
	attributes: {
		status: 'active' | 'inactive' | 'expired';
		checkout_url: string;
		payment_intent?: {
			attributes: {
				status:
					| 'awaiting_payment_method'
					| 'processing'
					| 'succeeded'
					| 'failed';
			};
		};
	};
};

export async function getCheckoutSession(checkoutSessionId: string) {
	const response = await axios.get(
		`https://api.paymongo.com/v1/checkout_sessions/${checkoutSessionId}`,
		{
			headers: {
				Accept: 'application/json',
				Authorization:
					'Basic ' + Buffer.from(PAYMONGO_SECRET + ':').toString('base64'),
			},
		},
	);

	return response.data.data as CheckoutSession;
}

export async function checkIfUserAlreadyPaid(checkoutSessionIds: string[]) {
	let hasPaid = false;
	let activeCheckoutUrl: string | null = null;

	for (const checkoutSessionId of checkoutSessionIds) {
		const checkout = await getCheckoutSession(checkoutSessionId);

		const paymentStatus =
			checkout.attributes.payment_intent?.attributes?.status;

		const checkoutStatus = checkout.attributes.status;

		if (paymentStatus === 'succeeded') {
			hasPaid = true;
			break;
		}

		if (checkoutStatus === 'active') {
			activeCheckoutUrl = checkout.attributes.checkout_url;
		}
	}

	return {
		hasPaid,
		activeCheckoutUrl,
	};
}

// export function verifyPaymongoSignature(payload: Buffer, signature: string) {
// 	if (!signature) return false;

// 	const [timestampPart, hashPart] = signature.split(',');
// 	if (!timestampPart || !hashPart) return false;

// 	const timestamp = timestampPart.split('=')[1];
// 	const receivedHash = hashPart.split('=')[1];

// 	const signedPayload = `${timestamp}.${payload.toString()}`;

// 	const expectedHash = crypto
// 		.createHmac('sha256', PAYMONGO_WEBHOOK_SECRET)
// 		.update(signedPayload)
// 		.digest('hex');

// 	return crypto.timingSafeEqual(
// 		Buffer.from(expectedHash),
// 		Buffer.from(receivedHash),
// 	);
// }

export async function processSuccessfulPayment(event: any) {
	const checkoutSession = event.data.attributes.data.attributes;

	const checkoutId = checkoutSession.id;

	const session = await mongoose.startSession();

	await session.withTransaction(async () => {
		const payment = await PaymentModel.findOne({
			checkoutSessionId: checkoutId,
		}).session(session);

		if (!payment || payment.status === 'paid') return;

		payment.status = 'paid';
		await payment.save({ session });

		const registration = await RegistrationModel.findById(
			payment.registration,
		).session(session);

		if (!registration) throw new Error('Registration not found');

		registration.status = 'confirmed';
		await registration.save({ session });

		const eventDoc = await EventModel.findById(payment.event).session(session);

		if (!eventDoc) throw new Error('Event not found');

		// const raceCategory = eventDoc.raceCategories.id(
		// 	registration.raceCategory,
		// );

		const raceCategory = eventDoc.raceCategories.find(
			(rc) => rc._id.toString() === registration.raceCategory?.toString(),
		);

		if (!raceCategory) throw new Error('Race category not found');

		raceCategory.registeredCount += 1;
		await eventDoc.save({ session });
	});

	session.endSession();
}
