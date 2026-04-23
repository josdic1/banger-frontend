import { useEffect, useMemo, useState } from "react";
import { getDashboard } from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  const byStatus = Array.isArray(data?.byStatus) ? data.byStatus : [];
  const rawByArtist = Array.isArray(data?.byArtist) ? data.byArtist : [];
  const byMonth = Array.isArray(data?.byMonth) ? data.byMonth : [];
  const topMoods = Array.isArray(data?.topMoods) ? data.topMoods : [];
  const missingSections = Array.isArray(data?.missingSections)
    ? data.missingSections
    : [];
  const recentSongs = Array.isArray(data?.recentSongs) ? data.recentSongs : [];

  const byArtist = useMemo(() => {
    return rawByArtist.map((row, index) => {
      const name =
        row?.artist_name ??
        row?.artistName ??
        row?.name ??
        row?.artist ??
        row?.title ??
        "—";

      const count =
        row?.count ??
        row?.song_count ??
        row?.songs_count ??
        row?.total ??
        row?.value ??
        0;

      return {
        id: row?.artist_id ?? row?.id ?? `artist-${index}`,
        name,
        count,
      };
    });
  }, [rawByArtist]);

  if (!data) {
    return (
      <div className="app-main">
        <p className="empty">loading...</p>
      </div>
    );
  }

  return (
    <div className="app-main">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div className="stat-card">
          <div className="stat-number">{data.totals?.songs ?? 0}</div>
          <div className="stat-label">songs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.totals?.artists ?? 0}</div>
          <div className="stat-label">artists</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.totals?.albums ?? 0}</div>
          <div className="stat-label">albums</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.totals?.genres ?? 0}</div>
          <div className="stat-label">genres</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div className="panel">
          <h3 style={{ marginBottom: "1rem" }}>by status</h3>
          {byStatus.map((row, index) => (
            <div
              key={`status-${row.status ?? "unknown"}-${index}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.4rem 0",
                borderBottom: "1px solid var(--zinc-100)",
              }}
            >
              <span className={`badge badge-${row.status}`}>{row.status}</span>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--zinc-600)",
                  fontWeight: 500,
                }}
              >
                {row.count}
              </span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: "1rem" }}>by artist</h3>
          {byArtist.length === 0 ? (
            <p className="empty">no artist data yet</p>
          ) : (
            byArtist.map((row, index) => (
              <div
                key={row.id ?? `artist-${index}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.4rem 0",
                  borderBottom: "1px solid var(--zinc-100)",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "var(--zinc-800)" }}>{row.name}</span>
                <span style={{ color: "var(--zinc-500)" }}>{row.count}</span>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: "1rem" }}>songs by month</h3>
          {byMonth.map((row, index) => (
            <div
              key={`month-${row.month ?? "unknown"}-${index}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.4rem 0",
                borderBottom: "1px solid var(--zinc-100)",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "var(--zinc-800)" }}>{row.month}</span>
              <span style={{ color: "var(--zinc-500)" }}>{row.count}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: "1rem" }}>top moods</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {topMoods.map((m, index) => (
              <span
                key={`mood-${m.label ?? "unknown"}-${index}`}
                className="pill pill-mood"
              >
                {m.label}{" "}
                <span
                  style={{ color: "var(--zinc-400)", marginLeft: "0.2rem" }}
                >
                  {m.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div className="panel">
          <h3 style={{ marginBottom: "1rem" }}>missing sections</h3>
          {missingSections.length === 0 ? (
            <p className="empty">all good ✓</p>
          ) : (
            missingSections.map((s, index) => (
              <div
                key={s.id ?? `missing-${index}`}
                onClick={() => navigate(`/songs/${s.id}`)}
                style={{
                  padding: "0.4rem 0",
                  borderBottom: "1px solid var(--zinc-100)",
                  fontSize: "13px",
                  color: "var(--accent)",
                  cursor: "pointer",
                }}
              >
                {s.title}
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: "1rem" }}>recent songs</h3>
          {recentSongs.map((s, index) => (
            <div
              key={s.id ?? `recent-${index}`}
              onClick={() => navigate(`/songs/${s.id}`)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.4rem 0",
                borderBottom: "1px solid var(--zinc-100)",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <span style={{ color: "var(--zinc-800)" }}>{s.title}</span>
              <span className={`badge badge-${s.status}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
