import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSongByToken, MEDIA_URL } from "../api";

export default function ShareView() {
  const { token } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getSongByToken(token)
      .then((data) => {
        if (data.error) {
          setNotFound(true);
        } else {
          setSong(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [token]);

  if (loading)
    return (
      <div style={{ padding: "2rem", color: "var(--zinc-500)" }}>
        loading...
      </div>
    );

  if (notFound)
    return (
      <div style={{ padding: "2rem", color: "var(--zinc-500)" }}>
        song not found.
      </div>
    );

  const sections = (song.sections || [])
    .slice()
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        background: "var(--bg-canvas)",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--zinc-900)",
          marginBottom: "0.25rem",
        }}
      >
        {song.title}
      </h1>
      <p
        style={{
          color: "var(--zinc-500)",
          fontSize: "13px",
          marginBottom: "1.5rem",
        }}
      >
        {song.artist_name || "—"}
        {song.status && (
          <span
            className={`badge badge-${song.status}`}
            style={{ marginLeft: "0.75rem" }}
          >
            {song.status}
          </span>
        )}
      </p>

      <div className="meta-table" style={{ marginBottom: "1.5rem" }}>
        {song.key && (
          <div className="meta-row">
            <span className="meta-label">key</span>
            <span className="meta-value">{song.key}</span>
          </div>
        )}
        {song.tempo && (
          <div className="meta-row">
            <span className="meta-label">tempo</span>
            <span className="meta-value">{song.tempo} bpm</span>
          </div>
        )}
        {song.time_signature && (
          <div className="meta-row">
            <span className="meta-label">time sig</span>
            <span className="meta-value">{song.time_signature}</span>
          </div>
        )}
        {song.genre_title && (
          <div className="meta-row">
            <span className="meta-label">genre</span>
            <span className="meta-value">{song.genre_title}</span>
          </div>
        )}
      </div>

      {song.notes && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="section-title" style={{ marginBottom: "0.4rem" }}>
            notes
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--zinc-600)",
              lineHeight: 1.6,
            }}
          >
            {song.notes}
          </p>
        </div>
      )}

      {(song.audio || []).length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="section-title" style={{ marginBottom: "0.75rem" }}>
            audio
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {song.audio.map((a) => (
              <div
                key={a.id}
                className="panel"
                style={{ padding: "0.875rem 1rem" }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--accent)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {a.version}
                </div>
                <audio
                  controls
                  src={
                    a.url.startsWith("http") ? a.url : `${MEDIA_URL}${a.url}`
                  }
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.length > 0 && (
        <div>
          <div className="section-title" style={{ marginBottom: "0.75rem" }}>
            lyrics
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {sections.map((sec) => (
              <div key={sec.id}>
                <div
                  style={{
                    color: "var(--accent)",
                    fontSize: "11px",
                    fontWeight: 600,
                    marginBottom: "0.3rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  [{sec.label}]
                </div>
                <div
                  style={{
                    color: "var(--zinc-600)",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {sec.lyrics || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
