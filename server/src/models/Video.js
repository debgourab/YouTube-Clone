import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    thumbnailUrl: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000
    },
    category: { type: String, required: true, trim: true },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 },
    dislikes: { type: Number, default: 0, min: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    duration: { type: String, default: "12:48" },
    uploadDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

videoSchema.index({ title: "text", description: "text" });
videoSchema.index({ category: 1, createdAt: -1 });
videoSchema.index({ channelId: 1, createdAt: -1 });

export default mongoose.model("Video", videoSchema);
