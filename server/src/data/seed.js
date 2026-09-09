import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../db.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";
import { VIDEO_CATEGORIES } from "../utils/validators.js";

dotenv.config();

const thumbnails = [
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
];

const shouldReset = process.argv.includes("--reset") || process.env.SEED_RESET === "true";

const run = async () => {
  await connectDB();

  if (shouldReset) {
    await Promise.all([User.deleteMany({}), Channel.deleteMany({}), Video.deleteMany({}), Comment.deleteMany({})]);
  } else if (await Video.exists({})) {
    console.log("Seed skipped because videos already exist. Run `npm run seed -- --reset` to replace demo data.");
    await mongoose.disconnect();
    return;
  }

  const password = await bcrypt.hash("password123", 10);
  const deb = await User.findOneAndUpdate(
    { email: "deb@example.com" },
    { username: "Deb", email: "deb@example.com", password, avatar: "/avatars/deb.svg" },
    { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  const maya = await User.findOneAndUpdate(
    { email: "maya@example.com" },
    { username: "MayaCreates", email: "maya@example.com", password, avatar: "/avatars/maya.svg" },
    { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const code = await Channel.findOneAndUpdate(
    { handle: "codewithdeb" },
    {
      channelName: "Code with Deb",
      handle: "codewithdeb",
      owner: deb._id,
      description: "Coding tutorials and tech reviews by Deb.",
      channelBanner: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=1400&q=80",
      avatar: "/avatars/deb.svg",
      subscribers: 5200
    },
    { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  const studio = await Channel.findOneAndUpdate(
    { handle: "mayastudio" },
    {
      channelName: "Maya Studio",
      handle: "mayastudio",
      owner: maya._id,
      description: "Design, productivity, and creative workflow videos.",
      channelBanner: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
      avatar: "/avatars/maya.svg",
      subscribers: 17800
    },
    { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  await User.findByIdAndUpdate(deb._id, { $addToSet: { channels: code._id } });
  await User.findByIdAndUpdate(maya._id, { $addToSet: { channels: studio._id } });

  const baseVideoUrl = "https://cdn.pixabay.com/video/2023/07/12/171343-845465072_large.mp4";
  const items = [
    ["React JS Roadmap With Projects", "A practical React roadmap with project checkpoints for frontend learners.", "React", code, deb, 15200, "14:24"],
    ["Build a MERN Auth Flow", "JWT login, protected routes, hashed passwords, and polished auth forms.", "Web Development", code, deb, 23400, "18:02"],
    ["MongoDB Models Explained", "A practical guide to schemas, references, and relationships in MongoDB.", "MongoDB", code, deb, 18720, "11:45"],
    ["CSS Grid YouTube Layout", "Recreate the YouTube homepage layout with responsive CSS grid techniques.", "Programming", studio, maya, 90200, "22:10"],
    ["Lo-Fi Coding Music Session", "A calm music session for creators, coders, and late-night study blocks.", "Music", studio, maya, 44100, "31:09"],
    ["Node API From Scratch", "Express routing, middleware, validation, and clean API structure for beginners.", "Node.js", code, deb, 30200, "16:33"],
    ["Gaming UI Breakdown", "Design lessons from gaming menus, overlays, cards, and streaming interfaces.", "Gaming", studio, maya, 38100, "09:58"],
    ["JavaScript Array Tricks", "Useful array methods for everyday frontend work and interview practice.", "JavaScript", code, deb, 76000, "12:40"],
    ["Tech News Weekly", "A quick roundup of developer tooling, AI updates, and web platform news.", "News", studio, maya, 21400, "08:21"]
  ];

  const videos = await Video.insertMany(
    items.map(([title, description, category, channel, user, views, duration], index) => ({
      title,
      description,
      category: VIDEO_CATEGORIES.includes(category) ? category : "Programming",
      channelId: channel._id,
      uploader: user._id,
      views,
      likes: Math.floor(views / 18),
      dislikes: Math.floor(views / 280),
      thumbnailUrl: thumbnails[index % thumbnails.length],
      videoUrl: baseVideoUrl,
      duration,
      uploadDate: new Date(Date.now() - index * 86400000)
    }))
  );

  code.videos = videos.filter((video) => video.channelId.equals(code._id)).map((video) => video._id);
  studio.videos = videos.filter((video) => video.channelId.equals(studio._id)).map((video) => video._id);
  await code.save();
  await studio.save();

  await Comment.create({
    videoId: videos[0]._id,
    userId: maya._id,
    text: "Great video! Very helpful."
  });

  console.log("Seed complete. Login with deb@example.com / password123 or maya@example.com / password123");
  await mongoose.disconnect();
};

run();
