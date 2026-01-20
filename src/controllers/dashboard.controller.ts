import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/Video.models.js";
import { User } from "../models/User.models.js";
import mongoose from "mongoose";

import { Request, Response } from "express";
import { Subscription } from "../models/Subscription.models.js";
export const getChannelStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const stats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            }
        }, {
            $facet: {
                videoMetrics: [
                    {
                        $group: {
                            _id: null,
                            totalVideos: { $sum: 1 },
                            totalViews: { $sum: "$views" }
                        }
                    }
                ],
                likeMetrics: [
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "video",
                            as: "likes"
                        }
                    },
                    {
                        $unwind: {
                            path: "$likes",
                            preserveNullAndEmptyArrays: false
                        }
                    }, {
                        $count: "totalLikes"
                    }

                ],

                ownerInfo: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id", as: "owner"
                        }
                    },
                    {
                        $unwind: "$owner"
                    },
                    { $limit: 1 },
                    {
                        $project: {
                            username: "$owner.username",
                            fullName: "$owner.fullName",
                            avatar: "$owner.avatar",
                            email: "$owner.email",
                        }
                    }
                ]
            }
        },
        {
            $project: {
                totalVideos: {
                    $ifNull: [{ $arrayElemAt: ["$videoMetrics.totalVideos", 0] }, 0]
                },
                totalViews: {
                    $ifNull: [{ $arrayElemAt: ["$videoMetrics.totalViews", 0] }, 0]
                },
                totalLikes: {
                    $ifNull: [{ $arrayElemAt: ["$videoMetrics.totalLikes", 0] }, 0]
                },
                channelInfo: {
                    $arrayElemAt: ["$ownerInfo", 0]
                },

            }
        }
    ])
    const subscriberCount = await Subscription.countDocuments({
        channel: new mongoose.Types.ObjectId(userId)
    });
    const channelStats = {
        ...stats[0], totalSubscribers: subscriberCount
    }
    return res.status(200).json(new ApiResponse(200, "Channel Stats Fethed Successfully! ", channelStats))

})
export const getChannelVideos = asyncHandler(async (req: Request, res: Response) => {

    const userId = req.user?._id;
    const channelVideos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },{
            $project:{
                videoFile: 1,
                thumbnail :1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200, "Channel Videos Fetched Successfully! ", channelVideos))

})