import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="app-header">
      <span
        className="app-header__title"
        onClick={() => navigate("/songs")}
        style={{ cursor: "pointer" }}
      >
        banger
      </span>
      <nav className="app-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `app-nav__link${isActive ? " app-nav__link--active" : ""}`
          }
        >
          dashboard
        </NavLink>
        <NavLink
          to="/songs"
          className={({ isActive }) =>
            `app-nav__link${isActive ? " app-nav__link--active" : ""}`
          }
        >
          songs
        </NavLink>
        <NavLink
          to="/artists"
          className={({ isActive }) =>
            `app-nav__link${isActive ? " app-nav__link--active" : ""}`
          }
        >
          artists
        </NavLink>
        <NavLink
          to="/albums"
          className={({ isActive }) =>
            `app-nav__link${isActive ? " app-nav__link--active" : ""}`
          }
        >
          albums
        </NavLink>
        {/* <NavLink
          to="/admin"
          className={({ isActive }) =>
            `app-nav__link${isActive ? " app-nav__link--active" : ""}`
          }
        >
          admin
        </NavLink> */}
      </nav>
    </header>
  );
}
