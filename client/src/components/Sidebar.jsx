import {
  Clock,
  Flame,
  Gamepad2,
  History,
  Home,
  ListVideo,
  Music,
  Newspaper,
  PlaySquare,
  Radio,
  ShoppingBag,
  Subtitles,
  ThumbsUp,
  Trophy
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const primaryItems = [
  [Home, "Home", "/"],
  [PlaySquare, "Shorts", "/"],
  [Subtitles, "Subscriptions", "/"]
];

const libraryItems = [
  [History, "History", "/"],
  [ListVideo, "Playlists", "/"],
  [Clock, "Watch Later", "/"],
  [ThumbsUp, "Liked Videos", "/"]
];

const exploreItems = [
  [Flame, "Trending", "/?category=Programming"],
  [ShoppingBag, "Shopping", "/?category=Web%20Development"],
  [Music, "Music", "/?category=Music"],
  [PlaySquare, "Movies", "/?category=News"],
  [Radio, "Live", "/?category=News"],
  [Gamepad2, "Gaming", "/?category=Gaming"],
  [Newspaper, "News", "/?category=News"],
  [Trophy, "Sports", "/?category=Programming"]
];

const SidebarSection = ({ title, items, collapsed }) => (
  <div className="side-section">
    {!collapsed && title && <h2>{title}</h2>}
    {items.map(([Icon, label, to]) => (
      <NavLink key={label} to={to} className="side-link">
        <Icon size={21} />
        <span>{label}</span>
      </NavLink>
    ))}
  </div>
);

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const toggle = () => setOpen((value) => !value);
    window.addEventListener("toggle-sidebar", toggle);
    return () => window.removeEventListener("toggle-sidebar", toggle);
  }, []);

  return (
    <aside className={`sidebar ${open ? "open" : "collapsed"}`}>
      <SidebarSection items={primaryItems} collapsed={!open} />
      <SidebarSection title="You" items={libraryItems} collapsed={!open} />
      <SidebarSection title="Explore" items={exploreItems} collapsed={!open} />
    </aside>
  );
}
