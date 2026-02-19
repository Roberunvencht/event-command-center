import React, { useState } from 'react';
import { Button } from '../ui/button';
import { EditEventDialog } from '../modals/EditEventModal';
import { Event } from '@/types/event';
import axiosInstance from '@/api/axios';
import { useToast } from '@/hooks/use-toast';
import ConfirmDialog from '../ConfirmDialog';
import { PlayCircle } from 'lucide-react';
import { queryClient } from '@/main';
import { QUERY_KEYS } from '@/constants';

type EventActionButtonProps = {
	event: Event;
};

export default function EventActionButton({ event }: EventActionButtonProps) {
	const [editOpen, setEditOpen] = useState(false);
	const { toast } = useToast();

	const onStart = async () => {
		try {
			await axiosInstance.patch(`/event/${event._id}/status`, {
				status: 'active',
			});

			toast({
				title: 'Event started',
				description: 'Event has been started successfully.',
			});
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT] });
		} catch (error) {
			console.error('Error starting event:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error.message ?? 'An error occurred while starting the event.',
			});
		}
	};

	const onStop = async () => {
		try {
			await axiosInstance.patch(`/event/${event._id}/status`, {
				status: 'stopped',
			});

			toast({
				title: 'Event stopped',
				description: 'Event has been stopped successfully.',
			});

			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT] });
		} catch (error) {
			console.error('Error stopping event:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error.message ?? 'An error occurred while stopping the event.',
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
					<Button size='sm' variant='outline'>
						Edit
					</Button>
				}
			/>

			{(event.status === 'upcoming' || event.status === 'stopped') && (
				<ConfirmDialog
					confirmText='Start Event'
					icon={<PlayCircle className='w-5 h-5' />}
					title='Start Event'
					description='Are you sure you want to start this event? The system will start to gather data from the devices.'
					onConfirm={onStart}
					trigger={<Button size='sm'>Start Event</Button>}
				/>
			)}
			{event.status === 'active' && (
				<ConfirmDialog
					confirmText='Stop Event'
					title='Stop Event'
					description='Are you sure you want to stop this event? This will stop the data collection and the results will be available for download.'
					onConfirm={onStop}
					trigger={
						<Button size='sm' variant='destructive'>
							Stop Event
						</Button>
					}
				/>
			)}
		</div>
	);
}
