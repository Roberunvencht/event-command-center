import z from 'zod';
import { ShirtSizes } from '../models/registration.model';

export const registrationSchema = z.object({
	raceCategoryId: z.string().min(1, 'Please select a race category'),
	shirtSize: z.enum(ShirtSizes),
	emergencyContact: z.object({
		name: z.string().min(2, 'Required'),
		phone: z.string().min(6, 'Required'),
		relationship: z.string().min(2, 'Required'),
	}),
	medicalInfo: z.object({
		conditions: z.string().optional(),
		allergies: z.string().optional(),
		medications: z.string().optional(),
	}),
});
