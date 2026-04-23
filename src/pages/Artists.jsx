import { useEffect, useState } from "react";
import {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  getSongs,
} from "../api";
import { Plus, X } from "lucide-react";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [drawer, setDrawer] = useState(null); // null | 'new' | artist obj
  const [form, setForm] = useState({});
  const [artistSongs, setArtistSongs] = useState([]);

  useEffect(() => {
    getArtists().then(setArtists);
  }, []);

  function openNew() {
    setForm({});
    setDrawer("new");
  }

  async function openEdit(artist) {
    setForm({ ...artist });
    setDrawer(artist);
    const all = await getSongs();
    setArtistSongs(all.filter((s) => s.artist_id === artist.id));
  }

  function closeDrawer() {
    setDrawer(null);
    setForm({});
    setArtistSongs([]);
  }

  async function handleSubmit() {
    if (drawer === "new") {
      const created = await createArtist(form);
      setArtists((a) => [created, ...a]);
    } else {
      const updated = await updateArtist(drawer.id, form);
      setArtists((a) => a.map((x) => (x.id === updated.id ? updated : x)));
    }
    closeDrawer();
  }

  async function handleDelete() {
    if (!confirm(`Delete ${drawer.name}?`)) return;
    try {
      await deleteArtist(drawer.id);
      setArtists((a) => a.filter((x) => x.id !== drawer.id));
      closeDrawer();
    } catch {
      alert("Can't delete — artist has songs.");
    }
  }

  const isOpen = drawer !== null;
  const isNew = drawer === "new";

  return (
    <div className="app-main">
      <div className="page-header">
        <h1 className="page-title">Artists</h1>
      </div>

      {artists.length === 0 && (
        <p className="empty">No artists yet. Hit + to add one.</p>
      )}

      <div className="list-rows">
        {artists.map((a) => (
          <div
            key={a.id}
            className="list-row"
            onClick={() => openEdit(a)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "var(--zinc-900)",
                }}
              >
                {a.name}
              </div>
              {a.bio && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--zinc-500)",
                    marginTop: "0.2rem",
                    maxWidth: "480px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.bio}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="btn-fab" onClick={openNew}>
        <Plus size={20} color="#0c0c0d" />
      </button>

      {isOpen && <div className="overlay" onClick={closeDrawer} />}

      <div
        className="drawer"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="drawer-header">
          <h2 className="drawer-title">{isNew ? "new artist" : form.name}</h2>
          <button className="btn-icon" onClick={closeDrawer}>
            <X size={18} />
          </button>
        </div>

        <div className="form-stack">
          <label>
            <span>name</span>
            <input
              value={form.name || ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bng-input"
              placeholder="artist name"
            />
          </label>
          <label>
            <span>bio</span>
            <textarea
              value={form.bio || ""}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="bng-textarea"
              placeholder="short bio..."
            />
          </label>

          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            {isNew ? "create artist" : "save changes"}
          </button>

          {!isNew && (
            <button
              onClick={handleDelete}
              className="btn-danger"
              style={{ width: "100%" }}
            >
              delete artist
            </button>
          )}
        </div>

        {!isNew && artistSongs.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <hr className="divider" />
            <h3 style={{ marginBottom: "0.75rem" }}>songs</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
              }}
            >
              {artistSongs.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    padding: "0.35rem 0",
                    borderBottom: "1px solid var(--zinc-100)",
                  }}
                >
                  <span style={{ color: "var(--zinc-800)" }}>{s.title}</span>
                  <span className={`badge badge-${s.status}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
