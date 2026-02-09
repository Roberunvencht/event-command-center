import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { createEventSchema } from '@/schemas/event.schema';
import axiosInstance from '@/api/axios';
import { registrationSchema, ShirtSizes } from '@/schemas/registration.schema';
import { Event } from '@/types/event';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';

type RegisterEventDialogProps = {
	event: Event;
};

export function RegisterEventDialog({ event }: RegisterEventDialogProps) {
	const { toast } = useToast();

	const form = useForm<z.infer<typeof registrationSchema>>({
		resolver: zodResolver(registrationSchema),
		defaultValues: {
			raceCategoryId: '',
			shirtSize: 'M',
			emergencyContact: {
				name: '',
				phone: '',
				relationship: '',
			},
			medicalInfo: {
				conditions: '',
				allergies: '',
				medications: '',
			},
		},
	});

	const onSubmit = async (values: z.infer<typeof registrationSchema>) => {
		try {
			const { data } = await axiosInstance.post(
				`/event/${event._id}/register`,
				values,
			);

			console.log(data);

			toast({
				title: 'Registration successful',
				description: 'Proceed to payment to confirm your slot.',
			});
		} catch (error) {
			console.error('Error registering event:', error);
			toast({
				variant: 'destructive',
				title: 'Failed to register',
				description:
					error.message ?? 'An error occurred while registering for the event.',
			});
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Register Now</Button>
			</DialogTrigger>

			<DialogContent className='max-w-xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Register for {event.name}</DialogTitle>
					<DialogDescription>
						Complete your registration details below.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						{/* Race Category */}
						<FormField
							control={form.control}
							name='raceCategoryId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Race Category</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select category' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{event.raceCategories.map((cat) => (
												<SelectItem key={cat._id} value={cat._id}>
													{cat.name} ({cat.distanceKm}K)
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Shirt Size */}
						<FormField
							control={form.control}
							name='shirtSize'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Shirt Size</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{ShirtSizes.map((size) => (
												<SelectItem key={size} value={size}>
													{size}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Emergency Contact */}
						<div className='space-y-3'>
							<h4 className='font-medium'>Emergency Contact</h4>

							<FormField
								control={form.control}
								name='emergencyContact.name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder='Full name' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='emergencyContact.phone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input placeholder='+63...' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='emergencyContact.relationship'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Relationship</FormLabel>
										<FormControl>
											<Input
												placeholder='Parent, sibling, friend...'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Medical Info */}
						<div className='space-y-3'>
							<h4 className='font-medium'>Medical Info (Optional)</h4>

							<FormField
								control={form.control}
								name='medicalInfo.conditions'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Conditions</FormLabel>
										<FormControl>
											<Input
												placeholder='Asthma, heart condition...'
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='medicalInfo.allergies'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Allergies</FormLabel>
										<FormControl>
											<Input placeholder='Food, medication...' {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='medicalInfo.medications'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Medications</FormLabel>
										<FormControl>
											<Input placeholder='Maintenance meds...' {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<Button type='submit' size='lg' className='w-full'>
								Submit Registration
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
