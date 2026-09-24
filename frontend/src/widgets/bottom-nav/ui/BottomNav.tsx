import { Disc, Home, ListMusic, MoreHorizontal } from "lucide-react";
import "./BottomNav.css";
import { NavLink } from "react-router-dom";

const items = [
  { path: "/", label: "Home", icon: Home, end: true },
  { path: "/playlists", label: "Playlists", icon: ListMusic },
  { path: "/albums", label: "Albums", icon: Disc },
  { path: "/more", label: "More", icon: MoreHorizontal },
];

export const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      {items.map(({ path, label, icon: Icon, end }) => (
        <NavLink
          key={path}
          to={path}
          end={end}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "bottom-nav-item-active" : ""}`
          }
        >
          <Icon size={22} strokeWidth={1.75} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
