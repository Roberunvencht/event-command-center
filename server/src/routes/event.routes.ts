import { Router } from 'express';
import {
	createEventHandler,
	getEventsHandler,
	getSingleEventHandler,
	editEventHandler,
	deleteEventHandler,
} from '../controllers/event.controller';
import { registerHandler } from '../controllers/registration.controller';

const router = Router();

router.get('/', getEventsHandler);
router.post('/', createEventHandler);
router.get('/:eventID', getSingleEventHandler);
router.patch('/:eventID', editEventHandler);
router.delete('/:eventID', deleteEventHandler);

router.post('/:eventID/register', registerHandler);

export default router;
