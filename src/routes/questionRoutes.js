import express from "express";

import { getQuestions } from "../controllers/questionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/meta/categories", protect, getCategories);
router.get("/", protect, getQuestions);

export default router;
