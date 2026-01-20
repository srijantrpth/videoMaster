import { User, IUser } from "../models/User.models.js"
import { Video, IVideo } from "../models/Video.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Request, Response } from "express"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose, { Mongoose, isValidObjectId } from "mongoose"

export const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query
    
    const pageNum = parseInt(page as string, 10) || 1
    const limitNum = parseInt(limit as string, 10) || 10
    
    const pipeline = [
        {
            $match: {
                isPublished: true,
                ...(userId && { owner: new mongoose.Types.ObjectId(userId as string) }),
                ...(query && { title: { $regex: query as string, $options: "i" } })
            }
        },
        {
            $sort: {
                [sortBy as string]: sortType === "asc" ? 1 : -1
            }
        }
    ]
    
    const results = await Video.aggregatePaginate(
        Video.aggregate(pipeline),
        { page: pageNum, limit: limitNum }
    )
    
    return res.status(200).json(new ApiResponse(200, "Videos fetched successfully!", results))
})

export const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const userId = req.user?._id
    const files = req.files as { [fieldName: string]: Express.Multer.File[] } | undefined;
    if ([title, description].some((field) => field === "")) {
        throw new ApiError(400, "Title or Description is Empty! All fields are required! ")
    }
    const videoFileLocalPath: string | undefined = files?.videoFile?.[0]?.path
    const thumbnailLocalPath: string | undefined = files?.thumbnail?.[0]?.path
    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required! ");
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required! ");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!videoFile) {
        throw new ApiError(500, "Failed to upload video file on cloudinary! ");
    }
    if (!thumbnail) {
        throw new ApiError(500, "Failed to upload thumbnail on cloudinary! ");
    }
    const video = await Video.create({
        owner: new mongoose.Types.ObjectId(userId),
        title,
        description,
        videoFile: videoFile.url || "",
        thumbnail: thumbnail.url || "",

    })
    if (!video) {
        throw new ApiError(500, "Unable to create video! ")
    }
    return res.status(201).json(new ApiResponse(201, "Video created successfully! ", video));


})

export const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id! ");
    }
    const video = await Video.findByIdAndUpdate(videoId, {
        $inc: {
            views: 1
        }
    }, { new: true })

    if (!video) {
        throw new ApiError(404, "Video not found! ")
    }
    return res.status(200).json(new ApiResponse(200, "Video found successfully! ", video))
})

export const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id
    const file = req.file as Express.Multer.File | undefined;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID! ")
    }

    const { title, description } = req.body;
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found! ");

    }
    if (video.owner.toString() != userId) {
        throw new ApiError(403, "You are not authorized to update this video! ")
    }
    const thumbnailLocalPath: string | undefined = req.file?.path
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required! ");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    video.title = title;
    video.description = description
    video.thumbnail = thumbnail?.url || "";
    await video.save();
    return res.status(204).json(new ApiResponse(204, "Video updated successfully! ", video))

})

export const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID! ")
    }
    const video = await Video.findByIdAndDelete(videoId)

    if (!video)
        if (!video.owner.toString() !== req.user?._id) {
            throw new ApiError(403, "User not authorized to update the video! ")
        } {
        throw new ApiError(500, "Unable to delete video! ")
    }
    return res.status(200).json(new ApiResponse(200, "Video deleted successfully! ", video))
})

export const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID! ")
    }


    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video does not exist! ")
    }

    if (!video.owner.toString() !== req.user?._id) {
        throw new ApiError(403, "User not authorized to update the video! ")
    }
    video.isPublished = !video.isPublished
    await video.save()
    return res.status(200).json(new ApiResponse(200, "Video Status Updated Successfully! ", video))

})


