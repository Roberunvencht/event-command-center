export interface Participant {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	emergencyName: string;
	emergencyPhone: string;
	medicalConditions?: string;
	tshirtSize: string;
	category: string;
	bibNumber: string;
	deviceType: string;
	deviceId: string;
	rfidTagId: string;
	status: string;
	isAssigned: boolean;
}
