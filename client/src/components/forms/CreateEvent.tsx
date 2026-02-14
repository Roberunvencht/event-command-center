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

export default function CreateEvent() {
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(createEventSchema),
		defaultValues: {
			name: '',
			description: '',
			date: '',
			startTime: '',
			endTime: '',
			location: {
				venue: '',
				city: '',
				province: '',
			},
			registration: {
				opensAt: '',
				closesAt: '',
			},
			raceCategories: [
				{ name: '', distanceKm: 5, cutoffTime: 60, price: 500, slots: 100 },
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'raceCategories',
	});

	const onSubmit = async (values: z.infer<typeof createEventSchema>) => {
		try {
			const { data } = await axiosInstance.post('/event', values);
			console.log(data);
			toast({
				title: 'Event created',
				description: 'Your event has been created successfully.',
			});
		} catch (error) {
			console.error('Error creating event:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'An error occurred while creating the event.',
			});
		} finally {
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='gap-2'>
					<Plus className='w-4 h-4' />
					Create Event
				</Button>
			</DialogTrigger>

			<DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Create New Event</DialogTitle>
					<DialogDescription>
						Setup your running event and race categories.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						{/* Event Info */}
						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem className='col-span-2'>
										<FormLabel>Event Name</FormLabel>
										<FormControl>
											<Input placeholder='City Marathon 2024' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem className='col-span-2'>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input placeholder='Optional description' {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='date'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date</FormLabel>
										<FormControl>
											<Input type='date' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='startTime'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Time</FormLabel>
										<FormControl>
											<Input type='time' {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{/* Location */}
						<div className='grid grid-cols-3 gap-4'>
							<FormField
								control={form.control}
								name='location.venue'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Venue</FormLabel>
										<FormControl>
											<Input placeholder='Downtown' {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='location.city'
								render={({ field }) => (
									<FormItem>
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input placeholder='Davao' {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='location.province'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Province</FormLabel>
										<FormControl>
											<Input placeholder='Davao del Sur' {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{/* Registration */}
						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='registration.opensAt'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Registration Opens</FormLabel>
										<FormControl>
											<Input type='datetime-local' {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='registration.closesAt'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Registration Closes</FormLabel>
										<FormControl>
											<Input type='datetime-local' {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{/* Race Categories */}
						<div className='space-y-4'>
							<div className='flex justify-between items-center'>
								<h4 className='font-semibold'>Race Categories</h4>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() =>
										append({
											name: '',
											distanceKm: 5,
											cutoffTime: 60,
											price: 500,
											slots: 100,
										})
									}
								>
									Add Category
								</Button>
							</div>

							{fields.map((field, index) => (
								<div
									key={field.id}
									className='grid grid-cols-5 gap-3 border p-3 rounded-lg'
								>
									<FormField
										control={form.control}
										name={`raceCategories.${index}.name`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder='5K Run' {...field} />
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name={`raceCategories.${index}.distanceKm`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>KM</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name={`raceCategories.${index}.cutoffTime`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Cutoff</FormLabel>
												<FormControl>
													<Input type='number' placeholder='min' {...field} />
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name={`raceCategories.${index}.price`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Price</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name={`raceCategories.${index}.slots`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Slots</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
											</FormItem>
										)}
									/>

									{fields.length > 1 && (
										<Button
											type='button'
											variant='link'
											size='sm'
											onClick={() => remove(index)}
											className='col-span-5 text-red-500'
										>
											Remove
										</Button>
									)}
								</div>
							))}
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									disabled={form.formState.isSubmitting}
									variant='outline'
								>
									Cancel
								</Button>
							</DialogClose>
							<Button disabled={form.formState.isSubmitting} type='submit'>
								Create Event
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
