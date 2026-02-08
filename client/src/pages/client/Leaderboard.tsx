import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Award } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export default function Leaderboard() {
	const currentEvent = {
		name: 'City Marathon 2024',
		yourRank: 3,
		yourTime: '2:15:30',
	};

	const overallLeaderboard = [
		{
			rank: 1,
			name: 'John Doe',
			bibNumber: '001',
			time: '2:10:45',
			techType: 'Running Node',
		},
		{
			rank: 2,
			name: 'Jane Smith',
			bibNumber: '002',
			time: '2:12:20',
			techType: 'Hybrid',
		},
		{
			rank: 3,
			name: 'You',
			bibNumber: '042',
			time: '2:15:30',
			techType: 'Running Node',
			isUser: true,
		},
		{
			rank: 4,
			name: 'Mike Johnson',
			bibNumber: '003',
			time: '2:18:45',
			techType: 'RFID',
		},
		{
			rank: 5,
			name: 'Sarah Williams',
			bibNumber: '005',
			time: '2:22:10',
			techType: 'Hybrid',
		},
	];

	const personalStats = [
		{
			event: 'City Marathon 2024',
			date: 'Jan 15, 2024',
			rank: 3,
			time: '2:15:30',
			participants: 150,
		},
		{
			event: 'Trail Run Challenge',
			date: 'Dec 22, 2023',
			rank: 5,
			time: '1:45:20',
			participants: 80,
		},
		{
			event: 'Sprint Series #3',
			date: 'Dec 8, 2023',
			rank: 2,
			time: '38:45',
			participants: 60,
		},
	];

	const achievements = [
		{
			title: 'First Marathon',
			description: 'Completed your first marathon',
			date: 'Jan 15, 2024',
		},
		{
			title: 'Top 5 Finish',
			description: 'Finished in top 5',
			date: 'Dec 22, 2023',
		},
		{
			title: 'Consistency',
			description: 'Participated in 3+ events',
			date: 'Dec 8, 2023',
		},
	];

	return (
		<div className='space-y-6 animate-appear'>
			<div>
				<h1 className='text-3xl font-bold text-foreground'>
					Leaderboard & Results
				</h1>
				<p className='text-muted-foreground mt-2'>
					Track your performance and rankings
				</p>
			</div>

			<div className='grid gap-6 md:grid-cols-3'>
				<Card className='border-border'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Current Rank</CardTitle>
						<Trophy className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>#{currentEvent.yourRank}</div>
						<p className='text-xs text-muted-foreground'>{currentEvent.name}</p>
					</CardContent>
				</Card>

				<Card className='border-border'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Best Time</CardTitle>
						<TrendingUp className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>38:45</div>
						<p className='text-xs text-muted-foreground'>Sprint Series #3</p>
					</CardContent>
				</Card>

				<Card className='border-border'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Achievements</CardTitle>
						<Award className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{achievements.length}</div>
						<p className='text-xs text-muted-foreground'>Unlocked</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue='current' className='w-full'>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value='current'>Current Event</TabsTrigger>
					<TabsTrigger value='history'>My History</TabsTrigger>
					<TabsTrigger value='achievements'>Achievements</TabsTrigger>
				</TabsList>

				<TabsContent value='current' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Trophy className='w-5 h-5 text-primary' />
								Overall Leaderboard - {currentEvent.name}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Rank</TableHead>
										<TableHead>Bib #</TableHead>
										<TableHead>Name</TableHead>
										<TableHead>Time</TableHead>
										<TableHead>Tech Type</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{overallLeaderboard.map((runner) => (
										<TableRow
											key={runner.rank}
											className={
												runner.isUser
													? 'bg-primary/5 border-l-4 border-l-primary'
													: ''
											}
										>
											<TableCell>
												<div className='flex items-center gap-2'>
													{runner.rank === 1 && (
														<Trophy className='w-4 h-4 text-yellow-500' />
													)}
													{runner.rank === 2 && (
														<Trophy className='w-4 h-4 text-gray-400' />
													)}
													{runner.rank === 3 && (
														<Trophy className='w-4 h-4 text-amber-600' />
													)}
													<span className='font-bold'>{runner.rank}</span>
												</div>
											</TableCell>
											<TableCell className='font-medium'>
												{runner.bibNumber}
											</TableCell>
											<TableCell className={runner.isUser ? 'font-bold' : ''}>
												{runner.name}
											</TableCell>
											<TableCell className='font-mono'>{runner.time}</TableCell>
											<TableCell>
												<Badge variant='outline'>{runner.techType}</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='history' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Personal Race History</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Event</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Rank</TableHead>
										<TableHead>Time</TableHead>
										<TableHead>Participants</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{personalStats.map((stat, index) => (
										<TableRow key={index}>
											<TableCell className='font-medium'>
												{stat.event}
											</TableCell>
											<TableCell>{stat.date}</TableCell>
											<TableCell>
												<Badge variant='secondary'>#{stat.rank}</Badge>
											</TableCell>
											<TableCell className='font-mono'>{stat.time}</TableCell>
											<TableCell>{stat.participants}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Performance Trends</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='w-full h-[200px] bg-muted rounded-lg flex items-center justify-center'>
								<div className='text-center text-muted-foreground'>
									<TrendingUp className='w-12 h-12 mx-auto mb-2' />
									<p>Performance chart</p>
									<p className='text-sm'>Track your improvement over time</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='achievements' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Award className='w-5 h-5 text-primary' />
								Unlocked Achievements
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							{achievements.map((achievement, index) => (
								<div
									key={index}
									className='flex items-start gap-4 p-4 border border-border rounded-lg'
								>
									<div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
										<Award className='w-6 h-6 text-primary' />
									</div>
									<div className='flex-1'>
										<h4 className='font-semibold'>{achievement.title}</h4>
										<p className='text-sm text-muted-foreground'>
											{achievement.description}
										</p>
										<p className='text-xs text-muted-foreground mt-1'>
											{achievement.date}
										</p>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
