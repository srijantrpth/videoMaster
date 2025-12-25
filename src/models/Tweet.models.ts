import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";
export interface ITweet extends Document{
content: string,
owner: mongoose.Types.ObjectId,
createdAt: Date,
updatedAt: Date
}
const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
