import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  .sr-root {
    font-family: 'DM Sans', sans-serif;
    background: #f0f2f7;
    min-height: 100vh;
    padding: 32px;
    color: #0f1117;
  }

  .sr-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .sr-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #9aa0b0;
    margin-bottom: 6px;
  }

  .sr-breadcrumb span {
    color: #00c4b8;
    font-weight: 600;
  }

  .sr-header h1 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: #0f1117;
    letter-spacing: -0.03em;
    margin-bottom: 4px;
  }

  .sr-header p {
    font-size: 0.82rem;
    color: #8a90a2;
  }

  .sr-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-outline {
    padding: 10px 16px;
    border: 1.5px solid #e2e7f0;
    border-radius: 11px;
    background: #fff;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 700;
    color: #4f5668;
    cursor: pointer;
    transition: all .2s;
  }

  .btn-outline:hover {
    border-color: #00d4c8;
    color: #00a99f;
  }

  .sr-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 22px;
  }

  .sr-stat {
    background: #fff;
    border: 1px solid #e8eaf0;
    border-radius: 18px;
    padding: 18px 20px;
  }

  .sr-stat-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .sr-stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: #e8faf9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .sr-stat-chip {
    font-size: 0.66rem;
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 99px;
  }

  .chip-info { background: #e8f4ff; color: #2563eb; }
  .chip-pending { background: #fff8e6; color: #d4800a; }
  .chip-success { background: #e6faf2; color: #00a36c; }
  .chip-danger { background: #fff0f0; color: #e05555; }

  .sr-stat-val {
    font-size: 1.65rem;
    font-weight: 800;
    color: #0f1117;
    line-height: 1;
  }

  .sr-stat-lbl {
    font-size: 0.73rem;
    color: #98a0b0;
    margin-top: 5px;
  }

  .sr-panel {
    background: #fff;
    border: 1px solid #e8eaf0;
    border-radius: 20px;
    overflow: hidden;
  }

  .sr-panel-top {
    padding: 18px 20px;
    border-bottom: 1px solid #eef1f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .sr-panel-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #0f1117;
  }

  .sr-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .sr-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1.5px solid #e8eaf0;
    border-radius: 11px;
    padding: 10px 14px;
    min-width: 260px;
  }

  .sr-search input {
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.82rem;
    color: #0f1117;
    width: 100%;
  }

  .sr-search input::placeholder {
    color: #b0b6c8;
  }

  .sr-select {
    padding: 10px 14px;
    border: 1.5px solid #e8eaf0;
    border-radius: 11px;
    background: #fff;
    font-family: inherit;
    font-size: 0.8rem;
    color: #4f5668;
    outline: none;
  }

  .request-list {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .request-card {
    background: #fff;
    border: 1px solid #e9edf5;
    border-radius: 18px;
    overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }

  .request-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 36px rgba(15,17,23,.07);
    border-color: #d6f3f0;
  }

  .request-top {
    display: grid;
    grid-template-columns: 190px 1fr;
    gap: 0;
  }

  .request-image-wrap {
    position: relative;
    min-height: 170px;
    background: linear-gradient(135deg, #e8faf9, #dff5ff);
  }

  .request-image-wrap img {
    width: 100%;
    height: 100%;
    min-height: 170px;
    object-fit: cover;
    display: block;
  }

  .request-image-fallback {
    min-height: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .request-status {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 800;
    backdrop-filter: blur(8px);
    background: rgba(255,255,255,.92);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }

  .dot-pending { background: #d4800a; }
  .dot-approved { background: #00a36c; }
  .dot-rejected { background: #e05555; }

  .request-main {
    padding: 16px 18px;
  }

  .request-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 6px;
  }

  .request-room {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.05rem;
    font-weight: 800;
    color: #0f1117;
  }

  .request-price {
    font-size: 0.78rem;
    font-weight: 800;
    color: #00a99f;
    background: #e8faf9;
    padding: 5px 9px;
    border-radius: 999px;
    white-space: nowrap;
  }

  .request-sub {
    font-size: 0.77rem;
    color: #8e96a8;
    line-height: 1.5;
    margin-bottom: 14px;
  }

  .request-meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 14px;
  }

  .request-meta {
    background: #f7f9fc;
    border: 1px solid #edf1f7;
    border-radius: 12px;
    padding: 10px 12px;
  }

  .request-meta-lbl {
    font-size: 0.64rem;
    color: #9aa1b1;
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-bottom: 4px;
  }

  .request-meta-val {
    font-size: 0.77rem;
    font-weight: 700;
    color: #0f1117;
    line-height: 1.4;
    word-break: break-word;
  }

  .request-features {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 14px;
  }

  .request-feature {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 5px 9px;
    border-radius: 999px;
    background: #f5f7fb;
    color: #5f6678;
    border: 1px solid #ecf0f7;
  }

  .request-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .request-time {
    font-size: 0.74rem;
    color: #96a0b2;
  }

  .request-note {
    font-size: 0.75rem;
    font-weight: 700;
  }

  .note-pending { color: #d4800a; }
  .note-approved { color: #00a36c; }
  .note-rejected { color: #e05555; }

  .empty-state {
    text-align: center;
    padding: 48px 18px;
    color: #96a0b2;
    font-size: 0.88rem;
  }

  @media (max-width: 1100px) {
    .sr-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .request-meta-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 760px) {
    .sr-root {
      padding: 16px;
    }

    .sr-stats {
      grid-template-columns: 1fr;
    }

    .sr-search {
      min-width: 100%;
    }

    .request-top {
      grid-template-columns: 1fr;
    }

    .request-meta-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function normalize(v = "") {
  return v.toString().toLowerCase().trim();
}

function formatLKR(value) {
  const num = Number(value || 0);
  return `LKR ${num.toLocaleString("en-LK")}`;
}

function timeAgo(dateStr) {
  if (!dateStr) return "Unknown time";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function statusDot(status) {
  const s = normalize(status);
  if (s === "approved") return "dot-approved";
  if (s === "rejected") return "dot-rejected";
  return "dot-pending";
}

function statusNote(status) {
  const s = normalize(status);
  if (s === "approved") return { text: "Approved by admin", cls: "note-approved" };
  if (s === "rejected") return { text: "Rejected by admin", cls: "note-rejected" };
  return { text: "Waiting for admin review", cls: "note-pending" };
}

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { showToast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
     

    const res = await axios.get(`${API}/requests/my`, {
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const myRequests = Array.isArray(res.data)
  ? res.data
  : res.data.requests || [];

setRequests(myRequests);
      setLoading(false);
    } catch (err) {
  showToast("Failed to load your requests.", "error");
  setLoading(false);
}
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const searchValue = search.toLowerCase();
      const matchesSearch =
        !searchValue ||
        req.room?.roomNumber?.toLowerCase().includes(searchValue) ||
        req.room?.location?.toLowerCase().includes(searchValue) ||
        req.room?.district?.toLowerCase().includes(searchValue) ||
        req.room?.type?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        normalize(req.status) === normalize(statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => normalize(r.status) === "pending").length,
      approved: requests.filter((r) => normalize(r.status) === "approved").length,
      rejected: requests.filter((r) => normalize(r.status) === "rejected").length,
    };
  }, [requests]);

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="sr-root">
        <div className="sr-header">
          <div>
            <div className="sr-breadcrumb">
              Dashboard › Student › <span>My Requests</span>
            </div>
            <h1>My Room Requests</h1>
            <p>Track pending, approved, and rejected room requests in one place.</p>
          </div>

          <div className="sr-actions">
            <button className="btn-outline" onClick={fetchRequests}>↻ Refresh</button>
          </div>
        </div>

        <div className="sr-stats">
          <div className="sr-stat">
            <div className="sr-stat-top">
              <div className="sr-stat-icon">☰</div>
              <div className="sr-stat-chip chip-info">All</div>
            </div>
            <div className="sr-stat-val">{stats.total}</div>
            <div className="sr-stat-lbl">Total Requests</div>
          </div>

          <div className="sr-stat">
            <div className="sr-stat-top">
              <div className="sr-stat-icon">🟡</div>
              <div className="sr-stat-chip chip-pending">Pending</div>
            </div>
            <div className="sr-stat-val">{stats.pending}</div>
            <div className="sr-stat-lbl">Awaiting Review</div>
          </div>

          <div className="sr-stat">
            <div className="sr-stat-top">
              <div className="sr-stat-icon">✅</div>
              <div className="sr-stat-chip chip-success">Approved</div>
            </div>
            <div className="sr-stat-val">{stats.approved}</div>
            <div className="sr-stat-lbl">Approved Requests</div>
          </div>

          <div className="sr-stat">
            <div className="sr-stat-top">
              <div className="sr-stat-icon">❌</div>
              <div className="sr-stat-chip chip-danger">Rejected</div>
            </div>
            <div className="sr-stat-val">{stats.rejected}</div>
            <div className="sr-stat-lbl">Rejected Requests</div>
          </div>
        </div>

        <div className="sr-panel">
          <div className="sr-panel-top">
            <div className="sr-panel-title">Request History</div>

            <div className="sr-filters">
              <div className="sr-search">
                <span style={{ color: "#b0b6c8" }}>🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by room, location, district..."
                />
              </div>

              <select
                className="sr-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="request-list">
            {loading && <div className="empty-state">Loading requests...</div>}

            {!loading && filteredRequests.length === 0 && (
              <div className="empty-state">No requests found.</div>
            )}

            {!loading &&
              filteredRequests.map((req) => {
                const room = req.room || {};
                const img = room.images?.[0]
                  ? `http://localhost:5000/${room.images[0]}`
                  : null;
                const note = statusNote(req.status);

                const features = [
                  room.genderCategory,
                  room.bathroomType,
                  room.wifiAvailable ? "Wi-Fi" : null,
                  room.mealIncluded ? "Meals" : null,
                  room.parkingAvailable ? "Parking" : null,
                  room.securityAvailable ? "Security" : null,
                ].filter(Boolean);

                return (
                  <div key={req._id} className="request-card">
                    <div className="request-top">
                      <div className="request-image-wrap">
                        {img ? (
                          <img src={img} alt={room.roomNumber || "Room"} />
                        ) : (
                          <div className="request-image-fallback">🏠</div>
                        )}

                        <div className="request-status">
                          <span className={`dot ${statusDot(req.status)}`} />
                          {req.status}
                        </div>
                      </div>

                      <div className="request-main">
                        <div className="request-head">
                          <div className="request-room">
                            {room.roomNumber || "Room"}
                          </div>
                          <div className="request-price">
                            {formatLKR(room.price)} / month
                          </div>
                        </div>

                        <div className="request-sub">
                          📍 {room.location || "N/A"}, {room.district || "N/A"}
                          <br />
                          {room.address || "Address not available"}
                        </div>

                        <div className="request-meta-grid">
                          <div className="request-meta">
                            <div className="request-meta-lbl">Type</div>
                            <div className="request-meta-val">{room.type || "N/A"}</div>
                          </div>

                          <div className="request-meta">
                            <div className="request-meta-lbl">Capacity</div>
                            <div className="request-meta-val">{room.capacity || 0} Students</div>
                          </div>

                          <div className="request-meta">
                            <div className="request-meta-lbl">Distance</div>
                            <div className="request-meta-val">{room.distanceToCampus || "N/A"}</div>
                          </div>

                          <div className="request-meta">
                            <div className="request-meta-lbl">Contact</div>
                            <div className="request-meta-val">{room.contactNumber || "N/A"}</div>
                          </div>
                        </div>

                        {features.length > 0 && (
                          <div className="request-features">
                            {features.map((item, index) => (
                              <span key={index} className="request-feature">{item}</span>
                            ))}
                          </div>
                        )}

                        <div className="request-bottom">
                          <div className="request-time">
                            Requested {timeAgo(req.createdAt)}
                          </div>
                          <div className={`request-note ${note.cls}`}>
                            {note.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Requests;