import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(
    () => !!sessionStorage.getItem("banger_admin_token"),
  );

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(!!sessionStorage.getItem("banger_admin_token"));
    };

    checkAdmin();

    window.addEventListener("storage", checkAdmin);
    window.addEventListener("focus", checkAdmin);
    window.addEventListener("banger-admin-change", checkAdmin);

    return () => {
      window.removeEventListener("storage", checkAdmin);
      window.removeEventListener("focus", checkAdmin);
      window.removeEventListener("banger-admin-change", checkAdmin);
    };
  }, []);

  return (
    <header className="app-header">
      <span
        className="app-header__title"
        onClick={() => navigate("/songs")}
        style={{
          cursor: "pointer",
          color: isAdmin ? "#facc15" : "#f4f0df",
          textShadow: isAdmin ? "0 0 14px rgba(250, 204, 21, 0.45)" : "none",
          opacity: isAdmin ? 1 : 0.75,
        }}
        title={isAdmin ? "admin mode active" : "not logged in as admin"}
      >
        banger
      </span>

      <nav className="app-nav">
        {isAdmin && (
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `app-nav__link${isActive ? " app-nav__link--active" : ""}`
            }
          >
            dashboard
          </NavLink>
        )}

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
      </nav>
    </header>
  );
}
