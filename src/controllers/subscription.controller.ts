import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/User.models.js"
import { ISubscription, Subscription } from "../models/Subscription.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel ID! ");
    }
    const subscriberId = req.user?._id;
    if (channelId === subscriberId.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }
    const channelExists = await User.findById(channelId);
    if (!channelExists) {
        throw new ApiError(404, "Channel not found");
    }
    const existingSubscription: ISubscription | null = await Subscription.findOne({
        subscriber: new mongoose.Types.ObjectId(subscriberId),
        channel: new mongoose.Types.ObjectId(channelId)
    })
    if (!existingSubscription) {
        const newSubscription: ISubscription | null = await Subscription.create({
            subscriber: new mongoose.Types.ObjectId(subscriberId),
            channel: new mongoose.Types.ObjectId(channelId)
        })
        return res.status(201).json(new ApiResponse(201, "Subscription added successfully! ", newSubscription))

    }
    else {
        const deletedSubscription = await Subscription.findByIdAndDelete(existingSubscription._id);
        return res.status(200).json(new ApiResponse(200, "Subscription Deleted Successfully! "));

    }
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel ID! ")
    }
    const result = await Subscription.aggregate([{
        $match: {
            channel: new mongoose.Types.ObjectId(channelId),
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "subscriber",
            foreignField: "_id",
            as: "subscribers"
        }
    },

    {
        $unwind: "$subscribers",
    },
    {
        $project: {
            subscribers: 1
        }
    }


    ])
    return res.status(200).json(new ApiResponse(200, "Subscribers Fetched Successfully! ", result));
})


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid Subscriber ID! ")
    }
    const result = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }

        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedChannels",
            }
        },
        {
            $unwind: "$subscribedChannels"
        },
        {
            $project: {
                subscribedChannels: 1
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200, "Fetched Subscribed Channels", result[0]));

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}