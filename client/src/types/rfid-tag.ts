import { Registration } from "./registration";
import { Event } from "./event";

export type RfidTag = {
  _id: string;
  epc: string;
  label?: string;
  status: "available" | "assigned" | "retired";
  registration: Registration | null;
  event: Event | null;
  createdAt: string;
  updatedAt: string;
};
