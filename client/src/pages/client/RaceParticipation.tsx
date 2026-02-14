import { useEffect, useState } from 'react';
import { connectSocket, disconnectSocket } from '@/services/socket';
import { RaceStatsCards } from '@/components/RaceStatsCards.tsx';
import { RaceProgress } from '@/components/RaceProgress.tsx';
import { BioSignalMonitor } from '@/components/BioSignalMonitor.tsx';
import { LiveMap } from '@/components/LiveMap.tsx';
import { CheckpointList } from '@/components/CheckpointList.tsx';
import { useParams } from 'react-router-dom';

type Checkpoint = {
	name: string;
	status: 'completed' | 'approaching' | 'pending';
	time: string;
};

export default function RaceParticipation() {
	const { registrationId } = useParams();

	const [raceData, setRaceData] = useState({
		currentPosition: '-',
		timeElapsed: '-',
		pace: '-',
		heartRate: 0,
		heartRateZone: '-',
		distance: 0,
		totalDistance: 42.2,
		nextCheckpoint: '-',
		distanceToCheckpoint: '-',
		estimatedTime: '-',
		emg: 'Normal',
		warning: null as string | null,
		checkpoints: [] as Checkpoint[],
	});

	useEffect(() => {
		const socket = connectSocket();
		console.log(registrationId);
		socket.emit('joinRace', { registrationId });

		socket.on('positionUpdate', (data) =>
			setRaceData((prev) => ({ ...prev, currentPosition: data.position })),
		);
		socket.on('timeUpdate', (data) =>
			setRaceData((prev) => ({
				...prev,
				timeElapsed: data.timeElapsed,
				pace: data.pace,
			})),
		);
		socket.on('bioSignalUpdate', (data) =>
			setRaceData((prev) => ({
				...prev,
				heartRate: data.heartRate,
				heartRateZone: data.heartRateZone,
				emg: data.emg,
				warning: data.warning,
			})),
		);
		socket.on('checkpointUpdate', (data) =>
			setRaceData((prev) => ({
				...prev,
				nextCheckpoint: data.nextCheckpoint,
				distanceToCheckpoint: data.distanceToCheckpoint,
				estimatedTime: data.estimatedTime,
				checkpoints: data.checkpoints,
				distance: data.distance,
			})),
		);

		return () => {
			socket.emit('leaveRace', { registrationId });
			disconnectSocket();
		};
	}, [registrationId]);

	return (
		<div className='space-y-6 animate-appear'>
			<RaceStatsCards
				currentPosition={raceData.currentPosition}
				timeElapsed={raceData.timeElapsed}
				pace={raceData.pace}
				heartRate={raceData.heartRate}
				heartRateZone={raceData.heartRateZone}
			/>
			<RaceProgress
				distance={raceData.distance}
				totalDistance={raceData.totalDistance}
				nextCheckpoint={raceData.nextCheckpoint}
				distanceToCheckpoint={raceData.distanceToCheckpoint}
				estimatedTime={raceData.estimatedTime}
			/>
			<BioSignalMonitor
				heartRate={raceData.heartRate}
				heartRateZone={raceData.heartRateZone}
				emg={raceData.emg}
				warning={raceData.warning}
			/>
			<LiveMap />
			<CheckpointList checkpoints={raceData.checkpoints} />
		</div>
	);
}
