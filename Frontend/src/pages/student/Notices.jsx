import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

.sn-root {
  min-height: 100vh;
  padding: 30px;
  font-family: 'DM Sans', sans-serif;
  color: #0f172a;
  background:
    radial-gradient(circle at 10% 0%, rgba(88,228,222,.28), transparent 28%),
    radial-gradient(circle at 90% 8%, rgba(99,102,241,.18), transparent 30%),
    radial-gradient(circle at 50% 100%, rgba(16,185,129,.12), transparent 32%),
    linear-gradient(135deg, #effefd 0%, #f8faff 45%, #f8fafc 100%);
}

.sn-shell {
  max-width: 1450px;
  margin: 0 auto;
  display: grid;
  gap: 22px;
}

.sn-hero {
  display: grid;
  grid-template-columns: 1.35fr .85fr;
  gap: 20px;
}

.sn-hero-main,
.sn-hero-side,
.sn-card,
.sn-side,
.sn-empty {
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(255,255,255,.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 18px 45px rgba(15,23,42,.08);
}

.sn-hero-main {
  border-radius: 30px;
  padding: 28px;
  position: relative;
  overflow: hidden;
}

.sn-hero-main::after {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  right: -80px;
  top: -90px;
  background: rgba(88,228,222,.2);
}

.sn-breadcrumb {
  display: flex;
  gap: 6px;
  font-size: .76rem;
  color: #94a3b8;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.sn-breadcrumb span {
  color: #00a7a0;
  font-weight: 900;
}

.sn-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.35rem;
  font-weight: 900;
  letter-spacing: -.055em;
  line-height: 1.05;
  color: #0f172a;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.sn-sub {
  color: #64748b;
  line-height: 1.75;
  max-width: 780px;
  font-size: .95rem;
  position: relative;
  z-index: 1;
}

.sn-hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 22px;
  position: relative;
  z-index: 1;
}

.sn-btn {
  border: none;
  border-radius: 15px;
  padding: 12px 16px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
  transition: .18s;
}

.sn-btn.primary {
  background: linear-gradient(135deg, #00d4c8, #2dd4bf);
  color: #073b3a;
  box-shadow: 0 10px 24px rgba(45,212,191,.28);
}

.sn-btn.secondary {
  background: #fff;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.sn-btn:hover {
  transform: translateY(-2px);
}

.sn-hero-side {
  border-radius: 30px;
  padding: 24px;
  background:
    linear-gradient(135deg, rgba(15,23,42,.94), rgba(30,41,59,.9)),
    rgba(255,255,255,.75);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.sn-hero-side::after {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  right: -55px;
  top: -45px;
  background: rgba(88,228,222,.18);
}

.sn-side-label {
  font-size: .7rem;
  font-weight: 900;
  letter-spacing: .16em;
  color: #58e4de;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.sn-side-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.4rem;
  font-weight: 900;
  letter-spacing: -.04em;
  margin-bottom: 6px;
  position: relative;
  z-index: 1;
}

.sn-side-text {
  color: #cbd5e1;
  line-height: 1.65;
  font-size: .88rem;
  position: relative;
  z-index: 1;
}

.sn-mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

.sn-mini-stat {
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 16px;
  padding: 13px;
}

.sn-mini-stat strong {
  display: block;
  color: #58e4de;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.18rem;
  font-weight: 900;
}

.sn-mini-stat span {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
  font-size: .68rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .08em;
}

.sn-toolbar {
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(255,255,255,.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 12px 32px rgba(15,23,42,.06);
  border-radius: 24px;
  padding: 16px;
  display: grid;
  grid-template-columns: 1.3fr 240px auto;
  gap: 12px;
  align-items: center;
}

.sn-search {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 13px 14px;
}

.sn-search input {
  border: none;
  outline: none;
  width: 100%;
  font-family: inherit;
  font-size: .9rem;
  color: #0f172a;
  background: transparent;
}

.sn-select {
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 16px;
  padding: 13px 14px;
  font-family: inherit;
  font-size: .86rem;
  font-weight: 800;
  color: #475569;
  outline: none;
}

.sn-count {
  background: #0f172a;
  color: #fff;
  border-radius: 999px;
  padding: 12px 16px;
  font-size: .82rem;
  font-weight: 900;
  white-space: nowrap;
}

.sn-content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 22px;
  align-items: start;
}

.sn-card {
  border-radius: 30px;
  padding: 22px;
}

.sn-list-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.sn-card-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.18rem;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 5px;
}

.sn-card-sub {
  font-size: .86rem;
  color: #64748b;
  line-height: 1.6;
}

.sn-list {
  display: grid;
  gap: 15px;
}

.sn-item {
  position: relative;
  overflow: hidden;
  border: 1px solid #e8eef6;
  border-radius: 22px;
  padding: 18px;
  background: #fff;
  transition: .22s ease;
}

.sn-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 42px rgba(15,23,42,.1);
}

.sn-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 5px;
  height: 100%;
  background: #00d4c8;
}

.sn-item.emergency::before { background: #ef4444; }
.sn-item.maintenance::before { background: #f59e0b; }
.sn-item.fee::before { background: #3b82f6; }
.sn-item.policy::before { background: #8b5cf6; }
.sn-item.event::before { background: #22c55e; }

.sn-item-top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.sn-item-left {
  display: flex;
  gap: 13px;
  align-items: flex-start;
}

.sn-icon {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: #ecfeff;
  color: #0f766e;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.sn-item-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.02rem;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 5px;
}

.sn-item-meta {
  font-size: .8rem;
  color: #64748b;
  line-height: 1.5;
}

.sn-pill-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sn-pill {
  padding: 7px 11px;
  border-radius: 999px;
  font-size: .72rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .04em;
}

.pill-general { background: #eef2ff; color: #4338ca; }
.pill-maintenance { background: #fff7ed; color: #c2410c; }
.pill-fee { background: #eff6ff; color: #1d4ed8; }
.pill-policy { background: #f5f3ff; color: #7c3aed; }
.pill-emergency { background: #fef2f2; color: #b91c1c; }
.pill-event { background: #ecfdf5; color: #047857; }

.sn-item-message {
  font-size: .93rem;
  color: #334155;
  line-height: 1.8;
  white-space: pre-wrap;
  margin: 12px 0 14px;
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
  font-size: .79rem;
  color: #64748b;
  line-height: 1.55;
  font-weight: 600;
}

.sn-read-chip {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: .75rem;
  font-weight: 900;
}

.sn-side {
  border-radius: 30px;
  padding: 22px;
  position: sticky;
  top: 84px;
  display: grid;
  gap: 14px;
}

.sn-stat {
  background: #f8fafc;
  border: 1px solid #e8eef6;
  border-radius: 18px;
  padding: 16px;
}

.sn-stat-kicker {
  font-size: .66rem;
  color: #94a3b8;
  font-weight: 900;
  letter-spacing: .1em;
  margin-bottom: 7px;
}

.sn-stat-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.65rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 5px;
}

.sn-stat-sub {
  font-size: .8rem;
  color: #64748b;
  line-height: 1.5;
}

.sn-tip {
  background:
    linear-gradient(135deg, rgba(15,23,42,.94), rgba(30,41,59,.9));
  border-radius: 20px;
  padding: 18px;
  color: #fff;
  overflow: hidden;
  position: relative;
}

.sn-tip::after {
  content: "";
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(88,228,222,.15);
  position: absolute;
  right: -40px;
  top: -40px;
}

.sn-tip-title {
  font-size: .98rem;
  font-weight: 900;
  margin-bottom: 7px;
  position: relative;
  z-index: 1;
}

.sn-tip-sub {
  font-size: .84rem;
  color: #cbd5e1;
  line-height: 1.7;
  position: relative;
  z-index: 1;
}

.sn-empty {
  border-radius: 24px;
  padding: 70px 20px;
  text-align: center;
  color: #64748b;
  font-weight: 800;
}

.sn-empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

@media (max-width: 1120px) {
  .sn-hero,
  .sn-content {
    grid-template-columns: 1fr;
  }

  .sn-side {
    position: static;
    grid-template-columns: repeat(3, 1fr);
  }

  .sn-tip {
    grid-column: 1 / -1;
  }
}

@media (max-width: 820px) {
  .sn-toolbar {
    grid-template-columns: 1fr;
  }

  .sn-count {
    text-align: center;
  }

  .sn-side {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .sn-root {
    padding: 16px;
  }

  .sn-title {
    font-size: 1.7rem;
  }

  .sn-mini-stats {
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

function itemClass(category = "General") {
  return category.toLowerCase();
}

function categoryIcon(category = "General") {
  const key = category.toLowerCase();
  if (key === "maintenance") return "🛠️";
  if (key === "fee") return "💳";
  if (key === "policy") return "📘";
  if (key === "emergency") return "🚨";
  if (key === "event") return "🎉";
  return "📢";
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
    } catch (err) {
      console.error(err);
      showToast("Failed to load notices", "error");
    } finally {
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
      fees: notices.filter((n) => n.category === "Fee").length,
    };
  }, [notices]);

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="sn-root">
        <div className="sn-shell">
          <div className="sn-hero">
            <div className="sn-hero-main">
              <div className="sn-breadcrumb">
                Dashboard › Student › <span>Notifications</span>
              </div>

              <div className="sn-title">Student Notices & Announcements</div>

              <div className="sn-sub">
                Stay updated with hostel rules, maintenance alerts, fee reminders,
                emergency announcements, and important campus residence updates.
              </div>

              <div className="sn-hero-actions">
                <button className="sn-btn primary" onClick={fetchNotices}>
                  Refresh Notices
                </button>
                <button
                  className="sn-btn secondary"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>

            <div className="sn-hero-side">
              <div className="sn-side-label">NOTIFICATION CENTER</div>
              <div className="sn-side-value">{stats.total}</div>
              <div className="sn-side-text">
                Active announcements available for your hostel account.
              </div>

              <div className="sn-mini-stats">
                <div className="sn-mini-stat">
                  <strong>{stats.emergencies}</strong>
                  <span>Emergency</span>
                </div>
                <div className="sn-mini-stat">
                  <strong>{stats.maintenance}</strong>
                  <span>Maintenance</span>
                </div>
                <div className="sn-mini-stat">
                  <strong>{stats.fees}</strong>
                  <span>Fee</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sn-toolbar">
            <div className="sn-search">
              <span style={{ color: "#94a3b8" }}>🔍</span>
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

            <div className="sn-count">
              {filteredNotices.length} notice{filteredNotices.length !== 1 ? "s" : ""} found
            </div>
          </div>

          <div className="sn-content">
            <div className="sn-card">
              <div className="sn-list-head">
                <div>
                  <div className="sn-card-title">Latest Updates</div>
                  <div className="sn-card-sub">
                    Read recent updates posted by hostel administration.
                  </div>
                </div>
              </div>

              <div className="sn-list">
                {loading ? (
                  <div className="sn-empty">
                    <div className="sn-empty-icon">⏳</div>
                    Loading notices...
                  </div>
                ) : filteredNotices.length === 0 ? (
                  <div className="sn-empty">
                    <div className="sn-empty-icon">📭</div>
                    No notices found.
                  </div>
                ) : (
                  filteredNotices.map((notice) => (
                    <div
                      key={notice._id}
                      className={`sn-item ${itemClass(notice.category)}`}
                    >
                      <div className="sn-item-top">
                        <div className="sn-item-left">
                          <div className="sn-icon">
                            {categoryIcon(notice.category)}
                          </div>

                          <div>
                            <div className="sn-item-title">{notice.title}</div>
                            <div className="sn-item-meta">
                              Posted by {notice.postedBy?.name || "Admin"}
                            </div>
                          </div>
                        </div>

                        <div className="sn-pill-row">
                          <span className={`sn-pill ${categoryClass(notice.category)}`}>
                            {notice.category || "General"}
                          </span>
                        </div>
                      </div>

                      <div className="sn-item-message">{notice.message}</div>

                      <div className="sn-item-footer">
                        <div className="sn-item-time">
                          Published {timeAgo(notice.createdAt)}
                          <br />
                          {notice.createdAt
                            ? new Date(notice.createdAt).toLocaleString()
                            : "No date"}
                        </div>

                        <div className="sn-read-chip">Visible to Students</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="sn-side">
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
                <div className="sn-tip-title">Quick Tip</div>
                <div className="sn-tip-sub">
                  Emergency and maintenance notices may also appear in your
                  notification bell for faster visibility.
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