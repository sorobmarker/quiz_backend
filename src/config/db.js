import mongoose from "mongoose";

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quizapp";

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (mongoUri.includes("cluster0.xxxxx.mongodb.net")) {
    throw new Error(
      "MONGODB_URI is using a placeholder Atlas host. Replace `cluster0.xxxxx.mongodb.net` in backend/.env with your real MongoDB Atlas cluster address."
    );
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

export default connectDatabase;
