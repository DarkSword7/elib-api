import mongoose from "mongoose";
import { config } from "./config";

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    mongoose.connection.on("error", (error) => {
      console.error(`Error in connecting to database: ${error.message}`);
    });

    await mongoose.connect(config.mongoURI as string);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
