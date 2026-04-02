import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700;800&display=swap');

  .ad-root {
    font-family: 'Inter', sans-serif;
    background: #f4f7fb;
    min-height: 100vh;
    color: #111827;
  }

  .ad-page {
    padding: 28px;
    display: grid;
    gap: 20px;
  }

  .ad-hero {
    background: linear-gradient(135deg, #e8fbf8, #eef7ff);
    border: 1px solid #e2f2f0;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 28px rgba(17,24,39,.04);
  }

  .ad-hero-top {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .ad-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #8b95a7;
    margin-bottom: 10px;
  }

  .ad-breadcrumb span {
    color: #00b8ae;
    font-weight: 700;
  }

  .ad-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }

  .ad-sub {
    font-size: 0.95rem;
    color: #667085;
    line-height: 1.6;
    max-width: 760px;
  }

  .ad-hero-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .ad-btn-primary {
    border: none;
    background: #58e4de;
    color: #0f3d3c;
    border-radius: 14px;
    padding: 12px 18px;
    font-size: 0.86rem;
    font-weight: 800;
    cursor: pointer;
  }

  .ad-btn-outline {
    border: 1.5px solid #d9ece9;
    background: rgba(255,255,255,.7);
    color: #4b5563;
    border-radius: 14px;
    padding: 12px 16px;
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
  }

  .ad-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .ad-stat {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    padding: 20px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
    min-height: 132px;
  }

  .ad-stat-top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .ad-stat-icon {
    width: 46px;
    height: 46px;
    border-radius: 16px;
    background: #f2fbfa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .ad-stat-chip {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .chip-teal { background: #ecfdf5; color: #047857; }
  .chip-gold { background: #fff7ed; color: #c2410c; }
  .chip-blue { background: #eff6ff; color: #1d4ed8; }
  .chip-red  { background: #fef2f2; color: #b91c1c; }

  .ad-stat-value {
    font-size: 1.9rem;
    font-weight: 800;
    line-height: 1;
    color: #111827;
    margin-bottom: 6px;
  }

  .ad-stat-label {
    font-size: 0.86rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .ad-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 18px;
    align-items: start;
  }

  .ad-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
  }

  .ad-card-pad {
    padding: 20px;
  }

  .ad-card-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .ad-card-title {
    font-size: 1.08rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .ad-card-sub {
    font-size: 0.84rem;
    color: #6b7280;
  }

  .ad-link-btn {
    border: none;
    background: transparent;
    color: #00b8ae;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;
  }

  .ad-quick-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .ad-quick {
    border: 1px solid #edf1f7;
    background: #fbfcfe;
    border-radius: 18px;
    padding: 18px 14px;
    cursor: pointer;
    text-align: left;
    transition: .18s ease;
  }

  .ad-quick:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(17,24,39,.05);
    border-color: #dceeea;
  }

  .ad-quick-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: #eef8f7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    margin-bottom: 12px;
  }

  .ad-quick-title {
    font-size: 0.88rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .ad-quick-sub {
    font-size: 0.76rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .ad-list {
    display: grid;
    gap: 12px;
  }

  .ad-item {
    border: 1px solid #edf1f7;
    border-radius: 18px;
    padding: 14px;
    background: #fff;
  }

  .ad-item-top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .ad-item-title {
    font-size: 0.92rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .ad-item-sub {
    font-size: 0.78rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .ad-pill {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .pill-pending { background: #fff7ed; color: #c2410c; }
  .pill-approved { background: #ecfdf5; color: #047857; }
  .pill-rejected { background: #fef2f2; color: #b91c1c; }
  .pill-progress { background: #eff6ff; color: #1d4ed8; }
  .pill-resolved { background: #ecfdf5; color: #047857; }
  .pill-open { background: #fef2f2; color: #b91c1c; }
  .pill-notice { background: #f5f3ff; color: #7c3aed; }

  .ad-mini-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .ad-mini-box {
    background: #f8fafc;
    border: 1px solid #edf1f7;
    border-radius: 16px;
    padding: 14px;
  }

  .ad-mini-kicker {
    font-size: 0.66rem;
    color: #9ca3af;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }

  .ad-mini-value {
    font-size: 1.15rem;
    font-weight: 800;
    color: #111827;
    line-height: 1;
    margin-bottom: 4px;
  }

  .ad-mini-sub {
    font-size: 0.76rem;
    color: #6b7280;
  }

  .ad-chart {
    display: grid;
    gap: 12px;
  }

  .ad-chart-row {
    display: grid;
    gap: 6px;
  }

  .ad-chart-top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    font-size: 0.82rem;
  }

  .ad-chart-name {
    font-weight: 700;
    color: #374151;
  }

  .ad-chart-value {
    color: #6b7280;
    font-weight: 700;
  }

  .ad-track {
    height: 10px;
    background: #eef2f7;
    border-radius: 999px;
    overflow: hidden;
  }

  .ad-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #58e4de, #93c5fd);
  }

  .ad-notice-box {
    background: linear-gradient(135deg, #fff9ec, #fff5e6);
    border: 1px solid #f6e6c5;
    border-radius: 20px;
    padding: 18px;
  }

  .ad-notice-title {
    font-size: 1rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 6px;
  }

  .ad-notice-sub {
    font-size: 0.84rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 12px;
  }

  .ad-notice-list {
    display: grid;
    gap: 10px;
  }

  .ad-notice-item {
    background: rgba(255,255,255,.75);
    border-radius: 14px;
    padding: 12px 14px;
    border: 1px solid rgba(246,230,197,.8);
  }

  .ad-notice-item-title {
    font-size: 0.86rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .ad-notice-item-time {
    font-size: 0.74rem;
    color: #6b7280;
  }

  .ad-empty {
    font-size: 0.86rem;
    color: #6b7280;
    padding: 8px 0;
  }

  @media (max-width: 1200px) {
    .ad-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 980px) {
    .ad-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .ad-quick-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 720px) {
    .ad-page {
      padding: 16px;
    }

    .ad-stats,
    .ad-quick-grid,
    .ad-mini-metrics {
      grid-template-columns: 1fr;
    }
  }
`;

function timeAgo(dateStr) {
  if (!dateStr) return "Now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function requestPill(status = "") {
  const s = status.toLowerCase();
  if (s === "approved") return "pill-approved";
  if (s === "rejected") return "pill-rejected";
  return "pill-pending";
}

function complaintPill(status = "") {
  const s = status.toLowerCase();
  if (s === "resolved") return "pill-resolved";
  if (s === "in progress") return "pill-progress";
  return "pill-open";
}

function initials(name = "ST") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [requests, setRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [notices, setNotices] = useState([]);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [
        studentsRes,
        roomsRes,
        requestsRes,
        complaintsRes,
        leavesRes,
        visitorsRes,
        noticesRes,
      ] = await Promise.all([
        axios.get(`${API}/users`, { headers }),
        axios.get(`${API}/rooms`, { headers }),
        axios.get(`${API}/requests`, { headers }),
        axios.get(`${API}/complaints`, { headers }),
        axios.get(`${API}/leaves`, { headers }),
        axios.get(`${API}/visitors`, { headers }),
        axios.get(`${API}/notices/admin`, { headers }),
      ]);

      const studentsData = Array.isArray(studentsRes.data)
        ? studentsRes.data
        : studentsRes.data.users || [];

      const roomsData = Array.isArray(roomsRes.data)
        ? roomsRes.data
        : roomsRes.data.rooms || [];

      const requestsData = Array.isArray(requestsRes.data)
        ? requestsRes.data
        : requestsRes.data.requests || [];

      const complaintsData = Array.isArray(complaintsRes.data)
        ? complaintsRes.data
        : complaintsRes.data.complaints || [];

      const leavesData = Array.isArray(leavesRes.data)
        ? leavesRes.data
        : leavesRes.data.leaves || [];

      const visitorsData = Array.isArray(visitorsRes.data)
        ? visitorsRes.data
        : visitorsRes.data.visitors || [];

      const noticesData = Array.isArray(noticesRes.data)
        ? noticesRes.data
        : noticesRes.data.notices || [];

      setStudents(studentsData.filter((u) => u.role === "student"));
      setRooms(roomsData);
      setRequests(requestsData);
      setComplaints(complaintsData);
      setLeaves(leavesData);
      setVisitors(visitorsData);
      setNotices(noticesData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to load admin dashboard", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(
      (r) => (r.status || "").toLowerCase() === "available"
    ).length;
    const fullRooms = rooms.filter(
      (r) => (r.status || "").toLowerCase() === "full"
    ).length;
    const pendingRequests = requests.filter(
      (r) => (r.status || "").toLowerCase() === "pending"
    ).length;
    const openComplaints = complaints.filter((c) => {
      const s = (c.status || "").toLowerCase();
      return s === "pending" || s === "in progress";
    }).length;
    const pendingLeaves = leaves.filter(
      (l) => (l.status || "").toLowerCase() === "pending"
    ).length;
    const pendingVisitors = visitors.filter(
      (v) => (v.status || "").toLowerCase() === "pending"
    ).length;

    return {
      totalStudents,
      totalRooms,
      availableRooms,
      fullRooms,
      pendingRequests,
      openComplaints,
      pendingLeaves,
      pendingVisitors,
    };
  }, [students, rooms, requests, complaints, leaves, visitors]);

  const occupancyByWing = useMemo(() => {
    const wingMap = {};

    rooms.forEach((room) => {
      const wing = room.wing || "Unknown";
      const capacity = Number(room.capacity || 0);
      const filled = Array.isArray(room.occupants) ? room.occupants.length : 0;

      if (!wingMap[wing]) {
        wingMap[wing] = { total: 0, filled: 0 };
      }

      wingMap[wing].total += capacity;
      wingMap[wing].filled += filled;
    });

    return Object.entries(wingMap).map(([wing, data]) => ({
      wing,
      percent: data.total > 0 ? Math.round((data.filled / data.total) * 100) : 0,
      label: `${data.filled}/${data.total} occupied`,
    }));
  }, [rooms]);

  const latestRequests = useMemo(() => requests.slice(0, 5), [requests]);
  const latestComplaints = useMemo(() => complaints.slice(0, 5), [complaints]);
  const latestNotices = useMemo(() => notices.slice(0, 3), [notices]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="ad-root">
        <div className="ad-page">
          <div className="ad-hero">
            <div className="ad-hero-top">
              <div>
                <div className="ad-breadcrumb">
                  Dashboard › Admin › <span>Overview</span>
                </div>
                <div className="ad-title">Hostel Operations Dashboard</div>
                <div className="ad-sub">
                  Monitor room occupancy, requests, complaints, notices, and daily residence operations from one place.
                  Today is {today}.
                </div>
              </div>

              <div className="ad-hero-actions">
                <button className="ad-btn-outline" onClick={() => navigate("/admin/notices")}>
                  📢 Post Notice
                </button>
                <button className="ad-btn-primary" onClick={() => navigate("/admin/add-room")}>
                  ➕ Add Room
                </button>
              </div>
            </div>
          </div>

          <div className="ad-stats">
            <div className="ad-stat">
              <div className="ad-stat-top">
                <div className="ad-stat-icon">👥</div>
                <div className="ad-stat-chip chip-blue">Live</div>
              </div>
              <div className="ad-stat-value">{loading ? "—" : stats.totalStudents}</div>
              <div className="ad-stat-label">Total active students in the residence system</div>
            </div>

            <div className="ad-stat">
              <div className="ad-stat-top">
                <div className="ad-stat-icon">🏠</div>
                <div className="ad-stat-chip chip-teal">Rooms</div>
              </div>
              <div className="ad-stat-value">{loading ? "—" : stats.availableRooms}</div>
              <div className="ad-stat-label">Available rooms ready for assignment</div>
            </div>

            <div className="ad-stat">
              <div className="ad-stat-top">
                <div className="ad-stat-icon">📝</div>
                <div className="ad-stat-chip chip-gold">Pending</div>
              </div>
              <div className="ad-stat-value">{loading ? "—" : stats.pendingRequests}</div>
              <div className="ad-stat-label">Room requests awaiting review or approval</div>
            </div>

            <div className="ad-stat">
              <div className="ad-stat-top">
                <div className="ad-stat-icon">⚠️</div>
                <div className="ad-stat-chip chip-red">Attention</div>
              </div>
              <div className="ad-stat-value">{loading ? "—" : stats.openComplaints}</div>
              <div className="ad-stat-label">Open complaint issues requiring hostel follow-up</div>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-pad">
              <div className="ad-card-head">
                <div>
                  <div className="ad-card-title">Quick Actions</div>
                  <div className="ad-card-sub">Jump into the most common admin tasks.</div>
                </div>
              </div>

              <div className="ad-quick-grid">
                <button className="ad-quick" onClick={() => navigate("/admin/add-room")}>
                  <div className="ad-quick-icon">➕</div>
                  <div className="ad-quick-title">Add Room</div>
                  <div className="ad-quick-sub">Create a new room listing with pricing and details.</div>
                </button>

                <button className="ad-quick" onClick={() => navigate("/admin/requests")}>
                  <div className="ad-quick-icon">☰</div>
                  <div className="ad-quick-title">Manage Requests</div>
                  <div className="ad-quick-sub">Approve or reject pending room requests.</div>
                </button>

                <button className="ad-quick" onClick={() => navigate("/admin/complaints")}>
                  <div className="ad-quick-icon">⚑</div>
                  <div className="ad-quick-title">Resolve Complaints</div>
                  <div className="ad-quick-sub">Track room issues and update status quickly.</div>
                </button>

                <button className="ad-quick" onClick={() => navigate("/admin/notices")}>
                  <div className="ad-quick-icon">📢</div>
                  <div className="ad-quick-title">Post Notice</div>
                  <div className="ad-quick-sub">Send policy, fee, emergency, or event updates.</div>
                </button>
              </div>
            </div>
          </div>

          <div className="ad-grid">
            <div className="ad-card">
              <div className="ad-card-pad">
                <div className="ad-card-head">
                  <div>
                    <div className="ad-card-title">Recent Room Requests</div>
                    <div className="ad-card-sub">Most recent student room applications.</div>
                  </div>
                  <button className="ad-link-btn" onClick={() => navigate("/admin/requests")}>
                    View All →
                  </button>
                </div>

                <div className="ad-list">
                  {loading ? (
                    <div className="ad-empty">Loading requests...</div>
                  ) : latestRequests.length === 0 ? (
                    <div className="ad-empty">No room requests yet.</div>
                  ) : (
                    latestRequests.map((item) => (
                      <div className="ad-item" key={item._id}>
                        <div className="ad-item-top">
                          <div>
                            <div className="ad-item-title">
                              {item.student?.name || item.user?.name || "Student"}
                            </div>
                            <div className="ad-item-sub">
                              Room {item.room?.roomNumber || "N/A"} • {timeAgo(item.createdAt)}
                            </div>
                          </div>

                          <span className={`ad-pill ${requestPill(item.status)}`}>
                            {item.status || "Pending"}
                          </span>
                        </div>

                        <div className="ad-item-sub">
                          {item.student?.email || item.user?.email || "No email available"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="ad-card">
              <div className="ad-card-pad">
                <div className="ad-card-head">
                  <div>
                    <div className="ad-card-title">Operations Snapshot</div>
                    <div className="ad-card-sub">Current request and movement summary.</div>
                  </div>
                </div>

                <div className="ad-mini-metrics">
                  <div className="ad-mini-box">
                    <div className="ad-mini-kicker">LEAVE REQUESTS</div>
                    <div className="ad-mini-value">{loading ? "—" : stats.pendingLeaves}</div>
                    <div className="ad-mini-sub">Pending leave approvals</div>
                  </div>

                  <div className="ad-mini-box">
                    <div className="ad-mini-kicker">VISITOR REQUESTS</div>
                    <div className="ad-mini-value">{loading ? "—" : stats.pendingVisitors}</div>
                    <div className="ad-mini-sub">Pending visitor entries</div>
                  </div>

                  <div className="ad-mini-box">
                    <div className="ad-mini-kicker">TOTAL ROOMS</div>
                    <div className="ad-mini-value">{loading ? "—" : stats.totalRooms}</div>
                    <div className="ad-mini-sub">Configured room inventory</div>
                  </div>

                  <div className="ad-mini-box">
                    <div className="ad-mini-kicker">FULL ROOMS</div>
                    <div className="ad-mini-value">{loading ? "—" : stats.fullRooms}</div>
                    <div className="ad-mini-sub">Rooms currently filled</div>
                  </div>
                </div>

                <div style={{ height: 18 }} />

                <div className="ad-card-title" style={{ fontSize: "1rem", marginBottom: 10 }}>
                  Occupancy by Wing
                </div>

                <div className="ad-chart">
                  {loading ? (
                    <div className="ad-empty">Loading occupancy...</div>
                  ) : occupancyByWing.length === 0 ? (
                    <div className="ad-empty">No wing data available.</div>
                  ) : (
                    occupancyByWing.map((wing) => (
                      <div className="ad-chart-row" key={wing.wing}>
                        <div className="ad-chart-top">
                          <div className="ad-chart-name">{wing.wing}</div>
                          <div className="ad-chart-value">{wing.label}</div>
                        </div>
                        <div className="ad-track">
                          <div className="ad-fill" style={{ width: `${wing.percent}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              <div className="ad-card">
                <div className="ad-card-pad">
                  <div className="ad-card-head">
                    <div>
                      <div className="ad-card-title">Recent Complaints</div>
                      <div className="ad-card-sub">Latest reported student issues.</div>
                    </div>
                    <button className="ad-link-btn" onClick={() => navigate("/admin/complaints")}>
                      Open →
                    </button>
                  </div>

                  <div className="ad-list">
                    {loading ? (
                      <div className="ad-empty">Loading complaints...</div>
                    ) : latestComplaints.length === 0 ? (
                      <div className="ad-empty">No complaints found.</div>
                    ) : (
                      latestComplaints.map((item) => (
                        <div className="ad-item" key={item._id}>
                          <div className="ad-item-top">
                            <div>
                              <div className="ad-item-title">{item.title || "Complaint"}</div>
                              <div className="ad-item-sub">
                                {item.student?.name || "Student"} • {timeAgo(item.createdAt)}
                              </div>
                            </div>

                            <span className={`ad-pill ${complaintPill(item.status)}`}>
                              {item.status || "Pending"}
                            </span>
                          </div>

                          <div className="ad-item-sub">
                            {item.room?.roomNumber ? `Room ${item.room.roomNumber}` : "No room linked"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="ad-notice-box">
                <div className="ad-notice-title">Latest Notices</div>
                <div className="ad-notice-sub">
                  Recently published announcements visible to students and staff.
                </div>

                <div className="ad-notice-list">
                  {loading ? (
                    <div className="ad-empty">Loading notices...</div>
                  ) : latestNotices.length === 0 ? (
                    <div className="ad-empty">No notices posted yet.</div>
                  ) : (
                    latestNotices.map((notice) => (
                      <div className="ad-notice-item" key={notice._id}>
                        <div className="ad-notice-item-title">{notice.title}</div>
                        <div className="ad-notice-item-time">
                          {notice.category} • {timeAgo(notice.createdAt)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ marginTop: 14 }}>
                  <button className="ad-btn-outline" onClick={() => navigate("/admin/notices")}>
                    Manage Notices
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;