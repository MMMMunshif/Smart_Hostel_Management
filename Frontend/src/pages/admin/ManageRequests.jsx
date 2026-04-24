import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,700&display=swap');

  :root {
    --mr-bg: #f5f7fb;
    --mr-surface: #ffffff;
    --mr-surface-2: #f8fafc;
    --mr-border: #e8edf4;
    --mr-text: #161a22;
    --mr-text-soft: #6b7280;
    --mr-text-muted: #98a1b2;
    --mr-primary: #00cdbd;
    --mr-primary-dark: #00a89a;
    --mr-primary-soft: #e9fcfa;
    --mr-warning: #f59e0b;
    --mr-warning-soft: #fff7e8;
    --mr-success: #16a34a;
    --mr-success-soft: #eaf9ef;
    --mr-danger: #ef4444;
    --mr-danger-soft: #fff1f1;
    --mr-shadow-sm: 0 2px 10px rgba(15, 23, 42, 0.04);
    --mr-shadow-md: 0 10px 30px rgba(15, 23, 42, 0.08);
    --mr-radius: 20px;
  }

  * { box-sizing: border-box; }

  .mr-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--mr-text);
    min-height: 100%;
  }

  .mr-page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 18px;
    margin-bottom: 22px;
    flex-wrap: wrap;
  }

  .mr-page-title-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mr-page-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--mr-primary-soft);
    color: var(--mr-primary-dark);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .mr-page-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--mr-primary);
  }

  .mr-page-title {
    font-family: 'Fraunces', serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--mr-text);
  }

  .mr-page-subtitle {
    font-size: 0.9rem;
    color: var(--mr-text-soft);
    line-height: 1.6;
    max-width: 560px;
  }

  .mr-header-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .mr-btn {
    border: none;
    outline: none;
    border-radius: 12px;
    padding: 11px 16px;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .mr-btn:active {
    transform: scale(0.98);
  }

  .mr-btn-outline {
    background: #fff;
    border: 1.5px solid var(--mr-border);
    color: #465062;
  }

  .mr-btn-outline:hover {
    border-color: var(--mr-primary);
    color: var(--mr-primary-dark);
    background: var(--mr-primary-soft);
  }

  .mr-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }

  .mr-summary-card {
    position: relative;
    overflow: hidden;
    background: var(--mr-surface);
    border: 1px solid var(--mr-border);
    border-radius: 18px;
    padding: 18px 18px 16px;
    box-shadow: var(--mr-shadow-sm);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .mr-summary-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--mr-shadow-md);
  }

  .mr-summary-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .mr-summary-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    font-weight: 700;
  }

  .mr-summary-icon.all {
    background: #ebf3ff;
    color: #2563eb;
  }

  .mr-summary-icon.pending {
    background: var(--mr-warning-soft);
    color: var(--mr-warning);
  }

  .mr-summary-icon.approved {
    background: var(--mr-success-soft);
    color: var(--mr-success);
  }

  .mr-summary-icon.rejected {
    background: var(--mr-danger-soft);
    color: var(--mr-danger);
  }

  .mr-summary-badge {
    font-size: 0.68rem;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 999px;
    letter-spacing: 0.02em;
  }

  .mr-badge-all {
    background: #ebf3ff;
    color: #2563eb;
  }

  .mr-badge-pending {
    background: var(--mr-warning-soft);
    color: #c47a0a;
  }

  .mr-badge-approved {
    background: var(--mr-success-soft);
    color: #13824f;
  }

  .mr-badge-rejected {
    background: var(--mr-danger-soft);
    color: #d53c3c;
  }

  .mr-summary-value {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
    color: var(--mr-text);
    margin-bottom: 6px;
  }

  .mr-summary-label {
    font-size: 0.78rem;
    color: var(--mr-text-soft);
    font-weight: 600;
  }

  .mr-summary-stripe {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;
  }

  .mr-summary-stripe.all {
    background: linear-gradient(90deg, #60a5fa, #2563eb);
  }

  .mr-summary-stripe.pending {
    background: linear-gradient(90deg, #fbbf24, #f59e0b);
  }

  .mr-summary-stripe.approved {
    background: linear-gradient(90deg, #4ade80, #16a34a);
  }

  .mr-summary-stripe.rejected {
    background: linear-gradient(90deg, #fb7185, #ef4444);
  }

  .mr-panel {
    background: var(--mr-surface);
    border: 1px solid var(--mr-border);
    border-radius: 22px;
    box-shadow: var(--mr-shadow-sm);
    overflow: hidden;
  }

  .mr-panel-top {
    padding: 18px 20px;
    border-bottom: 1px solid #eff3f8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .mr-panel-title-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mr-panel-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--mr-text);
  }

  .mr-panel-subtitle {
    font-size: 0.78rem;
    color: var(--mr-text-muted);
  }

  .mr-filter-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .mr-search-box {
    min-width: 270px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--mr-surface-2);
    border: 1.5px solid var(--mr-border);
    border-radius: 12px;
    padding: 10px 14px;
    transition: border-color 0.18s ease, background 0.18s ease;
  }

  .mr-search-box:focus-within {
    border-color: var(--mr-primary);
    background: #fff;
  }

  .mr-search-icon {
    color: #b1b8c6;
    font-size: 0.9rem;
  }

  .mr-search-box input {
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.83rem;
    color: var(--mr-text);
    width: 100%;
  }

  .mr-search-box input::placeholder {
    color: #a8b0bf;
  }

  .mr-status-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .mr-status-tab {
    border: 1.5px solid var(--mr-border);
    background: #fff;
    color: #6b7280;
    padding: 8px 14px;
    border-radius: 999px;
    font-family: inherit;
    font-size: 0.76rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.18s ease;
  }

  .mr-status-tab:hover {
    border-color: #cfd7e4;
    background: #fafcff;
  }

  .mr-status-tab.active {
    background: var(--mr-primary);
    color: #fff;
    border-color: var(--mr-primary);
    box-shadow: 0 6px 18px rgba(0, 205, 189, 0.22);
  }

  .mr-panel-count {
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--mr-text-muted);
    background: var(--mr-surface-2);
    border: 1px solid var(--mr-border);
    padding: 7px 12px;
    border-radius: 999px;
  }

  .mr-request-list {
    padding: 18px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .mr-request-card {
    border: 1px solid var(--mr-border);
    border-radius: 18px;
    padding: 18px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
    background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  }

  .mr-request-card:hover {
    border-color: #d8edf1;
    box-shadow: var(--mr-shadow-md);
    transform: translateY(-2px);
  }

  .mr-request-main {
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .mr-avatar {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: linear-gradient(135deg, #00d4c8, #0099a8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.84rem;
    font-weight: 800;
    flex-shrink: 0;
    box-shadow: 0 10px 22px rgba(0, 180, 170, 0.22);
  }

  .mr-info {
    flex: 1;
    min-width: 0;
  }

  .mr-name-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 5px;
  }

  .mr-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--mr-text);
  }

  .mr-status-pill {
    font-size: 0.67rem;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 999px;
    white-space: nowrap;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .mr-pill-pending {
    background: var(--mr-warning-soft);
    color: #c47a0a;
  }

  .mr-pill-approved {
    background: var(--mr-success-soft);
    color: #128250;
  }

  .mr-pill-rejected {
    background: var(--mr-danger-soft);
    color: #d53c3c;
  }

  .mr-subline {
    font-size: 0.78rem;
    color: var(--mr-text-soft);
    line-height: 1.6;
    margin-bottom: 12px;
  }

  .mr-meta-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .mr-meta-box {
    background: var(--mr-surface-2);
    border: 1px solid #edf1f6;
    border-radius: 14px;
    padding: 12px 12px 11px;
  }

  .mr-meta-label {
    font-size: 0.64rem;
    color: var(--mr-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 5px;
    font-weight: 800;
  }

  .mr-meta-value {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--mr-text);
    line-height: 1.3;
    word-break: break-word;
  }

  .mr-request-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    min-width: 150px;
  }

  .mr-action-btn {
    border: none;
    border-radius: 12px;
    padding: 11px 14px;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.12s ease, opacity 0.18s ease, box-shadow 0.18s ease;
  }

  .mr-action-btn:active {
    transform: scale(0.98);
  }

  .mr-btn-approve {
    background: linear-gradient(135deg, #00d4c8, #00b5a8);
    color: #fff;
    box-shadow: 0 8px 18px rgba(0, 205, 189, 0.22);
  }

  .mr-btn-approve:hover {
    box-shadow: 0 10px 24px rgba(0, 205, 189, 0.28);
  }

  .mr-btn-reject {
    background: #fff2f2;
    color: #dd4b4b;
    border: 1px solid #ffdede;
  }

  .mr-btn-reject:hover {
    background: #ffeaea;
  }

  .mr-btn-disabled {
    background: #f4f6f8;
    color: #99a2b1;
    cursor: default;
    border: 1px solid #edf1f5;
  }

  .mr-empty-state {
    text-align: center;
    padding: 42px 18px;
    color: #98a1b2;
    font-size: 0.88rem;
  }

  .mr-empty-icon {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  .mr-empty-title {
    font-size: 1rem;
    font-weight: 800;
    color: #4b5563;
    margin-bottom: 4px;
  }

  .mr-empty-sub {
    font-size: 0.82rem;
    color: #98a1b2;
  }

  @media (max-width: 1100px) {
    .mr-summary-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 900px) {
    .mr-request-card {
      grid-template-columns: 1fr;
    }

    .mr-request-actions {
      flex-direction: row;
      min-width: 0;
    }
  }

  @media (max-width: 700px) {
    .mr-meta-grid {
      grid-template-columns: 1fr;
    }

    .mr-search-box {
      min-width: 100%;
    }

    .mr-panel-top {
      align-items: stretch;
    }
  }

  @media (max-width: 640px) {
    .mr-summary-grid {
      grid-template-columns: 1fr;
    }

    .mr-page-title {
      font-size: 1.6rem;
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
  const { showToast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
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
    } catch (err) {
      showToast("Failed to load requests.", "error");
    } finally {
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

      showToast("Request approved successfully.", "success");
      fetchRequests();
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Approval failed.",
        "error"
      );
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

      showToast("Request rejected successfully.", "success");
      fetchRequests();
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Rejection failed.",
        "error"
      );
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const studentName = req.student?.name || "";
      const studentEmail = req.student?.email || "";
      const roomNumber = req.room?.roomNumber || "";
      const wing = req.room?.wing || "";
      const roomType = req.room?.type || "";
      const status = normalize(req.status);

      const matchesFilter = filter === "all" || status === filter;
      const searchValue = search.toLowerCase();

      const matchesSearch =
        !searchValue ||
        studentName.toLowerCase().includes(searchValue) ||
        studentEmail.toLowerCase().includes(searchValue) ||
        roomNumber.toLowerCase().includes(searchValue) ||
        wing.toLowerCase().includes(searchValue) ||
        roomType.toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [requests, filter, search]);

  const totalCount = requests.length;
  const pendingCount = requests.filter(
    (r) => normalize(r.status) === "pending"
  ).length;
  const approvedCount = requests.filter(
    (r) => normalize(r.status) === "approved"
  ).length;
  const rejectedCount = requests.filter(
    (r) => normalize(r.status) === "rejected"
  ).length;

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="mr-root">
        <div className="mr-page-header">
          <div className="mr-page-title-wrap">
            <div className="mr-page-badge">
              <span className="mr-page-badge-dot" />
              Admin Panel
            </div>
            <h1 className="mr-page-title">Manage Requests</h1>
            <p className="mr-page-subtitle">
              Review student room requests, monitor status, and approve or reject
              them from one clean dashboard.
            </p>
          </div>

          <div className="mr-header-actions">
            <button className="mr-btn mr-btn-outline" onClick={fetchRequests}>
              ↻ Refresh Requests
            </button>
          </div>
        </div>

        <div className="mr-summary-grid">
          <div className="mr-summary-card">
            <div className="mr-summary-top">
              <div className="mr-summary-icon all">📋</div>
              <span className="mr-summary-badge mr-badge-all">All</span>
            </div>
            <div className="mr-summary-value">{totalCount}</div>
            <div className="mr-summary-label">Total Requests</div>
            <div className="mr-summary-stripe all" />
          </div>

          <div className="mr-summary-card">
            <div className="mr-summary-top">
              <div className="mr-summary-icon pending">⏳</div>
              <span className="mr-summary-badge mr-badge-pending">Pending</span>
            </div>
            <div className="mr-summary-value">{pendingCount}</div>
            <div className="mr-summary-label">Pending Review</div>
            <div className="mr-summary-stripe pending" />
          </div>

          <div className="mr-summary-card">
            <div className="mr-summary-top">
              <div className="mr-summary-icon approved">✅</div>
              <span className="mr-summary-badge mr-badge-approved">Approved</span>
            </div>
            <div className="mr-summary-value">{approvedCount}</div>
            <div className="mr-summary-label">Approved Requests</div>
            <div className="mr-summary-stripe approved" />
          </div>

          <div className="mr-summary-card">
            <div className="mr-summary-top">
              <div className="mr-summary-icon rejected">✕</div>
              <span className="mr-summary-badge mr-badge-rejected">Rejected</span>
            </div>
            <div className="mr-summary-value">{rejectedCount}</div>
            <div className="mr-summary-label">Rejected Requests</div>
            <div className="mr-summary-stripe rejected" />
          </div>
        </div>

        <div className="mr-panel">
          <div className="mr-panel-top">
            <div className="mr-panel-title-wrap">
              <div className="mr-panel-title">Request Queue</div>
              <div className="mr-panel-subtitle">
                Search and filter all incoming room requests
              </div>
            </div>

            <div className="mr-filter-row">
              <div className="mr-search-box">
                <span className="mr-search-icon">🔍</span>
                <input
                  placeholder="Search by student, email, room, wing, or type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="mr-status-tabs">
                <button
                  className={`mr-status-tab ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`mr-status-tab ${filter === "pending" ? "active" : ""}`}
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </button>
                <button
                  className={`mr-status-tab ${filter === "approved" ? "active" : ""}`}
                  onClick={() => setFilter("approved")}
                >
                  Approved
                </button>
                <button
                  className={`mr-status-tab ${filter === "rejected" ? "active" : ""}`}
                  onClick={() => setFilter("rejected")}
                >
                  Rejected
                </button>
              </div>

              <div className="mr-panel-count">
                {filteredRequests.length} result
                {filteredRequests.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="mr-request-list">
            {loading && (
              <div className="mr-empty-state">
                <div className="mr-empty-icon">⏳</div>
                <div className="mr-empty-title">Loading requests...</div>
                <div className="mr-empty-sub">Please wait a moment.</div>
              </div>
            )}

            {!loading && filteredRequests.length === 0 && (
              <div className="mr-empty-state">
                <div className="mr-empty-icon">📭</div>
                <div className="mr-empty-title">No requests found</div>
                <div className="mr-empty-sub">
                  Try changing the search text or selected filter.
                </div>
              </div>
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
                  <div key={req._id} className="mr-request-card">
                    <div className="mr-request-main">
                      <div className="mr-avatar">{initialsFromName(studentName)}</div>

                      <div className="mr-info">
                        <div className="mr-name-row">
                          <div className="mr-name">{studentName}</div>

                          {status === "pending" && (
                            <span className="mr-status-pill mr-pill-pending">
                              Pending
                            </span>
                          )}
                          {status === "approved" && (
                            <span className="mr-status-pill mr-pill-approved">
                              Approved
                            </span>
                          )}
                          {status === "rejected" && (
                            <span className="mr-status-pill mr-pill-rejected">
                              Rejected
                            </span>
                          )}
                        </div>

                        <div className="mr-subline">
                          {studentEmail} • Requested {timeAgo(req.createdAt)}
                        </div>

                        <div className="mr-meta-grid">
                          <div className="mr-meta-box">
                            <div className="mr-meta-label">Room</div>
                            <div className="mr-meta-value">{roomNumber}</div>
                          </div>

                          <div className="mr-meta-box">
                            <div className="mr-meta-label">Wing</div>
                            <div className="mr-meta-value">{wing}</div>
                          </div>

                          <div className="mr-meta-box">
                            <div className="mr-meta-label">Type</div>
                            <div className="mr-meta-value">{roomType}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mr-request-actions">
                      {status === "pending" ? (
                        <>
                          <button
                            className="mr-action-btn mr-btn-approve"
                            onClick={() => approveRequest(req._id)}
                          >
                            Approve Request
                          </button>
                          <button
                            className="mr-action-btn mr-btn-reject"
                            onClick={() => rejectRequest(req._id)}
                          >
                            Reject Request
                          </button>
                        </>
                      ) : (
                        <button className="mr-action-btn mr-btn-disabled" disabled>
                          {status === "approved" ? "Already Approved" : "Already Rejected"}
                        </button>
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