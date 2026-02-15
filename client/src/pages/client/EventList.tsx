import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axios';
import ClientEventCard from '@/components/cards/ClientEventCard';
import { Event } from '@/types/event';
import { QUERY_KEYS } from '@/constants';
import { useUserStore } from '@/stores/user';
import { Registration } from '@/types/registration';

export default function ClientEventList() {
	const { user } = useUserStore((state) => state);
	const { data: events } = useQuery({
		queryKey: [QUERY_KEYS.EVENT],
		queryFn: async (): Promise<Event[]> => {
			const { data } = await axiosInstance.get('/event');
			return data.data;
		},
	});

	const { data: userRegistrations } = useQuery({
		queryKey: [QUERY_KEYS.REGISTRATIONS, user._id],
		queryFn: async (): Promise<Registration[]> => {
			const { data } = await axiosInstance.get(`/registration`, {
				params: { user: user._id },
			});
			return data.data;
		},
	});

	return (
		<div className='space-y-6 animate-appear'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>
						Available Events
					</h1>
					<p className='text-muted-foreground mt-2'>
						Register for upcoming running events
					</p>
				</div>
			</div>

			<div className='flex gap-4'>
				<Input placeholder='Search events...' className='max-w-sm' />
			</div>

			<div className='grid gap-6'>
				{events &&
					events.map((event) => (
						<ClientEventCard
							key={event._id}
							event={event}
							userRegistrations={userRegistrations}
						/>
					))}
			</div>
		</div>
	);
}
