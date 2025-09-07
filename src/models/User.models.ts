import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  username: string;
  email: string;
  coverImage?: string;
  avatar?: string;
  password: string;
  refreshToken?: string;
  watchHistory: [mongoose.Types.ObjectId];
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    coverImage: {
      type: String,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Minimum 6 characters are required! "],
      maxlength: [16, "Maximum 16 characters are permitted! "],
    },
    refreshToken: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    fullName: String,
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
