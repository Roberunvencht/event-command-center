import { StatusBadge } from '@/components/StatusBadge';
import { Calendar, MapPin, Users, MoreVertical } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Event } from '@/types/event';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axiosInstance from '@/api/axios';
import { useToast } from '@/hooks/use-toast';
import ConfirmDialog from '../ConfirmDialog';
import { queryClient } from '@/main';
import { QUERY_KEYS } from '@/constants';
import { EditEventDialog } from '../modals/EditEventModal';

type EventCardProps = {
	event: Event;
};

export default function EventCard({ event }: EventCardProps) {
	const navigate = useNavigate();
	const { toast } = useToast();

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

	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`/event/${event._id}`);

			toast({
				title: 'Event deleted',
				description: 'Your event has been deleted successfully.',
			});
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT] });
		} catch (error) {
			console.error('Error deleting event:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error.message || 'An error occurred while deleting the event.',
			});
		}
	};

	return (
		<div className='flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors gap-4'>
			<div className='flex-1 space-y-2'>
				<div className='flex items-center gap-2'>
					<h3 className='font-semibold text-foreground'>{event.name}</h3>
					<StatusBadge status={event.status} />
				</div>

				<div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
					<span className='flex items-center gap-1'>
						<Calendar className='w-3 h-3' />
						{format(new Date(event.date), 'MMM dd, yyyy')}
					</span>

					<span className='flex items-center gap-1'>
						<MapPin className='w-3 h-3' />
						{event.location.city}, {event.location.venue}
					</span>

					<span className='flex items-center gap-1'>
						<Users className='w-3 h-3' />
						{totalRegistered}/{totalSlots}
					</span>

					<span className='font-medium text-primary'>{distanceLabel}</span>
				</div>
			</div>

			<div className='flex items-center gap-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => navigate(`/events/${event._id}`)}
				>
					View Details
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='sm'>
							<MoreVertical className='w-4 h-4' />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align='end'>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<EditEventDialog
								event={event as any}
								trigger={<button>Edit Event</button>}
							/>
						</DropdownMenuItem>
						<DropdownMenuItem>Manage Participants</DropdownMenuItem>
						<DropdownMenuItem>View Results</DropdownMenuItem>
						<DropdownMenuItem className='text-destructive'>
							<ConfirmDialog
								onConfirm={handleDelete}
								trigger={<button>Delete Event</button>}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
