import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .lv-root {
    font-family: 'DM Sans', sans-serif;
    background: #f5f3ef;
    min-height: 100vh;
    padding: 36px 32px;
    color: #1c1a17;
    position: relative;
  }

  /* Decorative background blobs */
  .lv-root::before {
    content: '';
    position: fixed; top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(0,196,180,0.08) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none; z-index: 0;
  }
  .lv-root::after {
    content: '';
    position: fixed; bottom: -80px; left: -80px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(251,146,60,0.07) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none; z-index: 0;
  }

  @keyframes slideUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; } to { opacity:1; }
  }
  @keyframes scaleIn {
    from { opacity:0; transform:scale(.94); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulse-dot {
    0%, 100% { transform: scale(1); opacity:1; }
    50%       { transform: scale(1.4); opacity:.7; }
  }

  /* ── Header ── */
  .lv-header {
    margin-bottom: 32px; position: relative; z-index: 1;
    animation: slideUp .45s cubic-bezier(.22,1,.36,1) both;
  }
  .lv-breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.72rem; font-weight: 500; color: #9a9488;
    margin-bottom: 8px; letter-spacing: 0.02em;
  }
  .lv-breadcrumb-sep { color: #c8c2b8; }
  .lv-breadcrumb-active { color: #00c4b4; font-weight: 600; }
  .lv-title {
    font-family: 'Fraunces', serif;
    font-size: 2rem; font-weight: 700; color: #1c1a17;
    letter-spacing: -0.03em; line-height: 1.1;
    margin-bottom: 6px;
  }
  .lv-subtitle { font-size: 0.85rem; color: #7a7670; }

  /* ── Stats Row ── */
  .lv-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 12px; margin-bottom: 28px;
    position: relative; z-index: 1;
  }
  .lv-stat {
    background: #fff; border-radius: 16px;
    padding: 18px 20px; border: 1px solid #ebe7e0;
    animation: slideUp .45s cubic-bezier(.22,1,.36,1) both;
    position: relative; overflow: hidden;
    transition: transform .2s, box-shadow .2s;
  }
  .lv-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.07); }
  .lv-stat:nth-child(1){animation-delay:.05s}
  .lv-stat:nth-child(2){animation-delay:.10s}
  .lv-stat:nth-child(3){animation-delay:.15s}
  .lv-stat:nth-child(4){animation-delay:.20s}
  .lv-stat-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    border-radius: 16px 16px 0 0;
  }
  .lv-stat-icon { font-size: 1.3rem; margin-bottom: 10px; }
  .lv-stat-val {
    font-family: 'Fraunces', serif;
    font-size: 1.8rem; font-weight: 700; line-height: 1; color: #1c1a17;
  }
  .lv-stat-lbl { font-size: 0.7rem; color: #9a9488; margin-top: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: .06em; }

  /* ── Main Layout ── */
  .lv-body {
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 20px;
    position: relative; z-index: 1;
    align-items: start;
  }

  /* ── Form Card ── */
  .lv-form-card {
    background: #1c1a17;
    border-radius: 24px;
    padding: 30px 28px;
    position: sticky; top: 20px;
    animation: scaleIn .5s cubic-bezier(.22,1,.36,1) .1s both;
    overflow: hidden;
  }
  .lv-form-card::before {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(0,196,180,.15) 0%, transparent 70%);
    border-radius: 50%;
  }
  .lv-form-card::after {
    content: '';
    position: absolute; bottom: -40px; left: -40px;
    width: 140px; height: 140px;
    background: radial-gradient(circle, rgba(251,146,60,.1) 0%, transparent 70%);
    border-radius: 50%;
  }
  .lv-form-title {
    font-family: 'Fraunces', serif;
    font-size: 1.3rem; font-weight: 700; color: #fff;
    margin-bottom: 4px; position: relative; z-index: 1;
  }
  .lv-form-sub { font-size: 0.78rem; color: #6a6660; margin-bottom: 24px; position: relative; z-index: 1; }

  .lv-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; position: relative; z-index: 1; }
  .lv-field-label {
    font-size: 0.7rem; font-weight: 700; color: #5a5650;
    text-transform: uppercase; letter-spacing: .07em;
  }
  .lv-field-input, .lv-field-textarea {
    padding: 12px 14px;
    background: rgba(255,255,255,.06);
    border: 1.5px solid rgba(255,255,255,.1);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; color: #fff;
    outline: none; transition: border-color .2s, background .2s;
    width: 100%;
  }
  .lv-field-input::placeholder, .lv-field-textarea::placeholder { color: #4a4840; }
  .lv-field-input:focus, .lv-field-textarea:focus {
    border-color: #00c4b4;
    background: rgba(255,255,255,.09);
  }
  .lv-field-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(.5); cursor: pointer; }
  .lv-field-textarea { resize: none; min-height: 80px; }

  .lv-date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; position: relative; z-index: 1; }

  /* Duration badge */
  .lv-duration {
    background: rgba(0,196,180,.15); border: 1px solid rgba(0,196,180,.25);
    border-radius: 10px; padding: 10px 14px;
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 16px; position: relative; z-index: 1;
  }
  .lv-duration-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #00c4b4;
    animation: pulse-dot 1.5s ease infinite; flex-shrink: 0;
  }
  .lv-duration-text { font-size: 0.78rem; color: #00c4b4; font-weight: 600; }

  .lv-submit-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #00c4b4, #00a89a);
    color: #fff; border: none; border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem; font-weight: 700; cursor: pointer;
    transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; z-index: 1;
    box-shadow: 0 6px 20px rgba(0,196,180,.3);
  }
  .lv-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,196,180,.4); }
  .lv-submit-btn:active { transform: scale(.98); }
  .lv-submit-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  /* ── Right Panel ── */
  .lv-right { display: flex; flex-direction: column; gap: 16px; }

  /* ── Filter Bar ── */
  .lv-filter-bar {
    background: #fff; border-radius: 16px;
    padding: 14px 18px; border: 1px solid #ebe7e0;
    display: flex; align-items: center; gap: 12px;
    flex-wrap: wrap;
    animation: slideUp .45s cubic-bezier(.22,1,.36,1) .15s both;
  }
  .lv-filter-label { font-size: 0.72rem; font-weight: 700; color: #9a9488; text-transform: uppercase; letter-spacing:.05em; flex-shrink:0; }
  .lv-filter-chips { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; }
  .lv-filter-chip {
    padding: 7px 16px; border-radius: 99px;
    border: 1.5px solid #ebe7e0; background: #faf8f5;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 600; color: #7a7670;
    cursor: pointer; transition: all .2s;
  }
  .lv-filter-chip.active { background: #1c1a17; color: #fff; border-color: #1c1a17; }
  .lv-filter-chip:hover:not(.active) { border-color: #00c4b4; color: #00c4b4; }
  .lv-count-badge {
    margin-left: auto; font-size: 0.72rem; font-weight: 700;
    color: #9a9488; background: #f0ede8;
    padding: 4px 12px; border-radius: 99px;
  }

  /* ── Leave Cards ── */
  .lv-list { display: flex; flex-direction: column; gap: 12px; }

  .lv-card {
    background: #fff; border-radius: 18px;
    border: 1px solid #ebe7e0; padding: 20px 22px;
    display: flex; gap: 18px; align-items: flex-start;
    animation: slideUp .4s cubic-bezier(.22,1,.36,1) both;
    transition: transform .2s, box-shadow .2s;
    position: relative; overflow: hidden;
  }
  .lv-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0,0,0,.07);
    border-color: #d8d4ce;
  }
  .lv-card:nth-child(1){animation-delay:.10s}
  .lv-card:nth-child(2){animation-delay:.15s}
  .lv-card:nth-child(3){animation-delay:.20s}
  .lv-card:nth-child(4){animation-delay:.25s}
  .lv-card:nth-child(5){animation-delay:.30s}

  .lv-card-stripe {
    width: 4px; border-radius: 99px; flex-shrink: 0; align-self: stretch;
  }
  .stripe-pending  { background: linear-gradient(180deg, #fb923c, #f59e0b); }
  .stripe-approved { background: linear-gradient(180deg, #00c4b4, #10b981); }
  .stripe-rejected { background: linear-gradient(180deg, #f43f5e, #e11d48); }

  .lv-card-body { flex: 1; min-width: 0; }
  .lv-card-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 8px; gap: 12px;
  }
  .lv-card-reason {
    font-family: 'Fraunces', serif;
    font-size: 1rem; font-weight: 600; color: #1c1a17;
    line-height: 1.3;
  }

  .lv-status-pill {
    padding: 4px 12px; border-radius: 99px;
    font-size: 0.68rem; font-weight: 800; flex-shrink: 0;
    display: flex; align-items: center; gap: 5px;
    letter-spacing: .03em; text-transform: uppercase;
  }
  .pill-pending  { background: #fff7ed; color: #c2590a; border: 1px solid #fed7aa; }
  .pill-approved { background: #f0fdf9; color: #0f766e; border: 1px solid #99f6e4; }
  .pill-rejected { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
  .pill-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  .lv-card-dates {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.78rem; color: #7a7670; margin-bottom: 10px;
  }
  .lv-card-date-from, .lv-card-date-to {
    background: #f5f3ef; border-radius: 8px;
    padding: 4px 10px; font-weight: 600; color: #3a3830;
  }
  .lv-card-date-arrow { color: #c8c2b8; font-size: 0.7rem; }

  .lv-card-footer {
    display: flex; align-items: center; gap: 16px;
    padding-top: 10px; border-top: 1px solid #f0ede8;
  }
  .lv-card-meta {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.72rem; color: #9a9488;
  }
  .lv-card-days {
    margin-left: auto;
    font-size: 0.72rem; font-weight: 700; color: #5a5650;
    background: #f0ede8; padding: 3px 10px; border-radius: 99px;
  }

  /* ── Empty ── */
  .lv-empty {
    background: #fff; border-radius: 18px; border: 1px solid #ebe7e0;
    padding: 52px 24px; text-align: center;
    animation: fadeIn .4s ease both;
  }
  .lv-empty-icon { font-size: 2.8rem; margin-bottom: 12px; }
  .lv-empty-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; color: #1c1a17; margin-bottom: 6px; }
  .lv-empty-sub   { font-size: 0.8rem; color: #9a9488; }

  /* ── Skeleton ── */
  .lv-skeleton {
    background: linear-gradient(90deg, #f0ede8 25%, #e8e4de 50%, #f0ede8 75%);
    background-size: 800px 100%; border-radius: 12px;
    animation: shimmer 1.4s infinite;
  }

  /* ── Toast ── */
  .lv-toast {
    position: fixed; bottom: 28px; right: 28px;
    padding: 14px 22px; border-radius: 14px; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    z-index: 9999; animation: slideUp .3s ease;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 28px rgba(0,0,0,.18);
    min-width: 240px;
  }
  .lv-toast.success { background: linear-gradient(135deg, #00c4b4, #00a89a); }
  .lv-toast.error   { background: linear-gradient(135deg, #f43f5e, #e11d48); }

  @media (max-width: 1024px) {
    .lv-body { grid-template-columns: 1fr; }
    .lv-form-card { position: static; }
    .lv-stats { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 600px) {
    .lv-root { padding: 16px; }
    .lv-stats { grid-template-columns: repeat(2,1fr); }
    .lv-card { flex-direction: column; }
  }
`;

const FILTERS = [
  { label: "All",      value: "all"      },
  { label: "Pending",  value: "pending"  },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const statusPill = (status = "") => {
  const s = status.toLowerCase();
  if (s === "approved") return "pill-approved";
  if (s === "rejected") return "pill-rejected";
  return "pill-pending";
};

const stripeClass = (status = "") => {
  const s = status.toLowerCase();
  if (s === "approved") return "stripe-approved";
  if (s === "rejected") return "stripe-rejected";
  return "stripe-pending";
};

const daysBetween = (from, to) => {
  if (!from || !to) return null;
  const diff = new Date(to) - new Date(from);
  const d = Math.round(diff / 86400000) + 1;
  return d > 0 ? d : null;
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });

function Leave() {
  const [leaves, setLeaves]           = useState([]);
  const [form, setForm]               = useState({ reason:"", fromDate:"", toDate:"" });
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast]             = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await axios.get(`${API}/leaves/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reason || !form.fromDate || !form.toDate) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/leaves`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Leave request submitted ✅");
      setForm({ reason:"", fromDate:"", toDate:"" });
      fetchLeaves();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to submit ❌", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const total    = leaves.length;
  const pending  = leaves.filter(l => l.status?.toLowerCase() === "pending").length;
  const approved = leaves.filter(l => l.status?.toLowerCase() === "approved").length;
  const rejected = leaves.filter(l => l.status?.toLowerCase() === "rejected").length;

  // Filter
  const filtered = useMemo(() =>
    leaves.filter(l =>
      statusFilter === "all" || l.status?.toLowerCase() === statusFilter
    ), [leaves, statusFilter]);

  // Duration preview
  const previewDays = daysBetween(form.fromDate, form.toDate);

  const today = new Date().toISOString().split("T")[0];

  return (
    <Layout role="student">
      <style>{css}</style>
      <div className="lv-root">

        {/* Header */}
        <div className="lv-header">
          <div className="lv-breadcrumb">
            Dashboard <span className="lv-breadcrumb-sep">›</span>
            <span className="lv-breadcrumb-active">Leave Requests</span>
          </div>
          <h1 className="lv-title">Leave Requests</h1>
          <p className="lv-subtitle">Apply for leave and track your request status</p>
        </div>

        {/* Stats */}
        <div className="lv-stats">
          {[
            { icon:"📋", val:total,    lbl:"Total Requests", accent:"#6366f1" },
            { icon:"⏳", val:pending,  lbl:"Pending",        accent:"#fb923c" },
            { icon:"✅", val:approved, lbl:"Approved",       accent:"#00c4b4" },
            { icon:"❌", val:rejected, lbl:"Rejected",       accent:"#f43f5e" },
          ].map((s, i) => (
            <div key={i} className="lv-stat">
              <div className="lv-stat-accent" style={{ background: s.accent }} />
              <div className="lv-stat-icon">{s.icon}</div>
              <div className="lv-stat-val">{loading ? "—" : s.val}</div>
              <div className="lv-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="lv-body">

          {/* ── Form ── */}
          <div className="lv-form-card">
            <div className="lv-form-title">Apply for Leave</div>
            <div className="lv-form-sub">Submit your leave request below</div>

            <form onSubmit={handleSubmit}>
              <div className="lv-field">
                <label className="lv-field-label">Reason for Leave</label>
                <textarea
                  className="lv-field-textarea"
                  placeholder="Describe your reason (family visit, medical, etc.)"
                  value={form.reason}
                  onChange={e => setForm({...form, reason: e.target.value})}
                  required
                />
              </div>

              <div className="lv-date-row">
                <div className="lv-field">
                  <label className="lv-field-label">From Date</label>
                  <input
                    type="date" className="lv-field-input"
                    value={form.fromDate} min={today}
                    onChange={e => setForm({...form, fromDate: e.target.value})}
                    required
                  />
                </div>
                <div className="lv-field">
                  <label className="lv-field-label">To Date</label>
                  <input
                    type="date" className="lv-field-input"
                    value={form.toDate} min={form.fromDate || today}
                    onChange={e => setForm({...form, toDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              {previewDays && (
                <div className="lv-duration">
                  <div className="lv-duration-dot" />
                  <div className="lv-duration-text">
                    {previewDays} day{previewDays > 1 ? "s" : ""} of leave requested
                  </div>
                </div>
              )}

              <button type="submit" className="lv-submit-btn" disabled={submitting}>
                {submitting ? "⏳ Submitting..." : "✈ Submit Leave Request"}
              </button>
            </form>
          </div>

          {/* ── Right ── */}
          <div className="lv-right">

            {/* Filter bar */}
            <div className="lv-filter-bar">
              <span className="lv-filter-label">Filter</span>
              <div className="lv-filter-chips">
                {FILTERS.map(f => (
                  <button key={f.value} type="button"
                    className={`lv-filter-chip ${statusFilter === f.value ? "active" : ""}`}
                    onClick={() => setStatusFilter(f.value)}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="lv-count-badge">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
            </div>

            {/* List */}
            <div className="lv-list">

              {/* Loading skeletons */}
              {loading && [1,2,3].map(i => (
                <div key={i} style={{ height: 110, borderRadius: 18 }} className="lv-skeleton" />
              ))}

              {/* Empty */}
              {!loading && filtered.length === 0 && (
                <div className="lv-empty">
                  <div className="lv-empty-icon">✈</div>
                  <div className="lv-empty-title">No leave requests found</div>
                  <div className="lv-empty-sub">
                    {statusFilter === "all"
                      ? "Submit your first leave request using the form"
                      : `No ${statusFilter} requests yet`}
                  </div>
                </div>
              )}

              {/* Cards */}
              {!loading && filtered.map((l, i) => {
                const days = daysBetween(l.fromDate, l.toDate);
                return (
                  <div key={l._id || i} className="lv-card">
                    <div className={`lv-card-stripe ${stripeClass(l.status)}`} />
                    <div className="lv-card-body">
                      <div className="lv-card-top">
                        <div className="lv-card-reason">{l.reason}</div>
                        <span className={`lv-status-pill ${statusPill(l.status)}`}>
                          <span className="pill-dot" />
                          {l.status}
                        </span>
                      </div>

                      <div className="lv-card-dates">
                        <span className="lv-card-date-from">
                          {l.fromDate ? fmtDate(l.fromDate) : "—"}
                        </span>
                        <span className="lv-card-date-arrow">→</span>
                        <span className="lv-card-date-to">
                          {l.toDate ? fmtDate(l.toDate) : "—"}
                        </span>
                      </div>

                      <div className="lv-card-footer">
                        <div className="lv-card-meta">
                          🏠 Room {l.room?.roomNumber || "N/A"}
                        </div>
                        <div className="lv-card-meta">
                          🕐 {l.createdAt ? fmtDate(l.createdAt) : "—"}
                        </div>
                        {days && (
                          <div className="lv-card-days">
                            {days} day{days > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`lv-toast ${toast.type}`}>{toast.msg}</div>
      )}
    </Layout>
  );
}

export default Leave;