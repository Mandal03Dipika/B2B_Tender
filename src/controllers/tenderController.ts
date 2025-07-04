import { Request, Response } from "express";
import db from "../db/knex";
import { tenderQuerySchema, tenderSchema } from "../validators/tender";
import { z } from "zod";

export const createTender = async (req: Request, res: Response) => {
  try {
    const validated = tenderSchema.parse(req.body);
    const user = await db("users").where({ id: req.user!.id }).first();
    if (!user.company_id) {
      res.status(400).json({ message: "User has no company" });
      return;
    }
    const [tender] = await db("tenders")
      .insert({ ...validated, company_id: user.company_id })
      .returning("*");
    res.status(200).json(tender);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
      return;
    }
    console.log(error);
    res.status(500).json({ message: "Failed to create tender" });
  }
};

export const getAllTenders = async (req: Request, res: Response) => {
  try {
    const { page, limit } = tenderQuerySchema.parse(req.query);
    const tenders = await db("tenders")
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy("created_at", "desc");
    res.status(200).json({ page, limit, tenders });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.errors });
      return;
    }
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tenders" });
  }
};

export const getMyTender = async (req: Request, res: Response) => {
  try {
    const user = await db("users").where({ id: req.user!.id }).first();
    const tenders = await db("tenders")
      .where({ company_id: user.company_id })
      .orderBy("created_at", "desc");
    res.status(200).json(tenders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get my tenders" });
  }
};

export const getTenderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const tender = await db("tenders").where({ id }).first();
    if (!tender) {
      res.status(404).json({ message: "Tender no found" });
      return;
    }
    res.status(200).json(tender);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get tender by id" });
  }
};

export const updateTender = async (req: Request, res: Response) => {
  try {
    const validated = tenderSchema.partial().parse(req.body);
    const user = await db("users").where({ id: req.user!.id }).first();
    const tender = await db("tenders").where({ id: req.params.id }).first();
    if (!tender || tender.company_id !== user.company_id) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    const [updated] = await db("tenders")
      .where({ id: req.params.id })
      .update(validated)
      .returning("*");
    res.status(200).json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
      return;
    }
    console.log(error);
    res.status(500).json({ message: "Failed to update tender" });
  }
};

export const deleteTender = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await db("users").where({ id: req.user!.id }).first();
    const tender = await db("tenders").where({ id }).first();
    if (!tender || tender.company_id !== user.company_id) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    await db("tenders").where({ id }).delete();
    res.status(200).json({ message: "Tender Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete tender" });
  }
};
