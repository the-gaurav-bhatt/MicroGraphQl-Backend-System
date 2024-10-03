import mongoose, { Schema, Document } from "mongoose";

export interface OrderProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface OrderDocument extends Document {
  userID: mongoose.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  totalAmount: number;
  status: string;
  createdAt: Date;
}

const orderSchema: Schema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
