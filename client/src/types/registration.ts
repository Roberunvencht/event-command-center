import { Device } from "./device";
import { Event, RaceCategory } from "./event";
import { Payment } from "./payment";
import { RfidTag } from "./rfid-tag";
import { User } from "./user";

export type Registration = {
  _id: string;
  user: User;
  event: Event;
  raceCategory: RaceCategory;
  bibNumber?: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo: {
    conditions?: string;
    allergies?: string;
    medications?: string;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  device?: Device;
  payment?: Payment;
  rfidTag?: RfidTag;
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
