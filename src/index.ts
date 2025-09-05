import type { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import { app } from "./app.js";
import logger from "./logger.js";
dotenv.config({
  path: "./src/.env",
});
const port = process.env.PORT || 3000

connectDB().then(()=>{
  app.listen(port, ()=>{
    console.log("App started listening on: ", port )
  })
}).catch((err)=>{
  console.error("MongoDB Connection Failed! ", err);
  process.exit(1);
})