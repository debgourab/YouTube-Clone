import { Code2, Gamepad2, Home, Music, Newspaper, PlaySquare, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const sections = [
  { title: "", items: [[Home, "Home", "/"], [PlaySquare, "Creator Studio", "/studio"]] },
  { title: "Explore", items: [
    [Code2, "Programming", "/?category=Programming"],
    [Code2, "Web Development", "/?category=Web%20Development"],
    [Music, "Music", "/?category=Music"],
    [Gamepad2, "Gaming", "/?category=Gaming"],
    [Newspaper, "News", "/?category=News"]
  ] }
];

export default function Sidebar({ overlay = false, collapsed = false, onClose }) {
  const location = useLocation();
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!overlay) return;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = ref.current;
    node.querySelector("button, a")?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab") return;
      const items = [...node.querySelectorAll("button, a[href]")];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [overlay]);

  const category = new URLSearchParams(location.search).get("category");
  return (
    <>
      {overlay && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside id="site-sidebar" ref={ref} className={"sidebar " + (overlay ? "drawer" : collapsed ? "collapsed" : "open")}
        role={overlay ? "dialog" : undefined} aria-modal={overlay || undefined} aria-label="Main navigation">
        {overlay && <div className="drawer-heading"><strong>Explore YouTube</strong><button className="icon-button" onClick={onClose} aria-label="Close menu"><X size={22} /></button></div>}
        <nav aria-label="Video navigation">
          {sections.map(({ title, items }) => (
            <div className="side-section" key={title}>
              {!collapsed && title && <h2>{title}</h2>}
              {items.map(([Icon, label, to]) => {
                const target = new URL(to, window.location.origin);
                const active = location.pathname === target.pathname && category === target.searchParams.get("category");
                return <Link key={label} to={to} title={collapsed ? label : undefined}
                  onClick={overlay ? onClose : undefined} aria-current={active ? "page" : undefined}
                  className={"side-link" + (active ? " active" : "")}>
                  <Icon size={21} /><span>{label}</span>
                </Link>;
              })}
            </div>
          ))}
        </nav>
        {!collapsed && <p className="sidebar-note">Discover something worth watching.<br />Built by Deb Gourab Biswas.</p>}
      </aside>
    </>
  );
}
