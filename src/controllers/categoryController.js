import Category from "../models/Category.js";
import Question from "../models/Question.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.json({
    success: true,
    categories
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description = "" } = req.body;

  if (!name?.trim()) {
    const error = new Error("Category name is required");
    error.statusCode = 400;
    throw error;
  }

  const existingCategory = await Category.findOne({ name: name.trim() });
  if (existingCategory) {
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  const category = await Category.create({
    name: name.trim(),
    description: description.trim()
  });

  res.status(201).json({
    success: true,
    category
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description = "" } = req.body;

  if (!name?.trim()) {
    const error = new Error("Category name is required");
    error.statusCode = 400;
    throw error;
  }

  const existingCategory = await Category.findById(req.params.id);

  if (!existingCategory) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const previousName = existingCategory.name;
  existingCategory.name = name.trim();
  existingCategory.description = description.trim();
  await existingCategory.save();

  if (previousName !== existingCategory.name) {
    await Question.updateMany(
      { category: previousName },
      { $set: { category: existingCategory.name } }
    );
  }

  res.json({
    success: true,
    category: existingCategory
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const linkedQuestions = await Question.countDocuments({ category: category.name });
  if (linkedQuestions > 0) {
    const error = new Error("Delete questions in this category before removing it");
    error.statusCode = 400;
    throw error;
  }

  await category.deleteOne();

  res.json({
    success: true,
    message: "Category deleted"
  });
});
