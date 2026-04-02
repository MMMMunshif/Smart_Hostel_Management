import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .mr-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .mr-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .mr-header h1 {
    font-size: 1.55rem;
    font-weight: 800;
    color: #1a1d23;
    letter-spacing: -0.02em;
  }

  .mr-header p {
    font-size: 0.84rem;
    color: #8a90a0;
    margin-top: 4px;
  }

  .mr-actions {
    display: flex;
    gap: 10px;
  }

  .btn-outline {
    padding: 10px 16px;
    border: 1.5px solid #e2e5ec;
    border-radius: 10px;
    background: #fff;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    color: #4a5060;
    cursor: pointer;
    transition: border-color .15s;
  }

  .btn-outline:hover {
    border-color: #00d4c8;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 22px;
  }

  .summary-card {
    background: #fff;
    border: 1px solid #eef0f4;
    border-radius: 16px;
    padding: 18px 20px;
  }

  .summary-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .summary-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #e8faf9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .summary-badge {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 999px;
  }

  .sb-pending { background: #fff8e6; color: #d4800a; }
  .sb-approved { background: #e6faf2; color: #00a36c; }
  .sb-rejected { background: #fff0f0; color: #e05555; }
  .sb-all { background: #e8f4ff; color: #2563eb; }

  .summary-value {
    font-size: 1.65rem;
    font-weight: 800;
    color: #1a1d23;
    line-height: 1;
  }

  .summary-label {
    font-size: 0.74rem;
    color: #9aa0ae;
    margin-top: 4px;
  }

  .panel {
    background: #fff;
    border: 1px solid #eef0f4;
    border-radius: 18px;
    overflow: hidden;
  }

  .panel-top {
    padding: 18px 20px;
    border-bottom: 1px solid #f1f3f7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .panel-title {
    font-size: 0.98rem;
    font-weight: 800;
    color: #1a1d23;
  }

  .filter-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1.5px solid #eef0f4;
    border-radius: 10px;
    padding: 9px 14px;
    min-width: 240px;
  }

  .search-box input {
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.82rem;
    color: #1a1d23;
    width: 100%;
  }

  .status-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .status-tab {
    border: 1.5px solid #eef0f4;
    background: #fff;
    color: #6b7280;
    padding: 8px 14px;
    border-radius: 999px;
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }

  .status-tab.active {
    background: #00d4c8;
    color: #fff;
    border-color: #00d4c8;
  }

  .request-list {
    padding: 18px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .request-card {
    border: 1px solid #eef0f4;
    border-radius: 16px;
    padding: 16px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    transition: border-color .15s, background .15s;
  }

  .request-card:hover {
    border-color: #d8f5f2;
    background: #fcfffe;
  }

  .request-main {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg,#00d4c8,#0099a8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 800;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }

  .name {
    font-size: 0.88rem;
    font-weight: 800;
    color: #1a1d23;
  }

  .pill {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 999px;
    white-space: nowrap;
  }

  .pill-pending  { background: #fff8e6; color: #d4800a; }
  .pill-approved { background: #e6faf2; color: #00a36c; }
  .pill-rejected { background: #fff0f0; color: #e05555; }

  .subline {
    font-size: 0.76rem;
    color: #8a90a0;
    line-height: 1.5;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 12px;
  }

  .meta-box {
    background: #f8fafc;
    border: 1px solid #eef0f4;
    border-radius: 12px;
    padding: 10px 12px;
  }

  .meta-label {
    font-size: 0.66rem;
    color: #9aa0ae;
    text-transform: uppercase;
    letter-spacing: .06em;
    margin-bottom: 4px;
  }

  .meta-value {
    font-size: 0.78rem;
    font-weight: 700;
    color: #1a1d23;
  }

  .request-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    min-width: 128px;
  }

  .action-btn {
    border: none;
    border-radius: 10px;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
  }

  .action-btn:active {
    transform: scale(.98);
  }

  .btn-approve {
    background: #00d4c8;
    color: #fff;
  }

  .btn-reject {
    background: #fff0f0;
    color: #d64747;
  }

  .btn-disabled {
    background: #f5f6f8;
    color: #9aa0ae;
    cursor: default;
  }

  .empty-state {
    text-align: center;
    padding: 36px 18px;
    color: #9aa0ae;
    font-size: 0.86rem;
  }

  .message-box {
    margin-bottom: 16px;
    padding: 12px 14px;
    border-radius: 12px;
    font-size: 0.82rem;
    font-weight: 600;
  }

  .message-box.success {
    background: #eafaf5;
    color: #0f9f6e;
    border: 1px solid #c9f0df;
  }

  .message-box.error {
    background: #fff3f3;
    color: #d64747;
    border: 1px solid #ffd4d4;
  }

  @media (max-width: 1100px) {
    .summary-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 860px) {
    .request-card {
      grid-template-columns: 1fr;
    }

    .request-actions {
      flex-direction: row;
      min-width: 0;
    }

    .meta-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .summary-grid {
      grid-template-columns: 1fr;
    }

    .search-box {
      min-width: 100%;
    }
  }
`;

const timeAgo = (dateStr) => {
  if (!dateStr) return "Unknown time";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const initialsFromName = (name = "Student") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const normalize = (value = "") => value.toString().toLowerCase().trim();

function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.requests || [];

      setRequests(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load requests." });
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/requests/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({ type: "success", text: "Request approved successfully." });
      fetchRequests();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.response?.data?.error || "Approval failed.",
      });
    }
  };

  const rejectRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/requests/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({ type: "success", text: "Request rejected successfully." });
      fetchRequests();
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || err.response?.data?.error || "Rejection failed.",
      });
    }
  };

  const filteredRequests = requests.filter((req) => {
    const studentName = req.student?.name || "";
    const studentEmail = req.student?.email || "";
    const roomNumber = req.room?.roomNumber || "";
    const wing = req.room?.wing || "";
    const status = normalize(req.status);

    const matchesFilter = filter === "all" || status === filter;
    const searchValue = search.toLowerCase();

    const matchesSearch =
      !searchValue ||
      studentName.toLowerCase().includes(searchValue) ||
      studentEmail.toLowerCase().includes(searchValue) ||
      roomNumber.toLowerCase().includes(searchValue) ||
      wing.toLowerCase().includes(searchValue);

    return matchesFilter && matchesSearch;
  });

  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => normalize(r.status) === "pending").length;
  const approvedCount = requests.filter((r) => normalize(r.status) === "approved").length;
  const rejectedCount = requests.filter((r) => normalize(r.status) === "rejected").length;

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="mr-root">
        <div className="mr-header">
          <div>
            <h1>Manage Requests</h1>
            <p>Review, approve, and reject room requests from students.</p>
          </div>

          <div className="mr-actions">
            <button className="btn-outline" onClick={fetchRequests}>
              ↻ Refresh
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-top">
              <div className="summary-icon">☰</div>
              <span className="summary-badge sb-all">All</span>
            </div>
            <div className="summary-value">{totalCount}</div>
            <div className="summary-label">Total Requests</div>
          </div>

          <div className="summary-card">
            <div className="summary-top">
              <div className="summary-icon">🟡</div>
              <span className="summary-badge sb-pending">Pending</span>
            </div>
            <div className="summary-value">{pendingCount}</div>
            <div className="summary-label">Pending Review</div>
          </div>

          <div className="summary-card">
            <div className="summary-top">
              <div className="summary-icon">✅</div>
              <span className="summary-badge sb-approved">Approved</span>
            </div>
            <div className="summary-value">{approvedCount}</div>
            <div className="summary-label">Approved Requests</div>
          </div>

          <div className="summary-card">
            <div className="summary-top">
              <div className="summary-icon">❌</div>
              <span className="summary-badge sb-rejected">Rejected</span>
            </div>
            <div className="summary-value">{rejectedCount}</div>
            <div className="summary-label">Rejected Requests</div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-top">
            <div className="panel-title">Request Queue</div>

            <div className="filter-row">
              <div className="search-box">
                <span style={{ color: "#b0b6c3" }}>🔍</span>
                <input
                  placeholder="Search by student, email, room, or wing..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="status-tabs">
                <button
                  className={`status-tab ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`status-tab ${filter === "pending" ? "active" : ""}`}
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </button>
                <button
                  className={`status-tab ${filter === "approved" ? "active" : ""}`}
                  onClick={() => setFilter("approved")}
                >
                  Approved
                </button>
                <button
                  className={`status-tab ${filter === "rejected" ? "active" : ""}`}
                  onClick={() => setFilter("rejected")}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>

          <div className="request-list">
            {loading && <div className="empty-state">Loading requests...</div>}

            {!loading && filteredRequests.length === 0 && (
              <div className="empty-state">No requests found for the selected filter.</div>
            )}

            {!loading &&
              filteredRequests.map((req) => {
                const status = normalize(req.status);
                const studentName = req.student?.name || "Student";
                const studentEmail = req.student?.email || "No email";
                const roomNumber = req.room?.roomNumber || "N/A";
                const wing = req.room?.wing || "Unknown wing";
                const roomType = req.room?.type || "Unknown type";

                return (
                  <div key={req._id} className="request-card">
                    <div className="request-main">
                      <div className="avatar">{initialsFromName(studentName)}</div>

                      <div className="info">
                        <div className="name-row">
                          <div className="name">{studentName}</div>

                          {status === "pending" && (
                            <span className="pill pill-pending">Pending</span>
                          )}
                          {status === "approved" && (
                            <span className="pill pill-approved">Approved</span>
                          )}
                          {status === "rejected" && (
                            <span className="pill pill-rejected">Rejected</span>
                          )}
                        </div>

                        <div className="subline">
                          {studentEmail} • Requested {timeAgo(req.createdAt)}
                        </div>

                        <div className="meta-grid">
                          <div className="meta-box">
                            <div className="meta-label">Room</div>
                            <div className="meta-value">{roomNumber}</div>
                          </div>

                          <div className="meta-box">
                            <div className="meta-label">Wing</div>
                            <div className="meta-value">{wing}</div>
                          </div>

                          <div className="meta-box">
                            <div className="meta-label">Type</div>
                            <div className="meta-value">{roomType}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="request-actions">
                      {status === "pending" ? (
                        <>
                          <button
                            className="action-btn btn-approve"
                            onClick={() => approveRequest(req._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="action-btn btn-reject"
                            onClick={() => rejectRequest(req._id)}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="action-btn btn-disabled" disabled>
                            {status === "approved" ? "Approved" : "Rejected"}
                          </button>
                        </>
                      )}
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

export default ManageRequests;