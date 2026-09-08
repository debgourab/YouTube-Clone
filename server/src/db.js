import mongoose from "mongoose";

const cleanEnvValue = (value = "") => value.trim().replace(/^['"`]+|['"`]+$/g, "");

export const connectDB = async () => {
  const uri = cleanEnvValue(process.env.MONGODB_URI);

  if (!uri) {
    console.error("MONGODB_URI is required. Copy server/.env.example to server/.env.");
    process.exit(1);
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.error(
      'MONGODB_URI must start with "mongodb://" or "mongodb+srv://". Remove quotes, spaces, and Markdown backslashes such as \\_ or \\@ from the Render environment value.',
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 7000 });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
