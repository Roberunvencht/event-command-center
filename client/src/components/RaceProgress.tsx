import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type RaceProgressProps = {
	distance: number;
	totalDistance: number;
	nextCheckpoint: string;
	distanceToCheckpoint: string;
	estimatedTime: string;
};

export const RaceProgress = ({
	distance,
	totalDistance,
	nextCheckpoint,
	distanceToCheckpoint,
	estimatedTime,
}: RaceProgressProps) => (
	<Card className='border-primary/50 bg-primary/5'>
		<CardHeader>
			<CardTitle>Race Progress</CardTitle>
		</CardHeader>
		<CardContent className='space-y-4'>
			<div className='space-y-2'>
				<div className='flex items-center justify-between text-sm'>
					<span className='font-medium'>Distance Covered</span>
					<span className='text-primary font-bold'>
						{distance} / {totalDistance} km
					</span>
				</div>
				<Progress value={(distance / totalDistance) * 100} />
			</div>
			<div className='flex items-center justify-between p-3 bg-background rounded-lg'>
				<div>
					<p className='text-sm font-medium'>Next Checkpoint</p>
					<p className='text-sm text-muted-foreground'>{nextCheckpoint}</p>
				</div>
				<div className='text-right'>
					<p className='text-sm font-semibold text-primary'>
						{distanceToCheckpoint}
					</p>
					<p className='text-xs text-muted-foreground'>~{estimatedTime}</p>
				</div>
			</div>
		</CardContent>
	</Card>
);
