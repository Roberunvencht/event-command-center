export type EventStatus = 'upcoming' | 'active' | 'finished';

export type RaceCategory = {
	_id: string;
	name: string;
	distanceKm: number;
	cutoffTime: number; // minutes
	gunStartTime: Date;
	price: number;
	slots: number;
	registeredCount: number;
};

export type Event = {
	_id: string;
	slug: string;
	name: string;
	description: string;
	status: EventStatus;
	date: Date;
	startTime: string;
	endTime: string;
	location: {
		venue: string;
		city: string;
		province: string;
		country: string;
		coordinates: {
			lat: number;
			lng: number;
		};
	};
	raceCategories: RaceCategory[];
	registration: {
		isOpen: boolean;
		opensAt: Date;
		closesAt: Date;
	};
	capacity: {
		totalSlots: number;
		registeredCount: number;
	};
	createdAt: Date;
	updatedAt: Date;
};
