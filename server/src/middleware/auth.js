import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createError } from "../utils/validators.js";

const verifyToken = async (header) => {
  if (!header?.startsWith("Bearer ")) {
    throw createError(401, "Authentication token missing");
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw createError(401, "User not found");
  }

  return user;
};

export const protect = async (req, _res, next) => {
  try {
    req.user = await verifyToken(req.headers.authorization);
    next();
  } catch (error) {
    error.status = error.status || 401;
    next(error);
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    if (req.headers.authorization?.startsWith("Bearer ")) {
      req.user = await verifyToken(req.headers.authorization);
    }
    next();
  } catch {
    req.user = null;
    next();
  }
};
