import mongoose, { PopulatedDoc, ObjectId } from "mongoose";
import { Registration } from "./registration.model";
import { Event } from "./event.model";

export type RfidTag = {
  _id: ObjectId;
  epc: string;
  label?: string;
  status: "available" | "assigned" | "retired";
  registration: ObjectId | PopulatedDoc<Registration> | null;
  event: ObjectId | PopulatedDoc<Event> | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PopulatedRfidTag = RfidTag & {
  registration: PopulatedDoc<Registration> | null;
  event: PopulatedDoc<Event> | null;
};

const RfidTagSchema = new mongoose.Schema<RfidTag>(
  {
    epc: { type: String, required: true, unique: true },
    label: { type: String },
    status: {
      type: String,
      enum: ["available", "assigned", "retired"],
      default: "available",
    },
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      default: null,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
  },
  { timestamps: true },
);

const RfidTagModel = mongoose.model("RfidTag", RfidTagSchema);
export default RfidTagModel;
