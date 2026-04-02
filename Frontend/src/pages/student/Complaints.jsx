import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;1,400;1,600&display=swap');

  :root {
    --ink:       #0e0c0a;
    --ink-soft:  #4a4540;
    --ink-muted: #8a8480;
    --paper:     #faf8f4;
    --paper-2:   #f2efe9;
    --paper-3:   #e8e4dc;
    --teal:      #00c4b4;
    --teal-dim:  rgba(0,196,180,.12);
    --amber:     #f59e0b;
    --amber-dim: rgba(245,158,11,.12);
    --red:       #ef4444;
    --red-dim:   rgba(239,68,68,.10);
    --green:     #10b981;
    --green-dim: rgba(16,185,129,.10);
    --border:    #e2ddd6;
    --shadow-sm: 0 2px 8px rgba(14,12,10,.06);
    --shadow-md: 0 8px 28px rgba(14,12,10,.09);
    --shadow-lg: 0 18px 52px rgba(14,12,10,.12);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cp-root {
    font-family: 'Bricolage Grotesque', sans-serif;
    background: var(--paper);
    min-height: 100vh;
    padding: 36px 32px 56px;
    color: var(--ink);
    position: relative;
  }

  /* Noise texture overlay */
  .cp-root::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0; opacity: .4;
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideRight {
    from { opacity:0; transform:translateX(-14px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity:0; transform:scale(.96); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes spinDot {
    to { transform: rotate(360deg); }
  }
  @keyframes skeletonShimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  @keyframes toastIn {
    from { opacity:0; transform:translateY(16px) scale(.96); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  /* ── Header ── */
  .cp-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 36px; position: relative; z-index: 1;
    animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both;
  }
  .cp-eyebrow {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.7rem; font-weight: 700; color: var(--ink-muted);
    text-transform: uppercase; letter-spacing: .1em; margin-bottom: 10px;
  }
  .cp-eyebrow-line { height: 1px; width: 28px; background: var(--border); }
  .cp-title {
    font-family: 'Lora', serif;
    font-size: 2.2rem; font-weight: 400; font-style: italic;
    color: var(--ink); letter-spacing: -0.02em; line-height: 1.1;
    margin-bottom: 6px;
  }
  .cp-title strong { font-style: normal; font-weight: 700; }
  .cp-sub { font-size: 0.84rem; color: var(--ink-muted); line-height: 1.5; max-width: 380px; }

  .cp-refresh-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; background: var(--ink); color: #fff;
    border: none; border-radius: 12px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.8rem; font-weight: 700; cursor: pointer;
    transition: all .2s; flex-shrink: 0;
  }
  .cp-refresh-btn:hover { background: #1e1a16; transform: translateY(-1px); box-shadow: var(--shadow-md); }

  /* ── Stats ── */
  .cp-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 12px; margin-bottom: 28px;
    position: relative; z-index: 1;
  }
  .cp-stat {
    background: #fff; border: 1px solid var(--border);
    border-radius: 20px; padding: 20px 22px;
    position: relative; overflow: hidden;
    animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both;
    transition: transform .2s, box-shadow .2s;
    cursor: default;
  }
  .cp-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .cp-stat:nth-child(1) { animation-delay: .04s }
  .cp-stat:nth-child(2) { animation-delay: .08s }
  .cp-stat:nth-child(3) { animation-delay: .12s }
  .cp-stat:nth-child(4) { animation-delay: .16s }

  .cp-stat-bg {
    position: absolute; bottom: -20px; right: -20px;
    font-size: 5rem; opacity: .04; pointer-events: none;
    line-height: 1;
  }
  .cp-stat-label {
    font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: .09em; color: var(--ink-muted); margin-bottom: 12px;
  }
  .cp-stat-val {
    font-family: 'Lora', serif;
    font-size: 2.4rem; font-weight: 700; color: var(--ink);
    line-height: 1; margin-bottom: 2px;
  }
  .cp-stat-sub { font-size: 0.72rem; color: var(--ink-muted); }
  .cp-stat-bar {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; border-radius: 0 0 20px 20px;
  }

  /* ── Body ── */
  .cp-body {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 20px; align-items: start;
    position: relative; z-index: 1;
  }

  /* ── Form Panel ── */
  .cp-form-panel {
    background: var(--ink);
    border-radius: 24px; overflow: hidden;
    position: sticky; top: 20px;
    animation: scaleIn .5s cubic-bezier(.22,1,.36,1) .1s both;
  }
  .cp-form-header {
    padding: 26px 28px 0;
    background: linear-gradient(135deg, #161410 0%, #0e0c0a 100%);
    position: relative; overflow: hidden;
  }
  .cp-form-header::before {
    content: '';
    position: absolute; top: -40px; right: -40px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(0,196,180,.18) 0%, transparent 70%);
    border-radius: 50%;
  }
  .cp-form-header::after {
    content: '';
    position: absolute; bottom: -20px; left: 20px;
    width: 100px; height: 100px;
    background: radial-gradient(circle, rgba(245,158,11,.1) 0%, transparent 70%);
    border-radius: 50%;
  }
  .cp-form-eyebrow {
    font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: .12em; color: var(--teal); margin-bottom: 8px;
    position: relative; z-index: 1;
  }
  .cp-form-title {
    font-family: 'Lora', serif;
    font-size: 1.5rem; font-weight: 400; font-style: italic;
    color: #fff; margin-bottom: 4px;
    position: relative; z-index: 1;
  }
  .cp-form-title strong { font-style: normal; font-weight: 700; }
  .cp-form-sub {
    font-size: 0.76rem; color: #5a5650;
    padding-bottom: 20px; position: relative; z-index: 1;
  }

  .cp-form-body { padding: 22px 28px 28px; }

  .cp-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
  .cp-label {
    font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: .08em; color: #5a5650;
  }
  .cp-input, .cp-select, .cp-textarea {
    width: 100%; padding: 12px 14px;
    background: rgba(255,255,255,.06);
    border: 1.5px solid rgba(255,255,255,.09);
    border-radius: 12px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.84rem; color: #fff; outline: none;
    transition: border-color .2s, background .2s;
  }
  .cp-input::placeholder, .cp-textarea::placeholder { color: #3a3830; }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color: var(--teal);
    background: rgba(255,255,255,.09);
    box-shadow: 0 0 0 3px rgba(0,196,180,.12);
  }
  .cp-select { cursor: pointer; appearance: none; }
  .cp-select option { background: #1c1a17; color: #fff; }
  .cp-textarea { resize: none; min-height: 100px; }

  .cp-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* Priority selector */
  .cp-priority-chips { display: flex; gap: 8px; }
  .cp-priority-chip {
    flex: 1; padding: 9px 8px; border-radius: 10px;
    border: 1.5px solid rgba(255,255,255,.09);
    background: rgba(255,255,255,.04);
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.75rem; font-weight: 700; color: #5a5650;
    cursor: pointer; text-align: center; transition: all .2s;
  }
  .cp-priority-chip.low.sel    { border-color: var(--green); background: rgba(16,185,129,.15); color: var(--green); }
  .cp-priority-chip.medium.sel { border-color: var(--amber); background: rgba(245,158,11,.15); color: var(--amber); }
  .cp-priority-chip.high.sel   { border-color: var(--red);   background: rgba(239,68,68,.15);  color: var(--red);   }
  .cp-priority-chip:not(.sel):hover { border-color: rgba(255,255,255,.2); color: #9a9488; }

  .cp-char-count {
    font-size: 0.68rem; color: #3a3830; text-align: right; margin-top: 2px;
  }

  .cp-submit-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--teal), #00a89a);
    color: #fff; border: none; border-radius: 13px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.88rem; font-weight: 800; cursor: pointer;
    transition: all .25s; display: flex; align-items: center;
    justify-content: center; gap: 8px; margin-top: 6px;
    box-shadow: 0 6px 22px rgba(0,196,180,.32);
    letter-spacing: .01em;
  }
  .cp-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,196,180,.42); }
  .cp-submit-btn:active { transform: scale(.98); }
  .cp-submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

  .cp-inline-msg {
    margin-top: 14px; padding: 12px 14px;
    border-radius: 11px; font-size: 0.78rem; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
  }
  .cp-inline-msg.success { background: rgba(16,185,129,.15); color: #34d399; border: 1px solid rgba(16,185,129,.2); }
  .cp-inline-msg.error   { background: rgba(239,68,68,.15);  color: #f87171; border: 1px solid rgba(239,68,68,.2); }

  /* ── Right Panel ── */
  .cp-right { display: flex; flex-direction: column; gap: 16px; }

  /* Filter toolbar */
  .cp-toolbar {
    background: #fff; border: 1px solid var(--border);
    border-radius: 18px; padding: 14px 18px;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    animation: fadeUp .5s cubic-bezier(.22,1,.36,1) .15s both;
  }
  .cp-search-box {
    display: flex; align-items: center; gap: 8px;
    background: var(--paper-2); border: 1.5px solid var(--border);
    border-radius: 11px; padding: 9px 14px; flex: 1; min-width: 200px;
    transition: border-color .2s;
  }
  .cp-search-box:focus-within { border-color: var(--teal); }
  .cp-search-box input {
    border: none; outline: none; background: transparent;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.82rem; color: var(--ink); width: 100%;
  }
  .cp-search-box input::placeholder { color: var(--ink-muted); }

  .cp-status-tabs { display: flex; gap: 4px; }
  .cp-tab {
    padding: 8px 14px; border-radius: 99px; border: none;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.76rem; font-weight: 700; cursor: pointer;
    transition: all .2s; white-space: nowrap;
  }
  .cp-tab.active { background: var(--ink); color: #fff; }
  .cp-tab:not(.active) { background: var(--paper-2); color: var(--ink-soft); }
  .cp-tab:not(.active):hover { background: var(--paper-3); }

  .cp-result-count {
    margin-left: auto; font-size: 0.72rem; font-weight: 700;
    color: var(--ink-muted); background: var(--paper-2);
    padding: 5px 12px; border-radius: 99px; white-space: nowrap;
  }

  /* ── Complaint Cards ── */
  .cp-list { display: flex; flex-direction: column; gap: 14px; }

  .cp-card {
    background: #fff; border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden;
    animation: fadeUp .45s cubic-bezier(.22,1,.36,1) both;
    transition: transform .2s, box-shadow .2s, border-color .2s;
  }
  .cp-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    border-color: #cec9c0;
  }
  .cp-card:nth-child(1){animation-delay:.08s}
  .cp-card:nth-child(2){animation-delay:.13s}
  .cp-card:nth-child(3){animation-delay:.18s}
  .cp-card:nth-child(4){animation-delay:.23s}
  .cp-card:nth-child(5){animation-delay:.28s}

  /* Top accent bar */
  .cp-card-accent { height: 4px; }
  .accent-pending  { background: linear-gradient(90deg, var(--amber), #fbbf24); }
  .accent-progress { background: linear-gradient(90deg, #f97316, #fb923c); }
  .accent-resolved { background: linear-gradient(90deg, var(--green), #34d399); }

  .cp-card-head {
    padding: 18px 20px 14px;
    display: flex; justify-content: space-between;
    align-items: flex-start; gap: 14px;
    border-bottom: 1px solid var(--paper-2);
  }
  .cp-card-left { flex: 1; min-width: 0; }
  .cp-card-title {
    font-family: 'Lora', serif;
    font-size: 1.05rem; font-weight: 600; color: var(--ink);
    margin-bottom: 5px; line-height: 1.3;
  }
  .cp-card-room {
    font-size: 0.73rem; color: var(--ink-muted);
    display: flex; align-items: center; gap: 5px;
  }

  .cp-status-badge {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 99px;
    font-size: 0.68rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: .05em;
    flex-shrink: 0; white-space: nowrap;
  }
  .cp-status-badge .dot {
    width: 6px; height: 6px; border-radius: 50%; background: currentColor;
  }
  .badge-pending  { background: var(--amber-dim); color: #d97706; }
  .badge-progress { background: rgba(249,115,22,.12); color: #ea580c; }
  .badge-resolved { background: var(--green-dim); color: #059669; }

  .cp-card-body { padding: 14px 20px; }
  .cp-card-desc {
    font-size: 0.81rem; color: var(--ink-soft); line-height: 1.65;
    margin-bottom: 14px;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Meta pills */
  .cp-meta-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .cp-meta-pill {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 99px;
    background: var(--paper-2); border: 1px solid var(--paper-3);
    font-size: 0.71rem; font-weight: 600; color: var(--ink-soft);
  }
  .cp-meta-pill .pill-icon { font-size: 0.8rem; }

  /* Priority dot */
  .cp-priority-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .prio-low    { background: var(--green); }
  .prio-medium { background: var(--amber); }
  .prio-high   { background: var(--red); box-shadow: 0 0 6px rgba(239,68,68,.5); }

  .cp-card-footer {
    padding: 10px 20px 16px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .cp-card-id {
    font-family: 'Geist Mono', monospace;
    font-size: 0.68rem; color: var(--ink-muted);
    background: var(--paper-2); padding: 3px 9px; border-radius: 6px;
  }
  .cp-card-time { font-size: 0.71rem; color: var(--ink-muted); }

  /* ── Skeleton ── */
  .cp-skeleton {
    height: 160px; border-radius: 20px;
    background: linear-gradient(90deg, var(--paper-2) 25%, var(--paper-3) 50%, var(--paper-2) 75%);
    background-size: 600px 100%;
    animation: skeletonShimmer 1.5s infinite;
  }

  /* ── Empty ── */
  .cp-empty {
    background: #fff; border: 1px solid var(--border);
    border-radius: 20px; padding: 56px 24px; text-align: center;
  }
  .cp-empty-icon { font-size: 3rem; margin-bottom: 14px; }
  .cp-empty-title {
    font-family: 'Lora', serif;
    font-size: 1.15rem; font-weight: 600; color: var(--ink); margin-bottom: 6px;
  }
  .cp-empty-sub { font-size: 0.8rem; color: var(--ink-muted); }

  /* ── Toast ── */
  .cp-toast {
    position: fixed; bottom: 28px; right: 28px;
    padding: 14px 20px; border-radius: 16px; color: #fff;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.84rem; font-weight: 700;
    z-index: 9999; animation: toastIn .35s cubic-bezier(.22,1,.36,1);
    display: flex; align-items: center; gap: 10px;
    min-width: 260px; box-shadow: var(--shadow-lg);
  }
  .cp-toast.success { background: linear-gradient(135deg, #059669, #10b981); }
  .cp-toast.error   { background: linear-gradient(135deg, #dc2626, #ef4444); }

  @media (max-width: 1100px) {
    .cp-body { grid-template-columns: 1fr; }
    .cp-form-panel { position: static; }
    .cp-stats { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 600px) {
    .cp-root { padding: 16px 14px 40px; }
    .cp-stats { grid-template-columns: repeat(2,1fr); }
    .cp-row2 { grid-template-columns: 1fr; }
    .cp-title { font-size: 1.7rem; }
    .cp-toolbar { flex-direction: column; align-items: stretch; }
    .cp-status-tabs { flex-wrap: wrap; }
    .cp-result-count { margin-left: 0; }
  }
`;

/* ── Helpers ── */
const normalize = (v = "") => v.toString().toLowerCase().trim();

const timeAgo = (d) => {
  if (!d) return "—";
  const diff  = Date.now() - new Date(d).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const statusConfig = (status = "") => {
  const s = normalize(status);
  if (s === "resolved")    return { badge:"badge-resolved", accent:"accent-resolved", label:"Resolved"    };
  if (s === "in progress") return { badge:"badge-progress", accent:"accent-progress", label:"In Progress" };
  return                          { badge:"badge-pending",  accent:"accent-pending",  label:"Pending"     };
};

const priorityDot = (p = "") => {
  const s = p.toLowerCase();
  if (s === "high")   return "prio-high";
  if (s === "medium") return "prio-medium";
  return "prio-low";
};

const CATEGORY_ICONS = {
  Electrical: "⚡", Water: "💧", Furniture: "🪑",
  Cleanliness: "🧹", Internet: "📶", Security: "🔒", Other: "🔧",
};

const STATUS_TABS = [
  { label:"All",         value:"all"         },
  { label:"Pending",     value:"pending"     },
  { label:"In Progress", value:"in progress" },
  { label:"Resolved",    value:"resolved"    },
];

/* ── Component ── */
function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast]           = useState(null);
  const [inlineMsg, setInlineMsg]   = useState({ type:"", text:"" });

  const [form, setForm] = useState({
    title:"", description:"", category:"Other", priority:"Medium",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await axios.get(`${API}/complaints/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.complaints || [];
      setComplaints(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load complaints", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInlineMsg({ type:"", text:"" });
    if (!form.title.trim() || !form.description.trim()) {
      setInlineMsg({ type:"error", text:"Title and description are required." });
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/complaints`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title:"", description:"", category:"Other", priority:"Medium" });
      setInlineMsg({ type:"success", text:"Complaint submitted successfully!" });
      showToast("Complaint submitted ✅");
      fetchComplaints();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to submit.";
      setInlineMsg({ type:"error", text: msg });
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* Stats */
  const stats = useMemo(() => ({
    total:      complaints.length,
    pending:    complaints.filter(c => normalize(c.status) === "pending").length,
    inProgress: complaints.filter(c => normalize(c.status) === "in progress").length,
    resolved:   complaints.filter(c => normalize(c.status) === "resolved").length,
  }), [complaints]);

  /* Filter */
  const filtered = useMemo(() =>
    complaints.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.room?.roomNumber?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" ||
        normalize(c.status) === statusFilter;
      return matchSearch && matchStatus;
    }),
  [complaints, search, statusFilter]);

  return (
    <Layout role="student">
      <style>{css}</style>
      <div className="cp-root">

        {/* ── Header ── */}
        <div className="cp-header">
          <div>
            <div className="cp-eyebrow">
              <div className="cp-eyebrow-line" />
              Student Portal
              <div className="cp-eyebrow-line" />
            </div>
            <h1 className="cp-title">
              <strong>Complaints</strong> &<br />Maintenance
            </h1>
            <p className="cp-sub">
              Report hostel issues and track resolution progress in real time.
            </p>
          </div>
          <button className="cp-refresh-btn" onClick={fetchComplaints}>
            ↻ Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="cp-stats">
          {[
            { icon:"⚑", val:stats.total,      lbl:"Total",       sub:"All complaints",  bar:"linear-gradient(90deg,#6366f1,#818cf8)", bg:"⚑" },
            { icon:"⏳", val:stats.pending,    lbl:"Pending",     sub:"Awaiting review", bar:"linear-gradient(90deg,#f59e0b,#fbbf24)", bg:"⏳" },
            { icon:"🛠", val:stats.inProgress, lbl:"In Progress", sub:"Being handled",   bar:"linear-gradient(90deg,#f97316,#fb923c)", bg:"🛠" },
            { icon:"✅", val:stats.resolved,   lbl:"Resolved",    sub:"Issues closed",   bar:"linear-gradient(90deg,#10b981,#34d399)", bg:"✅" },
          ].map((s, i) => (
            <div key={i} className="cp-stat">
              <div className="cp-stat-bg">{s.bg}</div>
              <div className="cp-stat-label">{s.lbl}</div>
              <div className="cp-stat-val">{loading ? "—" : s.val}</div>
              <div className="cp-stat-sub">{s.sub}</div>
              <div className="cp-stat-bar" style={{ background: s.bar }} />
            </div>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="cp-body">

          {/* ── Form Panel ── */}
          <div className="cp-form-panel">
            <div className="cp-form-header">
              <div className="cp-form-eyebrow">Submit a Report</div>
              <div className="cp-form-title">
                <strong>New</strong> Complaint
              </div>
              <div className="cp-form-sub">Describe the issue clearly for faster resolution</div>
            </div>

            <div className="cp-form-body">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="cp-field">
                  <label className="cp-label">Complaint Title</label>
                  <input className="cp-input" name="title"
                    value={form.title} onChange={handleChange}
                    placeholder="e.g. Broken AC in room B-204" />
                </div>

                {/* Category & Priority */}
                <div className="cp-row2">
                  <div className="cp-field">
                    <label className="cp-label">Category</label>
                    <div style={{ position:"relative" }}>
                      <select className="cp-select" name="category"
                        value={form.category} onChange={handleChange}>
                        {Object.keys(CATEGORY_ICONS).map(c => (
                          <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                        ))}
                      </select>
                      <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#5a5650", pointerEvents:"none", fontSize:"0.7rem" }}>▾</span>
                    </div>
                  </div>

                  <div className="cp-field">
                    <label className="cp-label">Priority</label>
                    <div className="cp-priority-chips">
                      {["Low","Medium","High"].map(p => (
                        <button key={p} type="button"
                          className={`cp-priority-chip ${p.toLowerCase()} ${form.priority === p ? "sel" : ""}`}
                          onClick={() => setForm(f => ({...f, priority:p}))}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="cp-field">
                  <label className="cp-label">Description</label>
                  <textarea className="cp-textarea" name="description"
                    value={form.description} onChange={handleChange}
                    placeholder="Explain the problem in detail — location, what's broken, urgency…"
                    maxLength={500}
                  />
                  <div className="cp-char-count">{form.description.length}/500</div>
                </div>

                <button className="cp-submit-btn" type="submit" disabled={submitting}>
                  {submitting
                    ? <><span style={{display:"inline-block",animation:"spinDot 1s linear infinite"}}>⟳</span> Submitting…</>
                    : <>🔧 Submit Complaint</>
                  }
                </button>

                {inlineMsg.text && (
                  <div className={`cp-inline-msg ${inlineMsg.type}`}>
                    {inlineMsg.type === "success" ? "✅" : "⚠"} {inlineMsg.text}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="cp-right">

            {/* Toolbar */}
            <div className="cp-toolbar">
              <div className="cp-search-box">
                <span style={{ color:"var(--ink-muted)", fontSize:"0.9rem" }}>🔍</span>
                <input placeholder="Search by title, category, room…"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="cp-status-tabs">
                {STATUS_TABS.map(t => (
                  <button key={t.value} className={`cp-tab ${statusFilter === t.value ? "active":""}`}
                    onClick={() => setStatusFilter(t.value)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="cp-result-count">
                {filtered.length} result{filtered.length !== 1 ? "s":""}
              </div>
            </div>

            {/* List */}
            <div className="cp-list">
              {loading && [1,2,3].map(i => (
                <div key={i} className="cp-skeleton" style={{ animationDelay:`${i*0.08}s` }} />
              ))}

              {!loading && filtered.length === 0 && (
                <div className="cp-empty">
                  <div className="cp-empty-icon">🔧</div>
                  <div className="cp-empty-title">No complaints found</div>
                  <div className="cp-empty-sub">
                    {statusFilter === "all"
                      ? "Submit your first complaint using the form on the left"
                      : `No ${statusFilter} complaints`}
                  </div>
                </div>
              )}

              {!loading && filtered.map((item, i) => {
                const cfg = statusConfig(item.status);
                const catIcon = CATEGORY_ICONS[item.category] || "🔧";
                return (
                  <div key={item._id || i} className="cp-card">
                    <div className={`cp-card-accent ${cfg.accent}`} />

                    <div className="cp-card-head">
                      <div className="cp-card-left">
                        <div className="cp-card-title">{item.title}</div>
                        <div className="cp-card-room">
                          🏠 {item.room?.roomNumber
                            ? `Room ${item.room.roomNumber}${item.room.location ? ` · ${item.room.location}` : ""}`
                            : "No room linked"}
                        </div>
                      </div>
                      <div className={`cp-status-badge ${cfg.badge}`}>
                        <span className="dot" />
                        {cfg.label}
                      </div>
                    </div>

                    <div className="cp-card-body">
                      <div className="cp-card-desc">{item.description}</div>

                      <div className="cp-meta-row">
                        <div className="cp-meta-pill">
                          <span className="pill-icon">{catIcon}</span>
                          {item.category}
                        </div>
                        <div className="cp-meta-pill">
                          <span className={`cp-priority-dot ${priorityDot(item.priority)}`} />
                          {item.priority} Priority
                        </div>
                        <div className="cp-meta-pill">
                          🕐 {timeAgo(item.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="cp-card-footer">
                      <div className="cp-card-id">
                        #{item._id?.slice(-8).toUpperCase()}
                      </div>
                      <div className="cp-card-time">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })
                          : "—"}
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
        <div className={`cp-toast ${toast.type}`}>{toast.msg}</div>
      )}
    </Layout>
  );
}

export default Complaints;