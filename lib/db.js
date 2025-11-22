import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    if (!mongoURI) {
      throw new Error("MONGODB_URI or DATABASE_URL environment variable is not set");
    }

    await mongoose.connect(mongoURI, {
      dbName: "tinylink",
    });
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
