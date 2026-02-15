import { io, Socket } from 'socket.io-client';

const sockets: Record<string, Socket> = {};

export const getSocket = (namespace: string): Socket => {
	if (!sockets[namespace]) {
		sockets[namespace] = io(`${import.meta.env.VITE_API_URL}/${namespace}`, {
			withCredentials: true,
		});

		sockets[namespace].on('connect', () => {
			console.log(`Connected to namespace: ${namespace}`);
		});

		sockets[namespace].on('disconnect', () => {
			console.log(`Disconnected from namespace: ${namespace}`);
		});
	}

	return sockets[namespace];
};

export const disconnectSocket = (namespace: string) => {
	if (sockets[namespace]) {
		sockets[namespace].disconnect();
		delete sockets[namespace];
	}
};
