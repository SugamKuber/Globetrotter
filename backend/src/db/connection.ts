import mongoose from "mongoose";
import { config } from "../config/config";

export const connectToDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};