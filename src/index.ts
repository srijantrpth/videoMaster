import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import { app } from "./app.js";
dotenv.config({
  path: "./src/.env",
});
const port: number = parseInt(process.env.PORT || "3000", 10);
app.on("error", (err)=>{
  console.error("Express App Error: ", err);
})
connectDB().then(() => {
  app.listen(port, () => {
    console.log("App started listening on: ", `http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("MongoDB Connection Failed! ", err);
  process.exit(1);
});