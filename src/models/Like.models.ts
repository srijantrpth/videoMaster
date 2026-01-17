import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";
export interface ILike extends Document{
  video?: mongoose.Types.ObjectId,
  comment?: mongoose.Types.ObjectId,
  tweet?: mongoose.Types.ObjectId,
  likedBy: mongoose.Types.ObjectId,
 
}
const likeSchema = new Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Like = mongoose.model<ILike>("Like", likeSchema);
