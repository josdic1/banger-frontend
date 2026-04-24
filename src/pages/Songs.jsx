import { useEffect, useState } from "react";
import {
  getSongs,
  createSong,
  updateSong,
  getArtists,
  getGenres,
  createGenre,
  getMoods,
  createMood,
  getSongGenres,
  addSongGenre,
  removeSongGenre,
  getSongMoods,
  addSongMood,
  removeSongMood,
  getList,
  getSongLinks,
  MEDIA_URL,
} from "../api";
import { Plus, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Songs() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [keys, setKeys] = useState([]);
  const [timeSigs, setTimeSigs] = useState([]);
  const [drawer, setDrawer] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({});
  const [songGenres, setSongGenres] = useState([]);
  const [songMoods, setSongMoods] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [quickMoods, setQuickMoods] = useState([]);
  const [quickGenres, setQuickGenres] = useState([]);

  useEffect(() => {
    getSongs().then(setSongs);
    getArtists().then(setArtists);
    getGenres().then(setGenres);
    getMoods().then(setMoods);
    getList("status").then((r) => setStatuses(r.map((x) => x.value)));
    getList("key").then((r) => setKeys(r.map((x) => x.value)));
    getList("time_signature").then((r) => setTimeSigs(r.map((x) => x.value)));
  }, []);

  async function openQuickLook(song) {
    setDrawer(song);
    const [links, m, g] = await Promise.all([
      getSongLinks(song.id),
      getSongMoods(song.id),
      getSongGenres(song.id),
    ]);
    setQuickLinks(links);
    setQuickMoods(m);
    setQuickGenres(g);
  }

  function openCreate() {
    setForm({ status: "draft", time_signature: "4/4" });
    setSongGenres([]);
    setSongMoods([]);
    setCreating(true);
    setDrawer("new");
  }

  function closeDrawer() {
    setDrawer(null);
    setCreating(false);
    setForm({});
    setSongGenres([]);
    setSongMoods([]);
    setQuickLinks([]);
    setQuickMoods([]);
    setQuickGenres([]);
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    const created = await createSong(form);
    const artist = artists.find((a) => a.id === parseInt(form.artist_id));
    const genre = genres.find((g) => g.id === parseInt(form.genre_id));
    await Promise.all([
      ...songGenres.map((g) => addSongGenre(created.id, g.id)),
      ...songMoods.map((m) => addSongMood(created.id, m.id)),
    ]);
    setSongs((s) => [
      { ...created, artist_name: artist?.name, genre_title: genre?.title },
      ...s,
    ]);
    closeDrawer();
  }

  async function handleAddGenre(genreId, genreObj) {
    if (!genreId || parseInt(genreId) === parseInt(form.genre_id)) return;
    if (songGenres.find((g) => g.id === parseInt(genreId))) return;
    const genre = genreObj || genres.find((g) => g.id === parseInt(genreId));
    if (!genre) return;
    setSongGenres((sg) => [...sg, genre]);
  }

  async function handleNewGenre() {
    const title = prompt("New genre name:");
    if (!title) return;
    const created = await createGenre({ title });
    setGenres((g) => [...g, created]);
    handleAddGenre(created.id, created);
  }

  async function handleAddMood(moodId, moodObj) {
    if (!moodId || songMoods.find((m) => m.id === parseInt(moodId))) return;
    const mood = moodObj || moods.find((m) => m.id === parseInt(moodId));
    if (!mood) return;
    setSongMoods((sm) => [...sm, mood]);
  }

  async function handleNewMood() {
    const label = prompt("New mood:");
    if (!label) return;
    const created = await createMood({ label });
    setMoods((m) => [...m, created]);
    handleAddMood(created.id, created);
  }

  const isOpen = drawer !== null;
  const isQuickLook = isOpen && !creating;

  return (
    <div className="app-main">
      <div className="page-header">
        <h1 className="page-title">Songs</h1>
      </div>

      {songs.length === 0 && (
        <p className="empty">No songs yet. Hit + to add one.</p>
      )}

      <div className="song-grid">
        {songs.map((s) => (
          <div key={s.id} className="card" onClick={() => openQuickLook(s)}>
            <div className="card-cover">
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
              ) : s.spotify_url ? (
                <a
                  href={s.spotify_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>🟢</span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--zinc-500)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    spotify
                  </span>
                </a>
              ) : (
                "🎵"
              )}
            </div>
            <div className="card-title">{s.title}</div>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                const updated = await updateSong(s.id, { starred: !s.starred });
                setSongs((prev) =>
                  prev.map((x) =>
                    x.id === s.id ? { ...x, starred: updated.starred } : x,
                  ),
                );
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                padding: 0,
                lineHeight: 1,
                color: s.starred ? "#c9a84c" : "var(--zinc-300)",
              }}
            >
              {s.starred ? "★" : "☆"}
            </button>
            <div className="card-sub">{s.artist_name || "—"}</div>
            <div className="card-meta">
              <span className={`badge badge-${s.status}`}>{s.status}</span>
            </div>
            <div
              className="card-meta"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              {parseInt(s.section_count) === 0 ? (
                <span style={{ color: "var(--zinc-400)" }}>no sections</span>
              ) : parseInt(s.blank_section_count) > 0 ? (
                <>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#c9a84c",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span>
                    {s.section_count} sections · {s.blank_section_count} blank
                  </span>
                </>
              ) : (
                <>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#27ae60",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span>{s.section_count} sections</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="btn-fab" onClick={openCreate}>
        <Plus size={22} color="#0c0c0d" />
      </button>

      {isOpen && <div className="overlay" onClick={closeDrawer} />}

      <div
        className="drawer"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* QUICK LOOK */}
        {isQuickLook && drawer && (
          <>
            <div className="drawer-header">
              <h2 className="drawer-title">{drawer.title}</h2>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <button
                  onClick={() => window.open(`/listen/${drawer.id}`, "_blank")}
                  className="btn-ghost btn-ghost--small"
                  title="open listen page"
                >
                  listen ↗
                </button>
                <button
                  className="btn-primary btn"
                  onClick={() => {
                    closeDrawer();
                    navigate(`/songs/${drawer.id}`);
                  }}
                >
                  edit <ArrowRight size={13} />
                </button>
                <button className="btn-icon" onClick={closeDrawer}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="meta-table">
              {drawer.artist_name && (
                <div className="meta-row">
                  <span className="meta-label">artist</span>
                  <span className="meta-value">{drawer.artist_name}</span>
                </div>
              )}
              {drawer.status && (
                <div className="meta-row">
                  <span className="meta-label">status</span>
                  <span className="meta-value">
                    <span className={`badge badge-${drawer.status}`}>
                      {drawer.status}
                    </span>
                  </span>
                </div>
              )}
              {drawer.genre_title && (
                <div className="meta-row">
                  <span className="meta-label">genre</span>
                  <span className="meta-value">{drawer.genre_title}</span>
                </div>
              )}
              {drawer.key && (
                <div className="meta-row">
                  <span className="meta-label">key</span>
                  <span className="meta-value">{drawer.key}</span>
                </div>
              )}
              {drawer.tempo && (
                <div className="meta-row">
                  <span className="meta-label">tempo</span>
                  <span className="meta-value">{drawer.tempo} bpm</span>
                </div>
              )}
              {drawer.time_signature && (
                <div className="meta-row">
                  <span className="meta-label">time sig</span>
                  <span className="meta-value">{drawer.time_signature}</span>
                </div>
              )}
            </div>

            {quickGenres.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <div
                  className="section-title"
                  style={{ marginBottom: "0.5rem" }}
                >
                  secondary genres
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}
                >
                  {quickGenres.map((g) => (
                    <span key={g.id} className="pill pill-genre">
                      {g.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {quickMoods.length > 0 && (
              <div style={{ marginTop: "0.75rem" }}>
                <div
                  className="section-title"
                  style={{ marginBottom: "0.5rem" }}
                >
                  moods
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}
                >
                  {quickMoods.map((m) => (
                    <span key={m.id} className="pill pill-mood">
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {drawer.prompt && (
              <div style={{ marginTop: "0.75rem" }}>
                <div
                  className="section-title"
                  style={{ marginBottom: "0.35rem" }}
                >
                  suno prompt
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--zinc-600)",
                    cursor: "pointer",
                    lineHeight: 1.6,
                  }}
                  onClick={() => navigator.clipboard.writeText(drawer.prompt)}
                  title="click to copy"
                >
                  {drawer.prompt} 📋
                </p>
              </div>
            )}

            {drawer.notes && (
              <div style={{ marginTop: "0.75rem" }}>
                <div
                  className="section-title"
                  style={{ marginBottom: "0.35rem" }}
                >
                  notes
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--zinc-600)",
                    lineHeight: 1.6,
                  }}
                >
                  {drawer.notes}
                </p>
              </div>
            )}

            {quickLinks.length > 0 && (
              <div style={{ marginTop: "0.75rem" }}>
                <div
                  className="section-title"
                  style={{ marginBottom: "0.5rem" }}
                >
                  links
                </div>
                {quickLinks.map((l) => (
                  <div key={l.id} className="link-item">
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="link-label"
                    >
                      {l.type}
                    </a>
                    <button
                      className="btn-icon"
                      onClick={() => navigator.clipboard.writeText(l.url)}
                    >
                      📋
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CREATE FORM */}
        {creating && (
          <>
            <div className="drawer-header">
              <h2 className="drawer-title">new song</h2>
              <button className="btn-icon" onClick={closeDrawer}>
                <X size={18} />
              </button>
            </div>

            <div className="form-stack">
              <label>
                <span>title</span>
                <input
                  name="title"
                  value={form.title || ""}
                  onChange={handleChange}
                  className="bng-input"
                  placeholder="song title"
                />
              </label>
              <label>
                <span>artist</span>
                <select
                  name="artist_id"
                  value={form.artist_id || ""}
                  onChange={handleChange}
                  className="bng-select"
                >
                  <option value="">— select artist —</option>
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>primary genre</span>
                <select
                  name="genre_id"
                  value={form.genre_id || ""}
                  onChange={handleChange}
                  className="bng-select"
                >
                  <option value="">— select genre —</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <span className="field-label">secondary genres</span>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.35rem",
                    margin: "0.4rem 0",
                  }}
                >
                  {songGenres.map((g) => (
                    <span key={g.id} className="pill pill-genre">
                      {g.title}
                      <button
                        className="pill-btn"
                        onClick={() =>
                          setSongGenres((sg) => sg.filter((x) => x.id !== g.id))
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select
                    onChange={(e) => handleAddGenre(e.target.value)}
                    value=""
                    className="bng-select"
                    style={{ flex: 1 }}
                  >
                    <option value="">+ add genre</option>
                    {genres
                      .filter(
                        (g) =>
                          g &&
                          !songGenres.find((sg) => sg.id === g.id) &&
                          g.id !== parseInt(form.genre_id),
                      )
                      .map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.title}
                        </option>
                      ))}
                  </select>
                  <button className="btn-ghost" onClick={handleNewGenre}>
                    new
                  </button>
                </div>
              </div>

              <label>
                <span>status</span>
                <select
                  name="status"
                  value={form.status || ""}
                  onChange={handleChange}
                  className="bng-select"
                >
                  <option value="">— select status —</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-row">
                <label>
                  <span>key</span>
                  <select
                    name="key"
                    value={form.key || ""}
                    onChange={handleChange}
                    className="bng-select"
                  >
                    <option value="">—</option>
                    {keys.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>tempo</span>
                  <input
                    name="tempo"
                    type="number"
                    value={form.tempo || ""}
                    onChange={handleChange}
                    className="bng-input"
                    placeholder="120"
                  />
                </label>
                <label>
                  <span>time sig</span>
                  <select
                    name="time_signature"
                    value={form.time_signature || ""}
                    onChange={handleChange}
                    className="bng-select"
                  >
                    <option value="">—</option>
                    {timeSigs.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <span className="field-label">moods</span>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.35rem",
                    margin: "0.4rem 0",
                  }}
                >
                  {songMoods.map((m) => (
                    <span key={m.id} className="pill pill-mood">
                      {m.label}
                      <button
                        className="pill-btn"
                        onClick={() =>
                          setSongMoods((sm) => sm.filter((x) => x.id !== m.id))
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select
                    onChange={(e) => handleAddMood(e.target.value)}
                    value=""
                    className="bng-select"
                    style={{ flex: 1 }}
                  >
                    <option value="">+ add mood</option>
                    {moods
                      .filter(
                        (m) => m && !songMoods.find((sm) => sm.id === m.id),
                      )
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                  </select>
                  <button className="btn-ghost" onClick={handleNewMood}>
                    new
                  </button>
                </div>
              </div>

              <label>
                <span>suno prompt</span>
                <textarea
                  name="prompt"
                  value={form.prompt || ""}
                  onChange={handleChange}
                  className="bng-textarea"
                  placeholder="suno generation prompt..."
                />
              </label>
              <label>
                <span>notes</span>
                <textarea
                  name="notes"
                  value={form.notes || ""}
                  onChange={handleChange}
                  className="bng-textarea"
                  placeholder="any notes..."
                />
              </label>

              <button
                className="btn-primary btn"
                onClick={handleSubmit}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                create song
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
