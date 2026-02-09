import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import CreateEvent from '@/components/forms/CreateEvent';
import EventCard from '@/components/cards/EventCard';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axios';
import { Event } from '@/types/event';
import { QUERY_KEYS } from '@/constants';

export default function Events() {
	const { data: events } = useQuery({
		queryKey: [QUERY_KEYS.EVENT],
		queryFn: async (): Promise<Event[]> => {
			const { data } = await axiosInstance.get('/event');
			return data.data;
		},
	});

	// const events = [
	// 	{
	// 		id: 1,
	// 		name: 'City Marathon 2024',
	// 		date: 'Jan 15, 2024',
	// 		location: 'Downtown',
	// 		participants: 420,
	// 		status: 'upcoming' as const,
	// 		distance: '42.2 km',
	// 	},
	// 	{
	// 		id: 2,
	// 		name: 'Half Marathon Challenge',
	// 		date: 'Jan 10, 2024',
	// 		location: 'Park Lane',
	// 		participants: 267,
	// 		status: 'active' as const,
	// 		distance: '21.1 km',
	// 	},
	// 	{
	// 		id: 3,
	// 		name: 'Weekend Sprint',
	// 		date: 'Dec 20, 2023',
	// 		location: 'City Center',
	// 		participants: 189,
	// 		status: 'finished' as const,
	// 		distance: '10 km',
	// 	},
	// ];

	return (
		<div className='space-y-6 animate-appear'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground mb-2'>Events</h1>
					<p className='text-muted-foreground'>Manage all your race events</p>
				</div>
				<CreateEvent />
			</div>

			<Card>
				<CardContent className='p-6'>
					<div className='flex flex-col sm:flex-row gap-4 mb-6'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
							<Input placeholder='Search events...' className='pl-9' />
						</div>
						<Button variant='outline' className='gap-2'>
							<Filter className='w-4 h-4' />
							Filters
						</Button>
					</div>

					<div className='space-y-3'>
						{!events && (
							<p className='text-muted-foreground'>No events found</p>
						)}
						{events &&
							events.map((event) => (
								<EventCard key={event._id} event={event} />
							))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
