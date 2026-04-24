import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .rp-root {
    font-family: 'Inter', sans-serif;
    background: #f4f7fb;
    min-height: 100vh;
    padding: 28px;
    color: #111827;
  }

  .rp-shell {
    display: grid;
    gap: 20px;
  }

  .rp-hero {
    background: linear-gradient(135deg, #e8fbf8, #eef7ff);
    border: 1px solid #e2f2f0;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 28px rgba(17,24,39,.04);
  }

  .rp-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #8b95a7;
    margin-bottom: 10px;
  }

  .rp-breadcrumb span {
    color: #00b8ae;
    font-weight: 700;
  }

  .rp-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }

  .rp-sub {
    font-size: 0.95rem;
    color: #667085;
    line-height: 1.6;
    max-width: 780px;
  }

  .rp-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .rp-stat {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    padding: 20px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
  }

  .rp-stat-kicker {
    font-size: 0.68rem;
    color: #9ca3af;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  .rp-stat-value {
    font-size: 1.8rem;
    font-weight: 800;
    color: #111827;
    line-height: 1;
    margin-bottom: 4px;
  }

  .rp-stat-sub {
    font-size: 0.82rem;
    color: #6b7280;
  }

  .rp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }

  .rp-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
    padding: 20px;
  }

  .rp-card-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .rp-card-title {
    font-size: 1.08rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .rp-card-sub {
    font-size: 0.84rem;
    color: #6b7280;
  }

  .rp-search {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    padding: 11px 13px;
    background: #fff;
    margin-bottom: 16px;
  }

  .rp-search input {
    border: none;
    outline: none;
    width: 100%;
    font-family: inherit;
    font-size: 0.86rem;
    background: transparent;
  }

  .rp-list {
    display: grid;
    gap: 14px;
  }

  .rp-item {
    border: 1px solid #edf1f7;
    border-radius: 18px;
    padding: 16px;
    background: #fff;
  }

  .rp-pair-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .rp-pill {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .pill-pending { background: #fff7ed; color: #c2410c; }
  .pill-accepted { background: #ecfdf5; color: #047857; }
  .pill-rejected { background: #fef2f2; color: #b91c1c; }

  .rp-students {
    display: grid;
    gap: 10px;
  }

  .rp-student {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f8fafc;
    border: 1px solid #edf1f7;
    border-radius: 16px;
    padding: 12px;
  }

  .rp-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #58e4de, #93c5fd);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    flex-shrink: 0;
  }

  .rp-name {
    font-size: 0.9rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 3px;
  }

  .rp-meta {
    font-size: 0.78rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .rp-message {
    margin-top: 12px;
    background: #f9fbff;
    border: 1px solid #eef2f7;
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 0.84rem;
    color: #4b5563;
    line-height: 1.6;
  }

  .rp-time {
    margin-top: 10px;
    font-size: 0.76rem;
    color: #9ca3af;
  }

  .rp-empty {
    padding: 20px 0;
    color: #6b7280;
    font-size: 0.88rem;
  }

  @media (max-width: 1100px) {
    .rp-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .rp-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .rp-root {
      padding: 16px;
    }

    .rp-stats {
      grid-template-columns: 1fr;
    }
  }
`;

function initials(name = "ST") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function pillClass(status = "") {
  const s = status.toLowerCase();
  if (s === "accepted") return "pill-accepted";
  if (s === "rejected") return "pill-rejected";
  return "pill-pending";
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

function RoommatePairs() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/roommate-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to load roommate request data", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const accepted = useMemo(
    () => requests.filter((r) => (r.status || "").toLowerCase() === "accepted"),
    [requests]
  );

  const pending = useMemo(
    () => requests.filter((r) => (r.status || "").toLowerCase() === "pending"),
    [requests]
  );

  const rejected = useMemo(
    () => requests.filter((r) => (r.status || "").toLowerCase() === "rejected"),
    [requests]
  );

  const filteredAccepted = useMemo(() => {
    const q = search.toLowerCase();
    return accepted.filter((r) => {
      const fromName = r.fromStudent?.name?.toLowerCase() || "";
      const toName = r.toStudent?.name?.toLowerCase() || "";
      const fromEmail = r.fromStudent?.email?.toLowerCase() || "";
      const toEmail = r.toStudent?.email?.toLowerCase() || "";
      return !q || fromName.includes(q) || toName.includes(q) || fromEmail.includes(q) || toEmail.includes(q);
    });
  }, [accepted, search]);

  const filteredPending = useMemo(() => {
    const q = search.toLowerCase();
    return pending.filter((r) => {
      const fromName = r.fromStudent?.name?.toLowerCase() || "";
      const toName = r.toStudent?.name?.toLowerCase() || "";
      const fromEmail = r.fromStudent?.email?.toLowerCase() || "";
      const toEmail = r.toStudent?.email?.toLowerCase() || "";
      return !q || fromName.includes(q) || toName.includes(q) || fromEmail.includes(q) || toEmail.includes(q);
    });
  }, [pending, search]);

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="rp-root">
        <div className="rp-shell">
          <div className="rp-hero">
            <div className="rp-breadcrumb">
              Dashboard › Admin › <span>Roommate Pairs</span>
            </div>
            <div className="rp-title">Roommate Pair Management</div>
            <div className="rp-sub">
              Review accepted roommate pairings and pending mutual-interest requests before final room allocation.
            </div>
          </div>

          <div className="rp-stats">
            <div className="rp-stat">
              <div className="rp-stat-kicker">TOTAL REQUESTS</div>
              <div className="rp-stat-value">{loading ? "—" : requests.length}</div>
              <div className="rp-stat-sub">All roommate preference requests</div>
            </div>

            <div className="rp-stat">
              <div className="rp-stat-kicker">ACCEPTED PAIRS</div>
              <div className="rp-stat-value">{loading ? "—" : accepted.length}</div>
              <div className="rp-stat-sub">Mutually confirmed roommate pairs</div>
            </div>

            <div className="rp-stat">
              <div className="rp-stat-kicker">PENDING</div>
              <div className="rp-stat-value">{loading ? "—" : pending.length}</div>
              <div className="rp-stat-sub">Awaiting response</div>
            </div>

            <div className="rp-stat">
              <div className="rp-stat-kicker">REJECTED</div>
              <div className="rp-stat-value">{loading ? "—" : rejected.length}</div>
              <div className="rp-stat-sub">Declined requests</div>
            </div>
          </div>

          <div className="rp-search">
            <span style={{ color: "#9ca3af" }}>🔍</span>
            <input
              placeholder="Search by student name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="rp-grid">
            <div className="rp-card">
              <div className="rp-card-head">
                <div>
                  <div className="rp-card-title">Accepted Roommate Pairs</div>
                  <div className="rp-card-sub">These students have agreed to room together.</div>
                </div>
              </div>

              <div className="rp-list">
                {loading ? (
                  <div className="rp-empty">Loading...</div>
                ) : filteredAccepted.length === 0 ? (
                  <div className="rp-empty">No accepted roommate pairs yet.</div>
                ) : (
                  filteredAccepted.map((item) => (
                    <div className="rp-item" key={item._id}>
                      <div className="rp-pair-top">
                        <div className="rp-card-sub">Pair confirmed</div>
                        <span className={`rp-pill ${pillClass(item.status)}`}>{item.status}</span>
                      </div>

                      <div className="rp-students">
                        <div className="rp-student">
                          <div className="rp-avatar">{initials(item.fromStudent?.name || "S")}</div>
                          <div>
                            <div className="rp-name">{item.fromStudent?.name || "Student"}</div>
                            <div className="rp-meta">{item.fromStudent?.email || "No email"}</div>
                          </div>
                        </div>

                        <div className="rp-student">
                          <div className="rp-avatar">{initials(item.toStudent?.name || "S")}</div>
                          <div>
                            <div className="rp-name">{item.toStudent?.name || "Student"}</div>
                            <div className="rp-meta">{item.toStudent?.email || "No email"}</div>
                          </div>
                        </div>
                      </div>

                      {item.message ? (
                        <div className="rp-message">{item.message}</div>
                      ) : null}

                      <div className="rp-time">Updated {timeAgo(item.updatedAt)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rp-card">
              <div className="rp-card-head">
                <div>
                  <div className="rp-card-title">Pending Requests</div>
                  <div className="rp-card-sub">These roommate requests still need a response.</div>
                </div>
              </div>

              <div className="rp-list">
                {loading ? (
                  <div className="rp-empty">Loading...</div>
                ) : filteredPending.length === 0 ? (
                  <div className="rp-empty">No pending roommate requests.</div>
                ) : (
                  filteredPending.map((item) => (
                    <div className="rp-item" key={item._id}>
                      <div className="rp-pair-top">
                        <div className="rp-card-sub">Awaiting action</div>
                        <span className={`rp-pill ${pillClass(item.status)}`}>{item.status}</span>
                      </div>

                      <div className="rp-students">
                        <div className="rp-student">
                          <div className="rp-avatar">{initials(item.fromStudent?.name || "S")}</div>
                          <div>
                            <div className="rp-name">{item.fromStudent?.name || "Student"}</div>
                            <div className="rp-meta">Requested → {item.toStudent?.name || "Student"}</div>
                          </div>
                        </div>

                        <div className="rp-student">
                          <div className="rp-avatar">{initials(item.toStudent?.name || "S")}</div>
                          <div>
                            <div className="rp-name">{item.toStudent?.name || "Student"}</div>
                            <div className="rp-meta">{item.toStudent?.email || "No email"}</div>
                          </div>
                        </div>
                      </div>

                      {item.message ? (
                        <div className="rp-message">{item.message}</div>
                      ) : null}

                      <div className="rp-time">Sent {timeAgo(item.createdAt)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RoommatePairs;