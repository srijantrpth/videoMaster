import mongoose from "mongoose";
import logger from "../logger.js";
import { DB_NAME } from "../constants.js";
export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    logger.info("MongoDB Connected! ", connectionInstance.connections[0]?.host);
  } catch (error) {
    logger.error("MongoDB Connection Error", error);
    throw error;
  }
};
