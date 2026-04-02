import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700;800&display=swap');

  .sn-root {
    font-family: 'Inter', sans-serif;
    background: #f4f7fb;
    min-height: 100vh;
    padding: 28px;
    color: #111827;
  }

  .sn-shell {
    display: grid;
    gap: 20px;
  }

  .sn-hero {
    background: linear-gradient(135deg, #e8fbf8, #eef7ff);
    border: 1px solid #e2f2f0;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 28px rgba(17,24,39,.04);
  }

  .sn-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #8b95a7;
    margin-bottom: 10px;
  }

  .sn-breadcrumb span {
    color: #00b8ae;
    font-weight: 700;
  }

  .sn-title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }

  .sn-sub {
    font-size: 0.95rem;
    color: #667085;
    line-height: 1.6;
    max-width: 760px;
  }

  .sn-top-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 20px;
    align-items: start;
  }

  .sn-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
  }

  .sn-list-card {
    padding: 20px;
  }

  .sn-list-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .sn-card-title {
    font-size: 1.12rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .sn-card-sub {
    font-size: 0.84rem;
    color: #6b7280;
  }

  .sn-search-wrap {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    width: 100%;
  }

  .sn-search {
    flex: 1;
    min-width: 240px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    padding: 11px 13px;
    background: #fff;
  }

  .sn-search input {
    border: none;
    outline: none;
    width: 100%;
    font-family: inherit;
    font-size: 0.86rem;
    background: transparent;
  }

  .sn-select {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    background: #fff;
    padding: 11px 13px;
    font-family: inherit;
    font-size: 0.88rem;
    color: #111827;
    outline: none;
  }

  .sn-list {
    display: grid;
    gap: 14px;
  }

  .sn-item {
    border: 1px solid #e8edf4;
    border-radius: 18px;
    padding: 18px;
    background: #fff;
    transition: box-shadow .18s ease, transform .18s ease;
  }

  .sn-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(17,24,39,.06);
  }

  .sn-item-top {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .sn-item-title {
    font-size: 1rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 5px;
  }

  .sn-item-meta {
    font-size: 0.8rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .sn-pill-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .sn-pill {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 800;
  }

  .pill-general { background: #eef2ff; color: #4338ca; }
  .pill-maintenance { background: #fff7ed; color: #c2410c; }
  .pill-fee { background: #eff6ff; color: #1d4ed8; }
  .pill-policy { background: #f5f3ff; color: #7c3aed; }
  .pill-emergency { background: #fef2f2; color: #b91c1c; }
  .pill-event { background: #ecfdf5; color: #047857; }

  .sn-item-message {
    font-size: 0.92rem;
    color: #374151;
    line-height: 1.75;
    white-space: pre-wrap;
    margin-bottom: 14px;
  }

  .sn-item-footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    border-top: 1px solid #eef2f7;
    padding-top: 14px;
  }

  .sn-item-time {
    font-size: 0.78rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .sn-side {
    padding: 20px;
    align-self: start;
    position: sticky;
    top: 84px;
    display: grid;
    gap: 14px;
  }

  .sn-stat {
    background: #f8fafc;
    border: 1px solid #edf1f7;
    border-radius: 18px;
    padding: 16px;
  }

  .sn-stat-kicker {
    font-size: 0.68rem;
    color: #9ca3af;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 7px;
  }

  .sn-stat-value {
    font-size: 1.5rem;
    font-weight: 800;
    color: #111827;
    line-height: 1;
    margin-bottom: 4px;
  }

  .sn-stat-sub {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .sn-tip {
    background: linear-gradient(135deg, #dff8f6, #eef8ff);
    border: 1px solid #e2f2f0;
    border-radius: 18px;
    padding: 16px;
  }

  .sn-tip-title {
    font-size: 0.95rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 6px;
  }

  .sn-tip-sub {
    font-size: 0.82rem;
    color: #5f6b7d;
    line-height: 1.6;
  }

  .sn-empty {
    padding: 24px;
    text-align: center;
    font-size: 0.9rem;
    color: #6b7280;
  }

  @media (max-width: 1080px) {
    .sn-top-grid {
      grid-template-columns: 1fr;
    }

    .sn-side {
      position: static;
      grid-template-columns: repeat(3, 1fr);
      align-self: auto;
    }

    .sn-tip {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 760px) {
    .sn-root {
      padding: 16px;
    }

    .sn-side {
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

function categoryClass(category = "General") {
  const key = category.toLowerCase();
  if (key === "maintenance") return "pill-maintenance";
  if (key === "fee") return "pill-fee";
  if (key === "policy") return "pill-policy";
  if (key === "emergency") return "pill-emergency";
  if (key === "event") return "pill-event";
  return "pill-general";
}

function Notices() {
  const { showToast } = useToast();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/notices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotices(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to load notices", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const q = search.toLowerCase();

      const searchMatch =
        !q ||
        notice.title?.toLowerCase().includes(q) ||
        notice.message?.toLowerCase().includes(q) ||
        notice.category?.toLowerCase().includes(q);

      const categoryMatch =
        categoryFilter === "all" || notice.category === categoryFilter;

      return searchMatch && categoryMatch;
    });
  }, [notices, search, categoryFilter]);

  const stats = useMemo(() => {
    return {
      total: notices.length,
      emergencies: notices.filter((n) => n.category === "Emergency").length,
      maintenance: notices.filter((n) => n.category === "Maintenance").length,
    };
  }, [notices]);

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="sn-root">
        <div className="sn-shell">
          <div className="sn-hero">
            <div className="sn-breadcrumb">
              Dashboard › Student › <span>Notices</span>
            </div>
            <div className="sn-title">Student Notices & Announcements</div>
            <div className="sn-sub">
              Stay updated with hostel rules, maintenance alerts, fee reminders,
              emergency announcements, and important campus residence updates.
            </div>
          </div>

          <div className="sn-top-grid">
            <div className="sn-card">
              <div className="sn-list-card">
                <div className="sn-list-head">
                  <div>
                    <div className="sn-card-title">Latest Notices</div>
                    <div className="sn-card-sub">
                      Read recent updates posted by hostel administration.
                    </div>
                  </div>

                  <div className="sn-search-wrap">
                    <div className="sn-search">
                      <span style={{ color: "#9ca3af" }}>🔍</span>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search title, message, category..."
                      />
                    </div>

                    <select
                      className="sn-select"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="General">General</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Fee">Fee</option>
                      <option value="Policy">Policy</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Event">Event</option>
                    </select>
                  </div>
                </div>

                <div className="sn-list">
                  {loading ? (
                    <div className="sn-empty">Loading notices...</div>
                  ) : filteredNotices.length === 0 ? (
                    <div className="sn-empty">No notices found.</div>
                  ) : (
                    filteredNotices.map((notice) => (
                      <div key={notice._id} className="sn-item">
                        <div className="sn-item-top">
                          <div>
                            <div className="sn-item-title">{notice.title}</div>
                            <div className="sn-item-meta">
                              Posted by {notice.postedBy?.name || "Admin"}
                            </div>
                          </div>

                          <div className="sn-pill-row">
                            <span className={`sn-pill ${categoryClass(notice.category)}`}>
                              {notice.category}
                            </span>
                          </div>
                        </div>

                        <div className="sn-item-message">{notice.message}</div>

                        <div className="sn-item-footer">
                          <div className="sn-item-time">
                            Published {timeAgo(notice.createdAt)}
                            <br />
                            {new Date(notice.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="sn-card sn-side">
              <div className="sn-stat">
                <div className="sn-stat-kicker">TOTAL</div>
                <div className="sn-stat-value">{stats.total}</div>
                <div className="sn-stat-sub">Available notices</div>
              </div>

              <div className="sn-stat">
                <div className="sn-stat-kicker">EMERGENCY</div>
                <div className="sn-stat-value">{stats.emergencies}</div>
                <div className="sn-stat-sub">Critical alerts</div>
              </div>

              <div className="sn-stat">
                <div className="sn-stat-kicker">MAINTENANCE</div>
                <div className="sn-stat-value">{stats.maintenance}</div>
                <div className="sn-stat-sub">Service updates</div>
              </div>

              <div className="sn-tip">
                <div className="sn-tip-title">Tip</div>
                <div className="sn-tip-sub">
                  Emergency and maintenance notices may also appear in your notification bell for faster visibility.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Notices;