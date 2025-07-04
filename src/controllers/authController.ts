import { Request, Response } from "express";
import db from "../db/knex";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../validators/auth";

export const jwtSecret = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  const { email, password } = registerSchema.parse(req.body);
  if (!jwtSecret) {
    console.log("JWT_SECRET is throwing an error");
    res.status(500).json({ message: "Server configuration error" });
    return;
  }
  try {
    const existingUser = await db("users").where({ email }).first();
    if (existingUser) {
      res.status(409).json({ message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [user] = await db("users")
      .insert({ email, password: hashed })
      .returning(["id", "email"]);
    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Register failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  if (!jwtSecret) {
    console.log("JWT_SECRET is throwing an error");
    res.status(500).json({ message: "Server configuration error" });
    return;
  }
  try {
    const user = await db("users").where({ email }).first();
    if (!user) {
      res.status(401).json({ message: "Invalid user" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Logout failed" });
  }
};
