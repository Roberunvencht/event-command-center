import mongoose, { PopulatedDoc, ObjectId } from 'mongoose';
import { Registration } from './registration.model';

export type Telemetry = {
	registration: ObjectId | PopulatedDoc<Registration>;
	gps: {
		lat: number;
		lon: number;
	};
	heartRate: number;
	emg: string;
	createdAt: Date;
};

const TelemetrySchema = new mongoose.Schema<Telemetry>({
	registration: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Registration',
	},
	gps: {
		lat: Number,
		lon: Number,
	},
	heartRate: Number,
	emg: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const TelemetryModel = mongoose.model('Telemetry', TelemetrySchema);
export default TelemetryModel;
