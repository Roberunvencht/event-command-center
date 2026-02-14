import { BAD_REQUEST, UNAUTHORIZED } from '../constant/http';
import appAssert from '../errors/app-assert';
import DeviceModel, { PopulatedDevice } from '../models/device.model';
import TelemetryModel from '../models/telemetry.model';
import { io } from '../server';
import { asyncHandler } from '../utils/utils';

export const deviceTelemetryController = asyncHandler(async (req, res) => {
	const { deviceToken, gps, heartRate, emg } = req.body;

	const device = await DeviceModel.findOne<PopulatedDevice>({
		deviceToken,
		isActive: true,
	}).populate('registration');

	appAssert(device && device.registration, UNAUTHORIZED, 'Unauthorized device');

	const registrationId = device.registration._id.toString();

	// Only emit what exists
	if (gps) {
		io.of('/race').to(registrationId).emit('gpsUpdate', gps);
	}

	if (heartRate) {
		io.of('/race').to(registrationId).emit('bioSignalUpdate', {
			heartRate,
		});
	}

	if (emg) {
		io.of('/race').to(registrationId).emit('bioSignalUpdate', {
			emg,
		});
	}

	await TelemetryModel.create({
		registration: device.registration._id,
		gps,
		heartRate,
		emg,
	});

	res.json({ success: true });
});
