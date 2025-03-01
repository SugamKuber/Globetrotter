import mongoose from "mongoose";
import { config } from "../config/config";
import { seedDatabase } from "./seed";

export const connectToDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");

    await seedDatabase();

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};