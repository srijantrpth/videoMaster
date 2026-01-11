import express, { urlencoded } from "express"
import logger from "./logger.js";
import morgan from "morgan";
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express();
const morganFormat = ":method :url :status :response-time ms";
app.use(express.json());
app.use(urlencoded({ limit: "16kb", extended: true }))
app.use(cookieParser());
app.use(express.static("public"))
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}));
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



// Routes

import userRouter from "./routes/user.routes.js";
import playListRouter from "./routes/playlist.routes.js"
import tweetRouter from './routes/tweet.routes.js'
// Routes Declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/playlist", playListRouter)


export { app };
