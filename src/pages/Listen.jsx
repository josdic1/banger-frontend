import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MEDIA_URL } from "../api";

const LINK_ICONS = {
  spotify: "🟢",
  youtube: "🔴",
  soundcloud: "🟠",
  suno: "⚡",
  apple_music: "🎵",
  tiktok: "⬛",
  other: "🔗",
};

const CLOSE_BUTTON_STYLE = {
  position: "fixed",
  top: "max(1rem, env(safe-area-inset-top))",
  right: "max(1rem, env(safe-area-inset-right))",
  zIndex: 110,
  width: "40px",
  height: "40px",
  borderRadius: "999px",
  border: "1px solid #1e1e1e",
  background: "rgba(17,17,17,0.88)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  color: "#7a7a88",
  fontSize: "18px",
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "inherit",
};

export default function Listen() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [audio, setAudio] = useState([]);
  const [images, setImages] = useState([]);
  const [links, setLinks] = useState([]);
  const [sections, setSections] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lyricsOpen, setLyricsOpen] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch(`${MEDIA_URL}/api/songs/${id}`).then((r) => r.json()),
      fetch(`${MEDIA_URL}/api/songs/${id}/audio`).then((r) => r.json()),
      fetch(`${MEDIA_URL}/api/songs/${id}/images`).then((r) => r.json()),
      fetch(`${MEDIA_URL}/api/songs/${id}/links`).then((r) => r.json()),
      fetch(`${MEDIA_URL}/api/songs/${id}/moods`).then((r) => r.json()),
    ]).then(([songData, audioData, imagesData, linksData, moodsData]) => {
      setSong(songData);
      setSections(
        (songData.sections || [])
          .slice()
          .sort((a, b) => a.order_index - b.order_index),
      );
      setAudio(audioData);
      setImages(imagesData);
      setLinks(linksData);
      setMoods(moodsData);
      setLoading(false);
    });
  }, [id]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleClose() {
    window.close();

    setTimeout(() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    }, 50);
  }

  function toggleLyrics(sectionId) {
    setLyricsOpen((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <p style={{ color: "#555", fontSize: "14px" }}>loading...</p>
      </div>
    );
  }

  if (!song || song.error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          title="Close"
          style={CLOSE_BUTTON_STYLE}
        >
          ×
        </button>
        <p style={{ color: "#555", fontSize: "14px" }}>song not found.</p>
      </div>
    );
  }

  const cover = images.find((i) => i.type === "cover") || images[0];
  const hasSections = sections.some(
    (s) => s.lyrics && s.lyrics.trim().length > 0,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#f0ede8",
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <button
        onClick={handleClose}
        aria-label="Close"
        title="Close"
        style={CLOSE_BUTTON_STYLE}
      >
        ×
      </button>

      <div
        style={{
          position: "fixed",
          top: "1rem",
          left: "50%",
          transform: `translateX(-50%) translateY(${copied ? "0" : "-80px"})`,
          background: "#c9a84c",
          color: "#0a0a0a",
          padding: "0.5rem 1.25rem",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: 600,
          transition: "transform 0.25s ease",
          zIndex: 100,
          whiteSpace: "nowrap",
        }}
      >
        link copied ✓
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 0 4rem" }}>
        <div
          style={{
            width: "100%",
            aspectRatio: "1",
            background: "#111",
            overflow: "hidden",
          }}
        >
          {cover ? (
            <img
              src={
                cover.url.startsWith("http")
                  ? cover.url
                  : `${MEDIA_URL}${cover.url}`
              }
              alt={song.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "5rem",
              }}
            >
              🎵
            </div>
          )}
        </div>

        <div style={{ padding: "1.5rem 1.25rem 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "0.25rem",
            }}
          >
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                margin: 0,
                letterSpacing: "-0.02em",
                color: "#f0ede8",
                flex: 1,
                marginRight: "1rem",
              }}
            >
              {song.title}
            </h1>
            <button
              onClick={handleShare}
              style={{
                flexShrink: 0,
                background: "none",
                border: "1px solid #2e2c2a",
                borderRadius: "999px",
                color: "#7a7a88",
                fontSize: "12px",
                padding: "0.35rem 0.875rem",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              share
            </button>
          </div>

          <p style={{ fontSize: "14px", color: "#7a7a88", margin: "0 0 1rem" }}>
            {song.artist_name || "—"}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
              marginBottom: "1.25rem",
            }}
          >
            {song.genre_title && <Chip>{song.genre_title}</Chip>}
            {song.key && <Chip>{song.key}</Chip>}
            {song.tempo && <Chip>{song.tempo} bpm</Chip>}
            {song.time_signature && <Chip>{song.time_signature}</Chip>}
            {moods.map((m) => (
              <Chip key={m.id} mood>
                {m.label}
              </Chip>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: "0 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {audio.length === 0 && (
            <div
              style={{
                background: "#111",
                borderRadius: "12px",
                padding: "1.5rem",
                textAlign: "center",
                border: "1px solid #1e1e1e",
              }}
            >
              <p style={{ color: "#3d3d44", fontSize: "13px", margin: 0 }}>
                no audio uploaded yet
              </p>
            </div>
          )}

          {audio.map((a) => (
            <div
              key={a.id}
              style={{
                background: "#111",
                borderRadius: "12px",
                padding: "1rem",
                border: "1px solid #1e1e1e",
              }}
            >
              {a.version && (
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#c9a84c",
                    margin: "0 0 0.5rem",
                  }}
                >
                  {a.version}
                </p>
              )}
              <audio
                controls
                src={a.url.startsWith("http") ? a.url : `${MEDIA_URL}${a.url}`}
                style={{ width: "100%", height: "40px" }}
              />
            </div>
          ))}
        </div>

        {links.length > 0 && (
          <div
            style={{
              padding: "1.25rem 1.25rem 0",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {links.map((l) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "999px",
                  background: "#111",
                  border: "1px solid #1e1e1e",
                  color: "#f0ede8",
                  fontSize: "13px",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                {LINK_ICONS[l.type] || "🔗"} {l.type}
              </a>
            ))}
          </div>
        )}

        {hasSections && (
          <div style={{ padding: "1.5rem 1.25rem 0" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#3d3d44",
                margin: "0 0 0.75rem",
              }}
            >
              lyrics
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {sections
                .filter((s) => s.lyrics && s.lyrics.trim())
                .map((sec) => (
                  <div
                    key={sec.id}
                    style={{
                      background: "#111",
                      borderRadius: "10px",
                      border: "1px solid #1e1e1e",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => toggleLyrics(sec.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.875rem 1rem",
                        background: "none",
                        border: "none",
                        color: "#c9a84c",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {sec.label}
                      <span
                        style={{
                          color: "#3d3d44",
                          fontSize: "16px",
                          lineHeight: 1,
                        }}
                      >
                        {lyricsOpen[sec.id] ? "−" : "+"}
                      </span>
                    </button>

                    {lyricsOpen[sec.id] && (
                      <div
                        style={{
                          padding: "0 1rem 1rem",
                          color: "#7a7a88",
                          fontSize: "14px",
                          lineHeight: 1.8,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {sec.lyrics}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        <div style={{ padding: "2rem 1.25rem 0", textAlign: "center" }}>
          <p
            style={{
              fontSize: "11px",
              color: "#2e2c2a",
              letterSpacing: "0.06em",
            }}
          >
            banger
          </p>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, mood }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2rem 0.6rem",
        borderRadius: "999px",
        fontSize: "11px",
        background: mood ? "rgba(160,100,200,0.08)" : "rgba(201,168,76,0.07)",
        border: `1px solid ${
          mood ? "rgba(160,100,200,0.2)" : "rgba(201,168,76,0.2)"
        }`,
        color: mood ? "#b48fd4" : "#c9a84c",
      }}
    >
      {children}
    </span>
  );
}
