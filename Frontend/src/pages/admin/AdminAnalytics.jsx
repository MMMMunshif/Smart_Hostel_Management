import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  :root {
    --bg: #f6f8fb;
    --card: #ffffff;
    --text: #111827;
    --muted: #6b7280;
    --line: #e8edf4;
    --soft: #f8fafc;
    --teal: #58e4de;
    --teal-dark: #0f3d3c;
    --blue: #2563eb;
    --green: #10b981;
    --orange: #f59e0b;
    --red: #ef4444;
    --purple: #8b5cf6;
    --shadow: 0 10px 26px rgba(17,24,39,.04);
  }

  * { box-sizing: border-box; }

  .aa-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    padding: 28px;
    color: var(--text);
  }

  .aa-shell {
    display: grid;
    gap: 20px;
  }

  .aa-hero {
    background: linear-gradient(135deg, #e8fbf8, #eef6ff);
    border: 1px solid #dfeef0;
    border-radius: 26px;
    padding: 26px;
    box-shadow: var(--shadow);
  }

  .aa-breadcrumb {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: .76rem;
    color: #8a94a6;
    margin-bottom: 10px;
  }

  .aa-breadcrumb span {
    color: #00b8ae;
    font-weight: 700;
  }

  .aa-hero-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }

  .aa-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -.03em;
    margin-bottom: 8px;
  }

  .aa-sub {
    font-size: .95rem;
    color: #667085;
    line-height: 1.7;
    max-width: 760px;
  }

  .aa-refresh {
    border: none;
    background: #111827;
    color: #fff;
    border-radius: 14px;
    padding: 12px 16px;
    font-size: .84rem;
    font-weight: 800;
    font-family: inherit;
    cursor: pointer;
  }

  .aa-refresh:hover {
    opacity: .92;
  }

  .aa-top {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .aa-stat {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 22px;
    padding: 20px;
    box-shadow: var(--shadow);
    position: relative;
    overflow: hidden;
  }

  .aa-stat::after {
    content: "";
    position: absolute;
    right: -12px;
    bottom: -18px;
    width: 78px;
    height: 78px;
    border-radius: 50%;
    background: rgba(88,228,222,.12);
  }

  .aa-stat-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    margin-bottom: 14px;
    position: relative;
    z-index: 1;
  }

  .aa-stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #eefaf8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
  }

  .aa-stat-chip {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: .68rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .chip-blue { background: #eff6ff; color: #1d4ed8; }
  .chip-green { background: #ecfdf5; color: #047857; }
  .chip-orange { background: #fff7ed; color: #c2410c; }
  .chip-red { background: #fef2f2; color: #b91c1c; }

  .aa-stat-value {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.9rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 6px;
    position: relative;
    z-index: 1;
  }

  .aa-stat-label {
    color: var(--muted);
    font-size: .86rem;
    line-height: 1.5;
    position: relative;
    z-index: 1;
  }

  .aa-grid {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 18px;
    align-items: start;
  }

  .aa-card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 22px;
    box-shadow: var(--shadow);
    padding: 20px;
  }

  .aa-card-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .aa-card-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.02rem;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .aa-card-sub {
    font-size: .83rem;
    color: var(--muted);
  }

  .aa-bars {
    display: grid;
    gap: 14px;
  }

  .aa-bar-row {
    display: grid;
    gap: 7px;
  }

  .aa-bar-top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    font-size: .84rem;
  }

  .aa-bar-name {
    font-weight: 700;
    color: #374151;
  }

  .aa-bar-val {
    color: var(--muted);
    font-weight: 700;
  }

  .aa-track {
    height: 12px;
    background: #eef2f7;
    border-radius: 999px;
    overflow: hidden;
  }

  .aa-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #58e4de, #93c5fd);
  }

  .aa-fill-orange { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .aa-fill-red { background: linear-gradient(90deg, #ef4444, #f87171); }
  .aa-fill-green { background: linear-gradient(90deg, #10b981, #34d399); }
  .aa-fill-purple { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }

  .aa-mini-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .aa-mini {
    background: var(--soft);
    border: 1px solid #edf1f7;
    border-radius: 18px;
    padding: 16px;
  }

  .aa-mini-kicker {
    font-size: .66rem;
    color: #9ca3af;
    font-weight: 800;
    letter-spacing: .08em;
    margin-bottom: 7px;
  }

  .aa-mini-value {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 5px;
  }

  .aa-mini-sub {
    font-size: .78rem;
    color: var(--muted);
    line-height: 1.5;
  }

  .aa-insight-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .aa-insight {
    background: linear-gradient(135deg, #fbfcff, #f8fafc);
    border: 1px solid #edf1f7;
    border-radius: 18px;
    padding: 16px;
  }

  .aa-insight-title {
    font-size: .82rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 6px;
  }

  .aa-insight-text {
    font-size: .79rem;
    color: var(--muted);
    line-height: 1.6;
  }

  .aa-list {
    display: grid;
    gap: 12px;
  }

  .aa-item {
    border: 1px solid #edf1f7;
    border-radius: 18px;
    padding: 14px;
    background: #fff;
  }

  .aa-item-top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .aa-item-title {
    font-weight: 800;
    font-size: .92rem;
    color: #111827;
    margin-bottom: 4px;
  }

  .aa-item-sub {
    font-size: .79rem;
    color: var(--muted);
    line-height: 1.5;
  }

  .aa-pill {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: .68rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .pill-pending { background: #fff7ed; color: #c2410c; }
  .pill-progress { background: #eff6ff; color: #1d4ed8; }
  .pill-resolved { background: #ecfdf5; color: #047857; }
  .pill-approved { background: #ecfdf5; color: #047857; }
  .pill-rejected { background: #fef2f2; color: #b91c1c; }

  .aa-empty {
    color: var(--muted);
    font-size: .87rem;
    padding: 10px 0;
  }

  @media (max-width: 1100px) {
    .aa-top { grid-template-columns: repeat(2, 1fr); }
    .aa-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 720px) {
    .aa-root { padding: 16px; }
    .aa-top,
    .aa-mini-grid,
    .aa-insight-grid { grid-template-columns: 1fr; }
  }
`;

function normalize(v = "") {
  return v.toString().toLowerCase().trim();
}

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

function statusPill(status = "") {
  const s = normalize(status);
  if (s === "resolved" || s === "approved") return "pill-resolved";
  if (s === "rejected") return "pill-rejected";
  if (s === "in progress") return "pill-progress";
  return "pill-pending";
}

function AdminAnalytics() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [requests, setRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [notices, setNotices] = useState([]);

  const fetchAnalytics = async () => {
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

      setStudents(
        (Array.isArray(studentsRes.data) ? studentsRes.data : studentsRes.data.users || [])
          .filter((u) => u.role === "student")
      );
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data.rooms || []);
      setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : requestsRes.data.requests || []);
      setComplaints(Array.isArray(complaintsRes.data) ? complaintsRes.data : complaintsRes.data.complaints || []);
      setLeaves(Array.isArray(leavesRes.data) ? leavesRes.data : leavesRes.data.leaves || []);
      setVisitors(Array.isArray(visitorsRes.data) ? visitorsRes.data : visitorsRes.data.visitors || []);
      setNotices(Array.isArray(noticesRes.data) ? noticesRes.data : noticesRes.data.notices || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to load analytics", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const metrics = useMemo(() => {
    const totalStudents = students.length;
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((r) => normalize(r.status) === "available").length;
    const fullRooms = rooms.filter((r) => normalize(r.status) === "full").length;
    const maintenanceRooms = rooms.filter((r) => normalize(r.status) === "maintenance").length;
    const pendingRequests = requests.filter((r) => normalize(r.status) === "pending").length;
    const openComplaints = complaints.filter((c) => {
      const s = normalize(c.status);
      return s === "pending" || s === "in progress";
    }).length;

    const totalCapacity = rooms.reduce((sum, room) => sum + Number(room.capacity || 0), 0);
    const occupiedBeds = rooms.reduce(
      (sum, room) => sum + (Array.isArray(room.occupants) ? room.occupants.length : 0),
      0
    );
    const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

    return {
      totalStudents,
      totalRooms,
      availableRooms,
      fullRooms,
      maintenanceRooms,
      pendingRequests,
      openComplaints,
      occupancyRate,
      occupiedBeds,
      totalCapacity,
    };
  }, [students, rooms, requests, complaints]);

  const roomStatusData = useMemo(() => {
    const total = rooms.length || 1;
    const available = rooms.filter((r) => normalize(r.status) === "available").length;
    const full = rooms.filter((r) => normalize(r.status) === "full").length;
    const maintenance = rooms.filter((r) => normalize(r.status) === "maintenance").length;

    return [
      { name: "Available Rooms", value: available, pct: Math.round((available / total) * 100), fill: "aa-fill-green" },
      { name: "Full Rooms", value: full, pct: Math.round((full / total) * 100), fill: "aa-fill-red" },
      { name: "Maintenance Rooms", value: maintenance, pct: Math.round((maintenance / total) * 100), fill: "aa-fill-orange" },
    ];
  }, [rooms]);

  const requestSummary = useMemo(() => {
    return [
      {
        label: "Room Requests",
        value: requests.length,
        pending: requests.filter((r) => normalize(r.status) === "pending").length,
      },
      {
        label: "Leave Requests",
        value: leaves.length,
        pending: leaves.filter((r) => normalize(r.status) === "pending").length,
      },
      {
        label: "Visitor Requests",
        value: visitors.length,
        pending: visitors.filter((r) => normalize(r.status) === "pending").length,
      },
      {
        label: "Complaints",
        value: complaints.length,
        pending: complaints.filter((r) => {
          const s = normalize(r.status);
          return s === "pending" || s === "in progress";
        }).length,
      },
    ];
  }, [requests, leaves, visitors, complaints]);

  const occupancyByWing = useMemo(() => {
    const wingMap = {};

    rooms.forEach((room) => {
      const wing = room.wing || "Unknown";
      const capacity = Number(room.capacity || 0);
      const occupied = Array.isArray(room.occupants) ? room.occupants.length : 0;

      if (!wingMap[wing]) wingMap[wing] = { capacity: 0, occupied: 0 };
      wingMap[wing].capacity += capacity;
      wingMap[wing].occupied += occupied;
    });

    return Object.entries(wingMap).map(([wing, data]) => ({
      wing,
      occupied: data.occupied,
      capacity: data.capacity,
      pct: data.capacity > 0 ? Math.round((data.occupied / data.capacity) * 100) : 0,
    }));
  }, [rooms]);

  const complaintStatus = useMemo(() => {
    const total = complaints.length || 1;
    const pending = complaints.filter((c) => normalize(c.status) === "pending").length;
    const progress = complaints.filter((c) => normalize(c.status) === "in progress").length;
    const resolved = complaints.filter((c) => normalize(c.status) === "resolved").length;

    return [
      { name: "Pending", value: pending, pct: Math.round((pending / total) * 100), fill: "aa-fill-orange" },
      { name: "In Progress", value: progress, pct: Math.round((progress / total) * 100), fill: "aa-fill-purple" },
      { name: "Resolved", value: resolved, pct: Math.round((resolved / total) * 100), fill: "aa-fill-green" },
    ];
  }, [complaints]);

  const latestComplaints = useMemo(() => complaints.slice(0, 5), [complaints]);
  const latestRequests = useMemo(() => requests.slice(0, 5), [requests]);

  const insights = useMemo(() => {
    const emptyRooms = metrics.availableRooms;
    const bottleneck =
      metrics.openComplaints > metrics.pendingRequests
        ? "Complaint resolution is currently the biggest operational load."
        : "Room request handling is currently the biggest operational load.";

    const noticeInfo =
      notices.filter((n) => n.isActive).length > 0
        ? `${notices.filter((n) => n.isActive).length} active notices are currently visible.`
        : "No active public notices right now.";

    const occupancyMessage =
      metrics.occupancyRate >= 85
        ? "Occupancy is high. Consider preparing extra room capacity."
        : metrics.occupancyRate >= 60
        ? "Occupancy is healthy and stable."
        : "Occupancy is still moderate with room availability remaining.";

    return [
      { title: "Occupancy Insight", text: occupancyMessage },
      { title: "Operations Focus", text: bottleneck },
      { title: "Room Availability", text: `${emptyRooms} rooms are still marked available.` },
      { title: "Notice Activity", text: noticeInfo },
    ];
  }, [metrics, notices]);

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="aa-root">
        <div className="aa-shell">
          <div className="aa-hero">
            <div className="aa-breadcrumb">
              Dashboard › Admin › <span>Analytics</span>
            </div>

            <div className="aa-hero-top">
              <div>
                <div className="aa-title">Operations Analytics</div>
                <div className="aa-sub">
                  Track room utilization, request pressure, complaint flow, and hostel performance with a more detailed analytics layer.
                </div>
              </div>

              <button className="aa-refresh" onClick={fetchAnalytics}>
                Refresh Analytics
              </button>
            </div>
          </div>

          <div className="aa-top">
            <div className="aa-stat">
              <div className="aa-stat-top">
                <div className="aa-stat-icon">👥</div>
                <div className="aa-stat-chip chip-blue">Students</div>
              </div>
              <div className="aa-stat-value">{loading ? "—" : metrics.totalStudents}</div>
              <div className="aa-stat-label">Total student accounts in the system</div>
            </div>

            <div className="aa-stat">
              <div className="aa-stat-top">
                <div className="aa-stat-icon">🛏️</div>
                <div className="aa-stat-chip chip-green">Occupancy</div>
              </div>
              <div className="aa-stat-value">{loading ? "—" : `${metrics.occupancyRate}%`}</div>
              <div className="aa-stat-label">
                {loading ? "—" : `${metrics.occupiedBeds}/${metrics.totalCapacity} beds occupied`}
              </div>
            </div>

            <div className="aa-stat">
              <div className="aa-stat-top">
                <div className="aa-stat-icon">📝</div>
                <div className="aa-stat-chip chip-orange">Pending</div>
              </div>
              <div className="aa-stat-value">{loading ? "—" : metrics.pendingRequests}</div>
              <div className="aa-stat-label">Pending room requests to review</div>
            </div>

            <div className="aa-stat">
              <div className="aa-stat-top">
                <div className="aa-stat-icon">⚠️</div>
                <div className="aa-stat-chip chip-red">Issues</div>
              </div>
              <div className="aa-stat-value">{loading ? "—" : metrics.openComplaints}</div>
              <div className="aa-stat-label">Open complaints needing admin action</div>
            </div>
          </div>

          <div className="aa-grid">
            <div style={{ display: "grid", gap: "18px" }}>
              <div className="aa-card">
                <div className="aa-card-head">
                  <div>
                    <div className="aa-card-title">Room Status Analytics</div>
                    <div className="aa-card-sub">Inventory distribution across room states</div>
                  </div>
                </div>

                <div className="aa-bars">
                  {loading ? (
                    <div className="aa-empty">Loading room analytics...</div>
                  ) : (
                    roomStatusData.map((item) => (
                      <div className="aa-bar-row" key={item.name}>
                        <div className="aa-bar-top">
                          <div className="aa-bar-name">{item.name}</div>
                          <div className="aa-bar-val">{item.value} ({item.pct}%)</div>
                        </div>
                        <div className="aa-track">
                          <div className={`aa-fill ${item.fill}`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ height: 20 }} />

                <div className="aa-card-title" style={{ fontSize: "1rem", marginBottom: 10 }}>
                  Occupancy by Wing
                </div>

                <div className="aa-bars">
                  {loading ? (
                    <div className="aa-empty">Loading occupancy...</div>
                  ) : occupancyByWing.length === 0 ? (
                    <div className="aa-empty">No wing data available.</div>
                  ) : (
                    occupancyByWing.map((item) => (
                      <div className="aa-bar-row" key={item.wing}>
                        <div className="aa-bar-top">
                          <div className="aa-bar-name">{item.wing}</div>
                          <div className="aa-bar-val">
                            {item.occupied}/{item.capacity} ({item.pct}%)
                          </div>
                        </div>
                        <div className="aa-track">
                          <div className="aa-fill" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="aa-card">
                <div className="aa-card-head">
                  <div>
                    <div className="aa-card-title">Complaint Status Analytics</div>
                    <div className="aa-card-sub">Issue handling progress overview</div>
                  </div>
                </div>

                <div className="aa-bars">
                  {loading ? (
                    <div className="aa-empty">Loading complaint analytics...</div>
                  ) : (
                    complaintStatus.map((item) => (
                      <div className="aa-bar-row" key={item.name}>
                        <div className="aa-bar-top">
                          <div className="aa-bar-name">{item.name}</div>
                          <div className="aa-bar-val">{item.value} ({item.pct}%)</div>
                        </div>
                        <div className="aa-track">
                          <div className={`aa-fill ${item.fill}`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="aa-card">
                <div className="aa-card-head">
                  <div>
                    <div className="aa-card-title">Operational Insights</div>
                    <div className="aa-card-sub">Quick reading of current hostel conditions</div>
                  </div>
                </div>

                <div className="aa-insight-grid">
                  {insights.map((item) => (
                    <div className="aa-insight" key={item.title}>
                      <div className="aa-insight-title">{item.title}</div>
                      <div className="aa-insight-text">{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "18px" }}>
              <div className="aa-card">
                <div className="aa-card-head">
                  <div>
                    <div className="aa-card-title">Module Summary</div>
                    <div className="aa-card-sub">Load across hostel operations</div>
                  </div>
                </div>

                <div className="aa-mini-grid">
                  {requestSummary.map((item) => (
                    <div className="aa-mini" key={item.label}>
                      <div className="aa-mini-kicker">{item.label.toUpperCase()}</div>
                      <div className="aa-mini-value">{loading ? "—" : item.value}</div>
                      <div className="aa-mini-sub">
                        {loading ? "—" : `${item.pending} active / pending`}
                      </div>
                    </div>
                  ))}

                  <div className="aa-mini">
                    <div className="aa-mini-kicker">ACTIVE NOTICES</div>
                    <div className="aa-mini-value">
                      {loading ? "—" : notices.filter((n) => n.isActive).length}
                    </div>
                    <div className="aa-mini-sub">Current visible announcements</div>
                  </div>

                  <div className="aa-mini">
                    <div className="aa-mini-kicker">FULL ROOMS</div>
                    <div className="aa-mini-value">{loading ? "—" : metrics.fullRooms}</div>
                    <div className="aa-mini-sub">Rooms with no free beds</div>
                  </div>
                </div>
              </div>

              <div className="aa-card">
                <div className="aa-card-head">
                  <div>
                    <div className="aa-card-title">Recent Complaints</div>
                    <div className="aa-card-sub">Latest issue reporting activity</div>
                  </div>
                </div>

                <div className="aa-list">
                  {loading ? (
                    <div className="aa-empty">Loading complaints...</div>
                  ) : latestComplaints.length === 0 ? (
                    <div className="aa-empty">No complaints found.</div>
                  ) : (
                    latestComplaints.map((item) => (
                      <div className="aa-item" key={item._id}>
                        <div className="aa-item-top">
                          <div>
                            <div className="aa-item-title">{item.title || "Complaint"}</div>
                            <div className="aa-item-sub">
                              {item.student?.name || "Student"} • {timeAgo(item.createdAt)}
                            </div>
                          </div>
                          <span className={`aa-pill ${statusPill(item.status)}`}>
                            {item.status || "Pending"}
                          </span>
                        </div>
                        <div className="aa-item-sub">
                          {item.room?.roomNumber ? `Room ${item.room.roomNumber}` : "No room linked"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="aa-card">
                <div className="aa-card-head">
                  <div>
                    <div className="aa-card-title">Recent Room Requests</div>
                    <div className="aa-card-sub">Latest student allocation activity</div>
                  </div>
                </div>

                <div className="aa-list">
                  {loading ? (
                    <div className="aa-empty">Loading requests...</div>
                  ) : latestRequests.length === 0 ? (
                    <div className="aa-empty">No room requests found.</div>
                  ) : (
                    latestRequests.map((item) => (
                      <div className="aa-item" key={item._id}>
                        <div className="aa-item-top">
                          <div>
                            <div className="aa-item-title">
                              {item.student?.name || item.user?.name || "Student"}
                            </div>
                            <div className="aa-item-sub">
                              {item.room?.roomNumber ? `Room ${item.room.roomNumber}` : "No room"} • {timeAgo(item.createdAt)}
                            </div>
                          </div>
                          <span className={`aa-pill ${statusPill(item.status)}`}>
                            {item.status || "Pending"}
                          </span>
                        </div>
                        <div className="aa-item-sub">
                          {item.student?.email || item.user?.email || "No email"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminAnalytics;