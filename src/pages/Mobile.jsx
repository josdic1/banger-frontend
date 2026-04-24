import { useEffect, useState, useMemo } from "react";
import { getSongs, getArtists, getList, MEDIA_URL } from "../api";

export default function Mobile() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterArtist, setFilterArtist] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    getSongs().then(setSongs);
    getArtists().then(setArtists);
    getList("status").then((r) => setStatuses(r.map((x) => x.value)));
  }, []);

  const filtered = useMemo(() => {
    let r = [...songs];
    if (search)
      r = r.filter((s) =>
        s.title?.toLowerCase().includes(search.toLowerCase()),
      );
    if (filterArtist)
      r = r.filter((s) => s.artist_id === parseInt(filterArtist));
    if (filterStatus) r = r.filter((s) => s.status === filterStatus);
    return r;
  }, [songs, search, filterArtist, filterStatus]);

  const hasFilters = search || filterArtist || filterStatus;

  function clear() {
    setSearch("");
    setFilterArtist("");
    setFilterStatus("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#f0ede8",
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: "antialiased",
        paddingBottom: "2rem",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "1rem 1rem 0.75rem",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#c9a84c",
            }}
          >
            banger
          </span>
          <span style={{ fontSize: "11px", color: "#3d3d44" }}>
            {filtered.length} songs
          </span>
        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search songs..."
          style={{
            width: "100%",
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "10px",
            padding: "0.6rem 0.875rem",
            color: "#f0ede8",
            fontSize: "14px",
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "0.5rem",
          }}
        />

        {/* FILTERS */}
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <select
            value={filterArtist}
            onChange={(e) => setFilterArtist(e.target.value)}
            style={selectStyle}
          >
            <option value="">all artists</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="">all statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={clear}
              style={{
                flexShrink: 0,
                background: "none",
                border: "1px solid #2e2c2a",
                borderRadius: "999px",
                color: "#7a7a88",
                fontSize: "11px",
                padding: "0.35rem 0.75rem",
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              clear
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div
        style={{
          padding: "0.75rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {filtered.length === 0 && (
          <p
            style={{
              color: "#3d3d44",
              fontSize: "13px",
              textAlign: "center",
              marginTop: "3rem",
            }}
          >
            no songs found
          </p>
        )}
        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() => window.open(`/listen/${s.id}`, "_blank")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.875rem",
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "0.75rem",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              width: "100%",
              transition: "border-color 0.15s",
            }}
          >
            {/* COVER */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "8px",
                background: "#1a1a1a",
                flexShrink: 0,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}
            >
              {s.cover_url ? (
                <img
                  src={
                    s.cover_url.startsWith("http")
                      ? s.cover_url
                      : `${MEDIA_URL}${s.cover_url}`
                  }
                  alt={s.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                "🎵"
              )}
            </div>

            {/* META */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#f0ede8",
                  marginBottom: "0.2rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#7a7a88",
                  marginBottom: "0.3rem",
                }}
              >
                {s.artist_name || "—"}
              </div>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  background: statusBg(s.status),
                  color: statusColor(s.status),
                  letterSpacing: "0.04em",
                }}
              >
                {s.status}
              </span>
            </div>

            {/* ARROW */}
            <span style={{ color: "#2e2c2a", fontSize: "18px", flexShrink: 0 }}>
              ›
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const selectStyle = {
  flex: 1,
  background: "#111",
  border: "1px solid #1e1e1e",
  borderRadius: "8px",
  padding: "0.4rem 0.6rem",
  color: "#7a7a88",
  fontSize: "12px",
  fontFamily: "inherit",
  outline: "none",
  appearance: "none",
  cursor: "pointer",
};

function statusBg(status) {
  const map = {
    draft: "rgba(100,100,120,0.15)",
    tracking: "rgba(100,140,220,0.1)",
    in_progress: "rgba(200,120,40,0.1)",
    assets_uploaded: "rgba(180,140,60,0.12)",
    finished: "rgba(39,174,96,0.1)",
    released: "rgba(160,100,200,0.1)",
    dead_on_hd: "rgba(139,58,58,0.1)",
  };
  return map[status] || "rgba(100,100,120,0.15)";
}

function statusColor(status) {
  const map = {
    draft: "#7a7a88",
    tracking: "#8aabdb",
    in_progress: "#d4956a",
    assets_uploaded: "#c9a84c",
    finished: "#6db88a",
    released: "#b48fd4",
    dead_on_hd: "#e07070",
  };
  return map[status] || "#7a7a88";
}
