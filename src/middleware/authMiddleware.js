import jwt from "jsonwebtoken";

import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const verifyToken = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    const error = new Error("Not authorized, token missing");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured");
    error.statusCode = 500;
    throw error;
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.userId).select("-password");

  if (!user) {
    const error = new Error("Not authorized, user not found");
    error.statusCode = 401;
    throw error;
  }

  req.auth = payload;
  req.user = user;
  next();
});

export const checkRole = (role = "admin") => (req, _res, next) => {
  if (req.user?.role !== role) {
    const error = new Error("Admin access required");
    error.statusCode = 403;
    throw error;
  }

  next();
};

export const protect = verifyToken;
export const adminOnly = checkRole("admin");
