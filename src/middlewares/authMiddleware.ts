import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

interface JWTPayload {
  id: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!jwtSecret) {
    res.status(500).json({ message: "JWT Secret error" });
    return;
  }
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "No token provided in cookie" });
    return;
  }
  try {
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Token Expired or Invalid Token" });
  }
};
