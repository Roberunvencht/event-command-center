import express from 'express';
import { handlePaymongoWebhook } from '../controllers/webhook.controller';

const router = express.Router();

router.post(
	'/paymongo',
	express.raw({ type: 'application/json' }),
	handlePaymongoWebhook,
);

export default router;
