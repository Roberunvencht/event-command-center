import { Router } from "express";
import {
  getRfidTags,
  createRfidTag,
  removeRfidTag,
  unassignRfidTag,
} from "../controllers/rfid-tag.controller";

const router = Router();

router.get("/", getRfidTags);
router.post("/", createRfidTag);
router.patch("/unassign/:tagID", unassignRfidTag);
router.delete("/:tagID", removeRfidTag);

export default router;
