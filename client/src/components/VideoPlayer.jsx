import { useState } from "react";
import { resolveVideoSource } from "../utils/media.js";

export default function VideoPlayer({ url, poster, title }) {
  const source = resolveVideoSource(url);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  if (!source) return (
    <div className="player-error" role="alert">
      <h2>This video link is not supported</h2>
      <p>The creator needs to add a public MP4, WebM, Ogg, or YouTube video link in Studio.</p>
    </div>
  );

  return (
    <div className="video-player">
      {source.kind === "youtube" ? (
        <>
          <iframe className="player" src={source.src} title={title || "Video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          <p className="player-help">If the owner has disabled embedding, <a href={source.original} target="_blank" rel="noopener noreferrer">watch on YouTube</a>.</p>
        </>
      ) : failed ? (
        <div className="player-error" role="alert">
          <h2>We couldn’t play this video</h2>
          <p>The link may have expired, the host may block playback, or the format may be unsupported.</p>
          <div className="form-actions">
            <button className="secondary" onClick={() => { setFailed(false); setAttempt((value) => value + 1); }}>Try again</button>
            <a className="primary-link" href={source.src} target="_blank" rel="noopener noreferrer">Open original video</a>
          </div>
        </div>
      ) : (
        <video key={source.src + attempt} className="player" src={source.src} controls playsInline
          preload="metadata" poster={poster} onError={() => setFailed(true)}>
          Your browser does not support video playback.
        </video>
      )}
    </div>
  );
}
