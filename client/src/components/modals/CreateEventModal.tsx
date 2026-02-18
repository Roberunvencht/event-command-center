import { useToast } from '@/hooks/use-toast';
import { EventForm, EventFormValues } from '../forms/EventForm';
import axiosInstance from '@/api/axios';
import { queryClient } from '@/main';
import { QUERY_KEYS } from '@/constants';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

export function CreateEventDialog() {
	const { toast } = useToast();

	const defaultValues = {
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
	};

	const handleCreate = async (values: EventFormValues) => {
		try {
			await axiosInstance.post('/event', values);

			toast({
				title: 'Event created',
				description: 'Your event has been created successfully.',
			});

			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.EVENT],
			});
		} catch (error) {
			console.error('Error creating event:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error.message ?? 'An error occurred while creating the event.',
			});
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<Plus className='w-4 h-4' />
					Create Event
				</Button>
			</DialogTrigger>

			<DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Create New Event</DialogTitle>
					<DialogDescription>Setup your running event.</DialogDescription>
				</DialogHeader>

				<EventForm
					defaultValues={defaultValues}
					onSubmit={handleCreate}
					submitLabel='Create Event'
				/>
			</DialogContent>
		</Dialog>
	);
}
