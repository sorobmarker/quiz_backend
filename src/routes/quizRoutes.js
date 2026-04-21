import express from "express";

import { getQuizSettings, submitQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/settings", protect, getQuizSettings);
router.post("/submit", protect, submitQuiz);

export default router;
