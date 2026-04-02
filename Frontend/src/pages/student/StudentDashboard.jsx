import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700;800&display=swap');

  .sd-root {
    font-family: 'Inter', sans-serif;
    background: #f4f7fb;
    min-height: 100vh;
    color: #111827;
  }

  .sd-page {
    padding: 28px;
  }

  .sd-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 22px;
    flex-wrap: wrap;
  }

  .sd-title-wrap h1 {
    margin: 0 0 8px;
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    line-height: 1.05;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #111827;
  }

  .sd-title-wrap p {
    margin: 0;
    font-size: 0.95rem;
    color: #6b7280;
  }

  .sd-semester-chip {
    background: #fff;
    border: 1px solid #e5e7eb;
    color: #6b7280;
    border-radius: 999px;
    padding: 10px 14px;
    font-size: 0.82rem;
    font-weight: 600;
    box-shadow: 0 6px 18px rgba(17, 24, 39, 0.04);
  }

  .sd-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 18px;
  }

  .sd-stat {
    border-radius: 20px;
    padding: 20px;
    min-height: 120px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    box-shadow: 0 10px 26px rgba(17, 24, 39, 0.05);
    border: 1px solid rgba(255,255,255,0.55);
  }

  .sd-stat.mint   { background: linear-gradient(135deg, #dff7f5, #d5f4f0); }
  .sd-stat.gold   { background: linear-gradient(135deg, #f6edd8, #efe3c7); }
  .sd-stat.lilac  { background: linear-gradient(135deg, #ece3f7, #e6dbf4); }

  .sd-stat-kicker {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    font-weight: 800;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .sd-stat-value {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
    color: #111827;
    margin-bottom: 6px;
  }

  .sd-stat-sub {
    font-size: 0.92rem;
    color: #4b5563;
    line-height: 1.4;
  }

  .sd-stat-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.45rem;
    color: #111827;
    flex-shrink: 0;
  }

  .sd-main {
    display: grid;
    grid-template-columns: 1.15fr 1fr 0.9fr;
    gap: 18px;
    margin-bottom: 18px;
    align-items: start;
  }

  .sd-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 20px;
    box-shadow: 0 10px 26px rgba(17, 24, 39, 0.04);
  }

  .sd-card-pad {
    padding: 18px;
  }

  .sd-card-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .sd-card-sub {
    font-size: 0.85rem;
    color: #6b7280;
    margin-bottom: 14px;
  }

  .sd-room-image {
    height: 110px;
    width: 100%;
    object-fit: cover;
    border-radius: 16px 16px 0 0;
    display: block;
    background: #eef2f7;
  }

  .sd-room-fallback {
    height: 110px;
    border-radius: 16px 16px 0 0;
    background: linear-gradient(135deg, #d9f4f0, #e4eefb);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2rem;
  }

  .sd-room-badge {
    display: inline-block;
    margin-bottom: 10px;
    background: #58e4de;
    color: #0f3d3c;
    padding: 6px 10px;
    font-size: 0.72rem;
    font-weight: 800;
    border-radius: 999px;
  }

  .sd-room-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 10px;
    line-height: 1.05;
  }

  .sd-room-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 18px;
    margin-bottom: 16px;
  }

  .sd-meta-label {
    font-size: 0.68rem;
    color: #9ca3af;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }

  .sd-meta-value {
    font-size: 0.95rem;
    color: #1f2937;
    font-weight: 700;
    line-height: 1.45;
  }

  .sd-room-footer {
    border-top: 1px solid #edf1f6;
    padding-top: 14px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .sd-location {
    font-size: 0.88rem;
    color: #6b7280;
  }

  .sd-action-outline {
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #4b5563;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
  }

  .sd-match-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }

  .sd-match-score {
    font-size: 0.92rem;
    font-weight: 800;
    color: #111827;
  }

  .sd-match-score span {
    color: #111827;
    opacity: 0.75;
  }

  .sd-match-person {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
  }

  .sd-avatar {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6ee7e0, #93c5fd);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 800;
    flex-shrink: 0;
  }

  .sd-online-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #22c55e;
    border: 2px solid #fff;
    margin-left: -18px;
    margin-top: 34px;
    flex-shrink: 0;
  }

  .sd-person-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.45rem;
    line-height: 1.05;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .sd-person-sub {
    font-size: 0.88rem;
    color: #6b7280;
  }

  .sd-pill-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .sd-pill {
    padding: 6px 10px;
    background: #f4f6fa;
    border: 1px solid #ebeff5;
    color: #4b5563;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .sd-btn-col {
    display: grid;
    gap: 10px;
  }

  .sd-primary-btn {
    width: 100%;
    border: none;
    background: #58e4de;
    color: #0f3d3c;
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 0.86rem;
    font-weight: 800;
    cursor: pointer;
  }

  .sd-secondary-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .sd-soft-btn {
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #4b5563;
    border-radius: 12px;
    padding: 11px 14px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
  }

  .sd-side-stack {
    display: grid;
    gap: 18px;
  }

  .quick-title,
  .facility-title {
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 12px;
    color: #111827;
  }

  .quick-list {
    display: grid;
    gap: 10px;
  }

  .quick-btn {
    border: 1px solid #e8edf4;
    background: #fff;
    border-radius: 14px;
    padding: 14px 16px;
    font-size: 0.92rem;
    font-weight: 700;
    color: #374151;
    text-align: left;
    cursor: pointer;
  }

  .quick-btn.primary {
    background: #58e4de;
    color: #0f3d3c;
    border-color: #58e4de;
  }

  .facility-box {
    background: #dff1fb;
    border-radius: 18px;
    padding: 18px;
  }

  .facility-sub {
    font-size: 0.84rem;
    color: #6b7280;
    margin-bottom: 14px;
  }

  .facility-list {
    display: grid;
    gap: 10px;
  }

  .facility-item {
    background: rgba(255,255,255,0.7);
    border-radius: 14px;
    padding: 14px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
  }

  .facility-name {
    font-size: 0.9rem;
    font-weight: 700;
    color: #374151;
  }

  .facility-status {
    font-size: 0.68rem;
    font-weight: 800;
    color: #6b7280;
    letter-spacing: 0.08em;
  }

  .help-box {
    border: 1px dashed #d7dde7;
    border-radius: 20px;
    padding: 24px 18px;
    text-align: center;
    background: #fff;
  }

  .help-icon {
    font-size: 2rem;
    margin-bottom: 12px;
  }

  .help-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 6px;
  }

  .help-sub {
    font-size: 0.86rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 14px;
  }

  .help-link {
    border: none;
    background: transparent;
    color: #58d7d6;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
  }

  .sd-feed {
    margin-top: 18px;
  }

  .sd-feed-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 20px;
    box-shadow: 0 10px 26px rgba(17, 24, 39, 0.04);
    padding: 20px;
  }

  .sd-feed-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  .sd-feed-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .sd-feed-sub {
    font-size: 0.86rem;
    color: #6b7280;
  }

  .sd-view-link {
    border: none;
    background: transparent;
    color: #6ee7e0;
    font-size: 0.84rem;
    font-weight: 800;
    cursor: pointer;
  }

  .sd-activity-list {
    display: grid;
  }

  .sd-activity-item {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
    padding: 16px 0;
    border-top: 1px solid #f0f3f7;
  }

  .sd-activity-item:first-child {
    border-top: none;
  }

  .sd-activity-left {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .sd-activity-icon {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #f4f6fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .sd-activity-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .sd-activity-time {
    font-size: 0.84rem;
    color: #6b7280;
  }

  .sd-activity-badge {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .badge-progress { background: #f3f4f6; color: #4b5563; }
  .badge-action { background: #f3f4f6; color: #4b5563; }
  .badge-success { background: #f3f4f6; color: #4b5563; }
  .badge-pending { background: #f3f4f6; color: #4b5563; }

  .sd-empty {
    font-size: 0.9rem;
    color: #6b7280;
    padding: 14px 0 4px;
  }

  @media (max-width: 1180px) {
    .sd-main {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 900px) {
    .sd-stats {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 700px) {
    .sd-page {
      padding: 16px;
    }

    .sd-room-grid,
    .sd-secondary-row {
      grid-template-columns: 1fr;
    }
  }
`;

function initials(name = "Student") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function timeAgo(dateStr) {
  if (!dateStr) return "Unknown time";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins} hours ago`.replace("1 hours", "1 hour");
  if (hours < 24) return `${hours} hours ago`.replace("1 hours", "1 hour");
  return `${days} days ago`.replace("1 days", "1 day");
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString();
}

function formatLKR(value) {
  if (value === undefined || value === null || value === "") return "N/A";
  return `LKR ${Number(value).toLocaleString("en-LK")}`;
}

function prettyMatchTag(reason) {
  return reason || "Compatible";
}

function statusBadge(text = "") {
  const v = text.toLowerCase();

  if (v.includes("progress")) return "badge-progress";
  if (v.includes("required")) return "badge-action";
  if (v.includes("success") || v.includes("approved") || v.includes("resolved")) return "badge-success";
  return "badge-pending";
}

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [
        meRes,
        roomsRes,
        matchesRes,
        requestsRes,
        complaintsRes,
        leavesRes,
        visitorsRes,
      ] = await Promise.all([
        axios.get(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/matches/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/requests/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/complaints/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/leaves/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/visitors/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const me = meRes.data?.user || meRes.data;
      const roomData = Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data.rooms || [];
      const matchData = Array.isArray(matchesRes.data) ? matchesRes.data : [];
      const requestData = Array.isArray(requestsRes.data) ? requestsRes.data : requestsRes.data.requests || [];
      const complaintData = Array.isArray(complaintsRes.data) ? complaintsRes.data : complaintsRes.data.complaints || [];
      const leaveData = Array.isArray(leavesRes.data) ? leavesRes.data : leavesRes.data.leaves || [];
      const visitorData = Array.isArray(visitorsRes.data) ? visitorsRes.data : visitorsRes.data.visitors || [];

      setUser(me);
      setRooms(roomData);
      setMatches(matchData);
      setRequests(requestData);
      setComplaints(complaintData);
      setLeaves(leaveData);
      setVisitors(visitorData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const assignedRoom = useMemo(() => {
    if (!user?._id) return null;

    return rooms.find((room) =>
      (room.occupants || []).some((occ) => {
        const id = typeof occ === "string" ? occ : occ?._id;
        return id === user._id;
      })
    );
  }, [rooms, user]);

  const topMatch = useMemo(() => (matches.length ? matches[0] : null), [matches]);

  const pendingRequests = useMemo(
    () => requests.filter((r) => (r.status || "").toLowerCase() === "pending").length,
    [requests]
  );

  const assignedRoomLabel = assignedRoom
    ? `${assignedRoom.roomNumber || ""}${assignedRoom.location ? ` · ${assignedRoom.location}` : ""}`
    : "Not assigned yet";

  const roomImage = assignedRoom?.images?.[0]
    ? `http://localhost:5000/${assignedRoom.images[0]}`
    : null;

  const activityFeed = useMemo(() => {
    const items = [];

    complaints.forEach((c) => {
      items.push({
        type: "complaint",
        icon: "⚠️",
        title: `${c.title || "Complaint"} updated`,
        time: c.updatedAt || c.createdAt,
        badge: c.status || "Pending",
      });
    });

    requests.forEach((r) => {
      items.push({
        type: "request",
        icon: "👥",
        title: `Room request for ${r.room?.roomNumber || "room"}`,
        time: r.createdAt,
        badge:
          (r.status || "").toLowerCase() === "pending"
            ? "Action Required"
            : r.status || "Pending",
      });
    });

    leaves.forEach((l) => {
      items.push({
        type: "leave",
        icon: "🛫",
        title: `Leave request submitted`,
        time: l.createdAt,
        badge: l.status || "Pending",
      });
    });

    visitors.forEach((v) => {
      items.push({
        type: "visitor",
        icon: "👤",
        title: `Visitor request for ${v.visitorName || "visitor"}`,
        time: v.createdAt,
        badge: v.status || "Pending",
      });
    });

    return items
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  }, [complaints, requests, leaves, visitors]);

  if (loading) {
    return (
      <Layout role="student">
        <style>{css}</style>
        <div className="sd-root">
          <div className="sd-page">
            <div className="sd-card sd-card-pad">Loading dashboard...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="sd-root">
        <div className="sd-page">
          <div className="sd-header">
            <div className="sd-title-wrap">
              <h1>Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋</h1>
              <p>Here's what's happening with your residence today.</p>
            </div>

            
          </div>

          <div className="sd-stats">
            <div className="sd-stat mint">
              <div>
                <div className="sd-stat-kicker">ROOM STATUS</div>
                <div className="sd-stat-value">{assignedRoom ? "Assigned" : "Open"}</div>
                <div className="sd-stat-sub">{assignedRoomLabel}</div>
              </div>
              <div className="sd-stat-icon">🏠</div>
            </div>

            <div className="sd-stat gold">
              <div>
                <div className="sd-stat-kicker">ROOMMATE MATCH</div>
                <div className="sd-stat-value">{topMatch ? `${topMatch.score}%` : "--"}</div>
                <div className="sd-stat-sub">
                  {topMatch ? `Top match: ${topMatch.name}` : "Complete preferences for smart matching"}
                </div>
              </div>
              <div className="sd-stat-icon">👥</div>
            </div>

            <div className="sd-stat lilac">
              <div>
                <div className="sd-stat-kicker">PENDING REQUESTS</div>
                <div className="sd-stat-value">{pendingRequests.toString().padStart(2, "0")}</div>
                <div className="sd-stat-sub">
                  {requests.length} total room request{requests.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="sd-stat-icon">🕒</div>
            </div>
          </div>

          <div className="sd-main">
            <div className="sd-card">
              {roomImage ? (
                <img src={roomImage} alt="Assigned room" className="sd-room-image" />
              ) : (
                <div className="sd-room-fallback">🏢</div>
              )}

              <div className="sd-card-pad">
                <div className="sd-room-badge">{assignedRoom ? "Assigned" : "No Room Yet"}</div>
                <div className="sd-room-name">
                  {assignedRoom
                    ? `${assignedRoom.roomNumber}${assignedRoom.type ? ` · ${assignedRoom.type}` : ""}`
                    : "Browse Available Rooms"}
                </div>

                <div className="sd-room-grid">
                  <div>
                    <div className="sd-meta-label">ROOM NUMBER</div>
                    <div className="sd-meta-value">{assignedRoom?.roomNumber || "N/A"}</div>
                  </div>
                  <div>
                    <div className="sd-meta-label">TYPE</div>
                    <div className="sd-meta-value">{assignedRoom?.type || "N/A"}</div>
                  </div>
                  <div>
                    <div className="sd-meta-label">PRICE</div>
                    <div className="sd-meta-value">{formatLKR(assignedRoom?.price)}</div>
                  </div>
                  <div>
                    <div className="sd-meta-label">CAPACITY</div>
                    <div className="sd-meta-value">
                      {assignedRoom?.capacity ? `${assignedRoom.capacity} Students` : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="sd-meta-label">ROOM STATUS</div>
                    <div className="sd-meta-value">{assignedRoom?.status || "Not assigned"}</div>
                  </div>
                  <div>
                    <div className="sd-meta-label">LAST REQUEST</div>
                    <div className="sd-meta-value">
                      {requests.length ? formatDate(requests[0]?.createdAt) : "No requests"}
                    </div>
                  </div>
                </div>

                <div className="sd-room-footer">
                  <div className="sd-location">
                    📍 {assignedRoom?.location || "Campus location not available"}
                    {assignedRoom?.district ? `, ${assignedRoom.district}` : ""}
                  </div>

                  <button
                    className="sd-action-outline"
                    onClick={() => (window.location.href = "/rooms")}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            <div className="sd-card sd-card-pad">
              <div className="sd-match-head">
                <div>
                  <div className="sd-card-title">Your Best Roommate Match</div>
                  <div className="sd-card-sub">Based on your preference profile.</div>
                </div>
                <div className="sd-match-score">
                  {topMatch ? `${topMatch.score}% Match` : <span>No match yet</span>}
                </div>
              </div>

              {topMatch ? (
                <>
                  <div className="sd-match-person">
                    <div className="sd-avatar">{initials(topMatch.name)}</div>
                    <div className="sd-online-dot" />
                    <div>
                      <div className="sd-person-name">{topMatch.name}</div>
                      <div className="sd-person-sub">{topMatch.meta || "Compatible roommate"}</div>
                    </div>
                  </div>

                  <div className="sd-pill-row">
                    {(topMatch.reasons || []).length ? (
                      topMatch.reasons.map((reason, index) => (
                        <span key={index} className="sd-pill">
                          {prettyMatchTag(reason)}
                        </span>
                      ))
                    ) : (
                      <span className="sd-pill">Compatible Lifestyle</span>
                    )}
                  </div>

                  <div className="sd-btn-col">
                    <button
                      className="sd-primary-btn"
                      onClick={() => (window.location.href = "/matching")}
                    >
                      Find Roommates
                    </button>

                    <div className="sd-secondary-row">
                      <button className="sd-soft-btn" onClick={() => alert("Messaging next")}>
                        💬 Message
                      </button>
                      <button className="sd-soft-btn" onClick={() => (window.location.href = "/profile")}>
                        👤 Profile
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="sd-empty">
                  Complete your preferences to see better roommate suggestions.
                </div>
              )}
            </div>

            <div className="sd-side-stack">
              <div className="sd-card sd-card-pad">
                <div className="quick-title">Quick Actions</div>
                <div className="quick-list">
                  <button className="quick-btn primary" onClick={() => (window.location.href = "/complaints")}>
                    ➕ Raise Complaint
                  </button>
                  <button className="quick-btn" onClick={() => (window.location.href = "/profile")}>
                    ✎ Edit Profile
                  </button>
                  <button className="quick-btn" onClick={() => (window.location.href = "/matching")}>
                    ⚙ Matching Prefs
                  </button>
                  <button className="quick-btn" onClick={() => (window.location.href = "/matching")}>
                    👥 Find Roommates
                  </button>
                </div>
              </div>

              <div className="facility-box">
                <div className="facility-title">Facility Status</div>
                <div className="facility-sub">Real-time building services</div>

                <div className="facility-list">
                  <div className="facility-item">
                    <div className="facility-name">📶 High-Speed Wi-Fi</div>
                    <div className="facility-status">OPERATIONAL</div>
                  </div>
                  <div className="facility-item">
                    <div className="facility-name">⚡ Electricity Supply</div>
                    <div className="facility-status">OPERATIONAL</div>
                  </div>
                  <div className="facility-item">
                    <div className="facility-name">💧 Water Supply</div>
                    <div className="facility-status">OPERATIONAL</div>
                  </div>
                </div>
              </div>

              <div className="help-box">
                <div className="help-icon">💬</div>
                <div className="help-title">Need Assistance?</div>
                <div className="help-sub">
                  Our support team is available for urgent hostel matters and student help requests.
                </div>
                <button className="help-link" onClick={() => alert("Warden contact next")}>
                  Contact Warden
                </button>
              </div>
            </div>
          </div>

          <div className="sd-feed">
            <div className="sd-feed-card">
              <div className="sd-feed-head">
                <div>
                  <div className="sd-feed-title">Activity Feed</div>
                  <div className="sd-feed-sub">
                    Stay updated with your housing and request status.
                  </div>
                </div>

                <button className="sd-view-link" onClick={() => (window.location.href = "/requests")}>
                  View History
                </button>
              </div>

              <div className="sd-activity-list">
                {activityFeed.length ? (
                  activityFeed.map((item, index) => (
                    <div className="sd-activity-item" key={index}>
                      <div className="sd-activity-left">
                        <div className="sd-activity-icon">{item.icon}</div>
                        <div>
                          <div className="sd-activity-title">{item.title}</div>
                          <div className="sd-activity-time">{timeAgo(item.time)}</div>
                        </div>
                      </div>

                      <div className={`sd-activity-badge ${statusBadge(item.badge)}`}>
                        {item.badge}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="sd-empty">No recent activity yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StudentDashboard;