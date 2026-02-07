import mongoose from 'mongoose';
import { seedAdmin } from './adminSeed';
import { ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } from '../constant/env';

export default async function connectToMongoDB(): Promise<void> {
	try {
		await mongoose.connect(MONGO_URI);
		console.log('Connected to database successfully');

		await seedAdmin({
			name: 'Admin User',
			email: ADMIN_EMAIL,
			institutionalID: 'admin001',
			password: ADMIN_PASSWORD,
		});
	} catch (err: any) {
		console.error('Failed to connect to MongoDB', err);
	}
}
