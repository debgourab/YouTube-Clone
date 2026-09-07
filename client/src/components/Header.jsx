import { Bell, LogOut, Menu, Mic, Play, PlusCircle, Search, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useFallbackUserAvatar } from "../utils/imageFallback.js";

export default function Header() {
  const { user, logout } = useAuth();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("search") || "");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setQuery(params.get("search") || "");
  }, [params]);

  const onSearch = (event) => {
    event.preventDefault();
    const search = query.trim();
    const next = new URLSearchParams();
    const currentCategory = params.get("category");

    if (search) next.set("search", search);
    if (location.pathname === "/" && currentCategory) next.set("category", currentCategory);

    navigate(next.toString() ? `/?${next.toString()}` : "/");
  };

  return (
    <header className="header">
      <div className="brand-row">
        <button className="icon-button" aria-label="Toggle sidebar" onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}>
          <Menu size={22} />
        </button>
        <Link className="brand" to="/">
          <span className="play-mark"><Play size={17} fill="white" strokeWidth={0} /></span>
          <span>YouTube</span>
          <sup>IN</sup>
        </Link>
      </div>

      <form className="search" onSubmit={onSearch}>
        <input
          name="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          aria-label="Search videos by title"
        />
        <button type="submit" aria-label="Search"><Search size={20} /></button>
        <button type="button" className="voice-button" aria-label="Voice search"><Mic size={18} /></button>
      </form>

      <div className="account">
        {user ? (
          <>
            <Link className="icon-button hide-small" to="/studio" aria-label="Create or manage videos"><PlusCircle size={21} /></Link>
            <button className="icon-button hide-small" type="button" aria-label="Notifications"><Bell size={21} /></button>
            <img src={user.avatar || "/avatars/user.svg"} alt="" className="avatar" onError={useFallbackUserAvatar} />
            <span className="username">{user.username}</span>
            <button className="icon-button" type="button" aria-label="Log out" onClick={logout}><LogOut size={20} /></button>
          </>
        ) : (
          <Link className="sign-in" to="/auth"><UserCircle size={20} /> Sign in</Link>
        )}
      </div>
    </header>
  );
}
