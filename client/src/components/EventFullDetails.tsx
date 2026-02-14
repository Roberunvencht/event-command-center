import { Event } from '@/types/event';
import { StatusBadge } from './StatusBadge';
import { Calendar, Flag, MapPin, Users } from 'lucide-react';
import BackButton from './buttons/BackButton';
import { format } from 'date-fns';
import { EventActionButton } from './EventActionButton';
import { useUserStore } from '@/stores/user';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import axiosInstance from '@/api/axios';
import { Registration } from '@/types/registration';

type EventFullDetailsProps = {
	event: Event;
};

export default function EventFullDetails({ event }: EventFullDetailsProps) {
	const { user } = useUserStore((state) => state);

	const { data: userRegistrations } = useQuery({
		queryKey: [QUERY_KEYS.REGISTRATION, user._id],
		queryFn: async (): Promise<Registration[]> => {
			const { data } = await axiosInstance.get(`/registration`, {
				params: { user: user._id },
			});
			return data.data;
		},
	});

	return (
		<div className='space-y-4'>
			<div>
				<div className='flex items-center justify-between'>
					<div className='flex flex-wrap items-center gap-3 mb-2'>
						<BackButton />
						<h1 className='text-3xl font-bold text-foreground'>{event.name}</h1>
						<StatusBadge status={event.status} />
					</div>
					{user.role === 'user' && <EventActionButton event={event} />}
				</div>

				{event.description && (
					<p className='text-muted-foreground max-w-3xl'>{event.description}</p>
				)}
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground'>
				<div className='flex items-center gap-2'>
					<Calendar className='w-4 h-4' />
					<div>
						<div className='font-medium text-foreground'>
							{format(new Date(event.date), 'MMM dd, yyyy')}
						</div>
						{event.startTime && (
							<div>
								{event.startTime} {event.endTime && `– ${event.endTime}`}
							</div>
						)}
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<MapPin className='w-4 h-4' />
					<div>
						<div className='font-medium text-foreground'>
							{event.location.venue}
						</div>
						<div>
							{event.location.city}, {event.location.province}
						</div>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Users className='w-4 h-4' />
					<div>
						<div className='font-medium text-foreground'>
							{event.raceCategories.reduce((a, b) => a + b.registeredCount, 0)}
						</div>
						<div>
							of {event.raceCategories.reduce((a, b) => a + b.slots, 0)} slots
							filled
						</div>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Flag className='w-4 h-4' />
					<div>
						<div className='font-medium text-foreground'>
							{event.raceCategories.map((c) => `${c.distanceKm}K`).join(', ')}
						</div>
						<div>Race Categories</div>
					</div>
				</div>
			</div>

			{/* Capacity Progress */}
			<div>
				<div className='flex justify-between text-xs text-muted-foreground mb-1'>
					<span>Registration Progress</span>
					<span>
						{Math.round(
							(event.raceCategories.reduce((a, b) => a + b.registeredCount, 0) /
								event.raceCategories.reduce((a, b) => a + b.slots, 0)) *
								100,
						)}
						%
					</span>
				</div>
				<div className='h-2 bg-muted rounded-full overflow-hidden'>
					<div
						className='h-full bg-primary'
						style={{
							width: `${
								(event.raceCategories.reduce(
									(a, b) => a + b.registeredCount,
									0,
								) /
									event.raceCategories.reduce((a, b) => a + b.slots, 0)) *
								100
							}%`,
						}}
					/>
				</div>
			</div>

			{/* Registration Window */}
			<div className='text-sm'>
				<span className='font-medium'>Registration:</span>{' '}
				{event.registration.isOpen ? (
					<span className='text-green-600'>Open</span>
				) : (
					<span className='text-destructive'>Closed</span>
				)}{' '}
				({new Date(event.registration.opensAt).toLocaleDateString()} –{' '}
				{new Date(event.registration.closesAt).toLocaleDateString()})
			</div>
		</div>
	);
}
