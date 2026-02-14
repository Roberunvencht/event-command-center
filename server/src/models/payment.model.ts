import { ObjectId, PopulatedDoc, Schema, model } from 'mongoose';
import { IUser } from './user.model';
import { Event } from './event.model';
import { Registration } from './registration.model';

export type Payment = {
	_id: ObjectId;
	user: PopulatedDoc<IUser>;
	event: PopulatedDoc<Event>;
	registration: PopulatedDoc<Registration>;
	provider: 'paymongo';
	checkoutSessionId: string;
	checkoutUrl: string;
	paymentIntentId?: string;
	amount: number;
	currency: 'PHP';
	status: 'pending' | 'paid' | 'failed' | 'refunded';
	paidAt?: Date;
	createdAt: Date;
};

const PaymentSchema = new Schema<Payment>({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
	registration: {
		type: Schema.Types.ObjectId,
		ref: 'Registration',
		required: true,
	},
	provider: { type: String, default: 'paymongo' },
	checkoutSessionId: { type: String, required: true },
	checkoutUrl: { type: String, required: true },
	paymentIntentId: { type: String },
	amount: { type: Number, required: true },
	currency: { type: String, default: 'PHP' },
	status: { type: String, default: 'pending' },
	paidAt: { type: Date },
	createdAt: { type: Date, default: Date.now },
});

const PaymentModel = model<Payment>('Payment', PaymentSchema);
export default PaymentModel;
