import mongoose from "mongoose";
import User from "../models/user/userModel.js";
import { generateApiKey, generateSecretKey } from "../utils/helper.js";

export const seedAdmin = async () => {
  try {
    console.log("🚀 Connecting to MongoDB...");

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    console.log("✅ MongoDB connected");

    await User.deleteMany({ role: "admin" });
    console.log("🗑️ Existing admin(s) deleted");

    const { apiKey, hashedApiKey } = generateApiKey();
    const { secretKey, hashedSecretKey } = await generateSecretKey();

    const admin = await User.create({
      name: "admin",
      dbUri: "admin-db-uri",
      role: "admin",
      status: "active",
      apiKey: hashedApiKey,
      secretKey: hashedSecretKey,
    });

    console.log("🎯 Admin seeded successfully");

    console.log("🗝️ Admin credentials (SAVE THIS):");
    console.log({
      apiKey,
      secretKey,
    });

    return admin;
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};
