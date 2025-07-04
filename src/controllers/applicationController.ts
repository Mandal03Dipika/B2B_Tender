import { Request, Response } from "express";
import db from "../db/knex";
import {
  applyToTenderBodySchema,
  applyToTenderParamsSchema,
} from "../validators/tender";

export const applyToTender = async (req: Request, res: Response) => {
  const { tenderId } = applyToTenderParamsSchema.parse(req.params);
  const { proposal } = applyToTenderBodySchema.parse(req.body);
  try {
    const user = await db("users").where({ id: req.user!.id }).first();
    const companyId = user.company_id;
    if (!companyId) {
      res.status(400).json({ message: "User is not linked to a company" });
      return;
    }
    const tender = await db("tenders").where({ id: tenderId }).first();
    if (!tender) {
      res.status(404).json({ message: "Tender not found" });
      return;
    }
    if (tender.company_id === companyId) {
      res.status(403).json({ message: "Can not apply to your own tender" });
      return;
    }
    const alreadyApplied = await db("applications")
      .where({ tender_id: tenderId, applicant_company_id: companyId })
      .first();
    if (alreadyApplied) {
      res.status(409).json({ message: "You have already applied" });
      return;
    }
    const [application] = await db("applications")
      .insert({
        tender_id: tenderId,
        applicant_company_id: companyId,
        proposal,
      })
      .returning("*");
    res.status(200).json(application);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to apply to tender" });
  }
};

export const getTenderApplications = async (req: Request, res: Response) => {
  const { tenderId } = applyToTenderParamsSchema.parse(req.params);
  try {
    const tender = await db("tenders").where({ id: tenderId }).first();
    if (!tender) {
      res.status(404).json({ message: "Tender not found" });
      return;
    }
    const applications = await db("applications")
      .where({ tender_id: tenderId })
      .join("companies", "applications.applicant_company_id", "companies.id")
      .select("applications.*", "companies.name as applicant_name");
    res.status(200).json(applications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get applications" });
  }
};

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const user = await db("users").where({ id: req.user!.id }).first();
    const applications = await db("applications")
      .where({ applicant_company_id: user.company_id })
      .join("companies", "applications.applicant_company_id", "companies.id")
      .select("applications.*", "companies.name as applicant_name");
    res.status(200).json(applications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get my applications" });
  }
};
