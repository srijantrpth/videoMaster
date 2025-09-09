import mongoose, { Schema, Document } from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";  // Import SignOptions type
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  email: string;
  coverImage?: string;
  avatar?: string;
  password: string;
  refreshToken?: string;
  watchHistory: mongoose.Types.ObjectId[];  // Fixed: should be array, not tuple
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
    fullName: {  // Fixed: should be object for consistency
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const payload = {
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName: this.fullName,
  };
  
  const secret = process.env.ACCESS_TOKEN_SECRET!;
  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY!,
  };
  
  return jwt.sign(payload, secret, options);
};

userSchema.methods.generateRefreshToken = function(): string {
  const payload = {
    _id: this._id,
  };
  
  const secret = process.env.REFRESH_TOKEN_SECRET!;
  const options: SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY!,
  };
  
  return jwt.sign(payload, secret, options);
};

export const User = mongoose.model<IUser>("User", userSchema);
