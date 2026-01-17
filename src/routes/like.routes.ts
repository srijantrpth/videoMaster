import { Router } from "express";
import { getLikedVideos } from "../controllers/like.controller.js";
import { toggleCommentLike } from "../controllers/like.controller.js";
import { toggleTweetLike } from "../controllers/like.controller.js";
import { toggleVideoLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWT);
router.route("/toggle/v/:videoId").post(toggleVideoLike)
router.route("/toggle/v/:commentId").post(toggleCommentLike)
router.route("/toggle/v/:tweetId").post(toggleTweetLike)
router.route("/videos").get(getLikedVideos)
export default router

