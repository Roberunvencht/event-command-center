import { Registration } from './registration';

export type Device = {
	_id: string;
	name: string;
	registration: Registration;
	deviceToken: string;
	isActive: boolean;
};
