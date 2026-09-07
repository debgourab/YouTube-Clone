import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500
    },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

commentSchema.index({ videoId: 1, createdAt: -1 });
commentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
