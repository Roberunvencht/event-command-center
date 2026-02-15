import express from 'express';
import { updateProfileHandler } from '../controllers/user.controller';

const router = express.Router();

router.patch('/', updateProfileHandler);

export default router;
