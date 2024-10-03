import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  orderIds: mongoose.Types.ObjectId[];
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  orderIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

export const User = mongoose.model<UserDocument>("User", userSchema);
