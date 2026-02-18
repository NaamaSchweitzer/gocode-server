import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    const mongoURI = uri;

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected: gocode-shop");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop the app if connection fails
  }
};
