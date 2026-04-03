import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  .mn-root {
    font-family: 'DM Sans', sans-serif !important;
    background: #f0f4f8;
    min-height: 100vh;
    padding: 32px;
    color: #0f172a;
  }

  .mn-root *,
  .mn-root *::before,
  .mn-root *::after {
    font-family: 'DM Sans', sans-serif !important;
    box-sizing: border-box;
  }

  .mn-root h1, .mn-root h2, .mn-root h3,
  .mn-root .mn-title, .mn-root .mn-card-title,
  .mn-root .mn-item-title, .mn-root .mn-stat-value,
  .mn-root .mn-feed-title {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
  }

  .mn-shell {
    display: grid;
    gap: 24px;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── HERO ── */
  .mn-hero {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #0e4f4a 100%);
    border-radius: 28px;
    padding: 36px 40px;
    color: #fff;
    box-shadow: 0 20px 60px rgba(15,23,42,0.22);
  }

  .mn-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(88,228,222,0.18) 0%, transparent 65%),
                radial-gradient(ellipse at 10% 80%, rgba(56,189,248,0.12) 0%, transparent 50%);
    pointer-events: none;
  }

  .mn-hero-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .mn-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.73rem;
    color: rgba(255,255,255,0.5);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .mn-breadcrumb span {
    color: #58e4de;
  }

  .mn-title {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: #fff;
    margin-bottom: 10px;
  }

  .mn-sub {
    font-size: 0.93rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.65;
    max-width: 580px;
  }

  .mn-hero-badge {
    background: rgba(88,228,222,0.15);
    border: 1px solid rgba(88,228,222,0.3);
    border-radius: 16px;
    padding: 16px 22px;
    text-align: center;
    flex-shrink: 0;
  }

  .mn-hero-badge-num {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 2.4rem;
    font-weight: 800;
    color: #58e4de;
    line-height: 1;
    margin-bottom: 4px;
  }

  .mn-hero-badge-label {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.55);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── STATS ROW ── */
  .mn-stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .mn-stat {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 20px 22px;
    box-shadow: 0 4px 16px rgba(15,23,42,0.04);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .mn-stat:hover {
    box-shadow: 0 8px 28px rgba(15,23,42,0.09);
    transform: translateY(-2px);
  }

  .mn-stat-kicker {
    font-size: 0.68rem;
    color: #94a3b8;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .mn-stat-value {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 1.9rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1;
    margin-bottom: 3px;
  }

  .mn-stat-sub {
    font-size: 0.78rem;
    color: #64748b;
  }

  .mn-stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .icon-teal   { background: #e0faf8; }
  .icon-blue   { background: #eff6ff; }
  .icon-amber  { background: #fffbeb; }
  .icon-red    { background: #fff1f2; }

  /* ── MAIN LAYOUT ── */
  .mn-top-grid {
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 20px;
    align-items: start;
  }

  /* ── CARD ── */
  .mn-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    box-shadow: 0 4px 20px rgba(15,23,42,0.04);
  }

  .mn-form-wrap {
    padding: 28px;
  }

  .mn-card-title {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 1.15rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 4px;
  }

  .mn-card-sub {
    font-size: 0.83rem;
    color: #64748b;
    margin-bottom: 22px;
    line-height: 1.5;
  }

  /* ── FORM ── */
  .mn-form {
    display: grid;
    gap: 16px;
  }

  .mn-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .mn-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: #374151;
    letter-spacing: 0.03em;
  }

  .mn-input,
  .mn-select,
  .mn-textarea {
    width: 100%;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    background: #f8fafc;
    padding: 12px 16px;
    font-size: 0.88rem;
    color: #0f172a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    -webkit-appearance: none;
  }

  .mn-input:focus,
  .mn-select:focus,
  .mn-textarea:focus {
    border-color: #2dd4c8;
    box-shadow: 0 0 0 4px rgba(45,212,200,0.1);
    background: #fff;
  }

  .mn-input::placeholder,
  .mn-textarea::placeholder {
    color: #94a3b8;
  }

  .mn-textarea {
    min-height: 140px;
    resize: vertical;
    line-height: 1.65;
  }

  .mn-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .mn-helper {
    font-size: 0.73rem;
    color: #94a3b8;
    line-height: 1.55;
  }

  .mn-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .mn-btn-primary {
    border: none;
    background: linear-gradient(135deg, #14b8a6, #0891b2);
    color: #fff;
    border-radius: 14px;
    padding: 13px 22px;
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(20,184,166,0.35);
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
    letter-spacing: 0.01em;
  }

  .mn-btn-primary:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(20,184,166,0.4);
  }

  .mn-btn-primary:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .mn-btn-outline {
    border: 1.5px solid #e2e8f0;
    background: #fff;
    color: #64748b;
    border-radius: 14px;
    padding: 13px 18px;
    font-size: 0.86rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }

  .mn-btn-outline:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
    color: #374151;
  }

  /* ── DIVIDER ── */
  .mn-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 4px 0;
  }

  /* ── NOTICE LIST ── */
  .mn-list-card {
    padding: 28px;
  }

  .mn-list-head {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .mn-search-wrap {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .mn-search {
    display: flex;
    align-items: center;
    gap: 9px;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 11px 15px;
    background: #f8fafc;
    min-width: 260px;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .mn-search:focus-within {
    border-color: #2dd4c8;
    box-shadow: 0 0 0 4px rgba(45,212,200,0.1);
    background: #fff;
  }

  .mn-search-icon {
    font-size: 0.95rem;
    color: #94a3b8;
    flex-shrink: 0;
  }

  .mn-search input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.86rem;
    background: transparent;
    color: #0f172a;
  }

  .mn-search input::placeholder {
    color: #94a3b8;
  }

  .mn-filter-select {
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 11px 14px;
    font-size: 0.84rem;
    font-weight: 600;
    color: #374151;
    background: #f8fafc;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
    transition: border-color 0.15s;
  }

  .mn-filter-select:focus {
    border-color: #2dd4c8;
  }

  .mn-list {
    display: grid;
    gap: 16px;
  }

  /* ── NOTICE ITEM ── */
  .mn-item {
    border: 1px solid #e8edf4;
    border-radius: 20px;
    padding: 22px 24px;
    background: #fff;
    transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s;
    position: relative;
    overflow: hidden;
  }

  .mn-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #14b8a6, #0891b2);
    border-radius: 4px 0 0 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .mn-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(15,23,42,0.08);
    border-color: #d4dbe6;
  }

  .mn-item:hover::before {
    opacity: 1;
  }

  .mn-item-top {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-start;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .mn-item-title {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 1.05rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 5px;
    line-height: 1.3;
  }

  .mn-item-meta {
    font-size: 0.78rem;
    color: #94a3b8;
    line-height: 1.5;
    font-weight: 500;
  }

  .mn-pill-row {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  .mn-pill {
    padding: 5px 11px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  .pill-general     { background: #eef2ff; color: #4338ca; }
  .pill-maintenance { background: #fff7ed; color: #c2410c; }
  .pill-fee         { background: #eff6ff; color: #1d4ed8; }
  .pill-policy      { background: #f5f3ff; color: #7c3aed; }
  .pill-emergency   { background: #fef2f2; color: #b91c1c; }
  .pill-event       { background: #ecfdf5; color: #047857; }
  .pill-active      { background: #dcfce7; color: #166534; }
  .pill-inactive    { background: #f1f5f9; color: #64748b; }

  .mn-item-message {
    font-size: 0.88rem;
    color: #475569;
    line-height: 1.75;
    margin-bottom: 16px;
    white-space: pre-wrap;
    padding: 14px 16px;
    background: #f8fafc;
    border-radius: 12px;
    border-left: 3px solid #e2e8f0;
  }

  .mn-item-footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .mn-item-foot-left {
    font-size: 0.76rem;
    color: #94a3b8;
    line-height: 1.6;
    font-weight: 500;
  }

  .mn-item-foot-left strong {
    color: #475569;
    font-weight: 700;
  }

  .mn-item-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .mn-btn-soft {
    border: 1.5px solid #e2e8f0;
    background: #fff;
    color: #475569;
    border-radius: 11px;
    padding: 9px 14px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }

  .mn-btn-soft:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #0f172a;
  }

  .mn-btn-danger {
    border: none;
    background: #fff1f2;
    color: #be123c;
    border-radius: 11px;
    padding: 9px 14px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }

  .mn-btn-danger:hover {
    background: #ffe4e6;
    color: #9f1239;
  }

  .mn-empty {
    padding: 48px 24px;
    text-align: center;
    font-size: 0.9rem;
    color: #94a3b8;
  }

  .mn-empty-icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .mn-count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    color: #64748b;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 9px;
    margin-left: 8px;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .mn-hero    { animation: fadeUp 0.4s ease both; }
  .mn-stats-row { animation: fadeUp 0.4s 0.08s ease both; }
  .mn-top-grid  { animation: fadeUp 0.4s 0.14s ease both; }
  .mn-card.mn-list-outer { animation: fadeUp 0.4s 0.2s ease both; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1200px) {
    .mn-top-grid {
      grid-template-columns: 1fr;
    }
    .mn-stats-row {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 760px) {
    .mn-root {
      padding: 16px;
    }
    .mn-hero {
      padding: 24px 20px;
    }
    .mn-title {
      font-size: 1.6rem;
    }
    .mn-grid-2,
    .mn-stats-row {
      grid-template-columns: 1fr;
    }
    .mn-form-wrap,
    .mn-list-card {
      padding: 20px;
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

function ManageNotices() {
  const { showToast } = useToast();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");

  const [form, setForm] = useState({
    title: "",
    message: "",
    category: "General",
    audience: "students",
  });

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/notices/admin`, {
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

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/notices`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", message: "", category: "General", audience: "students" });
      showToast("Notice posted successfully", "success");
      await fetchNotices();
      setSaving(false);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || "Failed to post notice", "error");
      setSaving(false);
    }
  };

  const toggleActive = async (notice) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/notices/${notice._id}`,
        { isActive: !notice.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Notice ${notice.isActive ? "archived" : "activated"} successfully`, "success");
      await fetchNotices();
    } catch (err) {
      console.error(err);
      showToast("Failed to update notice", "error");
    }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Notice deleted successfully", "success");
      await fetchNotices();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete notice", "error");
    }
  };

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const q = search.toLowerCase();
      const searchMatch =
        !q ||
        notice.title?.toLowerCase().includes(q) ||
        notice.message?.toLowerCase().includes(q) ||
        notice.category?.toLowerCase().includes(q);
      const audienceMatch = audienceFilter === "all" || notice.audience === audienceFilter;
      return searchMatch && audienceMatch;
    });
  }, [notices, search, audienceFilter]);

  const stats = useMemo(() => ({
    total: notices.length,
    active: notices.filter((n) => n.isActive).length,
    students: notices.filter((n) => n.audience === "students" || n.audience === "all").length,
    emergencies: notices.filter((n) => n.category === "Emergency").length,
  }), [notices]);

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="mn-root">
        <div className="mn-shell">

          {/* ── HERO ── */}
          <div className="mn-hero">
            <div className="mn-hero-grid">
              <div>
                <div className="mn-breadcrumb">
                  Dashboard › Admin › <span>Notices</span>
                </div>
                <div className="mn-title">Post & Manage Notices</div>
                <div className="mn-sub">
                  Create announcements for students, publish maintenance updates, emergency alerts, and policy changes — all from one place.
                </div>
              </div>
              <div className="mn-hero-badge">
                <div className="mn-hero-badge-num">{stats.active}</div>
                <div className="mn-hero-badge-label">Active Notices</div>
              </div>
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="mn-stats-row">
            <div className="mn-stat">
              <div>
                <div className="mn-stat-kicker">Total Notices</div>
                <div className="mn-stat-value">{stats.total}</div>
                <div className="mn-stat-sub">All time created</div>
              </div>
              <div className="mn-stat-icon icon-teal">📋</div>
            </div>
            <div className="mn-stat">
              <div>
                <div className="mn-stat-kicker">Active</div>
                <div className="mn-stat-value">{stats.active}</div>
                <div className="mn-stat-sub">Visible to users</div>
              </div>
              <div className="mn-stat-icon icon-blue">✅</div>
            </div>
            <div className="mn-stat">
              <div>
                <div className="mn-stat-kicker">Student-Facing</div>
                <div className="mn-stat-value">{stats.students}</div>
                <div className="mn-stat-sub">Students can see</div>
              </div>
              <div className="mn-stat-icon icon-amber">👥</div>
            </div>
            <div className="mn-stat">
              <div>
                <div className="mn-stat-kicker">Emergencies</div>
                <div className="mn-stat-value">{stats.emergencies}</div>
                <div className="mn-stat-sub">Critical alerts</div>
              </div>
              <div className="mn-stat-icon icon-red">🚨</div>
            </div>
          </div>

          {/* ── FORM + PLACEHOLDER ── */}
          <div className="mn-top-grid">
            <div className="mn-card">
              <div className="mn-form-wrap">
                <div className="mn-card-title">Create New Notice</div>
                <div className="mn-card-sub">Publish a message to the selected audience instantly.</div>

                <form className="mn-form" onSubmit={handleCreate}>
                  <div className="mn-field">
                    <label className="mn-label">Notice Title</label>
                    <input
                      className="mn-input"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Water Outage on Floor 3"
                      required
                    />
                  </div>

                  <div className="mn-grid-2">
                    <div className="mn-field">
                      <label className="mn-label">Category</label>
                      <select
                        className="mn-select"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option value="General">General</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Fee">Fee</option>
                        <option value="Policy">Policy</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Event">Event</option>
                      </select>
                    </div>

                    <div className="mn-field">
                      <label className="mn-label">Audience</label>
                      <select
                        className="mn-select"
                        value={form.audience}
                        onChange={(e) => setForm({ ...form, audience: e.target.value })}
                      >
                        <option value="students">Students</option>
                        <option value="admins">Admins</option>
                        <option value="all">All Users</option>
                      </select>
                    </div>
                  </div>

                  <div className="mn-field">
                    <label className="mn-label">Message</label>
                    <textarea
                      className="mn-textarea"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Write the full notice message here..."
                      required
                    />
                    <div className="mn-helper">
                      Keep emergency and maintenance notices clear, short, and action-focused.
                    </div>
                  </div>

                  <div className="mn-actions">
                    <button className="mn-btn-primary" type="submit" disabled={saving}>
                      {saving ? "Posting..." : "📢 Post Notice"}
                    </button>
                    <button
                      type="button"
                      className="mn-btn-outline"
                      onClick={() => setForm({ title: "", message: "", category: "General", audience: "students" })}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right side info panel */}
            <div style={{ display: "grid", gap: "16px" }}>
              <div className="mn-card" style={{ padding: "24px" }}>
                <div className="mn-card-title" style={{ marginBottom: "6px" }}>📌 Posting Tips</div>
                <div className="mn-card-sub" style={{ marginBottom: "0" }}>Best practices for effective notices</div>
                <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
                  {[
                    { icon: "🚨", label: "Emergency", tip: "Use clear, direct language. State the issue and expected resolution time." },
                    { icon: "🔧", label: "Maintenance", tip: "Include affected area, start time, and estimated duration." },
                    { icon: "📢", label: "General", tip: "Keep announcements brief and actionable. Avoid jargon." },
                    { icon: "💰", label: "Fee Notice", tip: "Always include deadline dates and payment instructions." },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", marginBottom: "3px" }}>{item.label}</div>
                        <div style={{ fontSize: "0.76rem", color: "#64748b", lineHeight: 1.55 }}>{item.tip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── NOTICE LIST ── */}
          <div className="mn-card mn-list-outer">
            <div className="mn-list-card">
              <div className="mn-list-head">
                <div>
                  <div className="mn-card-title">
                    Notice History
                    <span className="mn-count-badge">{filteredNotices.length}</span>
                  </div>
                  <div className="mn-card-sub">Review, deactivate, or remove published notices.</div>
                </div>

                <div className="mn-search-wrap">
                  <div className="mn-search">
                    <span className="mn-search-icon">🔍</span>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search title, message or category..."
                    />
                  </div>
                  <select
                    className="mn-filter-select"
                    value={audienceFilter}
                    onChange={(e) => setAudienceFilter(e.target.value)}
                  >
                    <option value="all">All Audiences</option>
                    <option value="students">Students</option>
                    <option value="admins">Admins</option>
                  </select>
                </div>
              </div>

              <div className="mn-list">
                {loading ? (
                  <div className="mn-empty">
                    <div className="mn-empty-icon">⏳</div>
                    <div>Loading notices...</div>
                  </div>
                ) : filteredNotices.length === 0 ? (
                  <div className="mn-empty">
                    <div className="mn-empty-icon">📭</div>
                    <div>No notices found matching your filters.</div>
                  </div>
                ) : (
                  filteredNotices.map((notice) => (
                    <div key={notice._id} className="mn-item">
                      <div className="mn-item-top">
                        <div>
                          <div className="mn-item-title">{notice.title}</div>
                          <div className="mn-item-meta">
                            Posted by <strong style={{ color: "#475569" }}>{notice.postedBy?.name || "Admin"}</strong> · {timeAgo(notice.createdAt)}
                          </div>
                        </div>
                        <div className="mn-pill-row">
                          <span className={`mn-pill ${categoryClass(notice.category)}`}>
                            {notice.category}
                          </span>
                          <span className={`mn-pill ${notice.isActive ? "pill-active" : "pill-inactive"}`}>
                            {notice.isActive ? "● Active" : "○ Inactive"}
                          </span>
                        </div>
                      </div>

                      <div className="mn-item-message">{notice.message}</div>

                      <div className="mn-item-footer">
                        <div className="mn-item-foot-left">
                          Audience: <strong>{notice.audience}</strong>
                          &nbsp;·&nbsp; Updated: {new Date(notice.updatedAt).toLocaleString()}
                        </div>
                        <div className="mn-item-actions">
                          <button className="mn-btn-soft" onClick={() => toggleActive(notice)}>
                            {notice.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button className="mn-btn-danger" onClick={() => deleteNotice(notice._id)}>
                            Delete
                          </button>
                        </div>
                      </div>
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

export default ManageNotices;