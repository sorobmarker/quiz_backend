import Question from "../models/Question.js";
import Score from "../models/Score.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getOrCreateQuizSettings } from "../utils/quizSettings.js";

export const getQuizSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateQuizSettings();

  res.json({
    success: true,
    settings
  });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const { answers, category = "Mixed", difficulty = "mixed" } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    const error = new Error("Answers are required");
    error.statusCode = 400;
    throw error;
  }

  const questionIds = answers.map((answer) => answer.questionId);
  const questions = await Question.find({ _id: { $in: questionIds } });
  const questionMap = new Map(questions.map((question) => [String(question._id), question]));

  let score = 0;
  const review = answers.map((answer) => {
    const question = questionMap.get(String(answer.questionId));

    if (!question) {
      return {
        questionId: answer.questionId,
        question: "Question unavailable",
        selectedAnswer: answer.selectedAnswer,
        isCorrect: false
      };
    }

    const isCorrect = Number(answer.selectedAnswer) === question.correctAnswer;
    if (isCorrect) {
      score += 1;
    }

    return {
      questionId: question._id,
      question: question.question,
      options: question.options,
      selectedAnswer: Number(answer.selectedAnswer),
      correctAnswer: question.correctAnswer,
      category: question.category,
      difficulty: question.difficulty,
      isCorrect
    };
  });

  const totalQuestions = review.length;

  const scoreEntry = await Score.create({
    userId: req.user._id,
    score,
    totalQuestions,
    category,
    difficulty
  });

  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      scoreHistory: {
        score,
        totalQuestions,
        category,
        difficulty,
        date: scoreEntry.date
      }
    }
  });

  res.status(201).json({
    success: true,
    result: {
      score,
      totalQuestions,
      correctAnswers: score,
      wrongAnswers: totalQuestions - score,
      submittedAt: scoreEntry.date,
      review
    }
  });
});
