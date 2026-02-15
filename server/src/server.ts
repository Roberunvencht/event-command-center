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

let position = [8.163334, 125.130747];

// setInterval(() => {
// 	console.log('Emitting GPS update');
// 	if (position[0] && position[1]) {
// 		position = [
// 			position[0] + Math.random() * 0.0003,
// 			position[1] + Math.random() * 0.0003,
// 		];

// 		raceNamespace.emit('gpsUpdate', {
// 			lat: position[0],
// 			lon: position[1],
// 		});
// 	}
// }, 2000);

if (NODE_ENV === 'development') {
	server.listen(Number(PORT), '0.0.0.0', () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
}
