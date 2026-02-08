import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Trophy,
	Download,
	Activity,
	Heart,
	AlertTriangle,
	TrendingUp,
	FileText,
} from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Reports() {
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [selectedEvent, setSelectedEvent] = useState('city-marathon-2024');

	const events = [
		{ id: 'city-marathon-2024', name: 'City Marathon 2024' },
		{ id: 'trail-run-2024', name: 'Trail Run Challenge 2024' },
		{ id: 'sprint-series-2024', name: 'Sprint Series 2024' },
	];

	const leaderboardData = {
		all: [
			{
				rank: 1,
				bibNumber: '001',
				name: 'John Doe',
				category: 'Full Marathon',
				time: '2:10:45',
				avgHR: 165,
				alerts: 0,
			},
			{
				rank: 2,
				bibNumber: '002',
				name: 'Jane Smith',
				category: 'Full Marathon',
				time: '2:12:20',
				avgHR: 162,
				alerts: 1,
			},
			{
				rank: 3,
				bibNumber: '042',
				name: 'Mike Wilson',
				category: 'Half Marathon',
				time: '1:05:30',
				avgHR: 170,
				alerts: 0,
			},
			{
				rank: 4,
				bibNumber: '003',
				name: 'Sarah Johnson',
				category: 'Full Marathon',
				time: '2:18:45',
				avgHR: 158,
				alerts: 2,
			},
			{
				rank: 5,
				bibNumber: '005',
				name: 'Tom Brown',
				category: '10K',
				time: '35:20',
				avgHR: 175,
				alerts: 0,
			},
		],
		'full-marathon': [
			{
				rank: 1,
				bibNumber: '001',
				name: 'John Doe',
				category: 'Full Marathon',
				time: '2:10:45',
				avgHR: 165,
				alerts: 0,
			},
			{
				rank: 2,
				bibNumber: '002',
				name: 'Jane Smith',
				category: 'Full Marathon',
				time: '2:12:20',
				avgHR: 162,
				alerts: 1,
			},
			{
				rank: 3,
				bibNumber: '003',
				name: 'Sarah Johnson',
				category: 'Full Marathon',
				time: '2:18:45',
				avgHR: 158,
				alerts: 2,
			},
		],
		'half-marathon': [
			{
				rank: 1,
				bibNumber: '042',
				name: 'Mike Wilson',
				category: 'Half Marathon',
				time: '1:05:30',
				avgHR: 170,
				alerts: 0,
			},
			{
				rank: 2,
				bibNumber: '043',
				name: 'Emily Davis',
				category: 'Half Marathon',
				time: '1:08:15',
				avgHR: 168,
				alerts: 1,
			},
		],
		'10k': [
			{
				rank: 1,
				bibNumber: '005',
				name: 'Tom Brown',
				category: '10K',
				time: '35:20',
				avgHR: 175,
				alerts: 0,
			},
			{
				rank: 2,
				bibNumber: '006',
				name: 'Lisa Anderson',
				category: '10K',
				time: '37:45',
				avgHR: 172,
				alerts: 0,
			},
		],
	};

	const medicalProfiles = [
		{
			bibNumber: '001',
			name: 'John Doe',
			category: 'Full Marathon',
			heartRate: {
				min: 145,
				max: 185,
				avg: 165,
				zones: { z1: 15, z2: 25, z3: 35, z4: 20, z5: 5 },
			},
			semg: {
				fatigueLevel: 'Low',
				peakFatigue: 45,
				avgFatigue: 28,
				trend: 'Stable',
			},
			alerts: [],
		},
		{
			bibNumber: '002',
			name: 'Jane Smith',
			category: 'Full Marathon',
			heartRate: {
				min: 142,
				max: 182,
				avg: 162,
				zones: { z1: 18, z2: 28, z3: 32, z4: 18, z5: 4 },
			},
			semg: {
				fatigueLevel: 'Moderate',
				peakFatigue: 62,
				avgFatigue: 38,
				trend: 'Increasing',
			},
			alerts: [
				{
					time: '01:45:30',
					type: 'Elevated HR',
					severity: 'Warning',
					message: 'Heart rate above 180 bpm',
				},
			],
		},
		{
			bibNumber: '003',
			name: 'Sarah Johnson',
			category: 'Full Marathon',
			heartRate: {
				min: 138,
				max: 178,
				avg: 158,
				zones: { z1: 20, z2: 30, z3: 30, z4: 15, z5: 5 },
			},
			semg: {
				fatigueLevel: 'High',
				peakFatigue: 78,
				avgFatigue: 52,
				trend: 'Sharp Increase',
			},
			alerts: [
				{
					time: '01:30:15',
					type: 'High Fatigue',
					severity: 'Caution',
					message: 'sEMG fatigue above 70%',
				},
				{
					time: '02:00:45',
					type: 'Elevated HR',
					severity: 'Warning',
					message: 'Heart rate sustained above 175 bpm',
				},
			],
		},
	];

	const exportLeaderboardPDF = async () => {
		const element = document.getElementById('leaderboard-section');
		if (!element) return;

		const canvas = await html2canvas(element, { scale: 2 });
		const imgData = canvas.toDataURL('image/png');

		const pdf = new jsPDF('p', 'mm', 'a4');
		const imgWidth = 210;
		const imgHeight = (canvas.height * imgWidth) / canvas.width;

		pdf.addPage();
		pdf.setFontSize(18);
		pdf.text('Event Leaderboard Report', 15, 15);
		pdf.setFontSize(12);
		pdf.text(
			`Event: ${events.find((e) => e.id === selectedEvent)?.name}`,
			15,
			25,
		);
		pdf.text(
			`Category: ${selectedCategory === 'all' ? 'All Categories' : selectedCategory.replace('-', ' ')}`,
			15,
			32,
		);
		pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, 39);
		pdf.addImage(imgData, 'PNG', 0, 45, imgWidth, imgHeight);

		pdf.save(`leaderboard-${selectedEvent}-${selectedCategory}.pdf`);
	};

	const exportMedicalReportPDF = async (
		runner: (typeof medicalProfiles)[0],
	) => {
		const pdf = new jsPDF('p', 'mm', 'a4');

		// Header
		pdf.setFontSize(18);
		pdf.text('Medical Performance Report', 15, 15);

		// Runner Info
		pdf.setFontSize(12);
		pdf.text(`Bib Number: ${runner.bibNumber}`, 15, 30);
		pdf.text(`Runner: ${runner.name}`, 15, 37);
		pdf.text(`Category: ${runner.category}`, 15, 44);
		pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, 51);

		// Heart Rate Section
		pdf.setFontSize(14);
		pdf.text('Heart Rate Analysis', 15, 65);
		pdf.setFontSize(10);
		pdf.text(`Average HR: ${runner.heartRate.avg} bpm`, 20, 73);
		pdf.text(`Min HR: ${runner.heartRate.min} bpm`, 20, 79);
		pdf.text(`Max HR: ${runner.heartRate.max} bpm`, 20, 85);
		pdf.text(
			`Zone 1: ${runner.heartRate.zones.z1}% | Zone 2: ${runner.heartRate.zones.z2}% | Zone 3: ${runner.heartRate.zones.z3}%`,
			20,
			91,
		);
		pdf.text(
			`Zone 4: ${runner.heartRate.zones.z4}% | Zone 5: ${runner.heartRate.zones.z5}%`,
			20,
			97,
		);

		// sEMG Section
		pdf.setFontSize(14);
		pdf.text('sEMG Fatigue Analysis', 15, 110);
		pdf.setFontSize(10);
		pdf.text(`Fatigue Level: ${runner.semg.fatigueLevel}`, 20, 118);
		pdf.text(`Average Fatigue: ${runner.semg.avgFatigue}%`, 20, 124);
		pdf.text(`Peak Fatigue: ${runner.semg.peakFatigue}%`, 20, 130);
		pdf.text(`Trend: ${runner.semg.trend}`, 20, 136);

		// Alerts Section
		if (runner.alerts.length > 0) {
			pdf.setFontSize(14);
			pdf.text('Alerts & Warnings', 15, 150);
			pdf.setFontSize(10);
			let yPos = 158;
			runner.alerts.forEach((alert, index) => {
				pdf.text(
					`${index + 1}. [${alert.time}] ${alert.type} (${alert.severity})`,
					20,
					yPos,
				);
				pdf.text(`   ${alert.message}`, 20, yPos + 6);
				yPos += 14;
			});
		} else {
			pdf.setFontSize(14);
			pdf.text('Alerts & Warnings', 15, 150);
			pdf.setFontSize(10);
			pdf.text('No alerts triggered during the race.', 20, 158);
		}

		pdf.save(
			`medical-report-${runner.bibNumber}-${runner.name.replace(/\s+/g, '-')}.pdf`,
		);
	};

	const currentLeaderboard =
		leaderboardData[selectedCategory as keyof typeof leaderboardData] ||
		leaderboardData.all;

	return (
		<div className='space-y-6 p-6 animate-appear'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>
						Reports & Analytics
					</h1>
					<p className='text-muted-foreground mt-2'>
						Event performance reports and medical analytics
					</p>
				</div>
			</div>

			<div className='flex gap-4'>
				<Select value={selectedEvent} onValueChange={setSelectedEvent}>
					<SelectTrigger className='w-[300px]'>
						<SelectValue placeholder='Select event' />
					</SelectTrigger>
					<SelectContent>
						{events.map((event) => (
							<SelectItem key={event.id} value={event.id}>
								{event.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Tabs defaultValue='leaderboard' className='w-full'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='leaderboard'>Leaderboard</TabsTrigger>
					<TabsTrigger value='medical'>Medical Reports</TabsTrigger>
				</TabsList>

				<TabsContent value='leaderboard' className='space-y-4'>
					<Card id='leaderboard-section'>
						<CardHeader>
							<div className='flex items-center justify-between'>
								<div>
									<CardTitle className='flex items-center gap-2'>
										<Trophy className='w-5 h-5 text-primary' />
										Event Leaderboard
									</CardTitle>
									<CardDescription>Ranked by finish time</CardDescription>
								</div>
								<Button
									onClick={exportLeaderboardPDF}
									variant='outline'
									size='sm'
								>
									<Download className='w-4 h-4 mr-2' />
									Export PDF
								</Button>
							</div>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex gap-2'>
								<Button
									variant={selectedCategory === 'all' ? 'default' : 'outline'}
									size='sm'
									onClick={() => setSelectedCategory('all')}
								>
									All Categories
								</Button>
								<Button
									variant={
										selectedCategory === 'full-marathon' ? 'default' : 'outline'
									}
									size='sm'
									onClick={() => setSelectedCategory('full-marathon')}
								>
									Full Marathon
								</Button>
								<Button
									variant={
										selectedCategory === 'half-marathon' ? 'default' : 'outline'
									}
									size='sm'
									onClick={() => setSelectedCategory('half-marathon')}
								>
									Half Marathon
								</Button>
								<Button
									variant={selectedCategory === '10k' ? 'default' : 'outline'}
									size='sm'
									onClick={() => setSelectedCategory('10k')}
								>
									10K
								</Button>
							</div>

							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Rank</TableHead>
										<TableHead>Bib #</TableHead>
										<TableHead>Name</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Finish Time</TableHead>
										<TableHead>Avg HR</TableHead>
										<TableHead>Alerts</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{currentLeaderboard.map((runner) => (
										<TableRow key={runner.bibNumber}>
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
											<TableCell>{runner.name}</TableCell>
											<TableCell>
												<Badge variant='secondary'>{runner.category}</Badge>
											</TableCell>
											<TableCell className='font-mono font-semibold'>
												{runner.time}
											</TableCell>
											<TableCell>
												<div className='flex items-center gap-1'>
													<Heart className='w-3 h-3 text-red-500' />
													{runner.avgHR} bpm
												</div>
											</TableCell>
											<TableCell>
												{runner.alerts > 0 ? (
													<Badge variant='destructive' className='gap-1'>
														<AlertTriangle className='w-3 h-3' />
														{runner.alerts}
													</Badge>
												) : (
													<Badge variant='outline' className='text-green-600'>
														None
													</Badge>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='medical' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Activity className='w-5 h-5 text-primary' />
								Medical Performance Reports
							</CardTitle>
							<CardDescription>
								Individual runner medical profiles and analytics
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							{medicalProfiles.map((runner) => (
								<Card key={runner.bibNumber} className='border-2'>
									<CardHeader>
										<div className='flex items-center justify-between'>
											<div>
												<CardTitle className='text-lg'>
													{runner.name} - Bib #{runner.bibNumber}
												</CardTitle>
												<CardDescription>{runner.category}</CardDescription>
											</div>
											<Button
												onClick={() => exportMedicalReportPDF(runner)}
												variant='outline'
												size='sm'
											>
												<FileText className='w-4 h-4 mr-2' />
												Export PDF
											</Button>
										</div>
									</CardHeader>
									<CardContent className='space-y-4'>
										{/* Heart Rate Analysis */}
										<div className='grid gap-4 md:grid-cols-2'>
											<Card>
												<CardHeader className='pb-3'>
													<CardTitle className='text-sm flex items-center gap-2'>
														<Heart className='w-4 h-4 text-red-500' />
														Heart Rate Trends
													</CardTitle>
												</CardHeader>
												<CardContent className='space-y-2'>
													<div className='flex justify-between text-sm'>
														<span className='text-muted-foreground'>
															Average:
														</span>
														<span className='font-semibold'>
															{runner.heartRate.avg} bpm
														</span>
													</div>
													<div className='flex justify-between text-sm'>
														<span className='text-muted-foreground'>
															Min / Max:
														</span>
														<span className='font-semibold'>
															{runner.heartRate.min} / {runner.heartRate.max}{' '}
															bpm
														</span>
													</div>
													<div className='mt-3 space-y-2'>
														<p className='text-xs text-muted-foreground'>
															Heart Rate Zones:
														</p>
														<div className='flex gap-1'>
															{Object.entries(runner.heartRate.zones).map(
																([zone, percent]) => (
																	<div key={zone} className='flex-1'>
																		<div
																			className='h-2 bg-primary rounded'
																			style={{ width: `${percent}%` }}
																		></div>
																		<p className='text-xs text-center mt-1'>
																			{percent}%
																		</p>
																	</div>
																),
															)}
														</div>
														<div className='flex justify-between text-xs text-muted-foreground'>
															<span>Z1</span>
															<span>Z2</span>
															<span>Z3</span>
															<span>Z4</span>
															<span>Z5</span>
														</div>
													</div>
												</CardContent>
											</Card>

											{/* sEMG Fatigue */}
											<Card>
												<CardHeader className='pb-3'>
													<CardTitle className='text-sm flex items-center gap-2'>
														<Activity className='w-4 h-4 text-primary' />
														sEMG Fatigue Analysis
													</CardTitle>
												</CardHeader>
												<CardContent className='space-y-2'>
													<div className='flex justify-between text-sm'>
														<span className='text-muted-foreground'>
															Fatigue Level:
														</span>
														<Badge
															variant={
																runner.semg.fatigueLevel === 'Low'
																	? 'outline'
																	: runner.semg.fatigueLevel === 'Moderate'
																		? 'secondary'
																		: 'destructive'
															}
														>
															{runner.semg.fatigueLevel}
														</Badge>
													</div>
													<div className='flex justify-between text-sm'>
														<span className='text-muted-foreground'>
															Average:
														</span>
														<span className='font-semibold'>
															{runner.semg.avgFatigue}%
														</span>
													</div>
													<div className='flex justify-between text-sm'>
														<span className='text-muted-foreground'>Peak:</span>
														<span className='font-semibold'>
															{runner.semg.peakFatigue}%
														</span>
													</div>
													<div className='flex justify-between text-sm'>
														<span className='text-muted-foreground'>
															Trend:
														</span>
														<span className='font-semibold flex items-center gap-1'>
															<TrendingUp className='w-3 h-3' />
															{runner.semg.trend}
														</span>
													</div>
													<div className='mt-3'>
														<div className='w-full h-2 bg-muted rounded overflow-hidden'>
															<div
																className={`h-full ${
																	runner.semg.fatigueLevel === 'Low'
																		? 'bg-green-500'
																		: runner.semg.fatigueLevel === 'Moderate'
																			? 'bg-yellow-500'
																			: 'bg-red-500'
																}`}
																style={{ width: `${runner.semg.peakFatigue}%` }}
															></div>
														</div>
													</div>
												</CardContent>
											</Card>
										</div>

										{/* Alerts */}
										<Card
											className={
												runner.alerts.length > 0
													? 'border-destructive'
													: 'border-green-500'
											}
										>
											<CardHeader className='pb-3'>
												<CardTitle className='text-sm flex items-center gap-2'>
													<AlertTriangle
														className={`w-4 h-4 ${runner.alerts.length > 0 ? 'text-destructive' : 'text-green-500'}`}
													/>
													Alerts Triggered During Race
												</CardTitle>
											</CardHeader>
											<CardContent>
												{runner.alerts.length > 0 ? (
													<div className='space-y-3'>
														{runner.alerts.map((alert, index) => (
															<div
																key={index}
																className='flex items-start gap-3 p-3 border border-border rounded-lg bg-destructive/5'
															>
																<AlertTriangle className='w-4 h-4 text-destructive mt-0.5' />
																<div className='flex-1'>
																	<div className='flex items-center gap-2 mb-1'>
																		<Badge
																			variant='destructive'
																			className='text-xs'
																		>
																			{alert.severity}
																		</Badge>
																		<span className='text-xs text-muted-foreground'>
																			{alert.time}
																		</span>
																	</div>
																	<p className='text-sm font-semibold'>
																		{alert.type}
																	</p>
																	<p className='text-xs text-muted-foreground mt-1'>
																		{alert.message}
																	</p>
																</div>
															</div>
														))}
													</div>
												) : (
													<p className='text-sm text-muted-foreground flex items-center gap-2'>
														<span className='w-2 h-2 bg-green-500 rounded-full'></span>
														No alerts triggered. Runner maintained healthy
														vitals throughout the race.
													</p>
												)}
											</CardContent>
										</Card>
									</CardContent>
								</Card>
							))}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
