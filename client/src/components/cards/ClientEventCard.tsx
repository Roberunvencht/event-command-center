import { Event } from '@/types/event';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../StatusBadge';
import { format } from 'date-fns';
import { Registration } from '@/types/registration';
import { EventActionButton } from '../EventActionButton';

type ClientEventCardProps = {
	event: Event;
	userRegistrations: Registration[];
};

export default function ClientEventCard({
	event,
	userRegistrations,
}: ClientEventCardProps) {
	const distances = event.raceCategories.map((c) => c.distanceKm);
	const minDistance = Math.min(...distances);
	const maxDistance = Math.max(...distances);

	const totalSlots = event.raceCategories.reduce(
		(sum, cat) => sum + cat.slots,
		0,
	);

	const totalRegistered = event.raceCategories.reduce(
		(sum, cat) => sum + cat.registeredCount,
		0,
	);

	const distanceLabel =
		minDistance === maxDistance
			? `${minDistance} km`
			: `${minDistance}–${maxDistance} km`;

	return (
		<Card className='border-border'>
			<CardHeader>
				<div className='flex items-start justify-between'>
					<div className='space-y-1'>
						<CardTitle className='text-xl'>{event.name}</CardTitle>
						<p className='text-sm text-muted-foreground'>
							Organized by {event.description}
						</p>
					</div>
					<StatusBadge status={event.status} />
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
					<div className='flex items-center gap-2 text-sm'>
						<Calendar className='w-4 h-4 text-primary' />
						<span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
					</div>
					<div className='flex items-center gap-2 text-sm'>
						<MapPin className='w-4 h-4 text-primary' />
						<div>
							{event.location.city}, {event.location.province}
						</div>
					</div>
					<div className='text-sm'>
						<span className='font-semibold text-primary'>{distanceLabel}</span>
					</div>
				</div>

				<div className='flex items-center justify-between pt-4 border-t border-border'>
					<span className='text-sm text-muted-foreground flex items-center gap-2'>
						<Users className='w-3 h-3' />
						{totalRegistered}/{totalSlots} spots remaining
					</span>
					<div className='flex gap-2'>
						<Button asChild variant='outline' size='sm'>
							<Link to={`/client/events/${event._id}`}>View Details</Link>
						</Button>
						<EventActionButton event={event} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
