import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./logger.ts";
import morgan from "morgan";
dotenv.config({
  path: "./src/.env",
});
const app = express();
app.use(express.json());
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on port ${process.env.PORT || 3000}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! ");
});
