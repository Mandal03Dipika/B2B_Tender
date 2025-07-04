import { Request, Response } from "express";
import db from "../db/knex";
import { uploadLogo } from "../utils/uploadLogo";
import { companySchema, searchCompaniesSchema } from "../validators/company";
import { z } from "zod";

export const createCompany = async (req: Request, res: Response) => {
  console.log(req.body);

  try {
    const validated = companySchema.parse(req.body);
    const [company] = await db("companies")
      .insert({
        ...validated,
        created_by: req.user!.id,
      })
      .returning("*");
    await db("users")
      .where({ id: req.user!.id })
      .update({ company_id: company.id });
    res.status(201).json(company);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
      return;
    }
    console.log(error);
    res.status(500).json({ message: "Error in creating company" });
  }
};

export const getMyCompany = async (req: Request, res: Response) => {
  try {
    const user = await db("users").where({ id: req.user!.id }).first();
    if (!user?.company_id) {
      res.status(404).json({ message: "No company of this user" });
      return;
    }
    const companies = await db("companies")
      .where({ created_by: req.user!.id })
      .orderBy("created_at", "desc");
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch company" });
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const validated = companySchema.partial().parse(req.body);
    const user = await db("users").where({ id: req.user!.id }).first();
    const [company] = await db("companies")
      .where({ id: user.company_id })
      .update(validated)
      .returning("*");
    res.status(200).json(company);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
      return;
    }
    console.log(error);
    res.status(500).json({ message: "Error in updating company" });
  }
};

export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await db("companies").select("*");
    res.status(200).json(companies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error to get all companies" });
  }
};

export const logoUpload = async (req: Request, res: Response) => {
  try {
    const user = await db("users").where({ id: req.user!.id }).first();
    if (!req.file) {
      res.status(400).json({ message: "No file is uploaded" });
      return;
    }
    const publicUrl = await uploadLogo(req.file, user.company_id);
    console.log(publicUrl);
    await db("companies")
      .where({ id: user.company_id })
      .update({ logo_url: publicUrl });
    res.status(200).json(publicUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Logo uploading failed" });
  }
};

export const searchCompanies = async (req: Request, res: Response) => {
  try {
    const parsedQuery = searchCompaniesSchema.parse(req.query);
    const { name, industry, service, page = 1, limit = 10 } = parsedQuery;
    const baseQuery = db("companies")
      .leftJoin("goods_services", "companies.id", "goods_services.company_id")
      .select("companies.*")
      .groupBy("companies.id");
    if (name) {
      baseQuery.whereILike("companies.name", `%${name}%`);
    }
    if (industry) {
      baseQuery.whereILike("companies.industry", `%${industry}%`);
    }
    if (service) {
      baseQuery.whereILike("goods_services.name", `%${service}%`);
    }
    const totalQuery = baseQuery
      .clone()
      .clearSelect()
      .countDistinct("companies.id as count")
      .first();
    const { count } = (await totalQuery) as { count: string };
    const companies = await baseQuery.offset((page - 1) * limit).limit(limit);
    res.status(200).json({
      companies,
      pagination: {
        total: parseInt(count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(count) / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to search companies" });
  }
};

export const getCompanyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const company = await db("companies").where({ id }).first();
    if (!company) {
      res.status(404).json({ message: "Company no found" });
      return;
    }
    res.status(200).json(company);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get company by id" });
  }
};
