import Score from "../models/Score.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getLeaderboard = asyncHandler(async (_req, res) => {
  const leaderboard = await Score.find()
    .sort({ score: -1, totalQuestions: -1, date: 1 })
    .limit(20)
    .populate("userId", "name email")
    .lean();

  res.json({
    success: true,
    leaderboard: leaderboard.map((entry, index) => ({
      rank: index + 1,
      id: entry._id,
      user: entry.userId?.name || "Unknown Player",
      email: entry.userId?.email || "Unavailable",
      score: entry.score,
      totalQuestions: entry.totalQuestions,
      category: entry.category,
      difficulty: entry.difficulty,
      date: entry.date
    }))
  });
});
