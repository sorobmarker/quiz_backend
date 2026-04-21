import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      default: "Mixed"
    },
    difficulty: {
      type: String,
      default: "mixed"
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const Score = mongoose.model("Score", scoreSchema);

export default Score;
