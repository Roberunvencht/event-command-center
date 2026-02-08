import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Download } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export default function Results() {
	const fullMarathonResults = [
		{
			position: 1,
			bib: '001',
			name: 'Erik Larsson',
			team: 'None',
			time: '2:15:23',
			icon: Trophy,
		},
		{
			position: 2,
			bib: '042',
			name: 'John Smith',
			team: 'Team A',
			time: '2:18:45',
			icon: Medal,
		},
		{
			position: 3,
			bib: '103',
			name: 'Jose Reyes',
			team: 'Team B',
			time: '2:22:17',
			icon: Award,
		},
		{
			position: 4,
			bib: '087',
			name: 'David Chen',
			team: 'None',
			time: '2:28:09',
		},
		{
			position: 5,
			bib: '156',
			name: 'Sarah Miller',
			team: 'Team A',
			time: '2:31:54',
		},
	];

	const halfMarathonResults = [
		{
			position: 1,
			bib: '234',
			name: 'Emma Wilson',
			team: 'Team C',
			time: '1:12:34',
			icon: Trophy,
		},
		{
			position: 2,
			bib: '189',
			name: 'Mike Johnson',
			team: 'None',
			time: '1:15:21',
			icon: Medal,
		},
		{
			position: 3,
			bib: '267',
			name: 'Lisa Anderson',
			team: 'Team D',
			time: '1:18:45',
			icon: Award,
		},
	];

	const renderResultsTable = (results: any[]) => (
		<Table>
			<TableHeader>
				<TableRow className='bg-muted/50'>
					<TableHead className='w-20'>Position</TableHead>
					<TableHead className='w-20'>Bib</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Team</TableHead>
					<TableHead>Time</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{results.map((result) => {
					const IconComponent = result.icon;
					return (
						<TableRow key={result.position} className='hover:bg-muted/30'>
							<TableCell className='font-bold'>
								<div className='flex items-center gap-2'>
									{IconComponent && (
										<IconComponent className='w-4 h-4 text-primary' />
									)}
									{result.position}
								</div>
							</TableCell>
							<TableCell className='font-medium'>{result.bib}</TableCell>
							<TableCell className='font-medium text-foreground'>
								{result.name}
							</TableCell>
							<TableCell className='text-muted-foreground'>
								{result.team}
							</TableCell>
							<TableCell className='font-mono font-medium text-primary'>
								{result.time}
							</TableCell>
							<TableCell>
								<Badge variant='default'>Finished</Badge>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);

	return (
		<div className='space-y-6 animate-appear'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground mb-2'>Results</h1>
					<p className='text-muted-foreground'>
						View race results and leaderboards
					</p>
				</div>
				<Button variant='outline' className='gap-2'>
					<Download className='w-4 h-4' />
					Export Results
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>City Marathon 2024 - Results</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue='full' className='w-full'>
						<TabsList className='grid w-full grid-cols-3'>
							<TabsTrigger value='full'>Full Marathon</TabsTrigger>
							<TabsTrigger value='half'>Half Marathon</TabsTrigger>
							<TabsTrigger value='10k'>10km</TabsTrigger>
						</TabsList>

						<TabsContent value='full' className='mt-6'>
							<div className='rounded-lg border border-border overflow-hidden'>
								{renderResultsTable(fullMarathonResults)}
							</div>
						</TabsContent>

						<TabsContent value='half' className='mt-6'>
							<div className='rounded-lg border border-border overflow-hidden'>
								{renderResultsTable(halfMarathonResults)}
							</div>
						</TabsContent>

						<TabsContent value='10k' className='mt-6'>
							<div className='p-8 text-center text-muted-foreground'>
								<Trophy className='w-12 h-12 mx-auto mb-4 opacity-20' />
								<p>Results for 10km race will be available soon</p>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
