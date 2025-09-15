import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";
export const verifyJWT = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer: ", "");
      if (!token) {
        throw new ApiError(401, "Unauthorized request! ");
      }
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as jwt.JwtPayload;
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken",
      );
      if (!user) {
        throw new ApiError(401, "Invalid Access Token! ");
      }
      req.user = user;
      next();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid Access Token";
      throw new ApiError(401, message);
    }
  },
);
