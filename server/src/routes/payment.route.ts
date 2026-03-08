import { Router } from "express";
import {
  createCheckoutSession,
  markPaymentAsPaid,
  verifyCheckoutSession,
} from "../controllers/payment.controller";

const router = Router();

router.post("/create", createCheckoutSession);
router.post("/verify", verifyCheckoutSession);
router.post("/mark-paid", markPaymentAsPaid);

export default router;
