import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart';

export type SerialPlotterLine = {
	dataKey: string;
	color: string;
	label: string;
};

type SerialPlotterProps = {
	data: Record<string, number | string>[];
	lines: SerialPlotterLine[];
	yAxisLabel?: string;
	maxDataPoints?: number;
};

export const SerialPlotter = ({
	data,
	lines,
	yAxisLabel,
	maxDataPoints = 30,
}: SerialPlotterProps) => {
	const visibleData = data.slice(-maxDataPoints);

	const chartConfig: ChartConfig = Object.fromEntries(
		lines.map((line) => [
			line.dataKey,
			{ label: line.label, color: line.color },
		]),
	);

	return (
		<ChartContainer config={chartConfig} className='h-[200px] w-full'>
			<LineChart
				data={visibleData}
				margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
			>
				<CartesianGrid strokeDasharray='3 3' className='stroke-border/50' />
				<XAxis
					dataKey='time'
					tick={{ fontSize: 10 }}
					className='fill-muted-foreground'
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					tick={{ fontSize: 10 }}
					className='fill-muted-foreground'
					tickLine={false}
					axisLine={false}
					label={
						yAxisLabel
							? {
									value: yAxisLabel,
									angle: -90,
									position: 'insideLeft',
									style: { fontSize: 11 },
								}
							: undefined
					}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				{lines.map((line) => (
					<Line
						key={line.dataKey}
						type='monotone'
						dataKey={line.dataKey}
						stroke={`var(--color-${line.dataKey})`}
						strokeWidth={2}
						dot={false}
						animationDuration={300}
					/>
				))}
			</LineChart>
		</ChartContainer>
	);
};
