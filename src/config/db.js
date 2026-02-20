import mongoose from "mongoose";
import envConfig from "./env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
