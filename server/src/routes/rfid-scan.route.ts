import { Router } from "express";
import { handleRfidScan } from "../controllers/rfid-scan.controller";

const router = Router();

router.post("/", handleRfidScan);

export default router;
