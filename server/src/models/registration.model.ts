import { Schema, model, Types, PopulatedDoc } from 'mongoose';
import { IUser } from './user.model';
import { Event, RaceCategory } from './event.model';
import { Payment } from './payment.model';

export const ShirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export type Registration = {
	_id: Types.ObjectId;
	user: PopulatedDoc<IUser>;
	event: PopulatedDoc<Event>;
	raceCategory: RaceCategory;
	bibNumber?: number;
	shirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
	emergencyContact: {
		name: string;
		phone: string;
		relationship: string;
	};
	medicalInfo: {
		conditions?: string;
		allergies?: string;
		medications?: string;
	};
	status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
	device?: Types.ObjectId;
	payment?: PopulatedDoc<Payment>;
	registeredAt: Date;
	createdAt: Date;
	updatedAt: Date;
};

export type PopulatedRegistration = Omit<
	Registration,
	'event' | 'raceCategory'
> & {
	user: IUser;
	event: Event;
	raceCategory: RaceCategory;
	payment?: Payment;
};

const RegistrationSchema = new Schema<Registration>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		event: {
			type: Schema.Types.ObjectId,
			ref: 'Event',
			required: true,
			index: true,
		},

		raceCategory: {
			type: Schema.Types.ObjectId,
			required: true,
		},

		bibNumber: {
			type: Number,
			unique: true,
			sparse: true,
		},

		shirtSize: {
			type: String,
			enum: ShirtSizes,
			required: true,
		},

		emergencyContact: {
			name: String,
			phone: String,
			relationship: String,
		},

		medicalInfo: {
			conditions: String,
			allergies: String,
			medications: String,
		},

		status: {
			type: String,
			enum: ['pending', 'confirmed', 'cancelled', 'completed'],
			default: 'pending',
			index: true,
		},

		device: {
			type: Schema.Types.ObjectId,
			ref: 'Device',
		},

		payment: {
			type: Schema.Types.ObjectId,
			ref: 'Payment',
		},

		registeredAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

const RegistrationModel = model<Registration>(
	'Registration',
	RegistrationSchema,
);
export default RegistrationModel;
