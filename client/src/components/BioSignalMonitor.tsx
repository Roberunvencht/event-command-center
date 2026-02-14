import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, AlertTriangle } from 'lucide-react';

type BioSignalProps = {
	heartRate: number;
	heartRateZone: string;
	emg: string;
	warning?: string | null;
};

export const BioSignalMonitor = ({
	heartRate,
	heartRateZone,
	emg,
	warning,
}: BioSignalProps) => (
	<Card>
		<CardHeader>
			<CardTitle className='flex items-center gap-2'>
				<Activity className='w-5 h-5 text-primary' />
				Bio Signal Monitoring
			</CardTitle>
		</CardHeader>
		<CardContent className='space-y-4'>
			<div className='grid grid-cols-2 gap-4'>
				<div className='p-4 border border-border rounded-lg'>
					<div className='flex items-center gap-2 mb-2'>
						<Heart className='w-5 h-5 text-red-500' />
						<span className='text-sm font-medium'>Heart Rate</span>
					</div>
					<p className='text-2xl font-bold'>{heartRate} BPM</p>
					<p className='text-sm text-muted-foreground'>{heartRateZone}</p>
				</div>
				<div className='p-4 border border-border rounded-lg'>
					<div className='flex items-center gap-2 mb-2'>
						<Activity className='w-5 h-5 text-primary' />
						<span className='text-sm font-medium'>EMG Signal</span>
					</div>
					<p className='text-2xl font-bold'>{emg}</p>
					<p className='text-sm text-muted-foreground'>Muscle activity</p>
				</div>
			</div>
			{warning && (
				<div className='flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg'>
					<AlertTriangle className='w-5 h-5 text-yellow-500' />
					<p className='text-sm font-medium text-yellow-700 dark:text-yellow-300'>
						{warning}
					</p>
				</div>
			)}
		</CardContent>
	</Card>
);
