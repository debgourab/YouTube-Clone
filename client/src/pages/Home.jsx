import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api.js";
import Filters from "../components/Filters.jsx";
import Sidebar from "../components/Sidebar.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { categories } from "../utils/categories.js";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [params, setParams] = useSearchParams();
  const search = (params.get("search") || "").trim();
  const rawCategory = params.get("category") || "All";
  const category = categories.includes(rawCategory) ? rawCategory : "All";

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    api.get("/videos", { params: { search, category }, signal: controller.signal })
      .then(({ data }) => setVideos(data))
      .catch((err) => {
        if (err.name !== "CanceledError") {
          setError(err.response?.data?.message || "Could not load videos.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [search, category]);

  const selectCategory = (nextCategory) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (nextCategory === "All") next.delete("category");
      else next.set("category", nextCategory);
      return next;
    });
  };

  return (
    <main className="shell">
      <Sidebar />
      <section className="content">
        <Filters selected={category} onSelect={selectCategory} />
        {loading && <div className="status">Loading videos...</div>}
        {error && <div className="status error-state">{error}</div>}
        {!loading && !error && (
          <div className="video-grid">
            {videos.map((video) => <VideoCard key={video._id} video={video} />)}
            {!videos.length && (
              <div className="status empty-state">
                <h1>No matching videos</h1>
                <p>Try a different title search or switch the category back to All.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
