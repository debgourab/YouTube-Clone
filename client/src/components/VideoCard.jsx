import { Link } from "react-router-dom";
import { formatDate, formatViews } from "../utils/categories.js";
import { useFallbackChannelAvatar, useFallbackThumbnail } from "../utils/imageFallback.js";

export default function VideoCard({ video, compact = false }) {
  return (
    <Link className={`video-card ${compact ? "compact" : ""}`} to={`/watch/${video._id}`}>
      <div className="thumb-wrap">
        <img src={video.thumbnailUrl} alt={video.title} loading="lazy" decoding="async" onError={useFallbackThumbnail} />
        {video.duration && <span className="duration">{video.duration}</span>}
      </div>
      <div className="video-meta">
        <img className="channel-avatar" src={video.channelId?.avatar || "/avatars/channel.svg"} alt="" loading="lazy" decoding="async" onError={useFallbackChannelAvatar} />
        <div>
          <h3>{video.title}</h3>
          <p>{video.channelId?.channelName || "YouTube Creator"}</p>
          <p>{formatViews(video.views)} - {formatDate(video.uploadDate || video.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}
