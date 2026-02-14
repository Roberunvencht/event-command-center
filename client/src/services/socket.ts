// services/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = () => {
	if (!socket) {
		try {
			socket = io(import.meta.env.VITE_API_URL!, {
				withCredentials: true,
			});
		} catch (error) {
			console.error('Error connecting to socket:', error);
		}
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
	if (!socket) {
		try {
			socket = io(import.meta.env.VITE_API_URL!, {
				withCredentials: true,
			});
		} catch (error) {
			console.error('Error connecting to socket:', error);
		}
	}
	return socket;
};
