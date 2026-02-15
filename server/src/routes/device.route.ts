import express from 'express';
import {
	getDevices,
	createDevice,
	deviceTelemetryController,
	unassignDevice,
	removeDevice,
} from '../controllers/device.controller';

const router = express.Router();

router.get('/', getDevices);
router.post('/', createDevice);
router.post('/telemetry', deviceTelemetryController);
router.patch('/unassign/:deviceID', unassignDevice);
router.delete('/:deviceID', removeDevice);

export default router;
