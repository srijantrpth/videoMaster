import { isValidObjectId, RootQuerySelector } from "mongoose";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like, ILike } from "../models/Like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";


export const toggleVideoLike = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Object ID! ");
    }
    const existingLike = await Like.findOne({
        video: new mongoose.Types.ObjectId(videoId),
        likedBy: new mongoose.Types.ObjectId(req.user?._id),

    })
    if (existingLike) {
        const like: ILike = await Like.findByIdAndDelete(existingLike._id)

        if (!like) {
            throw new ApiError(400, "Unable to delete Like! ")
        }
        return res.status(200).json(new ApiResponse(200, "Like deleted successfully! "))
    }
    else {
        const newLike: ILike = await Like.create({
            video: new mongoose.Types.ObjectId(videoId),
            likedBy: new mongoose.Types.ObjectId(req.user?._id)
        })
        if (!newLike) {
            throw new ApiError(400, "Unable to create like! ")
        }
        return res.status(201).json(new ApiResponse(201, "Like created successfully! "))
    }
})

export const toggleCommentLike = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID! ")
    }
    const existingLike: ILike | null = await Like.findOne({
        comment: new mongoose.Types.ObjectId(commentId),
        likedBy: new mongoose.Types.ObjectId(req.user?._id)
    })
    if (existingLike) {
        const like = await Like.findByIdAndDelete(existingLike._id);
        if (!like) {
            throw new ApiError(500, "Unable to delete like! ");
        }
        return res.status(200).json(new ApiResponse(200, "Like deleted successfully! "))
    }
    else {
        const newLike: ILike | null = await Like.create({
            comment: new mongoose.Types.ObjectId(commentId),
            likedBy: new mongoose.Types.ObjectId(req.user?._id)
        })
        if (!newLike) {
            throw new ApiError(500, "Unable to create new Like! ")
        }
        return res.status(201).json(new ApiResponse(201, "Like registered successfully! "))
    }
})

export const toggleTweetLike = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID! ")
    }
    const existingLike: ILike | null = await Like.findOne({
        tweet: new mongoose.Types.ObjectId(tweetId),
        likedBy: new mongoose.Types.ObjectId(req.user?._id)
    })
    if (existingLike) {
        const like = await Like.findByIdAndDelete(existingLike._id);
        if (!like) {
            throw new ApiError(500, "Unable to delete like! ");
        }
        return res.status(200).json(new ApiResponse(200, "Like deleted successfully! "))
    }
    else {
        const newLike: ILike | null = await Like.create({
            tweet: new mongoose.Types.ObjectId(tweetId),
            likedBy: new mongoose.Types.ObjectId(req.user?._id)
        })
        if (!newLike) {
            throw new ApiError(500, "Unable to create new Like! ")
        }
        return res.status(201).json(new ApiResponse(201, "Like registered successfully! "))
    }
})
export const getLikedVideos = asyncHandler(async (req: Request, res: Response) => {

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true }

            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        {
            $unwind: "$videoDetails"
        },
        {
            $project: {
                videoDetails: 1
            }
        }
    ])
    if (!likedVideos) {
        throw new ApiError(500, "Unable to find Liked Videos! ")
    }
    return res.status(200).json(new ApiResponse(200, "Liked Videos found successfully! ", likedVideos))

})
