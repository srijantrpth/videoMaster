import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
export interface IVideo extends Document {
  thumbnail: string;
  owner: mongoose.Types.ObjectId;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  videoFile: string;
}

const videoSchema = new Schema<IVideo>(
  {
    videoFile: String,
    thumbnail: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    description: String,
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    duration: Number,
  },
  { timestamps: true },
);
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model<IVideo>("Video", videoSchema);
