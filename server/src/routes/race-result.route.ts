import { Router } from "express";
import { getRaceResults } from "../controllers/race-result.controller";

const router = Router();

router.get("/", getRaceResults);

export default router;
