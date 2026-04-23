import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSong,
  getSongLinks,
  addSongLink,
  deleteSongLink,
  getSongAudio,
  uploadAudio,
  deleteAudio,
  getList,
  addToList,
  getArtists,
  getGenres,
  updateSong,
  deleteSong,
  getSongAlbums,
  getAlbums,
  addSongToAlbum,
  removeSongFromAlbum,
  getSongImages,
  uploadSongImage,
  deleteSongImage,
  getSongGenres,
  addSongGenre,
  removeSongGenre,
  getSongMoods,
  addSongMood,
  removeSongMood,
  getMoods,
  MEDIA_URL,
} from "../api";
import { ArrowLeft, Plus } from "lucide-react";

const LINK_ICONS = {
  spotify: "🟢",
  youtube: "🔴",
  soundcloud: "🟠",
  suno: "⚡",
  apple_music: "🎵",
  tiktok: "⬛",
  other: "🔗",
};

const TABS = ["sections", "audio", "assets", "arrangement"];

export default function SongDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [sections, setSections] = useState([]);
  const [links, setLinks] = useState([]);
  const [audio, setAudio] = useState([]);
  const [images, setImages] = useState([]);
  const [songAlbums, setSongAlbums] = useState([]);
  const [songGenres, setSongGenres] = useState([]);
  const [songMoods, setSongMoods] = useState([]);
  const [tab, setTab] = useState("sections");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [allMoods, setAllMoods] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [keys, setKeys] = useState([]);
  const [timeSigs, setTimeSigs] = useState([]);
  const [linkTypes, setLinkTypes] = useState([]);
  const [audioVersions, setAudioVersions] = useState([]);
  const [sectionTypes, setSectionTypes] = useState([]);
  const [imageTypes, setImageTypes] = useState([]);

  useEffect(() => {
    getSong(id).then((data) => {
      setSong(data);
      setSections(data.sections || []);
      setLoading(false);
    });
    getSongLinks(id).then(setLinks);
    getSongAudio(id).then(setAudio);
    getSongAlbums(id).then(setSongAlbums);
    getSongImages(id).then(setImages);
    getSongGenres(id).then(setSongGenres);
    getSongMoods(id).then(setSongMoods);
    getArtists().then(setArtists);
    getGenres().then(setGenres);
    getMoods().then(setAllMoods);
    getAlbums().then(setAllAlbums);
    getList("status").then((r) => setStatuses(r.map((x) => x.value)));
    getList("key").then((r) => setKeys(r.map((x) => x.value)));
    getList("time_signature").then((r) => setTimeSigs(r.map((x) => x.value)));
    getList("link_type").then((r) => setLinkTypes(r.map((x) => x.value)));
    getList("audio_version").then((r) =>
      setAudioVersions(r.map((x) => x.value)),
    );
    getList("section_type").then((r) => setSectionTypes(r.map((x) => x.value)));
    getList("image_type").then((r) => setImageTypes(r.map((x) => x.value)));
  }, [id]);

  async function handleSave() {
    const updated = await updateSong(id, editForm);
    setSong((prev) => ({ ...prev, ...updated }));
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this song?")) return;
    await deleteSong(id);
    navigate("/songs");
  }

  if (loading)
    return (
      <div className="app-main" style={{ color: "var(--zinc-500)" }}>
        loading...
      </div>
    );

  const arrangement = sections
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .map((sec) => `[${sec.label}]\n${sec.lyrics || ""}`)
    .join("\n\n");

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 56px)",
        overflow: "hidden",
        background: "var(--bg-canvas)",
      }}
    >
      <div
        style={{
          width: "240px",
          borderRight: "1px solid var(--zinc-100)",
          padding: "1.25rem",
          overflowY: "auto",
          flexShrink: 0,
          background: "var(--bg-surface)",
        }}
      >
        <button
          onClick={() => navigate("/songs")}
          className="btn-icon"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "1.5rem",
            fontSize: "13px",
            color: "var(--zinc-500)",
          }}
        >
          <ArrowLeft size={14} /> back
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.2rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--zinc-900)",
            }}
          >
            {song.title}
          </h2>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              onClick={() => window.open(`/listen/${song.id ?? id}`, "_blank")}
              className="btn-ghost btn-ghost--small"
              title="open listen page"
            >
              listen ↗
            </button>
            <button
              onClick={() => {
                setEditing((e) => !e);
                setEditForm({ ...song });
              }}
              className="btn-ghost btn-ghost--small"
            >
              {editing ? "cancel" : "edit"}
            </button>
          </div>
        </div>

        <p
          style={{
            color: "var(--zinc-500)",
            fontSize: "12px",
            margin: "0 0 1.25rem",
          }}
        >
          {song.artist_name || "—"}
        </p>

        {editing ? (
          <div className="form-stack">
            <label>
              <span>title</span>
              <input
                value={editForm.title || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, title: e.target.value }))
                }
                className="bng-input"
              />
            </label>

            <label>
              <span>artist</span>
              <select
                value={editForm.artist_id || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, artist_id: e.target.value }))
                }
                className="bng-select"
              >
                <option value="">—</option>
                {artists.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>status</span>
              <select
                value={editForm.status || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, status: e.target.value }))
                }
                className="bng-select"
              >
                <option value="">—</option>
                {statuses.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>key</span>
              <select
                value={editForm.key || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, key: e.target.value }))
                }
                className="bng-select"
              >
                <option value="">—</option>
                {keys.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>tempo</span>
              <input
                type="number"
                value={editForm.tempo || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, tempo: e.target.value }))
                }
                className="bng-input"
                placeholder="120"
              />
            </label>

            <label>
              <span>time sig</span>
              <select
                value={editForm.time_signature || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, time_signature: e.target.value }))
                }
                className="bng-select"
              >
                <option value="">—</option>
                {timeSigs.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>suno prompt</span>
              <textarea
                value={editForm.prompt || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, prompt: e.target.value }))
                }
                className="bng-textarea"
                style={{ minHeight: "70px" }}
              />
            </label>

            <label>
              <span>notes</span>
              <textarea
                value={editForm.notes || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, notes: e.target.value }))
                }
                className="bng-textarea"
                style={{ minHeight: "55px" }}
              />
            </label>

            <button
              onClick={handleSave}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              save
            </button>

            <button
              onClick={handleDelete}
              className="btn-danger"
              style={{ width: "100%" }}
            >
              delete song
            </button>
          </div>
        ) : (
          <div>
            <div className="meta-table">
              {song.status && (
                <div className="meta-row">
                  <span className="meta-label">status</span>
                  <span className="meta-value">
                    <span className={`badge badge-${song.status}`}>
                      {song.status}
                    </span>
                  </span>
                </div>
              )}

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

            <div style={{ marginTop: "1rem" }}>
              <div className="section-title" style={{ marginBottom: "0.4rem" }}>
                secondary genres
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.3rem",
                  marginBottom: "0.4rem",
                }}
              >
                {songGenres.map((g) => (
                  <span key={g.id} className="pill pill-genre">
                    {g.title}
                    <button
                      className="pill-btn"
                      onClick={async () => {
                        await removeSongGenre(id, g.id);
                        setSongGenres((p) => p.filter((x) => x.id !== g.id));
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <select
                onChange={async (e) => {
                  const gid = e.target.value;
                  if (!gid || parseInt(gid) === parseInt(song.genre_id)) return;
                  if (songGenres.find((g) => g.id === parseInt(gid))) return;
                  await addSongGenre(id, gid);
                  setSongGenres((p) => [
                    ...p,
                    genres.find((g) => g.id === parseInt(gid)),
                  ]);
                  e.target.value = "";
                }}
                defaultValue=""
                className="bng-select"
                style={{ fontSize: "12px" }}
              >
                <option value="">+ add genre</option>
                {genres
                  .filter(
                    (g) =>
                      !songGenres.find((sg) => sg.id === g.id) &&
                      g.id !== parseInt(song.genre_id),
                  )
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              <div className="section-title" style={{ marginBottom: "0.4rem" }}>
                moods
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.3rem",
                  marginBottom: "0.4rem",
                }}
              >
                {songMoods.map((m) => (
                  <span key={m.id} className="pill pill-mood">
                    {m.label}
                    <button
                      className="pill-btn"
                      onClick={async () => {
                        await removeSongMood(id, m.id);
                        setSongMoods((p) => p.filter((x) => x.id !== m.id));
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <select
                onChange={async (e) => {
                  const mid = e.target.value;
                  if (!mid || songMoods.find((m) => m.id === parseInt(mid)))
                    return;
                  await addSongMood(id, mid);
                  setSongMoods((p) => [
                    ...p,
                    allMoods.find((m) => m.id === parseInt(mid)),
                  ]);
                  e.target.value = "";
                }}
                defaultValue=""
                className="bng-select"
                style={{ fontSize: "12px" }}
              >
                <option value="">+ add mood</option>
                {allMoods
                  .filter((m) => !songMoods.find((sm) => sm.id === m.id))
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
              </select>
            </div>

            {song.prompt && (
              <div style={{ marginTop: "0.75rem" }}>
                <div
                  className="section-title"
                  style={{ marginBottom: "0.3rem" }}
                >
                  suno prompt
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--zinc-600)",
                    cursor: "pointer",
                    lineHeight: 1.6,
                  }}
                  onClick={() => navigator.clipboard.writeText(song.prompt)}
                  title="click to copy"
                >
                  {song.prompt} 📋
                </p>
              </div>
            )}

            {song.notes && (
              <div style={{ marginTop: "0.75rem" }}>
                <div
                  className="section-title"
                  style={{ marginBottom: "0.3rem" }}
                >
                  notes
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--zinc-600)",
                    lineHeight: 1.6,
                  }}
                >
                  {song.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <div className="tab-bar">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tab-btn${tab === t ? " active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {tab === "sections" && (
            <SectionsTab
              sections={sections}
              setSections={setSections}
              songId={id}
              sectionTypes={sectionTypes}
            />
          )}

          {tab === "audio" && (
            <AudioTab
              audio={audio}
              setAudio={setAudio}
              songId={id}
              audioVersions={audioVersions}
              setAudioVersions={setAudioVersions}
            />
          )}

          {tab === "assets" && (
            <AssetsTab
              songId={id}
              links={links}
              setLinks={setLinks}
              linkTypes={linkTypes}
              setLinkTypes={setLinkTypes}
              images={images}
              setImages={setImages}
              imageTypes={imageTypes}
              setImageTypes={setImageTypes}
              songAlbums={songAlbums}
              setSongAlbums={setSongAlbums}
              allAlbums={allAlbums}
            />
          )}

          {tab === "arrangement" && (
            <ArrangementTab sections={sections} arrangement={arrangement} />
          )}
        </div>
      </div>
    </div>
  );
}

function SectionsTab({ sections, setSections, songId, sectionTypes }) {
  const [open, setOpen] = useState(false);

  async function addSection(type) {
    const count = sections.filter((sec) => sec.type === type).length + 1;
    const label = count > 1 ? `${type} ${count}` : type;
    const res = await fetch(`${MEDIA_URL}/api/songs/${songId}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, label, order_index: sections.length }),
    });
    const created = await res.json();
    setSections((prev) => [...prev, created]);
    setOpen(false);
  }

  return (
    <div>
      <div className="section-header">
        <span />
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="btn btn-primary"
          >
            <Plus size={13} /> add section
          </button>
          {open && (
            <div className="dropdown-menu">
              {sectionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="dropdown-item"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {sections.length === 0 && <p className="empty">no sections yet.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {sections
          .slice()
          .sort((a, b) => a.order_index - b.order_index)
          .map((sec) => (
            <SectionCard key={sec.id} section={sec} setSections={setSections} />
          ))}
      </div>
    </div>
  );
}

function SectionCard({ section, setSections }) {
  const [lyrics, setLyrics] = useState(section.lyrics || "");

  async function save() {
    await fetch(
      `${MEDIA_URL}/api/songs/${section.song_id}/sections/${section.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics }),
      },
    );
    setSections((prev) =>
      prev.map((x) => (x.id === section.id ? { ...x, lyrics } : x)),
    );
  }

  async function remove() {
    await fetch(
      `${MEDIA_URL}/api/songs/${section.song_id}/sections/${section.id}`,
      { method: "DELETE" },
    );
    setSections((prev) => prev.filter((x) => x.id !== section.id));
  }

  return (
    <div className="section-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.4rem",
        }}
      >
        <span className="section-label">{section.label}</span>
        <button onClick={remove} className="btn-icon">
          ×
        </button>
      </div>
      <textarea
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        onBlur={save}
        placeholder="lyrics..."
        className="section-textarea"
      />
    </div>
  );
}

function AudioTab({
  audio,
  setAudio,
  songId,
  audioVersions,
  setAudioVersions,
}) {
  const [version, setVersion] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [addingVersion, setAddingVersion] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("version", version || "demo");
    const created = await uploadAudio(songId, fd);
    setAudio((prev) => [created, ...prev]);
    setUploading(false);
    e.target.value = "";
  }

  async function handleAddVersion() {
    if (!newVersion) return;
    const created = await addToList("audio_version", newVersion);
    setAudioVersions((prev) => [...prev, created.value]);
    setVersion(created.value);
    setNewVersion("");
    setAddingVersion(false);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <select
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="bng-select"
          style={{ width: "auto" }}
        >
          <option value="">— version —</option>
          {audioVersions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <button
          onClick={() => setAddingVersion((a) => !a)}
          className="btn-ghost btn-ghost--small"
        >
          +
        </button>

        <label className="btn btn-primary" style={{ cursor: "pointer" }}>
          {uploading ? "uploading..." : "+ upload audio"}
          <input
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {addingVersion && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            value={newVersion}
            onChange={(e) => setNewVersion(e.target.value)}
            placeholder="new version..."
            className="bng-input"
            style={{ flex: 1 }}
          />
          <button onClick={handleAddVersion} className="btn btn-primary">
            add
          </button>
        </div>
      )}

      {audio.length === 0 && <p className="empty">no audio yet.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {audio.map((a) => (
          <div
            key={a.id}
            className="panel"
            style={{ padding: "0.875rem 1rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <div>
                <span
                  style={{
                    color: "var(--accent)",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {a.version}
                </span>
                <span
                  style={{
                    color: "var(--zinc-400)",
                    fontSize: "11px",
                    marginLeft: "0.5rem",
                  }}
                >
                  {a.filename}
                </span>
              </div>

              <button
                onClick={async () => {
                  await deleteAudio(songId, a.id);
                  setAudio((p) => p.filter((x) => x.id !== a.id));
                }}
                className="btn-icon"
              >
                ×
              </button>
            </div>

            <audio
              controls
              src={a.url.startsWith("http") ? a.url : `${MEDIA_URL}${a.url}`}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AssetsTab({
  songId,
  links,
  setLinks,
  linkTypes,
  setLinkTypes,
  images,
  setImages,
  imageTypes,
  setImageTypes,
  songAlbums,
  setSongAlbums,
  allAlbums,
}) {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}
    >
      <LinksSection
        songId={songId}
        links={links}
        setLinks={setLinks}
        linkTypes={linkTypes}
        setLinkTypes={setLinkTypes}
      />
      <ImagesSection
        songId={songId}
        images={images}
        setImages={setImages}
        imageTypes={imageTypes}
        setImageTypes={setImageTypes}
      />
      <AlbumsSection
        songId={songId}
        songAlbums={songAlbums}
        setSongAlbums={setSongAlbums}
        allAlbums={allAlbums}
      />
    </div>
  );
}

function LinksSection({ songId, links, setLinks, linkTypes, setLinkTypes }) {
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState("");
  const [addingType, setAddingType] = useState(false);

  return (
    <div>
      <div className="section-header">
        <span className="section-title">links</span>
        <button
          onClick={() => setAdding((a) => !a)}
          className="btn-ghost btn-ghost--small"
        >
          + add
        </button>
      </div>

      {adding && (
        <div className="form-stack" style={{ marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bng-select"
              style={{ flex: 1 }}
            >
              <option value="">— type —</option>
              {linkTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              onClick={() => setAddingType((a) => !a)}
              className="btn-ghost btn-ghost--small"
            >
              +
            </button>
          </div>

          {addingType && (
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="new type..."
                className="bng-input"
                style={{ flex: 1 }}
              />
              <button
                onClick={async () => {
                  if (!newType) return;
                  const created = await addToList("link_type", newType);
                  setLinkTypes((p) => [...p, created.value]);
                  setType(created.value);
                  setNewType("");
                  setAddingType(false);
                }}
                className="btn btn-primary"
              >
                add
              </button>
            </div>
          )}

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="paste url..."
            className="bng-input"
          />

          <button
            onClick={async () => {
              if (!url || !type) return;
              const created = await addSongLink(songId, { url, type });
              setLinks((p) => [...p, created]);
              setUrl("");
              setAdding(false);
            }}
            className="btn btn-primary"
          >
            save
          </button>
        </div>
      )}

      {links.map((l) => (
        <div key={l.id} className="link-item">
          <span>{LINK_ICONS[l.type] || "🔗"}</span>
          <a
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="link-label"
          >
            {l.type}
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(l.url)}
            className="btn-icon"
            style={{ fontSize: "11px" }}
          >
            📋
          </button>
          <button
            onClick={async () => {
              await deleteSongLink(songId, l.id);
              setLinks((p) => p.filter((x) => x.id !== l.id));
            }}
            className="btn-icon"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function ImagesSection({
  songId,
  images,
  setImages,
  imageTypes,
  setImageTypes,
}) {
  const [type, setType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newType, setNewType] = useState("");
  const [addingType, setAddingType] = useState(false);

  return (
    <div>
      <div className="section-header">
        <span className="section-title">images</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          marginBottom: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bng-select"
          style={{ flex: 1 }}
        >
          <option value="">— label —</option>
          {imageTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button
          onClick={() => setAddingType((a) => !a)}
          className="btn-ghost btn-ghost--small"
        >
          +
        </button>

        <label className="btn btn-primary" style={{ cursor: "pointer" }}>
          {uploading ? "..." : "+ upload"}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              setUploading(true);
              const fd = new FormData();
              fd.append("file", file);
              fd.append("type", type || "cover");
              const created = await uploadSongImage(songId, fd);
              setImages((p) => [...p, created]);
              setUploading(false);
              e.target.value = "";
            }}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {addingType && (
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem" }}>
          <input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="new label..."
            className="bng-input"
            style={{ flex: 1 }}
          />
          <button
            onClick={async () => {
              if (!newType) return;
              const created = await addToList("image_type", newType);
              setImageTypes((p) => [...p, created.value]);
              setType(created.value);
              setNewType("");
              setAddingType(false);
            }}
            className="btn btn-primary"
          >
            add
          </button>
        </div>
      )}

      {images.map((img) => (
        <div key={img.id} className="link-item">
          <img
            src={
              img.url.startsWith("http") ? img.url : `${MEDIA_URL}${img.url}`
            }
            alt={img.type}
            className="img-thumb"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span style={{ flex: 1, fontSize: "13px", color: "var(--zinc-600)" }}>
            {img.type}
          </span>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                img.url.startsWith("http") ? img.url : `${MEDIA_URL}${img.url}`,
              )
            }
            className="btn-icon"
            style={{ fontSize: "11px" }}
          >
            📋
          </button>
          <button
            onClick={async () => {
              await deleteSongImage(songId, img.id);
              setImages((p) => p.filter((x) => x.id !== img.id));
            }}
            className="btn-icon"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function AlbumsSection({ songId, songAlbums, setSongAlbums, allAlbums }) {
  return (
    <div>
      <div className="section-header" style={{ marginBottom: "0.5rem" }}>
        <span className="section-title">albums</span>
      </div>

      {songAlbums.length === 0 && <p className="empty">no albums</p>}

      {songAlbums.map((a) => (
        <div key={a.id} className="link-item">
          <span style={{ flex: 1, fontSize: "13px", color: "var(--zinc-600)" }}>
            💿 {a.title}
          </span>
          <button
            onClick={async () => {
              await removeSongFromAlbum(a.id, songId);
              setSongAlbums((p) => p.filter((x) => x.id !== a.id));
            }}
            className="btn-icon"
          >
            ×
          </button>
        </div>
      ))}

      <select
        onChange={async (e) => {
          const albumId = e.target.value;
          if (!albumId || songAlbums.find((a) => a.id === parseInt(albumId)))
            return;
          await addSongToAlbum(albumId, { song_id: songId });
          setSongAlbums((p) => [
            ...p,
            allAlbums.find((a) => a.id === parseInt(albumId)),
          ]);
          e.target.value = "";
        }}
        defaultValue=""
        className="bng-select"
        style={{ marginTop: "0.5rem" }}
      >
        <option value="">+ add to album</option>
        {allAlbums
          .filter((a) => !songAlbums.find((sa) => sa.id === a.id))
          .map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
      </select>
    </div>
  );
}

function ArrangementTab({ sections, arrangement }) {
  return (
    <div>
      <div className="section-header">
        <span className="section-title">arrangement</span>
        <button
          onClick={() => navigator.clipboard.writeText(arrangement)}
          className="btn-ghost btn-ghost--small"
        >
          copy all
        </button>
      </div>

      {sections.length === 0 && (
        <p className="empty">add sections to see arrangement.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {sections
          .slice()
          .sort((a, b) => a.order_index - b.order_index)
          .map((sec) => (
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
  );
}
