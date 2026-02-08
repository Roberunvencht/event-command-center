import { Router } from 'express';
import {
	createEventHandler,
	getEventsHandler,
	getSingleEventHandler,
} from '../controllers/event.controller';

const router = Router();

router.get('/', getEventsHandler);
router.post('/', createEventHandler);
router.get('/:eventID', getSingleEventHandler);

export default router;
