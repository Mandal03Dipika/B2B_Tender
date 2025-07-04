import express from "express";
import {
  linkServicesToTender,
  getServicesForTender,
  removeServiceFromTender,
} from "../controllers/tenderServiceController";

const router = express.Router();

router.post("/:tenderId/link-services", linkServicesToTender);
router.get("/:tenderId/services", getServicesForTender);
router.delete("/:tenderId/services/:serviceId", removeServiceFromTender);

export default router;
