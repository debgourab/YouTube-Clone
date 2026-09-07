import express from "express";
import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import { protect } from "../middleware/auth.js";
import {
  createError,
  isHttpUrl,
  isLocalAssetPath,
  normalizeHandle,
  normalizeString
} from "../utils/validators.js";

const router = express.Router();

const populateChannelVideos = (query) => query.populate("channelId", "channelName avatar subscribers handle");

const validateChannelInput = (body, partial = false) => {
  const payload = {};
  const channelName = normalizeString(body.channelName);
  const description = normalizeString(body.description);
  const handle = normalizeHandle(body.handle);
  const channelBanner = normalizeString(body.channelBanner);
  const avatar = normalizeString(body.avatar);

  if (!partial || channelName) {
    if (channelName.length < 3) throw createError(400, "Channel name must be at least 3 characters.");
    payload.channelName = channelName;
  }

  if (handle) payload.handle = handle;

  if (!partial || description) {
    if (description.length < 10) throw createError(400, "Channel description must be at least 10 characters.");
    payload.description = description;
  }

  if (channelBanner) {
    if (!isHttpUrl(channelBanner)) throw createError(400, "Channel banner must be a valid http(s) URL.");
    payload.channelBanner = channelBanner;
  }

  if (avatar) {
    if (!isHttpUrl(avatar) && !isLocalAssetPath(avatar)) {
      throw createError(400, "Avatar must be a valid http(s) URL or bundled avatar path.");
    }
    payload.avatar = avatar;
  }

  return payload;
};

const findOwnedChannel = async (channelId, userId) => {
  const channel = await Channel.findById(channelId);
  if (!channel) throw createError(404, "Channel not found.");
  if (channel.owner.toString() !== userId.toString()) {
    throw createError(403, "You can manage only your own channel.");
  }
  return channel;
};

router.post("/", protect, async (req, res, next) => {
  try {
    const payload = validateChannelInput(req.body);
    const channel = await Channel.create({ ...payload, owner: req.user._id });

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { channels: channel._id } });
    res.status(201).json(channel);
  } catch (error) {
    next(error);
  }
});

router.get("/mine", protect, async (req, res, next) => {
  try {
    const channels = await Channel.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(channels);
  } catch (error) {
    next(error);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw createError(404, "User not found.");

    const channels = await Channel.find({ owner: user._id }).sort({ createdAt: -1 });
    res.json(channels);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("owner", "username avatar");
    if (!channel) throw createError(404, "Channel not found.");

    const videos = await populateChannelVideos(Video.find({ channelId: channel._id }).sort({ createdAt: -1 }));
    res.json({ channel, videos });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, async (req, res, next) => {
  try {
    const channel = await findOwnedChannel(req.params.id, req.user._id);
    const payload = validateChannelInput(req.body, true);

    Object.assign(channel, payload);
    await channel.save();
    res.json(channel);
  } catch (error) {
    next(error);
  }
});

export default router;
