import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectToMongoDB from './database/mongodb';
import { notFoundHandler } from './middlewares/not-found';
import { errorHandler } from './middlewares/error';
import { healthcheck } from './middlewares/healthcheck';
import { corsOptions } from './utils/cors';
import { auth } from './middlewares/auth';
connectToMongoDB();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', healthcheck);

import authRoutes from './routes/auth.route';
import eventsRoutes from './routes/event.routes';
import registrationRoutes from './routes/registration.route';
import paymentRoutes from './routes/payment.route';
import deviceTelemetryRoutes from './routes/device.route';
import webhookRoutes from './routes/webhook.route';

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/device', deviceTelemetryRoutes);
app.use(auth);
app.use('/api/v1/event', eventsRoutes);
app.use('/api/v1/registration', registrationRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/webhook', webhookRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

// if (NODE_ENV === 'development') {
// 	app.listen(Number(PORT), () => {
// 		console.log(`Server is running on http://localhost:${PORT}`);
// 	});
// }
