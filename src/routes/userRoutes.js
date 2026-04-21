import express from "express";

import { getUserProfile, getUserScores } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/profile", getUserProfile);
router.get("/scores", getUserScores);

export default router;
