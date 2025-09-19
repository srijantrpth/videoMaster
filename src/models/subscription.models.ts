import mongoose, { Schema } from "mongoose";
export interface ISubscription {
  subscriber: mongoose.Types.ObjectId;
  channel: mongoose.Types.ObjectId;
}
const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
