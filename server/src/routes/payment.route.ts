import { Router } from 'express';
import {
	createCheckoutSession,
	verifyCheckoutSession,
} from '../controllers/payment.controller';

const router = Router();

router.post('/create', createCheckoutSession);
router.post('/verify', verifyCheckoutSession);

export default router;
