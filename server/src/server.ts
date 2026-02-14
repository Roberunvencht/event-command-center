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

if (NODE_ENV === 'development') {
	app.listen(Number(PORT), () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
}
