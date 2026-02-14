import { Router } from 'express';
import { getRegistrationsHander } from '../controllers/registration.controller';

const router = Router();

router.get('/', getRegistrationsHander);

export default router;
