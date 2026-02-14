import dotenv from 'dotenv';
import app from './app';
import { NODE_ENV, PORT } from './constant/env';
import { corsOptions } from './utils/cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
dotenv.config();

const server = createServer(app);

export const io = new Server(server, {
	cors: corsOptions,
});

/* -------------------------
   USER DASHBOARD NAMESPACE
-------------------------- */
const raceNamespace = io.of('/race');

raceNamespace.on('connection', (socket) => {
	socket.on('joinRace', ({ registrationId }) => {
		socket.join(registrationId);
	});

	socket.on('disconnect', () => {
		console.log('Race client disconnected');
	});
});

/* -------------------------
   DEVICE NAMESPACE
-------------------------- */
const deviceNamespace = io.of('/device');

// Middleware authentication
// deviceNamespace.use(async (socket, next) => {
// 	try {
// 		const token = socket.handshake.auth.deviceToken;

// 		if (!token) {
// 			return next(new Error('No device token'));
// 		}

// 		const device = await DeviceModel.findOne({
// 			deviceToken: token,
// 			isActive: true,
// 		}).populate('registration');

// 		if (!device || !device.registration) {
// 			return next(new Error('Unauthorized device'));
// 		}

// 		socket.data.device = device;
// 		next();
// 	} catch (error) {
// 		next(new Error('Authentication error'));
// 	}
// });

deviceNamespace.on('connection', (socket) => {
	console.log('Device connected:', socket.id);

	socket.on('raceUpdate', (payload) => {
		const device = socket.data.device;
		const registrationId = device.registration._id.toString();

		raceNamespace.to(registrationId).emit('positionUpdate', {
			position: payload.position,
		});

		raceNamespace.to(registrationId).emit('timeUpdate', {
			timeElapsed: payload.timeElapsed,
			pace: payload.pace,
		});

		raceNamespace.to(registrationId).emit('bioSignalUpdate', {
			heartRate: payload.heartRate,
			heartRateZone: payload.heartRateZone,
			emg: payload.emg,
			warning: payload.warning,
		});

		raceNamespace.to(registrationId).emit('checkpointUpdate', {
			nextCheckpoint: payload.nextCheckpoint,
			distanceToCheckpoint: payload.distanceToCheckpoint,
			estimatedTime: payload.estimatedTime,
			distance: payload.distance,
			checkpoints: payload.checkpoints,
		});
	});

	socket.on('disconnect', () => {
		console.log('Device disconnected');
	});
});

if (NODE_ENV === 'development') {
	server.listen(Number(PORT), () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
}
