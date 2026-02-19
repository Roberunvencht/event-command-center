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

type EditEventDialogProps = {
	event: Partial<EventFormValues> & { _id: string };
	open: boolean;
	onOpenChange: (open: boolean) => void;
	trigger?: React.ReactNode;
};

export function EditEventDialog({
	event,
	open,
	onOpenChange,
	trigger,
}: EditEventDialogProps) {
	const { toast } = useToast();

	const handleUpdate = async (values: EventFormValues) => {
		try {
			await axiosInstance.patch(`/event/${event._id}`, values);

			toast({
				title: 'Event updated',
				description: 'Changes saved successfully.',
			});

			await queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.EVENT],
			});
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
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{trigger ? trigger : null}</DialogTrigger>

			<DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Edit Event</DialogTitle>
					<DialogDescription>Edit the event details below.</DialogDescription>
				</DialogHeader>

				<EventForm
					defaultValues={event}
					onSubmit={handleUpdate}
					submitLabel='Save Changes'
				/>
			</DialogContent>
		</Dialog>
	);
}
