import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/Playlist.models.js";
import { isValidObjectId } from "mongoose";
import { Video } from "../models/Video.models.js";

export const createPlaylist = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { name, description } = req.body;
    const userId = req.user._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID! ")

    }
    if ([name, description].some((field) => field.trim() == "")) {
        throw new ApiError(400, "All fields are required! ")
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner: userId
    })
    if (!playlist) {
        throw new ApiError(500, "Unable to create Playlist! ")


    }
    return res.status(200).json(new ApiResponse(200, "PlayList Created Successfully! ", playlist));

})

export const addVideoToPlaylist = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID")
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Invalid Playlist Link");
    }
    const videoExist = await Video.findById(videoId);
    if (!videoExist) {
        throw new ApiError(400, "Invalid Video Link");
    }
    if (playlist.owner.toString() != req.user?._id) {
        throw new ApiError(403, "You do not have the permission to modify this playlist!")
    }
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(403, "Video already exists in the playlist!")

    }
    playlist.videos.push(videoId);
    await playlist.save();


    return res.status(200).json(new ApiResponse(200, "Playlist Updated! "))

})

export const deletePlaylist = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID! ");

    }
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if (!playlist) {
        throw new ApiError(500, "Unable to delete Playlist! ");
    }
    return res.status(200).json(new ApiResponse(200, "Playlist deleted successfully! "));


})

export const getPlaylistById = asyncHandler(async (req: Request, res: Response): Promise<any> => {

    const { playlistId } = req.params;
    if (isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist! ");

    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(500, "Playlist not found! ");

    }
    return res.status(200).json(new ApiResponse(200, "Playlist found! ", playlist));


})

export const getUserPlaylists = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID! ");
    }

    const playlist = await Playlist.find({ owner: userId })

    if (!playlist) {
        throw new ApiError(500, "Could not find playlist! ");
    }


    return res.status(200).json(new ApiResponse(200, "Playlist found! ", playlist));

})

export const removeVideoFromPlaylist = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { playlistId, videoId } = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID")
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Invalid Playlist Link");
    }
    const videoExist = await Video.findById(videoId);
    if (!videoExist) {
        throw new ApiError(400, "Invalid Video Link");
    }
    if (playlist.owner.toString() != req.user?._id) {
        throw new ApiError(403, "You do not have the permission to modify this playlist!")
    }
    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(403, "Video does not exist in the playlist!")

    }

    playlist.videos.pull(videoId);
    await playlist.save();
    return res.status(200).json(new ApiResponse(200, "Video removed from Playlist! "));
})
export const updatePlaylist = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { playlistId } = req.params
    const { name, description } = req.body


    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid Playlist ID! ");

    }
    if ([name, description].some((field) => field === "")) {
        throw new ApiError(400, "All fields are required! ");

    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        name, description
    }, { new: true })

    if (!playlist) {
        throw new ApiError(500, "Playlist could not be updated! ");
    }
    return res.status(200).json(new ApiResponse(200, "Playlist updated successfully! ", playlist));
})



