import Category from "../models/Category.js";
import mongoose from "mongoose";
import Question from "../models/Question.js";
import asyncHandler from "../utils/asyncHandler.js";

const normalizeQuestionPayload = (body) => {
  const { question, options, correctAnswer, category, difficulty } = body;

  if (!question || !Array.isArray(options) || options.length < 2 || category === undefined || !difficulty) {
    const error = new Error("Question, options, category, and difficulty are required");
    error.statusCode = 400;
    throw error;
  }

  if (Number(correctAnswer) < 0 || Number(correctAnswer) >= options.length) {
    const error = new Error("Correct answer index is invalid");
    error.statusCode = 400;
    throw error;
  }

  return {
    question: question.trim(),
    options: options.map((option) => String(option).trim()),
    correctAnswer: Number(correctAnswer),
    category: String(category).trim(),
    difficulty
  };
};

const randomSamplePipeline = (matchStage, limit) => {
  const pipeline = [];

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push({ $sample: { size: limit } });

  return pipeline;
};

export const getQuestions = asyncHandler(async (req, res) => {
  const { category, difficulty, limit = 10, randomize = "true", excludeIds = "" } = req.query;

  const match = {};
  if (category && category !== "all") {
    match.category = category;
  }
  if (difficulty && difficulty !== "all") {
    match.difficulty = difficulty;
  }

  const parsedExcludeIds = String(excludeIds)
    .split(",")
    .map((id) => id.trim())
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  if (parsedExcludeIds.length > 0) {
    match._id = { $nin: parsedExcludeIds };
  }

  const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  let questions;
  if (randomize === "true") {
    questions = await Question.aggregate(randomSamplePipeline(match, parsedLimit));

    if (questions.length < parsedLimit && parsedExcludeIds.length > 0) {
      const fallbackMatch = { ...match };
      delete fallbackMatch._id;

      const fallbackQuestions = await Question.aggregate(
        randomSamplePipeline(fallbackMatch, parsedLimit - questions.length)
      );

      const existingIds = new Set(questions.map((question) => String(question._id)));
      questions = [
        ...questions,
        ...fallbackQuestions.filter((question) => !existingIds.has(String(question._id)))
      ];
    }
  } else {
    questions = await Question.find(match).sort({ createdAt: -1 }).limit(parsedLimit).lean();
  }

  const responseQuestions =
    req.user?.role === "admin"
      ? questions
      : questions.map(({ correctAnswer, ...question }) => question);

  res.json({
    success: true,
    questions: responseQuestions
  });
});

export const getAdminQuestions = asyncHandler(async (_req, res) => {
  const questions = await Question.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    questions
  });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const payload = normalizeQuestionPayload(req.body);
  await Category.updateOne(
    { name: payload.category },
    { $setOnInsert: { name: payload.category } },
    { upsert: true }
  );

  const question = await Question.create(payload);

  res.status(201).json({
    success: true,
    question
  });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const payload = normalizeQuestionPayload(req.body);
  const question = await Question.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!question) {
    const error = new Error("Question not found");
    error.statusCode = 404;
    throw error;
  }

  await Category.updateOne(
    { name: payload.category },
    { $setOnInsert: { name: payload.category } },
    { upsert: true }
  );

  res.json({
    success: true,
    question
  });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    const error = new Error("Question not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    message: "Question deleted"
  });
});
