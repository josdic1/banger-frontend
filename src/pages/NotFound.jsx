import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-canvas)",
        gap: "1rem",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--zinc-400)",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "var(--zinc-900)",
          margin: 0,
        }}
      >
        page not found
      </h1>
      <p style={{ fontSize: "13px", color: "var(--zinc-500)", margin: 0 }}>
        that page doesn't exist.
      </p>
      <button
        onClick={() => navigate("/songs")}
        className="btn btn-primary"
        style={{ marginTop: "0.5rem" }}
      >
        go to songs
      </button>
    </div>
  );
}
