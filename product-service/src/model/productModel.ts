import mongoose, { Schema, Document } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  description?: string;
  price: number;
  inventory: number;
}

const productSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  inventory: {
    type: Number,
    required: true,
  },
});

export const Product = mongoose.model<ProductDocument>(
  "Product",
  productSchema
);
