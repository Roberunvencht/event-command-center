// services/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = () => {
	if (!socket) {
		socket = io(import.meta.env.VITE_BACKEND_URL!, {
			auth: {
				token: localStorage.getItem('token'),
			},
		});
	}
	return socket;
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};

export const getSocket = () => {
	if (!socket) throw new Error('Socket not connected');
	return socket;
};
