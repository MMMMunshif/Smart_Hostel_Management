import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .visitors-root {
    font-family: 'DM Sans', sans-serif;
    background: #06080f;
    min-height: 100vh;
    padding: 40px 36px;
    color: #e8eaf2;
    position: relative;
    overflow-x: hidden;
  }

  .visitors-root::before {
    content: '';
    position: fixed;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .visitors-root::after {
    content: '';
    position: fixed;
    bottom: -150px;
    left: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── HEADER ── */
  .page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 36px;
    position: relative;
    z-index: 1;
  }

  .page-title-block {}

  .page-eyebrow {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #6366f1;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .page-eyebrow::before {
    content: '';
    display: block;
    width: 24px;
    height: 2px;
    background: #6366f1;
    border-radius: 2px;
  }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: #f0f2ff;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .page-title span {
    background: linear-gradient(135deg, #818cf8 0%, #34d399 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stats-row {
    display: flex;
    gap: 16px;
  }

  .stat-pill {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px;
    padding: 8px 18px;
    font-size: 12px;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  .stat-pill b {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #e8eaf2;
  }

  .stat-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  /* ── GRID ── */
  .main-grid {
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 24px;
    align-items: start;
    position: relative;
    z-index: 1;
  }

  /* ── FORM CARD ── */
  .form-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 28px;
    backdrop-filter: blur(20px);
    position: sticky;
    top: 24px;
  }

  .card-header {
    margin-bottom: 24px;
  }

  .card-label {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #4b5563;
    font-weight: 600;
    font-family: 'Syne', sans-serif;
    margin-bottom: 4px;
  }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #f0f2ff;
    letter-spacing: -0.01em;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .field-wrap {
    position: relative;
  }

  .field-label {
    font-size: 11px;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: block;
  }

  .v-input, .v-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 11px 14px;
    color: #e8eaf2;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    appearance: none;
    -webkit-appearance: none;
  }

  .v-input::placeholder { color: #374151; }

  .v-input:focus, .v-select:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  .v-select option {
    background: #0f1623;
    color: #e8eaf2;
  }

  .select-wrap {
    position: relative;
  }

  .select-wrap::after {
    content: '▾';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #4b5563;
    pointer-events: none;
    font-size: 12px;
  }

  .submit-btn {
    margin-top: 6px;
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.3);
    position: relative;
    overflow: hidden;
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .submit-btn:hover::before { opacity: 1; }
  .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,0.4); }
  .submit-btn:active { transform: translateY(0); }

  /* ── LIST CARD ── */
  .list-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 28px;
    backdrop-filter: blur(20px);
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .filter-tabs {
    display: flex;
    gap: 6px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 4px;
  }

  .filter-tab {
    padding: 7px 16px;
    border-radius: 9px;
    border: none;
    background: transparent;
    color: #64748b;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-tab.active {
    background: rgba(99,102,241,0.2);
    color: #a5b4fc;
    font-weight: 600;
  }

  .filter-tab:hover:not(.active) { color: #94a3b8; background: rgba(255,255,255,0.04); }

  /* ── VISITOR CARD ── */
  .visitor-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .visitor-item {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 18px 20px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 16px;
    align-items: center;
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
    cursor: default;
  }

  .visitor-item:hover {
    border-color: rgba(99,102,241,0.25);
    background: rgba(99,102,241,0.04);
    transform: translateX(3px);
  }

  .visitor-avatar {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 800;
    flex-shrink: 0;
    letter-spacing: -0.02em;
  }

  .visitor-info { min-width: 0; }

  .visitor-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #f0f2ff;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .visitor-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
  }

  .meta-tag {
    font-size: 12px;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 400;
  }

  .meta-tag svg { opacity: 0.5; }

  .visitor-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    flex-shrink: 0;
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .badge-approved { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }
  .badge-rejected { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .badge-pending  { background: rgba(245,158,11,0.12); color: #fbbf24; border: 1px solid rgba(245,158,11,0.2); }

  .time-range {
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    color: #475569;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  /* ── EMPTY / LOADING ── */
  .empty-state {
    text-align: center;
    padding: 48px 20px;
    color: #374151;
  }

  .empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
    filter: grayscale(1);
    opacity: 0.4;
  }

  .empty-text {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #4b5563;
  }

  .loading-row {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .skeleton {
    height: 80px;
    border-radius: 16px;
    background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── DIVIDER ── */
  .section-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 20px 0;
  }

  /* ── ROOM BADGE IN VISITOR ── */
  .room-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.2);
    color: #818cf8;
    font-size: 11px;
    font-weight: 600;
    font-family: 'Syne', sans-serif;
    padding: 2px 9px;
    border-radius: 6px;
    white-space: nowrap;
  }

  @media (max-width: 900px) {
    .main-grid { grid-template-columns: 1fr; }
    .form-card { position: static; }
    .stats-row { display: none; }
  }
`;

const FILTERS = ["all", "pending", "approved", "rejected"];

const AVATAR_COLORS = [
  ["#6366f1", "#312e81"],
  ["#10b981", "#064e3b"],
  ["#f59e0b", "#451a03"],
  ["#ef4444", "#450a0a"],
  ["#8b5cf6", "#2e1065"],
  ["#06b6d4", "#083344"],
];

function getAvatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function StatusBadge({ status }) {
  const cls =
    status === "Approved"
      ? "badge-approved"
      : status === "Rejected"
      ? "badge-rejected"
      : "badge-pending";
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    roomId: "",
    visitorName: "",
    visitorNIC: "",
    visitorPhone: "",
    relation: "",
    purpose: "",
    visitDate: "",
    inTime: "",
    outTime: "",
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [visitorRes, roomRes] = await Promise.all([
        axios.get(`${API}/visitors/my`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setVisitors(visitorRes.data || []);
      setRooms(roomRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
   const { showToast } = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/visitors`, form, { headers: { Authorization: `Bearer ${token}` } });
      showToast("Visitor request submitted ✅", "success");
      setForm({ roomId: "", visitorName: "", visitorNIC: "", visitorPhone: "", relation: "", purpose: "", visitDate: "", inTime: "", outTime: "" });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Error", "error");
    }
  };

  const filteredVisitors = useMemo(() => {
    return visitors.filter(
      (v) => filter === "all" || v.status.toLowerCase() === filter
    );
  }, [visitors, filter]);

  // stats
  const counts = useMemo(() => ({
    all: visitors.length,
    pending: visitors.filter((v) => v.status.toLowerCase() === "pending").length,
    approved: visitors.filter((v) => v.status.toLowerCase() === "approved").length,
    rejected: visitors.filter((v) => v.status.toLowerCase() === "rejected").length,
  }), [visitors]);

  return (
    <Layout role="student">
      <style>{STYLES}</style>

      <div className="visitors-root">
        {/* HEADER */}
        <div className="page-header">
          <div className="page-title-block">
            <div className="page-eyebrow">Hostel Management</div>
            <h1 className="page-title">Visitor <span>Requests</span></h1>
          </div>

          <div className="stats-row">
            <div className="stat-pill">
              <span className="stat-dot" style={{ background: "#fbbf24" }} />
              <b>{counts.pending}</b> Pending
            </div>
            <div className="stat-pill">
              <span className="stat-dot" style={{ background: "#34d399" }} />
              <b>{counts.approved}</b> Approved
            </div>
            <div className="stat-pill">
              <span className="stat-dot" style={{ background: "#f87171" }} />
              <b>{counts.rejected}</b> Rejected
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="main-grid">
          {/* ── FORM ── */}
          <div className="form-card">
            <div className="card-header">
              <div className="card-label">New Entry</div>
              <div className="card-title">Add Visitor</div>
            </div>

            <form onSubmit={handleSubmit} className="form-group">
              {/* Room */}
              <div className="field-wrap">
                <label className="field-label">Room</label>
                <div className="select-wrap">
                  <select
                    required
                    className="v-select"
                    value={form.roomId}
                    onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                  >
                    <option value="">Select a room…</option>
                    {rooms.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.roomNumber} — {r.wing} Wing
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Name + Relation */}
              <div className="field-row">
                <div className="field-wrap">
                  <label className="field-label">Full Name</label>
                  <input className="v-input" placeholder="e.g. Ahmad Ali" required
                    value={form.visitorName}
                    onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
                  />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Relation</label>
                  <input className="v-input" placeholder="e.g. Father" required
                    value={form.relation}
                    onChange={(e) => setForm({ ...form, relation: e.target.value })}
                  />
                </div>
              </div>

              {/* NIC + Phone */}
              <div className="field-row">
                <div className="field-wrap">
                  <label className="field-label">NIC / ID</label>
                  <input className="v-input" placeholder="ID number" required
                    value={form.visitorNIC}
                    onChange={(e) => setForm({ ...form, visitorNIC: e.target.value })}
                  />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Phone</label>
                  <input className="v-input" placeholder="+92 …" required
                    value={form.visitorPhone}
                    onChange={(e) => setForm({ ...form, visitorPhone: e.target.value })}
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="field-wrap">
                <label className="field-label">Purpose of Visit</label>
                <input className="v-input" placeholder="Brief reason…" required
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                />
              </div>

              {/* Date */}
              <div className="field-wrap">
                <label className="field-label">Visit Date</label>
                <input type="date" className="v-input" required
                  value={form.visitDate}
                  onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                />
              </div>

              {/* Time */}
              <div className="field-row">
                <div className="field-wrap">
                  <label className="field-label">Check-in Time</label>
                  <input type="time" className="v-input" required
                    value={form.inTime}
                    onChange={(e) => setForm({ ...form, inTime: e.target.value })}
                  />
                </div>
                <div className="field-wrap">
                  <label className="field-label">Check-out Time</label>
                  <input type="time" className="v-input" required
                    value={form.outTime}
                    onChange={(e) => setForm({ ...form, outTime: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Submit Request →
              </button>
            </form>
          </div>

          {/* ── LIST ── */}
          <div className="list-card">
            <div className="list-header">
              <div>
                <div className="card-label">History</div>
                <div className="card-title">My Visitors</div>
              </div>

              <div className="filter-tabs">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`filter-tab ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    {f !== "all" && counts[f] > 0 && (
                      <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.7 }}>
                        {counts[f]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* loading skeletons */}
            {loading && (
              <div className="loading-row">
                {[1, 2, 3].map((i) => <div className="skeleton" key={i} />)}
              </div>
            )}

            {/* empty state */}
            {!loading && filteredVisitors.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <div className="empty-text">No visitor records found</div>
                <p style={{ fontSize: 13, color: "#374151", marginTop: 6 }}>
                  {filter !== "all" ? `No ${filter} requests yet.` : "Add a visitor using the form."}
                </p>
              </div>
            )}

            {/* visitor list */}
            {!loading && (
              <div className="visitor-list">
                {filteredVisitors.map((v) => {
                  const [fg, bg] = getAvatarColor(v.visitorName);
                  return (
                    <div className="visitor-item" key={v._id}>
                      {/* Avatar */}
                      <div
                        className="visitor-avatar"
                        style={{ background: `${bg}cc`, color: fg, border: `1.5px solid ${fg}40` }}
                      >
                        {getInitials(v.visitorName)}
                      </div>

                      {/* Info */}
                      <div className="visitor-info">
                        <div className="visitor-name">{v.visitorName}</div>
                        <div className="visitor-meta">
                          <span className="meta-tag">
                            <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                            </svg>
                            {v.relation}
                          </span>
                          <span className="meta-tag">
                            <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                            </svg>
                            {v.visitorPhone}
                          </span>
                          <span className="meta-tag">
                            <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            {new Date(v.visitDate).toDateString()}
                          </span>
                          {v.room?.roomNumber && (
                            <span className="room-chip">
                              🏠 Room {v.room.roomNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right */}
                      <div className="visitor-right">
                        <StatusBadge status={v.status} />
                        <div className="time-range">
                          {v.inTime} → {v.outTime}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Visitors;