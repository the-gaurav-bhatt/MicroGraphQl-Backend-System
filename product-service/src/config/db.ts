import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const URI = process.env.URI;
console.log(URI);
export const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
