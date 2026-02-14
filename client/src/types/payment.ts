import { Event } from './event';
import { Registration } from './registration';
import { User } from './user';

export type Payment = {
	_id: string;
	user: User;
	event: Event;
	registration: Registration;
	provider: 'paymongo';
	checkoutSessionId: string;
	paymentIntentId?: string;
	amount: number;
	currency: 'PHP';
	status: 'pending' | 'paid' | 'failed' | 'refunded';
	paidAt?: Date;
	createdAt: Date;
};
