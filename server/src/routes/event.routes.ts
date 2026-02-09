import { Router } from 'express';
import {
	createEventHandler,
	getEventsHandler,
	getSingleEventHandler,
} from '../controllers/event.controller';
import { registerController } from '../controllers/registration.controller';

const router = Router();

router.get('/', getEventsHandler);
router.post('/', createEventHandler);
router.get('/:eventID', getSingleEventHandler);
router.post('/:eventID/register', registerController);

export default router;
