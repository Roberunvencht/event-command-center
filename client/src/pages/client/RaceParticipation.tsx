import { useEffect, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "@/services/socket";
import { RaceStatsCards } from "@/components/RaceStatsCards.tsx";
import { RaceProgress } from "@/components/RaceProgress.tsx";
import { BioSignalMonitor } from "@/components/BioSignalMonitor.tsx";
import { LiveMap } from "@/components/LiveMap.tsx";
import { CheckpointList } from "@/components/CheckpointList.tsx";
import { useParams } from "react-router-dom";

type Checkpoint = {
  name: string;
  status: "completed" | "approaching" | "pending";
  time: string;
};

const MAX_HISTORY = 50;

function getTimeLabel() {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function RaceParticipation() {
  const { registrationId } = useParams();

  const [raceData, setRaceData] = useState({
    currentPosition: "-",
    timeElapsed: "-",
    pace: "-",
    heartRate: 0,
    heartRateZone: "-",
    distance: 0,
    totalDistance: 42.2,
    nextCheckpoint: "-",
    distanceToCheckpoint: "-",
    estimatedTime: "-",
    emg: "Normal",
    warning: null as string | null,
    checkpoints: [] as Checkpoint[],
  });

  const heartRateHistoryRef = useRef<{ time: string; value: number }[]>([]);
  const emgHistoryRef = useRef<{ time: string; value: number }[]>([]);
  const [heartRateHistory, setHeartRateHistory] = useState<
    { time: string; value: number }[]
  >([]);
  const [emgHistory, setEmgHistory] = useState<
    { time: string; value: number }[]
  >([]);

  useEffect(() => {
    const socket = getSocket("race");
    console.log(registrationId);

    socket.emit("joinRace", { registrationId });

    socket.on("positionUpdate", (data) =>
      setRaceData((prev) => ({ ...prev, currentPosition: data.position })),
    );
    socket.on("timeUpdate", (data) =>
      setRaceData((prev) => ({
        ...prev,
        timeElapsed: data.timeElapsed,
        pace: data.pace,
      })),
    );
    socket.on("heartRateUpdate", (data) => {
      setRaceData((prev) => ({
        ...prev,
        heartRate: data.heartRate,
        heartRateZone: data.heartRateZone,
      }));
      const entry = { time: getTimeLabel(), value: data.heartRate };
      heartRateHistoryRef.current = [
        ...heartRateHistoryRef.current,
        entry,
      ].slice(-MAX_HISTORY);
      setHeartRateHistory([...heartRateHistoryRef.current]);
    });
    socket.on("emgUpdate", (data) => {
      setRaceData((prev) => ({
        ...prev,
        emg: data.emg,
      }));
      const numericValue = parseFloat(data.emg) || 0;
      const entry = { time: getTimeLabel(), value: numericValue };
      emgHistoryRef.current = [
        ...emgHistoryRef.current,
        entry,
      ].slice(-MAX_HISTORY);
      setEmgHistory([...emgHistoryRef.current]);
    });
    socket.on("checkpointUpdate", (data) =>
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
      socket.emit("leaveRace", { registrationId });
      disconnectSocket("race");
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
        heartRateHistory={heartRateHistory}
        emgHistory={emgHistory}
      />
      <LiveMap />
      <CheckpointList checkpoints={raceData.checkpoints} />
    </div>
  );
}
