import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  getMyCompany,
  logoUpload,
  searchCompanies,
  updateCompany,
} from "../controllers/companyController";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/", authenticate, createCompany);
router.post("/upload-logo", authenticate, upload.single("logo"), logoUpload);
router.put("/:id", authenticate, updateCompany);
router.get("/", authenticate, getAllCompanies);
router.get("/my", authenticate, getMyCompany);
router.get("/search", searchCompanies);
router.get("/:id", getCompanyById);

export default router;
