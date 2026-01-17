import mongoose from "mongoose"
import { Comment, IComment } from "../models/Comment.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"
import { Request, Response } from "express"
import { Video, IVideo } from "../models/Video.models.js"

const getVideoComments = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(500, "Invalid videoId");

    }
    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        }, {
            $facet: {
                metadata: [
                    { $count: "totalComments" }
                ],
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    { $sort: { createdAt: -1 } }
                ]
            }
        }, {
            $project: {
                totalComments: { $arrayElemAt: ["$metadata.totalComments", 0] },
                comments: "$data"
            }
        }
    ])


    return res.status(200).json(new ApiResponse(200, "Comments fetched successfully! ", comments[0]));


})

const addComment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { content } = req.body;
    const {videoId} = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID! ")
    }
    const userId = req.user?._id;
    const comment: IComment = await Comment.create({
        owner: userId,
        content,
        video: videoId
    })
    if (!comment) {
        throw new ApiError(500, "Unable to create comment! ");

    }
    return res.status(201).json(new ApiResponse(201, "Comment Created Successfully! ", comment));
})
const updateComment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { content } = req.body;
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Video ID! ");
    }
    const comment: IComment | null = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found! ")
    }
    comment.content = content;
    await comment.save();

    return res.status(201).json(new ApiResponse(201, "Comment Updated Successfully! "));

})

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID! ");
    }
    const comment: IComment | null = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
        throw new ApiError(400, "Unable to find comment! ")

    }
    return res.status(200).json(new ApiResponse(200, "Comment Deleted Successfully! "))

})
export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
