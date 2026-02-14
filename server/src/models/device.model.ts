import mongoose, { PopulatedDoc, ObjectId } from 'mongoose';
import { Registration } from './registration.model';

export type Device = {
	name: string;
	registration: ObjectId | PopulatedDoc<Registration>;
	deviceToken: string;
	isActive: boolean;
};

export type PopulatedDevice = Device & {
	registration: PopulatedDoc<Registration>;
};

const DeviceSchema = new mongoose.Schema<Device>({
	name: { type: String, required: true },
	registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' },
	deviceToken: { type: String, required: true, unique: true },
	isActive: { type: Boolean, default: true },
});

const DeviceModel = mongoose.model('Device', DeviceSchema);
export default DeviceModel;
