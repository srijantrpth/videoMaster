import { asyncHandler } from "../utils/asyncHandler.js";
import { IUser, User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { options } from "../constants.js";
const generateAccessAndRefreshTokens = async function (
  userId: mongoose.Types.ObjectId,
) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found! ");
    }
    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens! ",
    );
  }
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, username, email, password } = req.body;
    if (
      [fullName, email, username, password].some(
        (field) => field?.trim() === "",
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne<IUser>({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ApiError(400, "User with email or username already exists! ");
    }
    console.log("Request files => \n", req.files);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const avatarLocalPath: string | undefined = files?.avatar?.[0]?.path;
    const coverImageLocalPath: string | undefined =
      files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required! ");
    }
    if (!coverImageLocalPath) {
      throw new ApiError(400, "Cover image file is required! ");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
      throw new ApiError(500, "Failed to upload avatar on cloudinary! ");
    }
    if (!coverImage) {
      throw new ApiError(500, "Failed to upload cover image on cloudinary! ");
    }
    const user: IUser = await User.create({
      fullName,
      avatar: avatar?.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username?.toLowerCase(),
    });
    console.log(`User created: `, user);

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user ! ",
      );
    }
    return res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully!", createdUser));
  },
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { username, password, email } = req.body;
    if (!username && !email) {
      throw new ApiError(400, "Username or email required! ");
    }
    const user = await User.findOne<IUser>({
      $or: [
        { username: username?.toLowerCase() },
        { email: email?.toLowerCase() },
      ],
    });
    if (!user) {
      throw new ApiError(404, "User does not exist! ");
    }
    const isPasswordValid: boolean = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials! ");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id as mongoose.Types.ObjectId,
    );
    const updatedUser = User.findById<IUser>(user._id).select(
      "-password -refreshToken",
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "User Logged in successfully! ", {
          user: updatedUser,
          accessToken,
          refreshToken,
        }),
      );
  },
);

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User Logged Out! "));
});
