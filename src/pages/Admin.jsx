import { useState, useEffect } from "react";
import { MEDIA_URL, getList, addToList } from "../api";

const ADMIN_PASSWORD = "banger2026";

const STATIC_CATEGORIES = [
  "status",
  "key",
  "time_signature",
  "section_type",
  "audio_version",
  "link_type",
  "image_type",
];

export default function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("banger_admin") === "yes",
  );
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [importing, setImporting] = useState(false);
  const [msg, setMsg] = useState(null);
  const [lists, setLists] = useState({});
  const [usage, setUsage] = useState({});
  const [newValues, setNewValues] = useState({});
  const [adding, setAdding] = useState({});
  const [moods, setMoods] = useState([]);
  const [genres, setGenres] = useState([]);
  const [newMood, setNewMood] = useState("");
  const [newGenre, setNewGenre] = useState("");

  useEffect(() => {
    if (!authed) return;

    Promise.all([
      ...STATIC_CATEGORIES.map((cat) =>
        getList(cat).then((rows) => [cat, rows]),
      ),
      fetch(`${MEDIA_URL}/api/admin/list-usage`)
        .then((r) => r.json())
        .then((data) => ["__usage__", data]),
      fetch(`${MEDIA_URL}/api/moods`)
        .then((r) => r.json())
        .then((data) => ["__moods__", data]),
      fetch(`${MEDIA_URL}/api/genres`)
        .then((r) => r.json())
        .then((data) => ["__genres__", data]),
    ]).then((results) => {
      const obj = {};
      let u = {};
      let moodRows = [];
      let genreRows = [];

      results.forEach(([cat, rows]) => {
        if (cat === "__usage__") {
          u = rows;
        } else if (cat === "__moods__") {
          moodRows = rows;
        } else if (cat === "__genres__") {
          genreRows = rows;
        } else {
          obj[cat] = rows;
        }
      });

      setLists(obj);
      setUsage(u);
      setMoods(moodRows);
      setGenres(genreRows);
    });
  }, [authed]);

  function handleLogin() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("banger_admin", "yes");
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("banger_admin");
    setAuthed(false);
    setPw("");
  }

  async function handleAddValue(cat) {
    const val = (newValues[cat] || "").trim();
    if (!val) return;
    const created = await addToList(cat, val);
    setLists((prev) => ({ ...prev, [cat]: [...(prev[cat] || []), created] }));
    setNewValues((prev) => ({ ...prev, [cat]: "" }));
    setAdding((prev) => ({ ...prev, [cat]: false }));
  }

  async function handleDeleteValue(cat, id) {
    await fetch(`${MEDIA_URL}/api/lists/${cat}/${id}`, { method: "DELETE" });
    setLists((prev) => ({
      ...prev,
      [cat]: prev[cat].filter((r) => r.id !== id),
    }));
  }

  async function handleExport() {
    const res = await fetch(`${MEDIA_URL}/api/admin/export`);
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `banger-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("exported ✓");
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setMsg(null);
    const text = await file.text();
    const data = JSON.parse(text);
    const res = await fetch(`${MEDIA_URL}/api/admin/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setImporting(false);
    setMsg(result.ok ? "imported ✓" : `error: ${result.error}`);
    e.target.value = "";
  }

  async function handleClear() {
    if (
      !confirm(
        "This will delete ALL songs, artists, albums, sections, audio, images, and links. Static list values will be kept. This cannot be undone.",
      )
    )
      return;
    if (!confirm("Are you sure? Last chance.")) return;
    const res = await fetch(`${MEDIA_URL}/api/admin/clear`, {
      method: "DELETE",
    });
    const result = await res.json();
    setMsg(result.ok ? "database cleared ✓" : `error: ${result.error}`);
  }

  async function handleAddMood() {
    const label = newMood.trim();
    if (!label) return;
    const res = await fetch(`${MEDIA_URL}/api/moods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });
    const created = await res.json();
    setMoods((p) => [...p, created]);
    setNewMood("");
  }

  async function handleDeleteMood(id) {
    await fetch(`${MEDIA_URL}/api/moods/${id}`, { method: "DELETE" });
    setMoods((p) => p.filter((m) => m.id !== id));
  }

  async function handleAddGenre() {
    const title = newGenre.trim();
    if (!title) return;
    const res = await fetch(`${MEDIA_URL}/api/genres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const created = await res.json();
    setGenres((p) => [...p, created]);
    setNewGenre("");
  }

  async function handleDeleteGenre(id) {
    await fetch(`${MEDIA_URL}/api/genres/${id}`, { method: "DELETE" });
    setGenres((p) => p.filter((g) => g.id !== id));
  }

  if (!authed)
    return (
      <div
        style={{
          minHeight: "calc(100vh - 56px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-canvas)",
        }}
      >
        <div className="panel" style={{ width: "100%", maxWidth: "360px" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            admin access
          </h2>
          <div className="form-stack">
            <label>
              <span>password</span>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="bng-input"
                placeholder="enter password"
                autoFocus
              />
            </label>
            {pwError && <p className="error-text">incorrect password</p>}
            <button
              onClick={handleLogin}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              enter
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="app-main">
      <div className="page-header">
        <h1 className="page-title">Admin</h1>
        <button onClick={handleLogout} className="btn-ghost btn-ghost--small">
          sign out
        </button>
      </div>

      {/* BACKUP */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          maxWidth: "700px",
          marginBottom: "2rem",
        }}
      >
        <div className="panel">
          <h3 style={{ marginBottom: "0.5rem" }}>export</h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--zinc-500)",
              marginBottom: "1rem",
            }}
          >
            Download all data as a JSON backup file.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            style={{ width: "100%" }}
          >
            download backup
          </button>
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: "0.5rem" }}>import</h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--zinc-500)",
              marginBottom: "1rem",
            }}
          >
            Upload a backup file. Existing records are updated, new ones added,
            nothing deleted.
          </p>
          <label
            className="btn btn-primary"
            style={{
              width: "100%",
              cursor: "pointer",
              justifyContent: "center",
            }}
          >
            {importing ? "importing..." : "upload backup file"}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div
          className="panel"
          style={{ border: "1px solid var(--error)", gridColumn: "1 / -1" }}
        >
          <h3 style={{ marginBottom: "0.5rem", color: "var(--danger-text)" }}>
            danger zone
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--zinc-500)",
              marginBottom: "1rem",
            }}
          >
            Wipe all songs, artists, albums, and related data. Static list
            values are preserved. Cannot be undone.
          </p>
          <button className="btn-danger" onClick={handleClear}>
            clear database
          </button>
        </div>
      </div>

      {msg && (
        <p
          style={{
            marginBottom: "1.5rem",
            fontSize: "13px",
            color: msg.includes("error")
              ? "var(--danger-text)"
              : "var(--accent)",
          }}
        >
          {msg}
        </p>
      )}

      {/* STATIC VALUES */}
      <h2
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          marginBottom: "1rem",
          color: "var(--zinc-900)",
        }}
      >
        static values
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
          maxWidth: "1000px",
        }}
      >
        {STATIC_CATEGORIES.map((cat) => (
          <div key={cat} className="panel" style={{ padding: "1.25rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h3>{cat.replace(/_/g, " ")}</h3>
              <button
                onClick={() => setAdding((p) => ({ ...p, [cat]: !p[cat] }))}
                className="btn-ghost btn-ghost--small"
              >
                + add
              </button>
            </div>

            {adding[cat] && (
              <div
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  value={newValues[cat] || ""}
                  onChange={(e) =>
                    setNewValues((p) => ({ ...p, [cat]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleAddValue(cat)}
                  className="bng-input"
                  placeholder="new value..."
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => handleAddValue(cat)}
                  className="btn btn-primary"
                >
                  add
                </button>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column" }}>
              {(lists[cat] || []).map((row) => (
                <div
                  key={row.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.35rem 0",
                    borderBottom: "1px solid var(--zinc-100)",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ color: "var(--zinc-800)" }}>{row.value}</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {(usage[cat]?.[row.value] || 0) > 0 && (
                      <span
                        style={{ fontSize: "11px", color: "var(--zinc-500)" }}
                      >
                        {usage[cat][row.value]}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteValue(cat, row.id)}
                      className="btn-icon"
                      style={{ fontSize: "0.85rem", color: "var(--zinc-400)" }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {(lists[cat] || []).length === 0 && (
                <p className="empty">no values yet</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          margin: "2rem 0 1rem",
          color: "var(--zinc-900)",
        }}
      >
        moods & genres
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          maxWidth: "700px",
        }}
      >
        <div className="panel" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>moods</h3>
          <div
            style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem" }}
          >
            <input
              value={newMood}
              onChange={(e) => setNewMood(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMood()}
              className="bng-input"
              placeholder="new mood..."
              style={{ flex: 1 }}
            />
            <button onClick={handleAddMood} className="btn btn-primary">
              add
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {moods.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.35rem 0",
                  borderBottom: "1px solid var(--zinc-100)",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "var(--zinc-800)" }}>{m.label}</span>
                <button
                  onClick={() => handleDeleteMood(m.id)}
                  className="btn-icon"
                  style={{ color: "var(--zinc-400)" }}
                >
                  ×
                </button>
              </div>
            ))}
            {moods.length === 0 && <p className="empty">no moods yet</p>}
          </div>
        </div>

        <div className="panel" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>genres</h3>
          <div
            style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem" }}
          >
            <input
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddGenre()}
              className="bng-input"
              placeholder="new genre..."
              style={{ flex: 1 }}
            />
            <button onClick={handleAddGenre} className="btn btn-primary">
              add
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {genres.map((g) => (
              <div
                key={g.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.35rem 0",
                  borderBottom: "1px solid var(--zinc-100)",
                  fontSize: "13px",
                }}
              >
                <span style={{ color: "var(--zinc-800)" }}>{g.title}</span>
                <button
                  onClick={() => handleDeleteGenre(g.id)}
                  className="btn-icon"
                  style={{ color: "var(--zinc-400)" }}
                >
                  ×
                </button>
              </div>
            ))}
            {genres.length === 0 && <p className="empty">no genres yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
