import { useSearchParams } from "react-router-dom";
import Filters from "../components/Filters.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { categories } from "../utils/categories.js";
import { useGetVideosQuery } from "../store/videosApi.js";

export default function Home() {
  const [params, setParams] = useSearchParams();
  const search = (params.get("search") || "").trim();
  const rawCategory = params.get("category") || "All";
  const category = categories.includes(rawCategory) ? rawCategory : "All";
  const { currentData: videos = [], isFetching, isError, error, refetch } = useGetVideosQuery(
    { search, category }, { refetchOnMountOrArgChange: true }
  );
  const selectCategory = (nextCategory) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (nextCategory === "All") next.delete("category");
      else next.set("category", nextCategory);
      return next;
    });
  };
  return (
    <main className="content home-content">
      <Filters selected={category} onSelect={selectCategory} />
      <div className="feed-heading"><div>
        <p className="eyebrow">{search ? "Search results" : "Your daily discovery"}</p>
        <h1>{search ? 'Results for “' + search + '”' : category === "All" ? "Made for your curiosity" : category}</h1>
      </div><span className="feed-label">{isFetching ? "Updating…" : videos.length + " videos"}</span></div>
      {isError && <div className="status error-state" role="alert"><p>{error?.message}</p><button className="secondary" onClick={refetch}>Try again</button></div>}
      {isFetching && !videos.length ? (
        <div className="video-grid" role="status" aria-label="Loading videos">
          {Array.from({ length: 8 }, (_, index) => <div className="skeleton-card" key={index} aria-hidden="true"><div className="skeleton-thumb" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}
        </div>
      ) : !isError && (
        <div className="video-grid">
          {videos.map((video) => <VideoCard key={video._id} video={video} />)}
          {!videos.length && <div className="status empty-state"><h2>No matching videos</h2><p>Try another search or explore a different category.</p><button className="secondary" onClick={() => setParams({})}>Show all videos</button></div>}
        </div>
      )}
    </main>
  );
}
