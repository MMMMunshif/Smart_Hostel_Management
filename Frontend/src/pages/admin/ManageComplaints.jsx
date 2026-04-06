import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.mc-root {
  font-family: 'DM Sans', sans-serif;
  background: #f4f7fb;
  min-height: 100vh;
  color: #0f172a;
}

.mc-page {
  padding: 28px 32px;
  max-width: 1440px;
  margin: 0 auto;
}

/* HEADER */
.mc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 22px;
  flex-wrap: wrap;
}

.mc-title-wrap h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #0f172a;
  margin-bottom: 4px;
}

.mc-title-wrap p {
  font-size: 0.92rem;
  color: #64748b;
}

/* STAT PILLS */
.mc-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mc-stat-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 14px;
  padding: 10px 16px;
  box-shadow: 0 2px 8px rgba(15,23,42,0.04);
  transition: box-shadow 0.18s;
}
.mc-stat-pill:hover { box-shadow: 0 4px 14px rgba(15,23,42,0.08); }

.mc-stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-all      { background: #64748b; }
.dot-pending  { background: #f59e0b; }
.dot-prog     { background: #3b82f6; }
.dot-resolved { background: #22c55e; }

.mc-stat-val {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.05rem; font-weight: 800; color: #0f172a;
}
.mc-stat-label { font-size: 0.75rem; font-weight: 600; color: #64748b; }

/* FILTER BAR */
.mc-filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  align-items: center;
  flex-wrap: wrap;
}

.mc-search-wrap {
  position: relative;
  flex: 1;
  min-width: 220px;
  max-width: 360px;
}

.mc-search-icon {
  position: absolute;
  left: 13px; top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem; color: #94a3b8;
  pointer-events: none;
}

.mc-search {
  width: 100%;
  padding: 11px 14px 11px 36px;
  border: 1px solid #e5e7eb;
  border-radius: 13px;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem; color: #0f172a;
  outline: none;
  box-shadow: 0 2px 8px rgba(15,23,42,0.04);
  transition: border-color 0.18s, box-shadow 0.18s;
}
.mc-search:focus {
  border-color: #58e4de;
  box-shadow: 0 0 0 3px rgba(88,228,222,0.14);
}

/* Tab row */
.mc-tabs {
  display: flex; gap: 6px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 13px;
  padding: 5px;
  box-shadow: 0 2px 8px rgba(15,23,42,0.04);
}

.mc-tab {
  padding: 8px 16px;
  border: none; border-radius: 9px;
  font-size: 0.82rem; font-weight: 700;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  color: #64748b; background: transparent;
  transition: all 0.16s;
  white-space: nowrap;
}
.mc-tab:hover { color: #0f172a; background: #f8fafc; }
.mc-tab.t-all      { }
.mc-tab.t-all.on   { background: #0f172a; color: #fff; }
.mc-tab.t-pend.on  { background: #fef3c7; color: #b45309; }
.mc-tab.t-prog.on  { background: #dbeafe; color: #1d4ed8; }
.mc-tab.t-res.on   { background: #dcfce7; color: #15803d; }

.mc-clear-btn {
  padding: 10px 16px;
  border: 1px solid #fca5a5;
  background: #fff5f5; color: #dc2626;
  border-radius: 12px;
  font-size: 0.82rem; font-weight: 700;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background 0.18s;
}
.mc-clear-btn:hover { background: #fee2e2; }

/* Count */
.mc-count { font-size: 0.82rem; color: #94a3b8; font-weight: 600; margin-bottom: 18px; }

/* GRID */
.mc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 18px;
}

/* CARD */
.mc-card {
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(15,23,42,0.05);
  display: flex; flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: card-in 0.3s ease both;
}
.mc-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(15,23,42,0.09);
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.mc-card.p-High   { border-left: 4px solid #ef4444; }
.mc-card.p-Medium { border-left: 4px solid #f59e0b; }
.mc-card.p-Low    { border-left: 4px solid #22c55e; }

/* Card image */
.mc-card-img {
  width: 100%; height: 170px;
  object-fit: cover; display: block;
  transition: transform 0.35s ease;
}
.mc-card:hover .mc-card-img { transform: scale(1.03); }

.mc-img-wrap { overflow: hidden; }

/* Card body */
.mc-card-body {
  padding: 18px; flex: 1;
  display: flex; flex-direction: column; gap: 13px;
}

.mc-card-top {
  display: flex; justify-content: space-between;
  align-items: flex-start; gap: 10px;
}

.mc-card-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem; font-weight: 800;
  color: #0f172a; letter-spacing: -0.02em; line-height: 1.3;
}

/* Status badge */
.mc-status {
  padding: 4px 10px; border-radius: 999px;
  font-size: 0.66rem; font-weight: 800;
  letter-spacing: 0.06em; text-transform: uppercase;
  white-space: nowrap; flex-shrink: 0;
}
.s-pending    { background: #fef3c7; color: #b45309; }
.s-inprogress { background: #dbeafe; color: #1d4ed8; }
.s-resolved   { background: #dcfce7; color: #15803d; }
.s-default    { background: #f1f5f9; color: #475569; }

/* Description */
.mc-desc {
  font-size: 0.86rem; color: #64748b; line-height: 1.68;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Tags */
.mc-tags { display: flex; gap: 7px; flex-wrap: wrap; }

.mc-tag-cat {
  padding: 4px 10px; border-radius: 999px;
  font-size: 0.68rem; font-weight: 700;
  background: rgba(88,228,222,0.1);
  border: 1px solid rgba(88,228,222,0.28);
  color: #0f766e;
}

.mc-tag-pri {
  padding: 4px 10px; border-radius: 999px;
  font-size: 0.68rem; font-weight: 800;
}
.pri-high   { background: #fee2e2; color: #dc2626; }
.pri-medium { background: #fef3c7; color: #b45309; }
.pri-low    { background: #dcfce7; color: #15803d; }
.pri-def    { background: #f1f5f9; color: #475569; }

/* Meta */
.mc-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 14px;
  padding: 14px;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
}

.mc-meta-item { display: flex; flex-direction: column; gap: 2px; }

.mc-meta-lbl {
  font-size: 0.6rem; font-weight: 800;
  letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8;
}

.mc-meta-val {
  font-size: 0.84rem; font-weight: 700; color: #1e293b; line-height: 1.3;
}

/* Actions */
.mc-actions {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; padding: 0 18px 18px;
}

.mc-btn {
  padding: 11px 10px; border: none; border-radius: 12px;
  font-size: 0.82rem; font-weight: 800; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.18s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.mc-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

.mc-btn-prog {
  background: #eff6ff; color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
.mc-btn-prog:hover:not(:disabled) {
  background: #dbeafe; transform: translateY(-1px);
}

.mc-btn-res {
  background: linear-gradient(135deg, #58e4de, #34c7c1);
  color: #0a3534;
  box-shadow: 0 3px 10px rgba(88,228,222,0.28);
}
.mc-btn-res:hover:not(:disabled) {
  box-shadow: 0 6px 18px rgba(88,228,222,0.42);
  transform: translateY(-1px);
}

/* Empty */
.mc-empty {
  grid-column: 1 / -1; text-align: center;
  padding: 64px 20px; color: #94a3b8;
}
.mc-empty-icon { font-size: 2.8rem; margin-bottom: 14px; }
.mc-empty-text { font-size: 1rem; font-weight: 700; color: #64748b; }
.mc-empty-sub  { font-size: 0.85rem; color: #94a3b8; margin-top: 6px; }

/* Loading */
.mc-loading {
  display: flex; align-items: center; justify-content: center;
  min-height: 40vh; font-size: 0.92rem; color: #64748b; gap: 10px;
}

/* Responsive */
@media (max-width: 900px) { .mc-stats { display: none; } }
@media (max-width: 700px) {
  .mc-page   { padding: 16px; }
  .mc-tabs   { flex-wrap: wrap; }
  .mc-meta   { grid-template-columns: 1fr; }
  .mc-actions{ grid-template-columns: 1fr; }
}
`;

/* ── HELPERS ── */
function statusCls(s = "") {
  const v = s.toLowerCase().replace(/\s/g, "");
  if (v === "pending")    return "s-pending";
  if (v === "inprogress") return "s-inprogress";
  if (v === "resolved")   return "s-resolved";
  return "s-default";
}

function priorityBorderCls(p = "") {
  if (p?.toLowerCase() === "high")   return "p-High";
  if (p?.toLowerCase() === "medium") return "p-Medium";
  if (p?.toLowerCase() === "low")    return "p-Low";
  return "";
}

function priorityChipCls(p = "") {
  if (p?.toLowerCase() === "high")   return "pri-high";
  if (p?.toLowerCase() === "medium") return "pri-medium";
  if (p?.toLowerCase() === "low")    return "pri-low";
  return "pri-def";
}

function priorityIcon(p = "") {
  if (p?.toLowerCase() === "high")   return "🔴";
  if (p?.toLowerCase() === "medium") return "🟡";
  return "🟢";
}

function ManageComplaints() {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load complaints.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/complaints/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Status updated to "${status}".`, "success");
      fetchComplaints();
    } catch {
      showToast("Failed to update complaint status.", "error");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchStatus = statusFilter === "all" || c.status?.toLowerCase() === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.student?.name?.toLowerCase().includes(q) ||
        c.student?.email?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.priority?.toLowerCase().includes(q) ||
        c.room?.roomNumber?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [complaints, statusFilter, searchQuery]);

  const counts = useMemo(() => ({
    all:      complaints.length,
    pending:  complaints.filter(c => c.status?.toLowerCase() === "pending").length,
    progress: complaints.filter(c => c.status?.toLowerCase() === "in progress").length,
    resolved: complaints.filter(c => c.status?.toLowerCase() === "resolved").length,
  }), [complaints]);

  const tabCls = (key, cls) => {
    const map = { all:"all", pending:"pending", "in progress":"progress", resolved:"resolved" };
    return `mc-tab t-${map[key] || "all"}${statusFilter === key ? " on" : ""}`;
  };

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="mc-root">
        <div className="mc-page">

          {/* HEADER */}
          <div className="mc-header">
            <div className="mc-title-wrap">
              <h1>Manage Complaints</h1>
              <p>Review, track, and resolve student hostel complaints.</p>
            </div>

            <div className="mc-stats">
              {[
                { dot:"dot-all",      val:counts.all,      label:"Total"      },
                { dot:"dot-pending",  val:counts.pending,  label:"Pending"    },
                { dot:"dot-prog",     val:counts.progress, label:"In Progress"},
                { dot:"dot-resolved", val:counts.resolved, label:"Resolved"   },
              ].map(s => (
                <div className="mc-stat-pill" key={s.label}>
                  <div className={`mc-stat-dot ${s.dot}`} />
                  <span className="mc-stat-val">{s.val}</span>
                  <span className="mc-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="mc-filter-bar">
            <div className="mc-search-wrap">
              <span className="mc-search-icon">🔍</span>
              <input
                className="mc-search"
                placeholder="Search title, student, category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mc-tabs">
              <button className={tabCls("all")}          onClick={() => setStatusFilter("all")}>All ({counts.all})</button>
              <button className={tabCls("pending")}      onClick={() => setStatusFilter("pending")}>Pending ({counts.pending})</button>
              <button className={tabCls("in progress")}  onClick={() => setStatusFilter("in progress")}>In Progress ({counts.progress})</button>
              <button className={tabCls("resolved")}     onClick={() => setStatusFilter("resolved")}>Resolved ({counts.resolved})</button>
            </div>

            {(searchQuery || statusFilter !== "all") && (
              <button className="mc-clear-btn" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}>
                ✕ Clear
              </button>
            )}
          </div>

          {!loading && (
            <div className="mc-count">
              Showing <strong>{filtered.length}</strong> of <strong>{complaints.length}</strong> complaints
            </div>
          )}

          {loading && <div className="mc-loading">⏳ Loading complaints…</div>}

          {!loading && (
            <div className="mc-grid">
              {filtered.length === 0 && (
                <div className="mc-empty">
                  <div className="mc-empty-icon">📋</div>
                  <div className="mc-empty-text">No complaints found</div>
                  <div className="mc-empty-sub">Try adjusting your search or filter.</div>
                </div>
              )}

              {filtered.map((c, idx) => {
                const imageUrl = c.image
                  ? c.image.startsWith("http") ? c.image : `http://localhost:5000/${c.image.replace(/\\\\/g, "/")}`
                  : "";
                const statusNorm = c.status?.toLowerCase().replace(/\s/g, "");

                return (
                  <div
                    key={c._id}
                    className={`mc-card ${priorityBorderCls(c.priority)}`}
                    style={{ animationDelay:`${idx * 0.04}s` }}
                  >
                    {/* Image */}
                    {imageUrl && (
                      <div className="mc-img-wrap">
                        <img src={imageUrl} alt={c.title} className="mc-card-img" />
                      </div>
                    )}

                    <div className="mc-card-body">
                      {/* Title + Status */}
                      <div className="mc-card-top">
                        <div className="mc-card-title">{c.title}</div>
                        <span className={`mc-status ${statusCls(c.status)}`}>
                          {c.status || "Pending"}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mc-desc">{c.description}</p>

                      {/* Tags */}
                      <div className="mc-tags">
                        {c.category && <span className="mc-tag-cat">🏷 {c.category}</span>}
                        {c.priority && (
                          <span className={`mc-tag-pri ${priorityChipCls(c.priority)}`}>
                            {priorityIcon(c.priority)} {c.priority}
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="mc-meta">
                        <div className="mc-meta-item">
                          <span className="mc-meta-lbl">Student</span>
                          <span className="mc-meta-val">👤 {c.student?.name || "—"}</span>
                        </div>
                        <div className="mc-meta-item">
                          <span className="mc-meta-lbl">Room</span>
                          <span className="mc-meta-val">🏠 {c.room?.roomNumber || "No room"}</span>
                        </div>
                        <div className="mc-meta-item">
                          <span className="mc-meta-lbl">Email</span>
                          <span className="mc-meta-val" style={{ fontSize:"0.78rem", wordBreak:"break-all" }}>
                            {c.student?.email || "—"}
                          </span>
                        </div>
                        <div className="mc-meta-item">
                          <span className="mc-meta-lbl">Filed On</span>
                          <span className="mc-meta-val">
                            🕐 {c.createdAt
                              ? new Date(c.createdAt).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" })
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mc-actions">
                      <button
                        className="mc-btn mc-btn-prog"
                        disabled={updating === c._id || statusNorm === "inprogress"}
                        onClick={() => updateStatus(c._id, "In Progress")}
                      >
                        {updating === c._id ? "⏳ Updating…" : "🔄 In Progress"}
                      </button>

                      <button
                        className="mc-btn mc-btn-res"
                        disabled={updating === c._id || statusNorm === "resolved"}
                        onClick={() => updateStatus(c._id, "Resolved")}
                      >
                        {updating === c._id ? "⏳ Updating…" : "✅ Resolve"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

export default ManageComplaints;