import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .ad-root { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ad-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
    animation: fadeUp .35s ease both;
  }
  .ad-header h1 { font-size: 1.5rem; font-weight: 800; color: #1a1d23; letter-spacing: -0.02em; }
  .ad-header p  { font-size: 0.82rem; color: #8a90a0; margin-top: 3px; }
  .ad-header-actions { display: flex; gap: 10px; }
  .btn-sm-outline {
    padding: 8px 16px; border: 1.5px solid #e2e5ec; border-radius: 9px;
    background: #fff; font-family: inherit; font-size: 0.8rem; font-weight: 600;
    color: #4a5060; cursor: pointer; transition: border-color .15s;
  }
  .btn-sm-outline:hover { border-color: #00d4c8; }
  .btn-sm-primary {
    padding: 8px 16px; background: #00d4c8; color: #fff; border: none;
    border-radius: 9px; font-family: inherit; font-size: 0.8rem;
    font-weight: 700; cursor: pointer; transition: opacity .15s;
  }
  .btn-sm-primary:hover { opacity: .88; }

  .ad-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 24px;
  }
  .ad-stat {
    background: #fff; border: 1px solid #eef0f4; border-radius: 14px;
    padding: 18px 20px; animation: fadeUp .4s ease both;
  }
  .ad-stat:nth-child(1){animation-delay:.04s}
  .ad-stat:nth-child(2){animation-delay:.08s}
  .ad-stat:nth-child(3){animation-delay:.12s}
  .ad-stat:nth-child(4){animation-delay:.16s}
  .ad-stat:nth-child(5){animation-delay:.20s}
  .ad-stat:nth-child(6){animation-delay:.24s}
  .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .stat-ico {
    width: 36px; height: 36px; border-radius: 10px; background: #e8faf9;
    display: flex; align-items: center; justify-content: center; font-size: 1rem;
  }
  .stat-trend { font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 99px; }
  .trend-up   { background: #e6faf2; color: #00a36c; }
  .trend-down { background: #fff0f0; color: #e05555; }
  .trend-warn { background: #fff8e6; color: #d4800a; }
  .trend-info { background: #e8f4ff; color: #2563eb; }
  .stat-val   { font-size: 1.7rem; font-weight: 800; color: #1a1d23; line-height: 1; }
  .stat-lbl   { font-size: 0.72rem; color: #9aa0ae; margin-top: 3px; }

  .ad-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-bottom: 20px;
  }
  .ad-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 18px;
    margin-bottom: 20px;
  }

  .ad-card {
    background: #fff; border: 1px solid #eef0f4; border-radius: 16px;
    padding: 20px 22px; animation: fadeUp .4s ease .12s both;
  }
  .ad-card-hdr {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
  }
  .ad-card-title { font-size: 0.92rem; font-weight: 800; color: #1a1d23; }
  .ad-card-link  {
    font-size: 0.75rem; font-weight: 600; color: #00b8b0;
    background: none; border: none; cursor: pointer; font-family: inherit;
  }

  .req-list { display: flex; flex-direction: column; gap: 10px; }
  .req-row  {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 10px;
    border: 1.5px solid #eef0f4; transition: background .15s;
  }
  .req-row:hover { background: #f8fffe; border-color: #d0f0ed; }
  .req-ava {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 800; color: #fff;
  }
  .req-info { flex: 1; min-width: 0; }
  .req-name { font-size: 0.8rem; font-weight: 700; color: #1a1d23; }
  .req-meta { font-size: 0.68rem; color: #9aa0ae; }
  .req-pill {
    font-size: 0.65rem; font-weight: 700; padding: 3px 9px; border-radius: 99px;
    white-space: nowrap;
  }
  .pill-pending  { background: #fff8e6; color: #d4800a; }
  .pill-approved { background: #e6faf2; color: #00a36c; }
  .pill-rejected { background: #fff0f0; color: #e05555; }
  .pill-review   { background: #e8f4ff; color: #2563eb; }

  .comp-list { display: flex; flex-direction: column; gap: 8px; }
  .comp-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 12px; border-radius: 10px; border: 1.5px solid #eef0f4;
  }
  .comp-icon { font-size: 1rem; margin-top: 1px; flex-shrink: 0; }
  .comp-title { font-size: 0.8rem; font-weight: 700; color: #1a1d23; }
  .comp-sub   { font-size: 0.68rem; color: #9aa0ae; }
  .comp-status{
    margin-left: auto; font-size: 0.65rem; font-weight: 700;
    padding: 3px 9px; border-radius: 99px; white-space: nowrap; align-self: center;
  }
  .cs-open     { background: #fff0f0; color: #e05555; }
  .cs-progress { background: #fff8e6; color: #d4800a; }
  .cs-resolved { background: #e6faf2; color: #00a36c; }

  .occ-list { display: flex; flex-direction: column; gap: 12px; }
  .occ-row  {}
  .occ-top  { display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 5px; }
  .occ-name { font-weight: 600; color: #1a1d23; }
  .occ-val  { color: #9aa0ae; }
  .occ-track { height: 6px; background: #f0f2f6; border-radius: 99px; overflow: hidden; }
  .occ-fill  { height: 100%; border-radius: 99px; transition: width .8s cubic-bezier(.22,1,.36,1); }

  .notice-list { display: flex; flex-direction: column; gap: 10px; }
  .notice-item {
    display: flex; gap: 10px; align-items: flex-start;
    padding: 10px 0; border-bottom: 1px solid #f5f6f9;
  }
  .notice-item:last-child { border-bottom: none; }
  .notice-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .notice-text{ font-size: 0.78rem; color: #4a5060; flex: 1; line-height: 1.4; }
  .notice-time{ font-size: 0.68rem; color: #b0b6c3; white-space: nowrap; }

  .quick-grid {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 20px;
    animation: fadeUp .4s ease .08s both;
  }
  .quick-btn {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 16px 10px; background: #fff; border: 1.5px solid #eef0f4;
    border-radius: 14px; cursor: pointer; transition: border-color .15s, background .15s;
    font-family: inherit;
  }
  .quick-btn:hover { border-color: #00d4c8; background: #f8fffe; }
  .quick-btn-icon  { font-size: 1.4rem; }
  .quick-btn-label { font-size: 0.72rem; font-weight: 700; color: #4a5060; text-align: center; }

  .empty-state {
    text-align: center; padding: 24px 0;
    font-size: 0.8rem; color: #b0b6c3;
  }

  @media (max-width: 1100px) {
    .ad-stats { grid-template-columns: repeat(3,1fr); }
    .ad-grid-3 { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .ad-stats { grid-template-columns: repeat(2,1fr); }
    .ad-grid, .ad-grid-3 { grid-template-columns: 1fr; }
    .quick-grid { grid-template-columns: repeat(2,1fr); }
  }
`;

const WING_COLORS = ["#00d4c8", "#f59e0b", "#10b981", "#6366f1", "#f43f5e", "#3b82f6"];

const NOTICES = [
  { dot: "#00d4c8", text: "Semester fee deadline: 15th April 2026.",         time: "Today"  },
  { dot: "#f59e0b", text: "Maintenance scheduled for Block D on 5th April.", time: "2d ago" },
  { dot: "#10b981", text: "New visitor policy effective from 1st April.",     time: "3d ago" },
];

const QUICK_ACTIONS = [
  { icon: "➕", label: "Add Room", onclick: () => navigate("/admin/add-room") },
  { icon: "📢", label: "Post Notice", onclick: () => navigate("/admin/post-notice") },
  { icon: "✅", label: "Approve Req.", onclick: () => navigate("/admin/approve-requests") },
  { icon: "📊", label: "Export Report", onclick: () => navigate("/admin/export-report") },
  { icon: "💬", label: "Message All", onclick: () => navigate("/admin/message-all") },
  { icon: "🔧", label: "Maintenance", onclick: () => navigate("/admin/maintenance")  },
  { icon: "✈",  label: "Leave Mgmt"   },
  { icon: "👤", label: "Add Student"   },
];

// avatar background per name
const avatarBg = (name = "") => {
  const colors = [
    "linear-gradient(135deg,#f4a6a6,#e88)",
    "linear-gradient(135deg,#a6c8f4,#6af)",
    "linear-gradient(135deg,#c4a6f4,#a6f)",
    "linear-gradient(135deg,#a6f4c8,#6fa)",
    "linear-gradient(135deg,#f4d4a6,#fa6)",
    "linear-gradient(135deg,#f4a6d4,#f6a)",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

const pillClass = (status = "") => {
  switch (status.toLowerCase()) {
    case "approved": return "pill-approved";
    case "rejected": return "pill-rejected";
    case "review":   return "pill-review";
    default:         return "pill-pending";
  }
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    availableRooms: 0,
    pendingRequests: 0,
    totalRooms: 0,
    maintenanceRooms: 0,
    fullRooms: 0,
  });
  const [requests, setRequests]     = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [loading, setLoading]       = useState(true);
   const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, roomsRes, requestsRes] = await Promise.all([
        axios.get(`${API}/users`,    { headers }),
        axios.get(`${API}/rooms`,    { headers }),
        axios.get(`${API}/requests`, { headers }),
      ]);

      const roomsData    = Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data.rooms    || [];
      const requestsData = Array.isArray(requestsRes.data) ? requestsRes.data : requestsRes.data.requests || [];
      const usersData    = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users    || [];

      // ── Stats ──
    setStats({
  users: usersData.length,
  availableRooms: roomsData.filter(
    r => r.status?.toLowerCase().trim() === "available"
  ).length,
  pendingRequests: requestsData.filter(
    r => r.status?.toLowerCase() === "pending"
  ).length,
  totalRooms: roomsData.length,
  maintenanceRooms: roomsData.filter(
    r => r.status?.toLowerCase() === "maintenance"
  ).length,
  fullRooms: roomsData.filter(
    r => r.status?.toLowerCase() === "full"
  ).length,
});

      // ── Requests ──
      setRequests(requestsData);

      // ── Occupancy per wing ──
      const wingMap = {};
      roomsData.forEach(room => {
        if (!wingMap[room.wing]) wingMap[room.wing] = { total: 0, filled: 0 };
        wingMap[room.wing].total  += room.capacity;
        wingMap[room.wing].filled += room.occupants.length;
      });
      setOccupancyData(
        Object.entries(wingMap).map(([name, { total, filled }], i) => ({
          name,
          pct:   total > 0 ? Math.round((filled / total) * 100) : 0,
          color: WING_COLORS[i % WING_COLORS.length],
        }))
      );

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <Layout role="admin">
      <style>{css}</style>
      <div className="ad-root">

        {/* ── Header ── */}
        <div className="ad-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Overview of hostel operations — {today}</p>
          </div>
          <div className="ad-header-actions">
            <button className="btn-sm-outline">📊 Export Report</button>
            <button className="btn-sm-primary" onClick={() => navigate("/admin/add-room")}>  ➕ Add Room </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="ad-stats">
          {[
            { ico:"🛏",  val: stats.availableRooms,  lbl:"Available Rooms",   trend:"Live",   tc:"trend-up"   },
            { ico:"👥",  val: stats.users,            lbl:"Total Students",    trend:"Live",   tc:"trend-up"   },
            { ico:"☰",   val: stats.pendingRequests,  lbl:"Pending Requests",  trend:"Review", tc:"trend-warn" },
            { ico:"🏠",  val: stats.totalRooms,       lbl:"Total Rooms",       trend:"All",    tc:"trend-info" },
            { ico:"🔧",  val: stats.maintenanceRooms, lbl:"Under Maintenance", trend:"Check",  tc:"trend-warn" },
            { ico:"🔴",  val: stats.fullRooms,        lbl:"Full Rooms",        trend:"Full",   tc:"trend-down" },
          ].map((s, i) => (
            <div key={i} className="ad-stat">
              <div className="stat-top">
                <div className="stat-ico">{s.ico}</div>
                <span className={`stat-trend ${s.tc}`}>{s.trend}</span>
              </div>
              <div className="stat-val">
                {loading ? "—" : s.val}
              </div>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div className="quick-grid">
          {QUICK_ACTIONS.map((a, i) => (
            <button key={i} className="quick-btn">
              <span className="quick-btn-icon">{a.icon}</span>
              <span className="quick-btn-label">{a.label}</span>
            </button>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="ad-grid">

          {/* Pending Requests — real data */}
          <div className="ad-card">
            <div className="ad-card-hdr">
              <span className="ad-card-title">Recent Requests</span>
              <button className="ad-card-link">View All →</button>
            </div>
            <div className="req-list">
              {loading && <div className="empty-state">Loading...</div>}
              {!loading && requests.length === 0 && (
                <div className="empty-state">No requests yet.</div>
              )}
              {!loading && requests.slice(0, 5).map((r, i) => {
                const name = r.student?.name || r.student?.email || "Student";
                const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <div key={i} className="req-row">
                    <div className="req-ava" style={{ background: avatarBg(name) }}>
                      {initials}
                    </div>
                    <div className="req-info">
                      <div className="req-name">{name}</div>
                      <div className="req-meta">
                        Room {r.room?.roomNumber || "N/A"} · {timeAgo(r.createdAt)}
                      </div>
                    </div>
                    <span className={`req-pill ${pillClass(r.status)}`}>{r.status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending only — filtered view */}
          <div className="ad-card">
            <div className="ad-card-hdr">
              <span className="ad-card-title">Pending Approvals</span>
              <button className="ad-card-link">View All →</button>
            </div>
            <div className="req-list">
              {loading && <div className="empty-state">Loading...</div>}
              {!loading && requests.filter(r => r.status === "Pending").length === 0 && (
                <div className="empty-state">No pending requests 🎉</div>
              )}
              {!loading && requests
                .filter(r => r.status === "Pending")
                .slice(0, 5)
                .map((r, i) => {
                  const name = r.student?.name || r.student?.email || "Student";
                  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <div key={i} className="req-row">
                      <div className="req-ava" style={{ background: avatarBg(name) }}>
                        {initials}
                      </div>
                      <div className="req-info">
                        <div className="req-name">{name}</div>
                        <div className="req-meta">
                          Room {r.room?.roomNumber || "N/A"} · {timeAgo(r.createdAt)}
                        </div>
                      </div>
                      <span className="req-pill pill-pending">Pending</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* ── Bottom grid ── */}
        <div className="ad-grid-3">

          {/* Wing Occupancy — real data */}
          <div className="ad-card">
            <div className="ad-card-hdr">
              <span className="ad-card-title">Wing Occupancy</span>
            </div>
            <div className="occ-list">
              {loading && <div className="empty-state">Loading...</div>}
              {!loading && occupancyData.length === 0 && (
                <div className="empty-state">No room data.</div>
              )}
              {!loading && occupancyData.map((o, i) => (
                <div key={i} className="occ-row">
                  <div className="occ-top">
                    <span className="occ-name">{o.name}</span>
                    <span className="occ-val">{o.pct}%</span>
                  </div>
                  <div className="occ-track">
                    <div className="occ-fill" style={{ width: `${o.pct}%`, background: o.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notices — static (until you have a notices API) */}
          <div className="ad-card">
            <div className="ad-card-hdr">
              <span className="ad-card-title">Recent Notices</span>
              <button className="ad-card-link">Post →</button>
            </div>
            <div className="notice-list">
              {NOTICES.map((n, i) => (
                <div key={i} className="notice-item">
                  <div className="notice-dot" style={{ background: n.dot }} />
                  <div className="notice-text">{n.text}</div>
                  <div className="notice-time">{n.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Status Summary */}
          <div className="ad-card">
            <div className="ad-card-hdr">
              <span className="ad-card-title">Room Status Summary</span>
            </div>
            <div className="occ-list">
              {[
                { label: "Available",    val: stats.availableRooms,   color: "#00d4c8" },
                { label: "Full",         val: stats.fullRooms,         color: "#ff6b6b" },
                { label: "Maintenance",  val: stats.maintenanceRooms,  color: "#f59e0b" },
              ].map((item, i) => {
                const pct = stats.totalRooms > 0
                  ? Math.round((item.val / stats.totalRooms) * 100)
                  : 0;
                return (
                  <div key={i} className="occ-row">
                    <div className="occ-top">
                      <span className="occ-name">{item.label}</span>
                      <span className="occ-val">
                        {loading ? "—" : `${item.val} rooms (${pct}%)`}
                      </span>
                    </div>
                    <div className="occ-track">
                      <div className="occ-fill" style={{ width: `${pct}%`, background: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;