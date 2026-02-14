import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export const LiveMap = () => (
	<Card>
		<CardHeader>
			<CardTitle className='flex items-center gap-2'>
				<MapPin className='w-5 h-5 text-primary' />
				Live Location Map
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className='w-full h-[400px] bg-muted rounded-lg flex items-center justify-center'>
				<div className='text-center text-muted-foreground'>
					<MapPin className='w-12 h-12 mx-auto mb-2 animate-pulse text-primary' />
					<p>Real-time location tracking</p>
					<p className='text-sm'>Your position on the race route</p>
				</div>
			</div>
		</CardContent>
	</Card>
);
