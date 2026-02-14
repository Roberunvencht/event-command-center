import { io } from '../server';

interface RaceUpdate {
	registrationId: string;
	position?: string;
	timeElapsed?: string;
	pace?: string;
	heartRate?: number;
	heartRateZone?: string;
	emg?: string;
	warning?: string;
	nextCheckpoint?: string;
	distanceToCheckpoint?: string;
	estimatedTime?: string;
	distance?: number;
	checkpoints?: {
		name: string;
		status: 'completed' | 'approaching' | 'pending';
		time: string;
	}[];
}

export const setupRaceSockets = () => {
	io.on('connection', (socket) => {
		console.log(`Client connected: ${socket.id}`);

		// Join a race room based on registrationId
		socket.on('joinRace', ({ registrationId }: { registrationId: string }) => {
			socket.join(registrationId);
			console.log(`Socket ${socket.id} joined race ${registrationId}`);
		});

		socket.on('leaveRace', ({ registrationId }: { registrationId: string }) => {
			socket.leave(registrationId);
			console.log(`Socket ${socket.id} left race ${registrationId}`);
		});

		// Device sends live updates
		socket.on('raceUpdate', (data: RaceUpdate) => {
			const { registrationId, ...update } = data;
			if (registrationId) {
				io.to(registrationId).emit('positionUpdate', {
					position: update.position,
				});
				io.to(registrationId).emit('timeUpdate', {
					timeElapsed: update.timeElapsed,
					pace: update.pace,
				});
				io.to(registrationId).emit('bioSignalUpdate', {
					heartRate: update.heartRate,
					heartRateZone: update.heartRateZone,
					emg: update.emg,
					warning: update.warning,
				});
				io.to(registrationId).emit('checkpointUpdate', {
					nextCheckpoint: update.nextCheckpoint,
					distanceToCheckpoint: update.distanceToCheckpoint,
					estimatedTime: update.estimatedTime,
					distance: update.distance,
					checkpoints: update.checkpoints,
				});
			}
		});

		socket.on('disconnect', () => {
			console.log(`Client disconnected: ${socket.id}`);
		});
	});
};
