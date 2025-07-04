import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import companyRoutes from "./routes/companyRoutes";
import tenderRoutes from "./routes/tenderRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import tenderServiceRoutes from "./routes/tenderServiceRoutes";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/tenders", tenderRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/tender-services", tenderServiceRoutes);

export default app;
