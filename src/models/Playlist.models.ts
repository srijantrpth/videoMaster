import mongoose, { Schema } from "mongoose";

import { Document } from "mongoose";
export interface IPlaylist extends Document {
  name: string;
  description: string;
  videos: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
}
const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
