import { Tweet, ITweet } from "../models/Tweet.models.js"
import { User, IUser } from "../models/User.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Request, Response } from "express"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"

const createTweet = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { content } = req.body;
    if (!content || content?.trim() === "") {
        throw new ApiError(400, "Content is missing! ");
    }
    const tweet: ITweet = await Tweet.create({
        content,
        owner: req.user?._id,
    })
    if (!tweet) {
        throw new ApiError(500, "Failed to create tweet! ")
    }
    return res.status(200).json(new ApiResponse(201, "Tweet Created Successfully! ", tweet));
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params
    
    const user = await User.findOne({username: userId});
    
    if (!user) {
        throw new ApiError(400, "User not Found! ");
    }
    //    const tweets = await Tweet.find({owner: userId}).populate('owner', '-password').sort({createdAt: -1})
    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: user._id
            }
        },
        {
            $lookup: {
                from: 'users',
                foreignField: "_id",
                localField: "owner",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                "owner._id": 1,
                "owner.name": 1,
                "owner.email": 1

            }
        },
        { $sort: { createdAt: -1 } }

    ])
    if (!tweets) {
        throw new ApiError(500, "Unable to find tweets! ");

    }
    return res.status(200).json(new ApiResponse(201, "Tweets fetched successfully! ", tweets));
})


const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(404, "Invalid Tweet ID! ");
    }
   const tweet = await Tweet.findById(tweetId);
   if (!tweet) {
        throw new ApiError(500, "Unable to update tweet! ");
    }
   if(tweet.owner.equals(userId)){
    throw new ApiError(400, "This tweet does not belong to the signed in user! ");

   }
   if(!content){
    throw new ApiError(400, "Empty content! ")
   }
   tweet.content = content || tweet.content;
   await tweet.save({validateBeforeSave: false});

    
    return res.status(200).json(new ApiResponse(201, "Tweet Updated Successfully! ", tweet));
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID! ");

    }
    const tweet = await Tweet.findByIdAndDelete(tweetId);
    if (!tweet) {
        throw new ApiError(500, "Tweet could not be deleted! ");

    }
    return res.status(200).json(new ApiResponse(201, "Tweet Deleted! "))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
