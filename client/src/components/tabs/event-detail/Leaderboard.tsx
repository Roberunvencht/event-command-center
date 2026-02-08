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
import { Trophy } from 'lucide-react';

export default function Leaderboard() {
	const leaderboard = [
		{
			rank: 1,
			name: 'John Doe',
			bibNumber: '001',
			time: '2:15:30',
			lastCheckpoint: 'CP-5',
		},
		{
			rank: 2,
			name: 'Jane Smith',
			bibNumber: '002',
			time: '2:18:45',
			lastCheckpoint: 'CP-5',
		},
		{
			rank: 3,
			name: 'Mike Johnson',
			bibNumber: '003',
			time: '2:22:10',
			lastCheckpoint: 'CP-4',
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Live Leaderboard</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Rank</TableHead>
							<TableHead>Bib #</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Time</TableHead>
							<TableHead>Last Checkpoint</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{leaderboard.map((runner) => (
							<TableRow key={runner.rank}>
								<TableCell>
									<div className='flex items-center gap-2'>
										{runner.rank === 1 && (
											<Trophy className='w-4 h-4 text-yellow-500' />
										)}
										<span className='font-bold'>{runner.rank}</span>
									</div>
								</TableCell>
								<TableCell className='font-medium'>
									{runner.bibNumber}
								</TableCell>
								<TableCell>{runner.name}</TableCell>
								<TableCell className='font-mono'>{runner.time}</TableCell>
								<TableCell>
									<Badge variant='secondary'>{runner.lastCheckpoint}</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
