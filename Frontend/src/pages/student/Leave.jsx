import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const statusStyles = {
  Pending: {
    bg: "linear-gradient(135deg, #fef3c7, #fde68a)",
    color: "#92400e",
    border: "#fbbf24",
    icon: "⏳",
  },
  Approved: {
    bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    color: "#065f46",
    border: "#34d399",
    icon: "✅",
  },
  Rejected: {
    bg: "linear-gradient(135deg, #fee2e2, #fecaca)",
    color: "#991b1b",
    border: "#f87171",
    icon: "❌",
  },
};

function StatusBadge({ status }) {
  const s = statusStyles[status] || statusStyles.Pending;
  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: ".6px",
        textTransform: "uppercase",
        background: s.bg,
        color: s.color,
        border: `1.5px solid ${s.border}`,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
    >
      <span>{s.icon}</span>
      {status}
    </span>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysBetween(a, b) {
  if (!a || !b) return "—";
  const diff =
    Math.round(
      (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  return `${diff} day${diff > 1 ? "s" : ""}`;
}

const STATS = [
  {
    label: "Total Requests",
    key: "total",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    icon: "📋",
    shadow: "rgba(99,102,241,.35)",
  },
  {
    label: "Pending",
    key: "pending",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    icon: "⏳",
    shadow: "rgba(245,158,11,.35)",
  },
  {
    label: "Approved",
    key: "approved",
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    icon: "✅",
    shadow: "rgba(16,185,129,.35)",
  },
  {
    label: "Rejected",
    key: "rejected",
    gradient: "linear-gradient(135deg, #ef4444, #f87171)",
    icon: "❌",
    shadow: "rgba(239,68,68,.35)",
  },
];

export default function Leave() {
  const { showToast } = useToast();

  const [tab, setTab] = useState("temporary");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchLeaves = async () => {
    try {
      setHistoryLoading(true);
      const res = await axios.get(`${API}/leaves/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load leave requests", "error");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const submitLeave = async () => {
    if (!reason.trim()) { showToast("Please enter a reason", "error"); return; }
    if (tab === "temporary") {
      if (!fromDate || !toDate) { showToast("Please select dates", "error"); return; }
      if (new Date(fromDate) > new Date(toDate)) { showToast("From date cannot be after To date", "error"); return; }
    }
    try {
      setLoading(true);
      const payload = { reason, leaveType: tab };
      if (tab === "temporary") { payload.fromDate = fromDate; payload.toDate = toDate; }
      await axios.post(`${API}/leaves`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(
        tab === "temporary" ? "Temporary leave request sent" : "Permanent room leave request sent",
        "success"
      );
      setReason(""); setFromDate(""); setToDate("");
      fetchLeaves();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to submit request", "error");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => ({
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "Pending").length,
    approved: leaves.filter((l) => l.status === "Approved").length,
    rejected: leaves.filter((l) => l.status === "Rejected").length,
  }), [leaves]);

  const filteredLeaves = useMemo(() =>
    leaves.filter((l) => {
      const matchFilter = filter === "All" || l.status === filter;
      const q = search.toLowerCase();
      const matchSearch = !q || l.reason?.toLowerCase().includes(q) ||
        l.leaveType?.toLowerCase().includes(q) ||
        l.room?.roomNumber?.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    }), [leaves, filter, search]);

  return (
    <Layout role="student">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900;1000&display=swap');

        * { box-sizing: border-box; }

        .leave-root * {
          font-family: 'Nunito', sans-serif;
        }

        /* Animated background blobs */
        .leave-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
          animation: blobFloat 8s ease-in-out infinite;
        }
        .blob1 { width: 500px; height: 500px; background: #c4b5fd; top: -120px; left: -100px; animation-delay: 0s; }
        .blob2 { width: 400px; height: 400px; background: #fbcfe8; top: 200px; right: -80px; animation-delay: 2s; }
        .blob3 { width: 350px; height: 350px; background: #bfdbfe; bottom: 100px; left: 30%; animation-delay: 4s; }
        .blob4 { width: 300px; height: 300px; background: #bbf7d0; bottom: -80px; right: 20%; animation-delay: 1s; }

        @keyframes blobFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        .leave-content { position: relative; z-index: 1; }

        /* Glass card */
        .card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.08);
        }

        /* Stat card */
        .stat-card {
          border-radius: 24px;
          padding: 22px 20px;
          color: #fff;
          position: relative;
          overflow: hidden;
          transition: transform .22s, box-shadow .22s;
          cursor: default;
        }
        .stat-card:hover {
          transform: translateY(-5px) scale(1.02);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: rgba(255,255,255,.15);
          top: -30px; right: -30px;
        }
        .stat-card::after {
          content: '';
          position: absolute;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,.1);
          bottom: -20px; left: 10px;
        }

        /* Input */
        .inp {
          width: 100%;
          padding: 13px 16px;
          border-radius: 16px;
          border: 2px solid rgba(99,102,241,.15);
          background: rgba(255,255,255,.9);
          outline: none;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          color: #1e1b4b;
          transition: .2s;
        }
        .inp:focus {
          border-color: #818cf8;
          box-shadow: 0 0 0 4px rgba(129,140,248,.15);
          background: #fff;
        }
        .inp::placeholder { color: #a5b4fc; font-weight: 600; }

        /* Tabs */
        .tab-btn {
          border: none;
          cursor: pointer;
          border-radius: 18px;
          font-weight: 800;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          padding: 13px 16px;
          transition: .2s;
          flex: 1;
        }
        .tab-btn:hover { transform: translateY(-2px); }

        /* Submit btn */
        .submit-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 18px;
          font-weight: 900;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          cursor: pointer;
          color: #fff;
          transition: .22s;
          letter-spacing: .3px;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.06); }
        .submit-btn:disabled { opacity: .7; cursor: not-allowed; }

        /* History card */
        .history-card {
          border-radius: 24px;
          padding: 22px;
          transition: transform .22s, box-shadow .22s;
        }
        .history-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 24px 48px rgba(99,102,241,.14) !important;
        }

        /* Label */
        .field-label {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .5px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 7px;
        }

        /* Fade in */
        .fade-in {
          animation: fadeUp .4s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Stagger */
        .s1 { animation-delay: .05s; }
        .s2 { animation-delay: .10s; }
        .s3 { animation-delay: .15s; }
        .s4 { animation-delay: .20s; }
        .s5 { animation-delay: .25s; }
        .s6 { animation-delay: .30s; }

        /* Responsive */
        @media(max-width:900px){
          .top-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width:560px){
          .stats-grid { grid-template-columns: 1fr !important; }
          .filter-row { flex-direction: column !important; }
          .filter-row input, .filter-row select { width: 100% !important; }
        }
      `}</style>

      {/* Animated background */}
      <div className="leave-bg">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />
        <div className="blob blob4" />
      </div>

      <div
        className="leave-root leave-content"
        style={{ minHeight: "100vh", padding: "28px 24px", background: "linear-gradient(145deg,#f0f4ff 0%,#fdf4ff 40%,#f0fff8 100%)" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* ── Header ── */}
          <div className="fade-in" style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg,#6366f1,#a78bfa)",
                display: "grid", placeItems: "center",
                fontSize: 26, boxShadow: "0 8px 20px rgba(99,102,241,.3)",
              }}>🏖️</div>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1e1b4b", margin: 0, letterSpacing: "-.5px" }}>
                  Leave Management
                </h1>
                <p style={{ color: "#7c3aed", fontSize: 14, margin: 0, fontWeight: 700 }}>
                  Request time off or vacate your room
                </p>
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div
            className="stats-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.key}
                className={`stat-card fade-in s${i + 1}`}
                style={{ background: s.gradient, boxShadow: `0 10px 30px ${s.shadow}` }}
              >
                <div style={{ fontSize: 32, marginBottom: 6, position: "relative", zIndex: 1 }}>{s.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, position: "relative", zIndex: 1 }}>
                  {stats[s.key]}
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".5px", textTransform: "uppercase", marginTop: 6, opacity: .9, position: "relative", zIndex: 1 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Top Grid ── */}
          <div
            className="top-grid"
            style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 18, marginBottom: 24, alignItems: "start" }}
          >
            {/* ── Form ── */}
            <div className="card fade-in s3" style={{ borderRadius: 28, padding: 26 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#1e1b4b", marginBottom: 20 }}>
                📝 Submit New Request
              </div>

              {/* Tab toggles */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <button
                  className="tab-btn"
                  onClick={() => setTab("temporary")}
                  style={{
                    background: tab === "temporary"
                      ? "linear-gradient(135deg,#6366f1,#818cf8)"
                      : "rgba(99,102,241,.08)",
                    color: tab === "temporary" ? "#fff" : "#6366f1",
                    boxShadow: tab === "temporary" ? "0 6px 18px rgba(99,102,241,.35)" : "none",
                  }}
                >
                  ✈️ Temporary Leave
                </button>
                <button
                  className="tab-btn"
                  onClick={() => setTab("permanent")}
                  style={{
                    background: tab === "permanent"
                      ? "linear-gradient(135deg,#ef4444,#f87171)"
                      : "rgba(239,68,68,.08)",
                    color: tab === "permanent" ? "#fff" : "#ef4444",
                    boxShadow: tab === "permanent" ? "0 6px 18px rgba(239,68,68,.35)" : "none",
                  }}
                >
                  🚪 Leave Room
                </button>
              </div>

              {/* Dates */}
              {tab === "temporary" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  <div>
                    <label className="field-label" style={{ color: "#6366f1" }}>📅 From Date</label>
                    <input type="date" className="inp" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="field-label" style={{ color: "#6366f1" }}>📅 To Date</label>
                    <input type="date" className="inp" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                  </div>
                </div>
              )}

              {/* Permanent warning */}
              {tab === "permanent" && (
                <div style={{
                  background: "linear-gradient(135deg,#fee2e2,#fecaca)",
                  border: "1.5px solid #f87171",
                  borderRadius: 18, padding: 16, marginBottom: 16,
                  fontSize: 13, fontWeight: 700, color: "#991b1b", lineHeight: 1.6,
                }}>
                  ⚠️ This permanently removes you from your current room allocation once approved by admin.
                </div>
              )}

              {/* Reason */}
              <div style={{ marginBottom: 18 }}>
                <label className="field-label" style={{ color: "#7c3aed" }}>💬 Reason</label>
                <textarea
                  rows={5}
                  className="inp"
                  style={{ resize: "none" }}
                  placeholder="Explain your reason..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <button
                className="submit-btn"
                onClick={submitLeave}
                disabled={loading}
                style={{
                  background: tab === "temporary"
                    ? "linear-gradient(135deg,#6366f1,#818cf8)"
                    : "linear-gradient(135deg,#ef4444,#f87171)",
                  boxShadow: tab === "temporary"
                    ? "0 8px 24px rgba(99,102,241,.4)"
                    : "0 8px 24px rgba(239,68,68,.4)",
                }}
              >
                {loading ? "⏳ Submitting..." : tab === "temporary" ? "✈️ Submit Temporary Leave" : "🚪 Request Permanent Leave"}
              </button>
            </div>

            {/* ── Guidelines ── */}
            <div className="card fade-in s4" style={{ borderRadius: 28, padding: 26 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#1e1b4b", marginBottom: 18 }}>
                💡 Quick Guidelines
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { icon: "📅", text: "Temporary leave requires both from and to dates.", color: "#6366f1", bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)" },
                  { icon: "✅", text: "Permanent room leave requires admin approval before taking effect.", color: "#059669", bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)" },
                  { icon: "✍️", text: "Provide a clear, detailed reason for faster approval.", color: "#d97706", bg: "linear-gradient(135deg,#fef3c7,#fde68a)" },
                  { icon: "🔍", text: "Track all your request statuses in the history section below.", color: "#7c3aed", bg: "linear-gradient(135deg,#f3e8ff,#e9d5ff)" },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "14px 16px", borderRadius: 18,
                    background: item.bg,
                    border: `1.5px solid rgba(255,255,255,.7)`,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 12,
                      background: "rgba(255,255,255,.7)",
                      display: "grid", placeItems: "center",
                      fontSize: 18, flexShrink: 0,
                    }}>{item.icon}</div>
                    <div style={{ fontSize: 14, color: item.color, lineHeight: 1.55, fontWeight: 700, paddingTop: 2 }}>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini calendar decoration */}
              <div style={{
                marginTop: 18, padding: "16px 20px", borderRadius: 20,
                background: "linear-gradient(135deg,#bfdbfe,#ddd6fe)",
                border: "1.5px solid rgba(255,255,255,.8)",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{ fontSize: 36 }}>🏝️</div>
                <div>
                  <div style={{ fontWeight: 900, color: "#1e1b4b", fontSize: 15 }}>Plan your break!</div>
                  <div style={{ fontWeight: 600, color: "#4c1d95", fontSize: 13 }}>Submit requests early for smooth approvals.</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── History Header ── */}
          <div className="card fade-in s5" style={{ borderRadius: 24, padding: 18, marginBottom: 16 }}>
            <div style={{
              display: "flex", gap: 12, flexWrap: "wrap",
              justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#1e1b4b", marginBottom: 4 }}>
                  🗂️ My Request History
                </div>
                <div style={{ fontSize: 13, color: "#7c3aed", fontWeight: 700 }}>
                  {filteredLeaves.length} request{filteredLeaves.length !== 1 ? "s" : ""} found
                </div>
              </div>

              <div className="filter-row" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  className="inp"
                  placeholder="🔍 Search..."
                  style={{ width: 220 }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="inp"
                  style={{ width: 150 }}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── History Cards ── */}
          {historyLoading ? (
            <div className="card" style={{ borderRadius: 24, padding: 50, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
              <div style={{ color: "#7c3aed", fontWeight: 800, fontSize: 16 }}>Loading your requests...</div>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="card" style={{ borderRadius: 24, padding: 50, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <div style={{ color: "#7c3aed", fontWeight: 800, fontSize: 16 }}>No requests found</div>
              <div style={{ color: "#a78bfa", fontWeight: 600, fontSize: 13, marginTop: 6 }}>Submit your first leave request above!</div>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
              gap: 16,
            }}>
              {filteredLeaves.map((item, idx) => {
                const isPermanent = item.leaveType === "permanent";
                const cardGradient = isPermanent
                  ? "linear-gradient(145deg,#fff1f2,#fff5f5)"
                  : "linear-gradient(145deg,#f0f4ff,#f5f3ff)";
                const accentColor = isPermanent ? "#ef4444" : "#6366f1";
                const accentLight = isPermanent ? "rgba(239,68,68,.1)" : "rgba(99,102,241,.1)";

                return (
                  <div
                    key={item._id}
                    className={`history-card card fade-in`}
                    style={{
                      animationDelay: `${idx * 0.05}s`,
                      background: cardGradient,
                      borderLeft: `4px solid ${accentColor}`,
                    }}
                  >
                    {/* Card header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 20 }}>{isPermanent ? "🚪" : "✈️"}</span>
                          <span style={{ fontSize: 16, fontWeight: 900, color: "#1e1b4b" }}>
                            {isPermanent ? "Permanent Room Leave" : "Temporary Leave"}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>
                          Requested {formatDate(item.createdAt)}
                        </div>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    {/* Reason box */}
                    <div style={{
                      background: "rgba(255,255,255,.8)",
                      borderRadius: 16, padding: 14,
                      border: `1.5px solid ${accentLight}`,
                      marginBottom: 12,
                    }}>
                      <div style={{
                        fontSize: 10, fontWeight: 900, color: accentColor,
                        textTransform: "uppercase", letterSpacing: ".7px", marginBottom: 6,
                      }}>
                        💬 Reason
                      </div>
                      <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, fontWeight: 600 }}>
                        {item.reason}
                      </div>
                    </div>

                    {/* Dates or permanent notice */}
                    {!isPermanent ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {[
                          ["📅 From", formatDate(item.fromDate), "#6366f1"],
                          ["📅 To", formatDate(item.toDate), "#8b5cf6"],
                          ["⏱️ Duration", daysBetween(item.fromDate, item.toDate), "#a78bfa"],
                        ].map(([label, val, col]) => (
                          <div key={label} style={{
                            background: "rgba(255,255,255,.8)",
                            borderRadius: 14, padding: 12,
                            border: "1.5px solid rgba(99,102,241,.1)",
                            textAlign: "center",
                          }}>
                            <div style={{ fontSize: 10, fontWeight: 900, color: col, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>
                              {label}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#1e1b4b" }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        padding: 14, borderRadius: 14,
                        background: "linear-gradient(135deg,#fee2e2,#fecaca)",
                        border: "1.5px solid #fca5a5",
                        color: "#991b1b", fontWeight: 700, fontSize: 13,
                        display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <span style={{ fontSize: 18 }}>⚠️</span>
                        If approved, you will be removed from your assigned room.
                      </div>
                    )}
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