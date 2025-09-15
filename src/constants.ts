import { trusted } from "mongoose";

export const DB_NAME: string = "backend-dev";
export const options = {
  httpOnly: true,
  secure: true,
};
