import { Request } from "express";
import { File as MulterFile } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
      file?: MulterFile;
    }
  }
}
