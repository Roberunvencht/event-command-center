import { Event, RaceCategory } from './event';
import { Payment } from './payment';
import { User } from './user';

export type Registration = {
	_id: string;
	user: User;
	event: Event;
	raceCategory: RaceCategory;
	bibNumber?: string;
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
	device?: string;
	payment?: Payment;
	registeredAt: Date;
	createdAt: Date;
	updatedAt: Date;
};
