import express from "express";
import { getEventTelemetry } from "../controllers/telemetry.controller";

const router = express.Router();

router.get("/event/:eventID", getEventTelemetry);

export default router;
