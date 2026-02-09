import { Router } from "express";
import { registerController } from "../controllers/registration.controller";

const router = Router();

router.post(
  '/events/:eventID/register',
  registerController
);

export default router;

