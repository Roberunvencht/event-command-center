import express from 'express';
import {
	getDevices,
	createDevice,
	deviceTelemetryController,
} from '../controllers/device.controller';

const router = express.Router();

router.get('/', getDevices);
router.post('/', createDevice);
router.post('/telemetry', deviceTelemetryController);

export default router;
