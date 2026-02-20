import { useState } from 'react';
import { Button } from '../ui/button';
import { EditEventDialog } from '../modals/EditEventModal';
import { Event, EventStatus } from '@/types/event';
import axiosInstance from '@/api/axios';
import { useToast } from '@/hooks/use-toast';
import ConfirmDialog from '../ConfirmDialog';
import { Edit2, PauseCircle, PlayCircle, StopCircle } from 'lucide-react';
import { queryClient } from '@/main';
import { QUERY_KEYS } from '@/constants';

type EventActionButtonProps = {
	event: Event;
};

export default function EventActionButton({ event }: EventActionButtonProps) {
	const [editOpen, setEditOpen] = useState(false);
	const { toast } = useToast();

	const onStatusUpdate = async (status: EventStatus) => {
		try {
			await axiosInstance.patch(`/event/${event._id}/status`, {
				status: status,
			});

			toast({
				title: 'Event started',
				description: 'Event has been updated successfully.',
			});
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT] });
		} catch (error) {
			console.error('Error updating event:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error.message ?? 'An error occurred while updating the event.',
			});
		}
	};

	return (
		<div className='flex gap-2'>
			<EditEventDialog
				event={event}
				open={editOpen}
				onOpenChange={setEditOpen}
				trigger={
					<Button size='sm' variant='outline' className='rounded-full'>
						<Edit2 className='w-5 h-5' />
						Edit
					</Button>
				}
			/>

			{(event.status === 'active' || event.status === 'stopped') && (
				<ConfirmDialog
					confirmText='End Event'
					title='End Event'
					description='Are you sure you want to end this event? This will stop the data collection and the results will be available for download.'
					onConfirm={() => onStatusUpdate('finished')}
					trigger={
						<Button
							size='sm'
							variant='outline'
							className='rounded-full text-red-500 border-red-500 hover:bg-red-500 hover:text-white'
						>
							<StopCircle className='w-5 h-5' />
							End Event
						</Button>
					}
				/>
			)}

			{(event.status === 'upcoming' || event.status === 'stopped') && (
				<ConfirmDialog
					confirmText='Start Event'
					icon={<PlayCircle className='w-5 h-5' />}
					title='Start Event'
					description='Are you sure you want to start this event? The system will start to gather data from the devices.'
					onConfirm={() => onStatusUpdate('active')}
					trigger={
						<Button size='sm' className='rounded-full'>
							<PlayCircle className='w-5 h-5' />
							Start Event
						</Button>
					}
				/>
			)}
			{event.status === 'active' && (
				<ConfirmDialog
					confirmText='Pause Event'
					title='Pause Event'
					description='Are you sure you want to Pause this event? This will stop the data collection and the results will be available for download.'
					onConfirm={() => onStatusUpdate('stopped')}
					trigger={
						<Button size='sm' className='rounded-full'>
							<PauseCircle className='w-5 h-5' />
							Pause Event
						</Button>
					}
				/>
			)}
		</div>
	);
}
