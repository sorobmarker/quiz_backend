import express from "express";

import {
  getAdminAnalytics,
  getAdminResults,
  getAdminSettings,
  updateAdminSettings
} from "../controllers/adminController.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from "../controllers/categoryController.js";
import {
  createQuestion,
  deleteQuestion,
  getAdminQuestions,
  updateQuestion
} from "../controllers/questionController.js";
import { getAllUsers } from "../controllers/userController.js";
import { checkRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken, checkRole("admin"));

router.get("/questions", getAdminQuestions);
router.get("/question", getAdminQuestions);
router.post("/questions", createQuestion);
router.post("/question", createQuestion);
router.put("/questions/:id", updateQuestion);
router.put("/question/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);
router.delete("/question/:id", deleteQuestion);

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.get("/users", getAllUsers);
router.get("/results", getAdminResults);
router.get("/analytics", getAdminAnalytics);
router.get("/settings", getAdminSettings);
router.put("/settings", updateAdminSettings);

export default router;
