import { Edit2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api.js";
import VideoCard from "../components/VideoCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { videoCategories } from "../utils/categories.js";
import { useFallbackChannelAvatar } from "../utils/imageFallback.js";

const blankChannel = { channelName: "", handle: "", description: "", channelBanner: "", avatar: "" };
const blankVideo = {
  title: "",
  thumbnailUrl: "",
  videoUrl: "",
  description: "",
  category: "React",
  duration: "12:48"
};

export default function Channel({ studio = false }) {
  const { id } = useParams();
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [channelForm, setChannelForm] = useState(blankChannel);
  const [settingsForm, setSettingsForm] = useState(blankChannel);
  const [videoForm, setVideoForm] = useState(blankVideo);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const activeChannelId = useMemo(() => studio ? channel?._id : id, [studio, channel, id]);

  const loadChannelVideos = useCallback((channelId) => {
    if (!channelId) return;
    api.get(`/channels/${channelId}`).then(({ data }) => {
      if (!studio) setChannel(data.channel);
      setVideos(data.videos);
    });
  }, [studio]);

  useEffect(() => {
    setLoading(true);
    setError("");

    if (studio) {
      api.get("/channels/mine")
        .then(({ data }) => {
          setChannels(data);
          setChannel(data[0] || null);
          if (!data.length) setVideos([]);
        })
        .catch((err) => setError(err.response?.data?.message || "Could not load your channels."))
        .finally(() => setLoading(false));
      return;
    }

    api.get(`/channels/${id}`)
      .then(({ data }) => {
        setChannel(data.channel);
        setVideos(data.videos);
      })
      .catch((err) => setError(err.response?.data?.message || "Channel not found."))
      .finally(() => setLoading(false));
  }, [id, studio]);

  useEffect(() => {
    if (studio && activeChannelId) loadChannelVideos(activeChannelId);
  }, [activeChannelId, studio, loadChannelVideos]);

  useEffect(() => {
    if (!channel) {
      setSettingsForm(blankChannel);
      return;
    }

    setSettingsForm({
      channelName: channel.channelName || "",
      handle: channel.handle || "",
      description: channel.description || "",
      channelBanner: channel.channelBanner || "",
      avatar: channel.avatar || ""
    });
  }, [channel]);

  const createChannel = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/channels", channelForm);
      setChannels((items) => [data, ...items]);
      setChannel(data);
      setChannelForm(blankChannel);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create channel.");
    }
  };

  const updateChannel = async (event) => {
    event.preventDefault();
    if (!activeChannelId) return;
    setError("");

    try {
      const { data } = await api.put(`/channels/${activeChannelId}`, settingsForm);
      setChannel(data);
      setChannels((items) => items.map((item) => (item._id === data._id ? data : item)));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update channel.");
    }
  };

  const saveVideo = async (event) => {
    event.preventDefault();
    if (!activeChannelId) return setError("Create or select a channel before adding videos.");
    setError("");

    try {
      if (editing) {
        const { data } = await api.put(`/videos/${editing}`, videoForm);
        setVideos((items) => items.map((item) => (item._id === editing ? data : item)));
      } else {
        const { data } = await api.post("/videos", { ...videoForm, channelId: activeChannelId });
        setVideos((items) => [data, ...items]);
      }
      setEditing(null);
      setVideoForm(blankVideo);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save video.");
    }
  };

  const editVideo = (video) => {
    setEditing(video._id);
    setVideoForm({
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      description: video.description,
      category: video.category,
      duration: video.duration || "12:48"
    });
  };

  const deleteVideo = async (videoId) => {
    setError("");
    try {
      await api.delete(`/videos/${videoId}`);
      setVideos((items) => items.filter((item) => item._id !== videoId));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete video.");
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setVideoForm(blankVideo);
  };

  if (loading) return <main className="channel-page"><div className="status">Loading channel...</div></main>;

  if (!channel && !studio) {
    return (
      <main className="status-page">
        <h1>Channel unavailable</h1>
        <p>{error || "The requested channel could not be found."}</p>
        <Link className="primary-link" to="/">Back to Home</Link>
      </main>
    );
  }

  return (
    <main className="channel-page">
      {channel && (
        <section className="channel-hero">
          <img src={channel.channelBanner} alt="" />
          <div className="channel-info">
            <img src={channel.avatar || "/avatars/channel.svg"} alt="" onError={useFallbackChannelAvatar} />
            <div>
              <h1>{channel.channelName}</h1>
              {channel.handle && <span className="channel-handle">@{channel.handle}</span>}
              <p>{channel.description}</p>
              <span>{channel.subscribers?.toLocaleString()} subscribers</span>
            </div>
          </div>
        </section>
      )}

      {studio && (
        <section className="studio-panel">
          <div className="panel-column">
            <h2>Create channel</h2>
            <form onSubmit={createChannel} className="stack-form">
              <label>
                Channel name
                <input value={channelForm.channelName} onChange={(event) => setChannelForm({ ...channelForm, channelName: event.target.value })} required />
              </label>
              <label>
                Handle
                <input value={channelForm.handle} onChange={(event) => setChannelForm({ ...channelForm, handle: event.target.value })} placeholder="codewithdeb" />
              </label>
              <label>
                Description
                <textarea value={channelForm.description} onChange={(event) => setChannelForm({ ...channelForm, description: event.target.value })} required />
              </label>
              <label>
                Banner image URL
                <input value={channelForm.channelBanner} onChange={(event) => setChannelForm({ ...channelForm, channelBanner: event.target.value })} placeholder="https://..." />
              </label>
              <label>
                Avatar URL
                <input value={channelForm.avatar} onChange={(event) => setChannelForm({ ...channelForm, avatar: event.target.value })} placeholder="https://... or /avatars/channel.svg" />
              </label>
              <button className="primary"><Plus size={18} /> Create channel</button>
            </form>
          </div>

          <div className="panel-column">
            <h2>Channel settings</h2>
            {channel ? (
              <form onSubmit={updateChannel} className="stack-form">
                <label>
                  Active channel
                  <select value={activeChannelId || ""} onChange={(event) => setChannel(channels.find((item) => item._id === event.target.value))}>
                    {channels.map((item) => <option key={item._id} value={item._id}>{item.channelName}</option>)}
                  </select>
                </label>
                <label>
                  Channel name
                  <input value={settingsForm.channelName} onChange={(event) => setSettingsForm({ ...settingsForm, channelName: event.target.value })} required />
                </label>
                <label>
                  Handle
                  <input value={settingsForm.handle} onChange={(event) => setSettingsForm({ ...settingsForm, handle: event.target.value })} />
                </label>
                <label>
                  Description
                  <textarea value={settingsForm.description} onChange={(event) => setSettingsForm({ ...settingsForm, description: event.target.value })} required />
                </label>
                <label>
                  Banner image URL
                  <input value={settingsForm.channelBanner} onChange={(event) => setSettingsForm({ ...settingsForm, channelBanner: event.target.value })} />
                </label>
                <label>
                  Avatar URL
                  <input value={settingsForm.avatar} onChange={(event) => setSettingsForm({ ...settingsForm, avatar: event.target.value })} />
                </label>
                <button className="primary"><Edit2 size={18} /> Save channel</button>
              </form>
            ) : (
              <p className="muted">Create a channel before publishing videos.</p>
            )}
          </div>

          <div className="panel-column wide">
            <h2>{editing ? "Edit video" : "Upload video metadata"}</h2>
            <form onSubmit={saveVideo} className="stack-form">
              <fieldset disabled={!activeChannelId}>
                <label>
                  Title
                  <input value={videoForm.title} onChange={(event) => setVideoForm({ ...videoForm, title: event.target.value })} required />
                </label>
                <label>
                  Thumbnail URL
                  <input value={videoForm.thumbnailUrl} onChange={(event) => setVideoForm({ ...videoForm, thumbnailUrl: event.target.value })} required />
                </label>
                <label>
                  Video URL
                  <input value={videoForm.videoUrl} onChange={(event) => setVideoForm({ ...videoForm, videoUrl: event.target.value })} required />
                </label>
                <div className="form-row">
                  <label>
                    Category
                    <select value={videoForm.category} onChange={(event) => setVideoForm({ ...videoForm, category: event.target.value })}>
                      {videoCategories.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label>
                    Duration
                    <input value={videoForm.duration} onChange={(event) => setVideoForm({ ...videoForm, duration: event.target.value })} placeholder="12:48" />
                  </label>
                </div>
                <label>
                  Description
                  <textarea value={videoForm.description} onChange={(event) => setVideoForm({ ...videoForm, description: event.target.value })} required />
                </label>
                <div className="form-actions">
                  <button className="primary">{editing ? <Edit2 size={18} /> : <Plus size={18} />} {editing ? "Update video" : "Add video"}</button>
                  {editing && <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>}
                </div>
              </fieldset>
            </form>
            {error && <p className="form-error">{error}</p>}
          </div>
        </section>
      )}

      <section className="channel-videos">
        <h2>{studio ? "Your videos" : "Videos"}</h2>
        <div className="video-grid">
          {videos.map((video) => (
            <div className="managed-video" key={video._id}>
              <VideoCard video={{ ...video, channelId: video.channelId || channel }} />
              {studio && (
                <div className="manage-tools">
                  <button type="button" onClick={() => editVideo(video)}><Edit2 size={16} /> Edit</button>
                  <button type="button" onClick={() => deleteVideo(video._id)}><Trash2 size={16} /> Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {!videos.length && <p className="status">{studio && user ? "Create a channel and add your first video." : "This channel has no videos yet."}</p>}
      </section>
    </main>
  );
}
