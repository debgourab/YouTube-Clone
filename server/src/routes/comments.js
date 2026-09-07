import express from "express";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import { protect } from "../middleware/auth.js";
import { createError, normalizeString } from "../utils/validators.js";

const router = express.Router();

export const listVideoComments = async (videoId) => {
  const video = await Video.findById(videoId);
  if (!video) throw createError(404, "Video not found.");

  return Comment.find({ videoId: video._id }).populate("userId", "username avatar").sort({ createdAt: -1 });
};

export const createVideoComment = async (videoId, userId, body) => {
  const text = normalizeString(body.text);
  if (!text) throw createError(400, "Comment text is required.");
  if (text.length > 500) throw createError(400, "Comment must be 500 characters or fewer.");

  const video = await Video.findById(videoId);
  if (!video) throw createError(404, "Video not found.");

  const comment = await Comment.create({ videoId: video._id, userId, text });
  await comment.populate("userId", "username avatar");
  return comment;
};

router.get("/video/:videoId", async (req, res, next) => {
  try {
    res.json(await listVideoComments(req.params.videoId));
  } catch (error) {
    next(error);
  }
});

router.post("/video/:videoId", protect, async (req, res, next) => {
  try {
    const comment = await createVideoComment(req.params.videoId, req.user._id, req.body);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, async (req, res, next) => {
  try {
    const text = normalizeString(req.body.text);
    if (!text) throw createError(400, "Comment text is required.");
    if (text.length > 500) throw createError(400, "Comment must be 500 characters or fewer.");

    const comment = await Comment.findById(req.params.id);
    if (!comment) throw createError(404, "Comment not found.");
    if (comment.userId.toString() !== req.user._id.toString()) {
      throw createError(403, "You can edit only your comments.");
    }

    comment.text = text;
    await comment.save();
    await comment.populate("userId", "username avatar");
    res.json(comment);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protect, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) throw createError(404, "Comment not found.");
    if (comment.userId.toString() !== req.user._id.toString()) {
      throw createError(403, "You can delete only your comments.");
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
