import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function MapTrack() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Race Route Map</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='w-full h-[500px] bg-muted rounded-lg flex items-center justify-center'>
					<div className='text-center text-muted-foreground'>
						<MapPin className='w-12 h-12 mx-auto mb-2' />
						<p>Map visualization will be displayed here</p>
						<p className='text-sm'>Integration with mapping service pending</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
