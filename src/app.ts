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
import likeRouter from "./routes/like.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import healthRouter from "./routes/healthcheck.routes.js"
// Routes Declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/playlist", playListRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/health", healthRouter)


export { app };
