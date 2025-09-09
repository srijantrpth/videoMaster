import * as z from "zod";
import { Request, Response, NextFunction } from "express";
import logger from "../logger.js";
import { ApiError } from "../utils/ApiError.js";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      logger.error(`Validation failed! ${result.error.message}`);
      throw new ApiError(400, "Validation failed!", result.error.issues);
    } else {
      next();
    }
  };
}
