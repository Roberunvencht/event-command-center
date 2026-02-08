import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Activity } from 'lucide-react';

export default function RunnerStatus() {
	const runnerStatus = [
		{
			bibNumber: '001',
			name: 'John Doe',
			rfidStatus: 'Active',
			heartRate: 145,
			lastSeen: '2 min ago',
		},
		{
			bibNumber: '002',
			name: 'Jane Smith',
			rfidStatus: 'Active',
			heartRate: 152,
			lastSeen: '1 min ago',
		},
		{
			bibNumber: '003',
			name: 'Mike Johnson',
			rfidStatus: 'Active',
			heartRate: 138,
			lastSeen: '3 min ago',
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>RFID & Biosignal Status</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Bib #</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>RFID Status</TableHead>
							<TableHead>Heart Rate (BPM)</TableHead>
							<TableHead>Last Seen</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{runnerStatus.map((runner) => (
							<TableRow key={runner.bibNumber}>
								<TableCell className='font-medium'>
									{runner.bibNumber}
								</TableCell>
								<TableCell>{runner.name}</TableCell>
								<TableCell>
									<Badge className='bg-teal-500/20 text-teal-700 dark:text-teal-300'>
										{runner.rfidStatus}
									</Badge>
								</TableCell>
								<TableCell>
									<div className='flex items-center gap-2'>
										<Activity className='w-4 h-4 text-red-500' />
										<span className='font-mono'>{runner.heartRate}</span>
									</div>
								</TableCell>
								<TableCell className='text-muted-foreground'>
									{runner.lastSeen}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
