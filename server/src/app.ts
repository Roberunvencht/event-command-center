import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import connectToMongoDB from './database/mongodb';
import { notFoundHandler } from './middlewares/not-found';
import { errorHandler } from './middlewares/error';
import { healthcheck } from './middlewares/healthcheck';
import { corsOptions } from './utils/cors';
import { auth } from './middlewares/auth';
import { NODE_ENV, PORT } from './constant/env';
connectToMongoDB();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', healthcheck);

import authRoutes from './routes/auth.route';

// Routes
app.use('/api/v1/auth', authRoutes);
app.use(auth);
app.use('/private', (req, res) => {
	res.json({ message: 'Private route' });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

if (NODE_ENV === 'development') {
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
}
