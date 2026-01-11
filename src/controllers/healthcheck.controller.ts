import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response } from "express";
export const healthCheck = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
return res.status(200).json(new ApiResponse(200, "Everything is OK! "))
    }
)