// Resolve only supported media URLs; never embed arbitrary websites.
export function resolveVideoSource(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    const youtube = ["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"];
    if (host === "youtu.be" || host === "www.youtu.be" || youtube.includes(host)) {
      const parts = url.pathname.split("/").filter(Boolean);
      const id = host.endsWith("youtu.be") ? parts[0]
        : url.pathname === "/watch" ? url.searchParams.get("v")
        : ["embed", "shorts", "live"].includes(parts[0]) ? parts[1] : null;
      if (!/^[A-Za-z0-9_-]{11}$/.test(id || "")) return null;
      return { kind: "youtube", src: "https://www.youtube-nocookie.com/embed/" + id, original: url.href };
    }
    if (!/\.(mp4|webm|ogg|ogv|m4v)$/i.test(url.pathname)) return null;
    return { kind: "file", src: url.href, original: url.href };
  } catch {
    return null;
  }
}

export const VIDEO_SOURCE_HELP = "Use a public MP4, WebM, Ogg, or YouTube video link. Links to drive folders or ordinary web pages cannot be played.";
