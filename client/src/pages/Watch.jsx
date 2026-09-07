import { Edit2, Send, ThumbsDown, ThumbsUp, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api.js";
import VideoCard from "../components/VideoCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate, formatViews } from "../utils/categories.js";
import { useFallbackChannelAvatar, useFallbackUserAvatar } from "../utils/imageFallback.js";

export default function Watch() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [related, setRelated] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError("");

    api.get(`/videos/${id}`)
      .then(({ data }) => {
        setVideo(data.video);
        setComments(data.comments);
        setRelated(data.related || []);
      })
      .catch((err) => {
        setVideo(null);
        setComments([]);
        setRelated([]);
        setError(err.response?.data?.message || "Video not found.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const react = async (action) => {
    if (!user) return setError("Please sign in to like or dislike videos.");
    setError("");

    try {
      const { data } = await api.put(`/videos/${id}/${action}`);
      setVideo((current) => ({ ...current, ...data }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update reaction.");
    }
  };

  const saveComment = async (event) => {
    event.preventDefault();
    if (!user) return setError("Please sign in to comment.");
    if (!text.trim()) return setError("Comment text is required.");
    setError("");

    try {
      if (editing) {
        const { data } = await api.put(`/comments/${editing}`, { text });
        setComments((items) => items.map((item) => (item._id === editing ? data : item)));
        setEditing(null);
      } else {
        const { data } = await api.post(`/videos/${id}/comments`, { text });
        setComments((items) => [data, ...items]);
      }
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save comment.");
    }
  };

  const removeComment = async (commentId) => {
    setError("");
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((items) => items.filter((item) => item._id !== commentId));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete comment.");
    }
  };

  const startEdit = (comment) => {
    setEditing(comment._id);
    setText(comment.text);
  };

  const cancelEdit = () => {
    setEditing(null);
    setText("");
  };

  if (loading) return <main className="watch-page"><div className="status">Loading video...</div></main>;

  if (!video) {
    return (
      <main className="status-page">
        <h1>Video unavailable</h1>
        <p>{error || "The requested video could not be found."}</p>
        <Link className="primary-link" to="/">Back to Home</Link>
      </main>
    );
  }

  return (
    <main className="watch-page">
      <section className="watch-main">
        <section className="watch-content">
          <video className="player" src={video.videoUrl} controls poster={video.thumbnailUrl} />
          <h1>{video.title}</h1>
          <div className="watch-actions">
            <Link className="channel-chip" to={`/channel/${video.channelId?._id}`}>
              <img src={video.channelId?.avatar || "/avatars/channel.svg"} alt="" onError={useFallbackChannelAvatar} />
              <span>
                <strong>{video.channelId?.channelName || "YouTube Creator"}</strong>
                <small>{video.channelId?.subscribers?.toLocaleString() || 0} subscribers</small>
              </span>
            </Link>
            <div className="reaction-group" aria-label="Video reactions">
              <button
                type="button"
                className={video.viewerReaction === "like" ? "active" : ""}
                onClick={() => react("like")}
              >
                <ThumbsUp size={18} /> {video.likes}
              </button>
              <button
                type="button"
                className={video.viewerReaction === "dislike" ? "active" : ""}
                onClick={() => react("dislike")}
              >
                <ThumbsDown size={18} /> {video.dislikes}
              </button>
            </div>
          </div>
          <div className="description">
            <strong>{formatViews(video.views)} - {formatDate(video.uploadDate || video.createdAt)}</strong>
            <p>{video.description}</p>
          </div>

          <section className="comments">
            <h2>{comments.length} Comments</h2>
            <form className="comment-form" onSubmit={saveComment}>
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={user ? "Add a comment..." : "Sign in to comment"}
                aria-label="Comment text"
              />
              {editing && (
                <button type="button" className="cancel-comment" aria-label="Cancel edit" onClick={cancelEdit}>
                  <X size={18} />
                </button>
              )}
              <button type="submit" aria-label={editing ? "Update comment" : "Send comment"}><Send size={18} /></button>
            </form>
            {error && <p className="form-error">{error}</p>}
            {comments.map((comment) => {
              const ownerId = comment.userId?._id || comment.userId?.id || comment.userId;
              const isOwner = user?.id === ownerId;

              return (
                <article className="comment" key={comment._id}>
                  <img src={comment.userId?.avatar || "/avatars/user.svg"} alt="" onError={useFallbackUserAvatar} />
                  <div>
                    <strong>{comment.userId?.username || "Viewer"}</strong>
                    <time>{formatDate(comment.createdAt || comment.timestamp)}</time>
                    <p>{comment.text}</p>
                  </div>
                  {isOwner && (
                    <div className="comment-tools">
                      <button type="button" onClick={() => startEdit(comment)} aria-label="Edit comment"><Edit2 size={16} /></button>
                      <button type="button" onClick={() => removeComment(comment._id)} aria-label="Delete comment"><Trash2 size={16} /></button>
                    </div>
                  )}
                </article>
              );
            })}
            {!comments.length && <p className="muted">No comments yet. Start the conversation after signing in.</p>}
          </section>
        </section>

        <aside className="related-videos" aria-label="Related videos">
          <h2>Related</h2>
          {related.map((item) => <VideoCard key={item._id} video={item} compact />)}
          {!related.length && <p className="muted">No related videos yet.</p>}
        </aside>
      </section>
    </main>
  );
}
