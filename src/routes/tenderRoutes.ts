import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createTender,
  deleteTender,
  getAllTenders,
  getMyTender,
  getTenderById,
  updateTender,
} from "../controllers/tenderController";

const router = express.Router();

router.post("/", authenticate, createTender);
router.put("/:id", authenticate, updateTender);
router.delete("/:id", authenticate, deleteTender);
router.get("/", getAllTenders);
router.get("/mine", authenticate, getMyTender);
router.get("/:id", getTenderById);

export default router;
