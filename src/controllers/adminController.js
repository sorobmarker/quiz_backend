import Question from "../models/Question.js";
import QuizSettings from "../models/QuizSettings.js";
import Score from "../models/Score.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getOrCreateQuizSettings } from "../utils/quizSettings.js";

export const getAdminAnalytics = asyncHandler(async (_req, res) => {
  const [totalUsers, totalQuestions, totalQuizzesTaken, recentScores, recentUsers, aggregateStats, difficultyBreakdown, quizSettings] = await Promise.all([
    User.countDocuments(),
    Question.countDocuments(),
    Score.countDocuments(),
    Score.find().sort({ date: -1 }).limit(8).populate("userId", "name email").lean(),
    User.find().select("-password").sort({ createdAt: -1 }).limit(8).lean(),
    Score.aggregate([
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: {
              $cond: [
                { $gt: ["$totalQuestions", 0] },
                { $multiply: [{ $divide: ["$score", "$totalQuestions"] }, 100] },
                0
              ]
            }
          }
        }
      }
    ]),
    Score.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 }
        }
      }
    ]),
    getOrCreateQuizSettings()
  ]);

  const averageScore = Math.round(aggregateStats[0]?.averageScore || 0);
  const quizzesByDifficulty = difficultyBreakdown.reduce(
    (accumulator, item) => ({
      ...accumulator,
      [item._id || "mixed"]: item.count
    }),
    {}
  );

  res.json({
    success: true,
    analytics: {
      totalUsers,
      totalQuestions,
      totalQuizzesTaken,
      averageScore,
      quizzesByDifficulty,
      quizSettings
    },
    recentResults: recentScores.map((entry) => ({
      id: entry._id,
      user: entry.userId?.name || "Unknown Player",
      email: entry.userId?.email || "Unavailable",
      score: entry.score,
      totalQuestions: entry.totalQuestions,
      category: entry.category,
      difficulty: entry.difficulty,
      date: entry.date
    })),
    recentUsers
  });
});

export const getAdminSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateQuizSettings();

  res.json({
    success: true,
    settings
  });
});

export const updateAdminSettings = asyncHandler(async (req, res) => {
  const { questionsPerQuiz, secondsPerQuestion } = req.body;

  if (!Number.isInteger(Number(questionsPerQuiz)) || Number(questionsPerQuiz) < 1 || Number(questionsPerQuiz) > 50) {
    const error = new Error("Questions per quiz must be an integer between 1 and 50");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(Number(secondsPerQuestion)) || Number(secondsPerQuestion) < 5 || Number(secondsPerQuestion) > 300) {
    const error = new Error("Seconds per question must be an integer between 5 and 300");
    error.statusCode = 400;
    throw error;
  }

  let settings = await QuizSettings.findOne();

  if (!settings) {
    settings = new QuizSettings();
  }

  settings.questionsPerQuiz = Number(questionsPerQuiz);
  settings.secondsPerQuestion = Number(secondsPerQuestion);
  await settings.save();

  res.json({
    success: true,
    settings
  });
});

export const getAdminResults = asyncHandler(async (_req, res) => {
  const results = await Score.find()
    .sort({ date: -1 })
    .populate("userId", "name email role")
    .lean();

  res.json({
    success: true,
    results: results.map((entry) => ({
      id: entry._id,
      score: entry.score,
      totalQuestions: entry.totalQuestions,
      category: entry.category,
      difficulty: entry.difficulty,
      date: entry.date,
      user: {
        id: entry.userId?._id,
        name: entry.userId?.name || "Unknown Player",
        email: entry.userId?.email || "Unavailable",
        role: entry.userId?.role || "user"
      }
    }))
  });
});
