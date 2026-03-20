import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Heart, Activity, AlertTriangle } from 'lucide-react';
import { SerialPlotter } from '@/components/SerialPlotter';

type BioSignalProps = {
	heartRate: number;
	heartRateZone: string;
	emg: string;
	warning?: string | null;
	heartRateHistory?: { time: string; value: number }[];
	emgHistory?: { time: string; value: number }[];
};

export const BioSignalMonitor = ({
	heartRate,
	heartRateZone,
	emg,
	warning,
	heartRateHistory = [],
	emgHistory = [],
}: BioSignalProps) => {
	const [showPlotter, setShowPlotter] = useState(false);

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle className='flex items-center gap-2'>
						<Activity className='w-5 h-5 text-primary' />
						Bio Signal Monitoring
					</CardTitle>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-muted-foreground'>
							{showPlotter ? 'Plotter' : 'Numbers'}
						</span>
						<Switch
							checked={showPlotter}
							onCheckedChange={setShowPlotter}
						/>
					</div>
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				{showPlotter ? (
					<div className='space-y-6'>
						<div>
							<div className='flex items-center gap-2 mb-3'>
								<Heart className='w-4 h-4 text-red-500' />
								<span className='text-sm font-medium'>
									Heart Rate (BPM)
								</span>
							</div>
							<SerialPlotter
								data={heartRateHistory}
								lines={[
									{
										dataKey: 'value',
										color: 'hsl(0, 84%, 60%)',
										label: 'Heart Rate',
									},
								]}
								yAxisLabel='BPM'
							/>
						</div>
						<div>
							<div className='flex items-center gap-2 mb-3'>
								<Activity className='w-4 h-4 text-primary' />
								<span className='text-sm font-medium'>
									EMG Signal
								</span>
							</div>
							<SerialPlotter
								data={emgHistory}
								lines={[
									{
										dataKey: 'value',
										color: 'hsl(221, 83%, 53%)',
										label: 'EMG',
									},
								]}
								yAxisLabel='EMG'
							/>
						</div>
					</div>
				) : (
					<div className='grid grid-cols-2 gap-4'>
						<div className='p-4 border border-border rounded-lg'>
							<div className='flex items-center gap-2 mb-2'>
								<Heart className='w-5 h-5 text-red-500' />
								<span className='text-sm font-medium'>
									Heart Rate
								</span>
							</div>
							<p className='text-2xl font-bold'>
								{heartRate} BPM
							</p>
							<p className='text-sm text-muted-foreground'>
								{heartRateZone}
							</p>
						</div>
						<div className='p-4 border border-border rounded-lg'>
							<div className='flex items-center gap-2 mb-2'>
								<Activity className='w-5 h-5 text-primary' />
								<span className='text-sm font-medium'>
									EMG Signal
								</span>
							</div>
							<p className='text-2xl font-bold'>{emg}</p>
							<p className='text-sm text-muted-foreground'>
								Muscle activity
							</p>
						</div>
					</div>
				)}
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
};
