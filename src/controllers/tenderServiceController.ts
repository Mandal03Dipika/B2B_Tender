import { Request, Response } from "express";
import db from "../db/knex";
import {
  tenderServiceParamsSchema,
  linkServicesSchema,
} from "../validators/tenderService";
import { z } from "zod";

export const linkServicesToTender = async (req: Request, res: Response) => {
  try {
    const { tenderId } = tenderServiceParamsSchema.parse(req.params);
    const { serviceIds } = linkServicesSchema.parse(req.body);
    const rowsToInsert = serviceIds.map((serviceId) => ({
      tender_id: tenderId,
      goods_service_id: serviceId,
    }));
    await db("tender_services").insert(rowsToInsert);
    res
      .status(201)
      .json({ message: "Services linked to tender successfully." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Failed to link services to tender" });
  }
};

export const getServicesForTender = async (req: Request, res: Response) => {
  try {
    const { tenderId } = tenderServiceParamsSchema.parse(req.params);
    const services = await db("tender_services")
      .join(
        "goods_services",
        "tender_services.goods_service_id",
        "goods_services.id"
      )
      .where("tender_services.tender_id", tenderId)
      .select("goods_services.*");
    res.status(200).json(services);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Failed to fetch services for tender" });
  }
};

export const removeServiceFromTender = async (req: Request, res: Response) => {
  try {
    const { tenderId, serviceId } = tenderServiceParamsSchema.parse(req.params);
    await db("tender_services")
      .where({ tender_id: tenderId, goods_service_id: serviceId })
      .del();
    res.status(200).json({ message: "Service removed from tender." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Failed to remove service from tender" });
  }
};
