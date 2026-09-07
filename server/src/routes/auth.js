import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import {
  createError,
  escapeRegex,
  isValidEmail,
  normalizeEmail,
  normalizeString,
  publicUser
} from "../utils/validators.js";

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const validateRegister = ({ username, email, password }) => {
  const cleanUsername = normalizeString(username);

  if (cleanUsername.length < 3) return "Username must be at least 3 characters.";
  if (cleanUsername.length > 32) return "Username must be 32 characters or fewer.";
  if (!/^[a-zA-Z0-9_. -]+$/.test(cleanUsername)) return "Username can use letters, numbers, spaces, dots, dashes, and underscores.";
  if (!isValidEmail(email)) return "Enter a valid email address.";
  if (!password || password.length < 8) return "Password must be at least 8 characters.";
  return "";
};

const findUserByIdentifier = (identifier) => {
  const cleanIdentifier = normalizeString(identifier);

  if (isValidEmail(cleanIdentifier)) {
    return User.findOne({ email: normalizeEmail(cleanIdentifier) }).select("+password");
  }

  return User.findOne({
    username: { $regex: `^${escapeRegex(cleanIdentifier)}$`, $options: "i" }
  }).select("+password");
};

router.post("/register", async (req, res, next) => {
  try {
    const message = validateRegister(req.body);
    if (message) return res.status(400).json({ message });

    const username = normalizeString(req.body.username);
    const email = normalizeEmail(req.body.email);
    const duplicate = await User.findOne({
      $or: [
        { email },
        { username: { $regex: `^${escapeRegex(username)}$`, $options: "i" } }
      ]
    });

    if (duplicate?.email === email) return res.status(409).json({ message: "Email is already registered." });
    if (duplicate) return res.status(409).json({ message: "Username is already taken." });

    const hashed = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({ username, email, password: hashed });

    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const identifier = normalizeString(req.body.identifier || req.body.email || req.body.username);
    if (!identifier) throw createError(400, "Email or username is required.");
    if (!req.body.password || req.body.password.length < 8) throw createError(400, "Password must be at least 8 characters.");

    const user = await findUserByIdentifier(identifier);
    const isPasswordValid = user ? await bcrypt.compare(req.body.password, user.password) : false;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email/username or password." });
    }

    res.json({ token: signToken(user._id), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.get("/me", protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
