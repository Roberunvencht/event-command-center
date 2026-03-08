import mongoose, { Types, PopulatedDoc } from "mongoose";
import { Registration } from "./registration.model";
import { Event } from "./event.model";
import { RfidTag } from "./rfid-tag.model";

export type Checkpoint = {
  name: string;
  time: Date;
};

export type RaceResult = {
  _id: Types.ObjectId;
  registration: Types.ObjectId | PopulatedDoc<Registration>;
  event: Types.ObjectId | PopulatedDoc<Event>;
  raceCategory: Types.ObjectId;
  rfidTag: Types.ObjectId | PopulatedDoc<RfidTag>;
  startTime?: Date;
  finishTime?: Date;
  checkpoints: Checkpoint[];
  elapsedMs?: number;
  status: "not_started" | "running" | "finished" | "dnf" | "dns";
  rank?: number;
  createdAt: Date;
  updatedAt: Date;
};

const CheckpointSchema = new mongoose.Schema<Checkpoint>(
  {
    name: { type: String, required: true },
    time: { type: Date, required: true },
  },
  { _id: false },
);

const RaceResultSchema = new mongoose.Schema<RaceResult>(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    raceCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    rfidTag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RfidTag",
      required: true,
    },
    startTime: { type: Date },
    finishTime: { type: Date },
    checkpoints: [CheckpointSchema],
    elapsedMs: { type: Number },
    status: {
      type: String,
      enum: ["not_started", "running", "finished", "dnf", "dns"],
      default: "not_started",
      index: true,
    },
    rank: { type: Number },
  },
  { timestamps: true },
);

// Compound index for quick lookups
RaceResultSchema.index({ event: 1, raceCategory: 1, elapsedMs: 1 });

const RaceResultModel = mongoose.model("RaceResult", RaceResultSchema);
export default RaceResultModel;
