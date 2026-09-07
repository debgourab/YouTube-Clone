import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 80
    },
    handle: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 32,
      unique: true,
      sparse: true
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600
    },
    channelBanner: {
      type: String,
      default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
    },
    avatar: {
      type: String,
      default: "/avatars/channel.svg"
    },
    subscribers: { type: Number, default: 0, min: 0 },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }]
  },
  { timestamps: true }
);

channelSchema.index({ owner: 1, createdAt: -1 });

export default mongoose.model("Channel", channelSchema);
