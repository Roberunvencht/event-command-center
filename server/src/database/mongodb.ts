import mongoose from "mongoose";
import { seedAdmin } from "./adminSeed";
import { ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } from "../constant/env";
import seedEvents from "./eventSeed";
import { seedTelemetry } from "./telemetrySeed";

export default async function connectToMongoDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to database successfully");

    await seedAdmin({
      name: "Admin User",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    await seedEvents();
    await seedTelemetry();
  } catch (err: any) {
    console.error("Failed to connect to MongoDB", err);
  }
}
