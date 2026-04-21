import Score from "../models/Score.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const buildTrend = (scores) =>
  scores
    .slice(0, 8)
    .reverse()
    .map((entry) => ({
      id: entry._id,
      date: entry.date,
      label: new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      }),
      percentage: entry.totalQuestions ? Math.round((entry.score / entry.totalQuestions) * 100) : 0,
      score: entry.score,
      totalQuestions: entry.totalQuestions
    }));

export const getUserProfile = asyncHandler(async (req, res) => {
  const scores = await Score.find({ userId: req.user._id }).sort({ date: -1 }).limit(12).lean();
  const quizzesTaken = await Score.countDocuments({ userId: req.user._id });

  const totalCorrect = scores.reduce((sum, entry) => sum + entry.score, 0);
  const totalQuestions = scores.reduce((sum, entry) => sum + entry.totalQuestions, 0);
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, entry) => sum + entry.score / entry.totalQuestions, 0) * 100 / scores.length)
    : 0;
  const bestScore = scores.reduce((best, entry) => Math.max(best, entry.score), 0);

  res.json({
    success: true,
    profile: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      scoreHistory: req.user.scoreHistory || []
    },
    stats: {
      quizzesTaken,
      totalCorrect,
      totalQuestions,
      averageScore,
      bestScore
    },
    recentQuizzes: scores.slice(0, 5),
    scoreTrend: buildTrend(scores)
  });
});

export const getUserScores = asyncHandler(async (req, res) => {
  const scores = await Score.find({ userId: req.user._id }).sort({ date: -1 }).lean();

  res.json({
    success: true,
    scores
  });
});

export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();

  res.json({
    success: true,
    users
  });
});
