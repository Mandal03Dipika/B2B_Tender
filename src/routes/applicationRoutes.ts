import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  applyToTender,
  getMyApplications,
  getTenderApplications,
} from "../controllers/applicationController";

const router = express.Router();

router.post("/:tenderId", authenticate, applyToTender);
router.get("/mine", authenticate, getMyApplications);
router.get("/:tenderId", authenticate, getTenderApplications);

export default router;
