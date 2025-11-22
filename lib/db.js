import mongoose from "mongoose";

let isConnecting = false;

export async function connectDB() {
  try {
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      return;
    }

    // If currently connecting, wait for it
    if (isConnecting) {
      return new Promise((resolve, reject) => {
        mongoose.connection.once("connected", resolve);
        mongoose.connection.once("error", reject);
      });
    }

    isConnecting = true;
    
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL;
    
    if (!mongoURI) {
      isConnecting = false;
      throw new Error("MONGODB_URI or DATABASE_URL environment variable is not set");
    }

    await mongoose.connect(mongoURI, {
      dbName: "tinylink",
    });
    
    isConnecting = false;
    console.log("MongoDB connected successfully");
  } catch (error) {
    isConnecting = false;
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}
