import { useEffect, useState } from "react";
import {
  getAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getArtists,
  getSongs,
  addSongToAlbum,
  removeSongFromAlbum,
  getAlbum,
} from "../api";
import { Plus, X } from "lucide-react";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [albumSongs, setAlbumSongs] = useState([]);

  useEffect(() => {
    getAlbums().then(setAlbums);
    getArtists().then(setArtists);
    getSongs().then(setAllSongs);
  }, []);

  function openNew() {
    setForm({});
    setAlbumSongs([]);
    setDrawer("new");
  }

  async function openEdit(album) {
    setForm({ ...album });
    setDrawer(album);
    const fresh = await getAlbum(album.id);
    setAlbumSongs(fresh.songs || []);
  }

  function closeDrawer() {
    setDrawer(null);
    setForm({});
    setAlbumSongs([]);
  }

  async function handleSubmit() {
    if (drawer === "new") {
      const created = await createAlbum(form);
      await Promise.all(
        albumSongs.map((s) => addSongToAlbum(created.id, { song_id: s.id })),
      );
      setAlbums((a) => [{ ...created, song_count: albumSongs.length }, ...a]);
    } else {
      const updated = await updateAlbum(drawer.id, form);
      setAlbums((a) =>
        a.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)),
      );
    }
    closeDrawer();
  }

  async function handleDelete() {
    if (!confirm(`Delete "${drawer.title}"?`)) return;
    await deleteAlbum(drawer.id);
    setAlbums((a) => a.filter((x) => x.id !== drawer.id));
    closeDrawer();
  }

  async function handleAddSong(songId) {
    if (!songId) return;
    if (drawer === "new") {
      const song = allSongs.find((s) => s.id === parseInt(songId));
      if (song && !albumSongs.find((s) => s.id === song.id))
        setAlbumSongs((p) => [...p, song]);
    } else {
      if (albumSongs.find((s) => s.id === parseInt(songId))) return;
      await addSongToAlbum(drawer.id, { song_id: songId });
      const song = allSongs.find((s) => s.id === parseInt(songId));
      setAlbumSongs((p) => [...p, song]);
    }
  }

  async function handleRemoveSong(song) {
    if (drawer !== "new") await removeSongFromAlbum(drawer.id, song.id);
    setAlbumSongs((p) => p.filter((s) => s.id !== song.id));
  }

  const isOpen = drawer !== null;
  const isNew = drawer === "new";

  return (
    <div className="app-main">
      <div className="page-header">
        <h1 className="page-title">Albums</h1>
      </div>

      {albums.length === 0 && (
        <p className="empty">No albums yet. Hit + to add one.</p>
      )}

      <div className="song-grid">
        {albums.map((a) => (
          <div key={a.id} className="card" onClick={() => openEdit(a)}>
            <div className="card-cover">💿</div>
            <div className="card-title">{a.title}</div>
            <div className="card-sub">
              {artists.find((ar) => ar.id === a.artist_id)?.name || "—"}
            </div>
            <div className="card-meta">
              {a.song_count || 0} songs
              {a.release_date ? ` · ${a.release_date.slice(0, 4)}` : ""}
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
          <h2 className="drawer-title">{isNew ? "new album" : form.title}</h2>
          <button className="btn-icon" onClick={closeDrawer}>
            <X size={18} />
          </button>
        </div>

        <div className="form-stack">
          <label>
            <span>title</span>
            <input
              value={form.title || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="bng-input"
              placeholder="album title"
            />
          </label>
          <label>
            <span>artist</span>
            <select
              value={form.artist_id || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, artist_id: e.target.value }))
              }
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
            <span>type</span>
            <select
              value={form.type || ""}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="bng-select"
            >
              <option value="">—</option>
              <option value="album">album</option>
              <option value="ep">ep</option>
              <option value="single">single</option>
              <option value="compilation">compilation</option>
            </select>
          </label>
          <label>
            <span>release date</span>
            <input
              type="date"
              value={form.release_date ? form.release_date.slice(0, 10) : ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, release_date: e.target.value }))
              }
              className="bng-input"
            />
          </label>

          {/* SONGS */}
          <div>
            <span className="field-label">songs</span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                margin: "0.4rem 0",
              }}
            >
              {albumSongs.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                    padding: "0.3rem 0",
                    borderBottom: "1px solid var(--zinc-100)",
                  }}
                >
                  <span style={{ color: "var(--zinc-800)" }}>{s.title}</span>
                  <button
                    className="btn-icon"
                    onClick={() => handleRemoveSong(s)}
                  >
                    ×
                  </button>
                </div>
              ))}
              {albumSongs.length === 0 && (
                <p className="empty">no songs added</p>
              )}
            </div>
            <select
              onChange={(e) => {
                handleAddSong(e.target.value);
                e.target.value = "";
              }}
              defaultValue=""
              className="bng-select"
            >
              <option value="">+ add song</option>
              {allSongs
                .filter((s) => !albumSongs.find((as) => as.id === s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            {isNew ? "create album" : "save changes"}
          </button>

          {!isNew && (
            <button
              onClick={handleDelete}
              className="btn-danger"
              style={{ width: "100%" }}
            >
              delete album
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
