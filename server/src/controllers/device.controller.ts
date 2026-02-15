import { BAD_REQUEST, OK, UNAUTHORIZED } from '../constant/http';
import appAssert from '../errors/app-assert';
import DeviceModel, { PopulatedDevice } from '../models/device.model';
import TelemetryModel from '../models/telemetry.model';
import { io } from '../server';
import CustomResponse from '../utils/response';
import { asyncHandler, generateCypto } from '../utils/utils';

export const deviceTelemetryController = asyncHandler(async (req, res) => {
	const { deviceToken, gps, heartRate, emg } = req.body;

	console.log(deviceToken, gps, heartRate, emg);
	// const device = await DeviceModel.findOne<PopulatedDevice>({
	// 	deviceToken,
	// 	isActive: true,
	// }).populate('registration');

	// appAssert(device && device.registration, UNAUTHORIZED, 'Unauthorized device');

	// const registrationId = device.registration._id.toString();

	// Only emit what exists
	if (gps) {
		io.of('/race').emit('gpsUpdate', gps);
	}

	if (heartRate) {
		io.of('/race').emit('bioSignalUpdate', {
			heartRate,
		});
	}

	if (emg) {
		io.of('/race').emit('bioSignalUpdate', {
			emg,
		});
	}
	// if (gps) {
	// 	io.of('/race').to(registrationId).emit('gpsUpdate', gps);
	// }

	// if (heartRate) {
	// 	io.of('/race').to(registrationId).emit('bioSignalUpdate', {
	// 		heartRate,
	// 	});
	// }

	// if (emg) {
	// 	io.of('/race').to(registrationId).emit('bioSignalUpdate', {
	// 		emg,
	// 	});
	// }

	// await TelemetryModel.create({
	// 	registration: device.registration._id,
	// 	gps,
	// 	heartRate,
	// 	emg,
	// });

	res.status(OK).json({ success: true });
});

export const getDevices = asyncHandler(async (req, res) => {
	const devices = await DeviceModel.find().populate('registration');

	res.json(new CustomResponse(true, devices, 'Devices fetched successfully'));
});

export const createDevice = asyncHandler(async (req, res) => {
	const { name, deviceToken, isActive } = req.body;

	const existing = await DeviceModel.findOne({ deviceToken });
	if (existing) {
		res
			.status(BAD_REQUEST)
			.json(new CustomResponse(false, null, 'Device already exists'));
		return;
	}

	const device = await DeviceModel.create({
		name,
		deviceToken: generateCypto(),
		isActive,
	});

	res.json({
		success: true,
		device,
	});
});

export const removeDevice = asyncHandler(async (req, res) => {
	const { deviceID } = req.params;

	const device = await DeviceModel.findByIdAndDelete(deviceID);
	appAssert(device, BAD_REQUEST, 'Device not found');

	res.json(new CustomResponse(true, null, 'Device deleted successfully'));
});

export const unassignDevice = asyncHandler(async (req, res) => {
	const { deviceID } = req.params;

	const device = await DeviceModel.findByIdAndUpdate(
		deviceID,
		{ registration: null },
		{ new: true },
	);
	appAssert(device, BAD_REQUEST, 'Device not found');

	res.json(new CustomResponse(true, null, 'Device unassigned successfully'));
});
