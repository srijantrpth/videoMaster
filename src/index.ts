import 'dotenv/config';  // Load dotenv globally
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.resolve(__dirname, "../.env"), // Absolute path to root/.env
});

import { connectDB } from "./db/db.js";
import { app } from "./app.js";


const port: number = parseInt(process.env.PORT || "3000", 10);
app.on("error", (err) => {
  console.error("Express App Error: ", err);
});
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("App started listening on: ", `http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed! ", err);
    process.exit(1);
  });
