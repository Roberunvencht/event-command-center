import { Registration } from "./registration";
import { RfidTag } from "./rfid-tag";

export type Checkpoint = {
  name: string;
  time: string;
};

export type RaceResult = {
  _id: string;
  registration: Registration;
  event: string;
  raceCategory: string;
  rfidTag: RfidTag;
  startTime?: string;
  finishTime?: string;
  checkpoints: Checkpoint[];
  elapsedMs?: number;
  status: "not_started" | "running" | "finished" | "dnf" | "dns";
  rank?: number;
  createdAt: string;
  updatedAt: string;
};
