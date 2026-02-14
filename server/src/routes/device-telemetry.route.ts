import express from 'express';
import { deviceTelemetryController } from '../controllers/device-telemetry.controller';

const router = express.Router();

router.post('/telemetry', deviceTelemetryController);

export default router;
