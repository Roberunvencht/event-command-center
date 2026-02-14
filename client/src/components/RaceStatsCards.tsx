import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Heart, Zap } from 'lucide-react';

type RaceStatsProps = {
	currentPosition: string;
	timeElapsed: string;
	pace: string;
	heartRate: number;
	heartRateZone: string;
};

export const RaceStatsCards = ({
	currentPosition,
	timeElapsed,
	pace,
	heartRate,
	heartRateZone,
}: RaceStatsProps) => (
	<div className='grid gap-6 md:grid-cols-3'>
		<Card className='border-border'>
			<CardHeader className='flex justify-between pb-2'>
				<CardTitle className='text-sm font-medium'>Current Position</CardTitle>
				<Zap className='h-4 w-4 text-primary' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{currentPosition}</div>
				<p className='text-xs text-muted-foreground'>Overall ranking</p>
			</CardContent>
		</Card>

		<Card className='border-border'>
			<CardHeader className='flex justify-between pb-2'>
				<CardTitle className='text-sm font-medium'>Time Elapsed</CardTitle>
				<Clock className='h-4 w-4 text-primary' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{timeElapsed}</div>
				<p className='text-xs text-muted-foreground'>Pace: {pace}</p>
			</CardContent>
		</Card>

		<Card className='border-border'>
			<CardHeader className='flex justify-between pb-2'>
				<CardTitle className='text-sm font-medium'>Heart Rate</CardTitle>
				<Heart className='h-4 w-4 text-red-500' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{heartRate} BPM</div>
				<p className='text-xs text-muted-foreground'>{heartRateZone} zone</p>
			</CardContent>
		</Card>
	</div>
);
