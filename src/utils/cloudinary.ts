import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import logger from "../logger.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});


export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    logger.info(`File uploaded to Cloudinary: ${JSON.stringify(result, null, 2)}`);
    fs.unlinkSync(localFilePath);
    return result;
  } catch (error) {
    logger.error("Error uploading file to Cloudinary: ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};
