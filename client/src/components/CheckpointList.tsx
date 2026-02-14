import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Checkpoint = {
	name: string;
	status: 'completed' | 'approaching' | 'pending';
	time: string;
};

type CheckpointListProps = { checkpoints: Checkpoint[] };

export const CheckpointList = ({ checkpoints }: CheckpointListProps) => (
	<Card>
		<CardHeader>
			<CardTitle>Checkpoint Status</CardTitle>
		</CardHeader>
		<CardContent>
			<div className='space-y-2'>
				{checkpoints.map((checkpoint, i) => (
					<div
						key={i}
						className='flex items-center justify-between p-3 border border-border rounded-lg'
					>
						<div className='flex items-center gap-3'>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
									checkpoint.status === 'completed'
										? 'bg-teal-500/20 text-teal-700 dark:text-teal-300'
										: checkpoint.status === 'approaching'
											? 'bg-primary/20 text-primary'
											: 'bg-muted text-muted-foreground'
								}`}
							>
								{i + 1}
							</div>
							<span className='font-medium'>{checkpoint.name}</span>
						</div>
						<div className='flex items-center gap-3'>
							<span className='text-sm text-muted-foreground'>
								{checkpoint.time}
							</span>
							<Badge
								variant={
									checkpoint.status === 'completed' ? 'default' : 'secondary'
								}
								className={
									checkpoint.status === 'completed'
										? 'bg-teal-500/20 text-teal-700 dark:text-teal-300'
										: checkpoint.status === 'approaching'
											? 'bg-primary/20 text-primary'
											: ''
								}
							>
								{checkpoint.status}
							</Badge>
						</div>
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);
