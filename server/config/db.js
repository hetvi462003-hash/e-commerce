import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/caymanbazaar");
    isConnected = true;
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
  }
};

export default connectDB;

