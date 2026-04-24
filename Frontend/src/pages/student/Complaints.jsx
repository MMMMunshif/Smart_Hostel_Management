import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
const API = "http://localhost:5000/api";

/* ─────────────────────────── CSS ─────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400;1,9..144,600&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg:         #f0ebe3;
    --bg2:        #e8e1d7;
    --bg3:        #ddd5c8;
    --surface:    #faf7f3;
    --surface2:   #fff;
    --ink:        #1c1814;
    --ink2:       #4a4238;
    --ink3:       #9a8f84;
    --teal:       #1a9e8f;
    --teal-l:     #e6f7f5;
    --teal-m:     #b3e8e3;
    --amber:      #d97706;
    --amber-l:    #fef3c7;
    --red:        #dc2626;
    --red-l:      #fee2e2;
    --green:      #059669;
    --green-l:    #d1fae5;
    --orange:     #ea580c;
    --orange-l:   #ffedd5;
    --border:     rgba(28,24,20,.1);
    --radius:     18px;
    --radius-sm:  10px;
    --shadow:     0 2px 12px rgba(28,24,20,.07);
    --shadow-md:  0 8px 32px rgba(28,24,20,.10);
    --shadow-lg:  0 20px 56px rgba(28,24,20,.13);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cp { font-family:'Plus Jakarta Sans',sans-serif; background:var(--bg); min-height:100vh; color:var(--ink); }

  /* ── Grid layout ── */
  .cp-wrap {
    display:grid;
    grid-template-columns:380px 1fr;
    grid-template-rows:auto auto 1fr;
    grid-template-areas:
      "header header"
      "stats  stats"
      "form   list";
    gap:20px;
    max-width:1380px;
    margin:0 auto;
    padding:32px 28px 56px;
  }

  /* ── Header ── */
  .cp-header {
    grid-area:header;
    display:flex; justify-content:space-between; align-items:center;
    animation: fadeUp .5s ease both;
  }
  .cp-title-group {}
  .cp-tag {
    display:inline-flex; align-items:center; gap:6px;
    background:var(--teal-l); color:var(--teal);
    font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em;
    padding:4px 12px; border-radius:99px; margin-bottom:10px;
  }
  .cp-tag-dot { width:6px; height:6px; border-radius:50%; background:var(--teal); }
  .cp-h1 {
    font-family:'Fraunces',serif;
    font-size:2rem; font-weight:700; color:var(--ink); line-height:1.1;
  }
  .cp-h1 em { font-style:italic; font-weight:400; color:var(--ink2); }
  .cp-sub { font-size:.82rem; color:var(--ink3); margin-top:5px; }

  .cp-refresh {
    display:flex; align-items:center; gap:8px;
    padding:11px 22px; background:var(--ink); color:#fff;
    border:none; border-radius:var(--radius-sm);
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:.8rem; font-weight:700; cursor:pointer;
    transition:all .2s; letter-spacing:.01em;
    box-shadow: 0 4px 14px rgba(28,24,20,.18);
  }
  .cp-refresh:hover { background:#2d2820; transform:translateY(-2px); box-shadow:var(--shadow-md); }
  .cp-refresh svg { transition:transform .4s; }
  .cp-refresh:hover svg { transform:rotate(180deg); }

  /* ── Stats ── */
  .cp-stats {
    grid-area:stats;
    display:grid; grid-template-columns:repeat(4,1fr); gap:14px;
    animation: fadeUp .5s .05s ease both;
  }
  .cp-stat {
    background:var(--surface2); border-radius:var(--radius);
    padding:20px 22px; border:1px solid var(--border);
    position:relative; overflow:hidden;
    transition:transform .2s, box-shadow .2s;
    cursor:default;
    box-shadow:var(--shadow);
  }
  .cp-stat:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
  .cp-stat-icon {
    width:42px; height:42px; border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-size:1.1rem; margin-bottom:14px;
  }
  .cp-stat-val {
    font-family:'Fraunces',serif;
    font-size:2.2rem; font-weight:700; line-height:1; margin-bottom:4px;
  }
  .cp-stat-lbl { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--ink3); margin-bottom:2px; }
  .cp-stat-sub { font-size:.72rem; color:var(--ink3); }
  .cp-stat-stripe { position:absolute; bottom:0; left:0; right:0; height:3px; }

  /* ── Form Panel ── */
  .cp-form-panel {
    grid-area:form;
    background:var(--surface2); border-radius:22px;
    border:1px solid var(--border); box-shadow:var(--shadow);
    position:sticky; top:24px; height:fit-content;
    overflow:hidden;
    animation: fadeUp .5s .1s ease both;
  }
  .cp-form-banner {
    background: linear-gradient(135deg, #1c1814 0%, #2d2420 100%);
    padding:28px 28px 24px;
    position:relative; overflow:hidden;
  }
  .cp-form-banner::after {
    content:'';
    position:absolute; top:-60px; right:-60px;
    width:200px; height:200px;
    background:radial-gradient(circle, rgba(26,158,143,.3) 0%, transparent 65%);
    border-radius:50%; pointer-events:none;
  }
  .cp-form-banner-tag {
    font-size:.65rem; font-weight:800; text-transform:uppercase;
    letter-spacing:.12em; color:var(--teal); margin-bottom:8px;
    position:relative; z-index:1;
  }
  .cp-form-banner-title {
    font-family:'Fraunces',serif;
    font-size:1.45rem; color:#fff; font-weight:700; line-height:1.2;
    position:relative; z-index:1;
  }
  .cp-form-banner-title em { font-style:italic; font-weight:400; color:var(--teal-m); }
  .cp-form-banner-sub { font-size:.75rem; color:#6b6058; margin-top:5px; position:relative; z-index:1; }

  .cp-form-body { padding:24px 28px 28px; }

  .cp-field { margin-bottom:16px; }
  .cp-label {
    display:block; font-size:.68rem; font-weight:800;
    text-transform:uppercase; letter-spacing:.08em;
    color:var(--ink3); margin-bottom:7px;
  }
  .cp-input, .cp-select, .cp-textarea {
    width:100%; padding:12px 15px;
    background:var(--bg); border:1.5px solid var(--bg3);
    border-radius:12px;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:.84rem; color:var(--ink); outline:none;
    transition:border-color .2s, background .2s, box-shadow .2s;
  }
  .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
    border-color:var(--teal); background:#fff;
    box-shadow:0 0 0 3px var(--teal-l);
  }
  .cp-input::placeholder, .cp-textarea::placeholder { color:var(--ink3); }
  .cp-select { cursor:pointer; appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%239a8f84' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 13px center;
    padding-right:36px;
  }
  .cp-select option { background:#fff; color:var(--ink); }
  .cp-textarea { resize:none; min-height:110px; line-height:1.6; }

  .cp-row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

  .cp-char { font-size:.68rem; color:var(--ink3); text-align:right; margin-top:4px; }

  /* Priority chips */
  .cp-chips { display:flex; gap:8px; }
  .cp-chip {
    flex:1; padding:10px 6px; border-radius:10px;
    border:1.5px solid var(--bg3); background:var(--bg);
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:.75rem; font-weight:700; color:var(--ink3);
    cursor:pointer; text-align:center; transition:all .2s;
  }
  .cp-chip:hover:not(.sel) { border-color:var(--ink3); color:var(--ink2); }
  .cp-chip.low.sel    { border-color:var(--green); background:var(--green-l); color:var(--green); }
  .cp-chip.medium.sel { border-color:var(--amber); background:var(--amber-l); color:var(--amber); }
  .cp-chip.high.sel   { border-color:var(--red);   background:var(--red-l);   color:var(--red); }

  .cp-submit {
    width:100%; padding:14px; margin-top:6px;
    background:var(--teal); color:#fff; border:none; border-radius:13px;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:.88rem; font-weight:800; cursor:pointer; letter-spacing:.01em;
    display:flex; align-items:center; justify-content:center; gap:8px;
    transition:all .25s;
    box-shadow:0 6px 22px rgba(26,158,143,.35);
  }
  .cp-submit:hover:not(:disabled) { background:#158a7d; transform:translateY(-2px); box-shadow:0 10px 30px rgba(26,158,143,.45); }
  .cp-submit:active:not(:disabled) { transform:scale(.98); }
  .cp-submit:disabled { opacity:.55; cursor:not-allowed; }

  .cp-msg {
    margin-top:14px; padding:12px 15px;
    border-radius:11px; font-size:.78rem; font-weight:600;
    display:flex; align-items:center; gap:8px;
  }
  .cp-msg.ok  { background:var(--green-l); color:var(--green); border:1px solid #a7f3d0; }
  .cp-msg.err { background:var(--red-l);   color:var(--red);   border:1px solid #fca5a5; }

  /* ── Right Panel ── */
  .cp-right { grid-area:list; display:flex; flex-direction:column; gap:14px; }

  /* Toolbar */
  .cp-toolbar {
    background:var(--surface2); border:1px solid var(--border);
    border-radius:var(--radius); padding:14px 16px;
    display:flex; align-items:center; gap:10px; flex-wrap:wrap;
    box-shadow:var(--shadow);
    animation: fadeUp .5s .12s ease both;
  }
  .cp-search {
    display:flex; align-items:center; gap:8px;
    background:var(--bg); border:1.5px solid var(--bg3);
    border-radius:10px; padding:9px 14px; flex:1; min-width:180px;
    transition:border-color .2s;
  }
  .cp-search:focus-within { border-color:var(--teal); }
  .cp-search input {
    border:none; outline:none; background:transparent;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:.82rem; color:var(--ink); width:100%;
  }
  .cp-search input::placeholder { color:var(--ink3); }
  .cp-search-icon { color:var(--ink3); font-size:.9rem; }

  .cp-tabs { display:flex; gap:4px; }
  .cp-tab {
    padding:8px 15px; border-radius:99px; border:none;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:.75rem; font-weight:700; cursor:pointer; transition:all .2s;
    white-space:nowrap;
  }
  .cp-tab.on  { background:var(--ink); color:#fff; box-shadow:0 3px 10px rgba(28,24,20,.2); }
  .cp-tab:not(.on) { background:var(--bg2); color:var(--ink2); }
  .cp-tab:not(.on):hover { background:var(--bg3); }

  .cp-count {
    margin-left:auto;
    font-size:.72rem; font-weight:700; color:var(--ink3);
    background:var(--bg2); padding:5px 13px; border-radius:99px;
    white-space:nowrap;
  }

  /* ── Cards ── */
  .cp-list { display:flex; flex-direction:column; gap:12px; }

  .cp-card {
    background:var(--surface2); border:1px solid var(--border);
    border-radius:20px; overflow:hidden;
    transition:transform .2s, box-shadow .2s;
    animation: fadeUp .4s ease both;
    box-shadow:var(--shadow);
    cursor:default;
  }
  .cp-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
  .cp-card:nth-child(1){animation-delay:.08s}
  .cp-card:nth-child(2){animation-delay:.13s}
  .cp-card:nth-child(3){animation-delay:.18s}
  .cp-card:nth-child(4){animation-delay:.22s}
  .cp-card:nth-child(5){animation-delay:.26s}

  .cp-card-stripe { height:3px; }

  .cp-card-inner {
    display:grid; grid-template-columns:1fr auto;
    align-items:start; gap:16px;
    padding:18px 20px 14px;
  }
  .cp-card-cat-row {
    display:flex; align-items:center; gap:8px; margin-bottom:7px;
  }
  .cp-cat-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 11px; border-radius:99px;
    font-size:.68rem; font-weight:700;
    background:var(--bg2); color:var(--ink3);
    border:1px solid var(--bg3);
  }
  .cp-card-title {
    font-family:'Fraunces',serif;
    font-size:1.05rem; font-weight:600; color:var(--ink); line-height:1.3;
    margin-bottom:6px;
  }
  .cp-card-desc {
    font-size:.8rem; color:var(--ink2); line-height:1.6;
    display:-webkit-box; -webkit-line-clamp:2;
    -webkit-box-orient:vertical; overflow:hidden;
  }

  /* Status badge */
  .cp-badge {
    display:inline-flex; align-items:center; gap:6px;
    padding:6px 13px; border-radius:99px;
    font-size:.68rem; font-weight:800; text-transform:uppercase; letter-spacing:.06em;
    white-space:nowrap; flex-shrink:0;
  }
  .cp-badge .dot { width:6px; height:6px; border-radius:50%; background:currentColor; }
  .badge-pending  { background:var(--amber-l); color:var(--amber); }
  .badge-progress { background:var(--orange-l); color:var(--orange); }
  .badge-resolved { background:var(--green-l); color:var(--green); }

  /* Footer row */
  .cp-card-foot {
    padding:0 20px 16px;
    display:flex; align-items:center; gap:8px; flex-wrap:wrap;
  }
  .cp-pill {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 11px; border-radius:99px;
    background:var(--bg); border:1px solid var(--bg3);
    font-size:.7rem; font-weight:600; color:var(--ink2);
  }
  .cp-prio-dot {
    width:7px; height:7px; border-radius:50%;
    display:inline-block; flex-shrink:0;
  }
  .prio-low    { background:var(--green); }
  .prio-medium { background:var(--amber); }
  .prio-high   { background:var(--red); box-shadow:0 0 5px rgba(220,38,38,.5); }

  .cp-id {
    margin-left:auto;
    font-family:'JetBrains Mono',monospace;
    font-size:.65rem; color:var(--ink3);
    background:var(--bg2); padding:3px 9px; border-radius:6px;
  }

  /* Skeleton */
  @keyframes shimmer {
    0%   { background-position:-600px 0 }
    100% { background-position:600px 0 }
  }
  .cp-skel {
    height:140px; border-radius:20px;
    background:linear-gradient(90deg, var(--bg2) 25%, var(--bg3) 50%, var(--bg2) 75%);
    background-size:600px 100%;
    animation:shimmer 1.4s infinite;
  }

  /* Empty */
  .cp-empty {
    background:var(--surface2); border:1px dashed var(--bg3);
    border-radius:20px; padding:52px 24px; text-align:center;
    box-shadow:var(--shadow);
  }
  .cp-empty-icon { font-size:2.5rem; margin-bottom:12px; }
  .cp-empty-title {
    font-family:'Fraunces',serif;
    font-size:1.1rem; font-weight:600; color:var(--ink); margin-bottom:6px;
  }
  .cp-empty-sub { font-size:.8rem; color:var(--ink3); line-height:1.6; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* Responsive */
  @media (max-width:1100px) {
    .cp-wrap { grid-template-columns:1fr; grid-template-areas:"header""stats""form""list"; }
    .cp-form-panel { position:static; }
    .cp-stats { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:600px) {
    .cp-wrap { padding:16px 14px 40px; gap:14px; }
    .cp-stats { grid-template-columns:repeat(2,1fr); }
    .cp-row2  { grid-template-columns:1fr; }
    .cp-h1    { font-size:1.6rem; }
    .cp-toolbar { flex-direction:column; align-items:stretch; }
    .cp-tabs  { flex-wrap:wrap; }
    .cp-count { margin-left:0; }
  }
`;

/* ─────────────────── Helpers ─────────────────── */
const norm = (v = "") => v.toString().toLowerCase().trim();

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

const statusCfg = (status = "") => {
  const s = norm(status);
  if (s === "resolved")    return { cls:"badge-resolved", stripe:"#10b981", label:"Resolved"    };
  if (s === "in progress") return { cls:"badge-progress", stripe:"#ea580c", label:"In Progress" };
  return                          { cls:"badge-pending",  stripe:"#d97706", label:"Pending"     };
};

const prioDot = (p = "") => {
  const s = p.toLowerCase();
  if (s === "high")   return "prio-high";
  if (s === "medium") return "prio-medium";
  return "prio-low";
};

const CAT = {
  Electrical:"⚡", Water:"💧", Furniture:"🪑",
  Cleanliness:"🧹", Internet:"📶", Security:"🔒", Other:"🔧",
};

const TABS = [
  { label:"All",         val:"all"         },
  { label:"Pending",     val:"pending"     },
  { label:"In Progress", val:"in progress" },
  { label:"Resolved",    val:"resolved"    },
];

const STAT_CFG = [
  { lbl:"Total",       sub:"All reports",     icon:"📋", iconBg:"#eef2ff", iconC:"#4f46e5", stripe:"linear-gradient(90deg,#818cf8,#6366f1)", key:"total"      },
  { lbl:"Pending",     sub:"Awaiting review", icon:"⏳", iconBg:"#fef3c7", iconC:"#d97706", stripe:"linear-gradient(90deg,#fbbf24,#f59e0b)", key:"pending"    },
  { lbl:"In Progress", sub:"Being handled",   icon:"🔧", iconBg:"#ffedd5", iconC:"#ea580c", stripe:"linear-gradient(90deg,#fb923c,#f97316)", key:"inProgress" },
  { lbl:"Resolved",    sub:"Issues closed",   icon:"✅", iconBg:"#d1fae5", iconC:"#059669", stripe:"linear-gradient(90deg,#34d399,#10b981)", key:"resolved"   },
];

/* ─────────────────── Component ─────────────────── */
export default function Complaints() {
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState("");
  const [tab, setTab]               = useState("all");
  const [msg, setMsg]               = useState({ type:"", text:"" });

  const [form, setForm] = useState({
    title:"", description:"", category:"Other", priority:"Medium",
  });

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await axios.get(`${API}/complaints/my`, {
        headers:{ Authorization:`Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.complaints || [];
      setComplaints(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load complaints","error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type:"", text:"" });
    if (!form.title.trim() || !form.description.trim()) {
      setMsg({ type:"err", text:"Title and description are required." }); return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/complaints`, form, {
        headers:{ Authorization:`Bearer ${token}` },
      });
      setForm({ title:"", description:"", category:"Other", priority:"Medium" });
      setMsg({ type:"ok", text:"Complaint submitted — we'll get on it!" });
      showToast("Complaint submitted ✅");
      load();
    } catch (err) {
      const m = err.response?.data?.message || err.response?.data?.error || "Something went wrong.";
      setMsg({ type:"err", text:m });
      showToast(m,"error");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = useMemo(() => ({
    total:      complaints.length,
    pending:    complaints.filter(c => norm(c.status) === "pending").length,
    inProgress: complaints.filter(c => norm(c.status) === "in progress").length,
    resolved:   complaints.filter(c => norm(c.status) === "resolved").length,
  }), [complaints]);

  const filtered = useMemo(() =>
    complaints.filter(c => {
      const q = search.toLowerCase();
      const matchQ = !q ||
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.room?.roomNumber?.toLowerCase().includes(q);
      const matchT = tab === "all" || norm(c.status) === tab;
      return matchQ && matchT;
    }),
  [complaints, search, tab]);

  return (
    <Layout role="student">
      <style>{css}</style>
      <div className="cp">
        <div className="cp-wrap">

          {/* Header */}
          <header className="cp-header">
            <div className="cp-title-group">
              <div className="cp-tag"><span className="cp-tag-dot"/>Student Portal</div>
              <h1 className="cp-h1">Complaints <em>&amp; Maintenance</em></h1>
              <p className="cp-sub">Report issues · track resolution · stay informed</p>
            </div>
            <button className="cp-refresh" onClick={load}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Refresh
            </button>
          </header>

          {/* Stats */}
          <div className="cp-stats">
            {STAT_CFG.map((s, i) => (
              <div key={i} className="cp-stat" style={{ animationDelay:`${i*0.06}s` }}>
                <div className="cp-stat-icon" style={{ background:s.iconBg, color:s.iconC }}>{s.icon}</div>
                <div className="cp-stat-lbl">{s.lbl}</div>
                <div className="cp-stat-val">{loading ? "—" : stats[s.key]}</div>
                <div className="cp-stat-sub">{s.sub}</div>
                <div className="cp-stat-stripe" style={{ background:s.stripe }} />
              </div>
            ))}
          </div>

          {/* Form Panel */}
          <div className="cp-form-panel">
            <div className="cp-form-banner">
              <div className="cp-form-banner-tag">New Report</div>
              <div className="cp-form-banner-title">Submit a <em>Complaint</em></div>
              <div className="cp-form-banner-sub">Be specific — it helps us fix things faster</div>
            </div>

            <div className="cp-form-body">
              <form onSubmit={handleSubmit}>

                <div className="cp-field">
                  <label className="cp-label">What's the issue?</label>
                  <input className="cp-input" name="title"
                    value={form.title} onChange={handleChange}
                    placeholder="e.g. Broken AC in room B-204" />
                </div>

                <div className="cp-row2">
                  <div className="cp-field">
                    <label className="cp-label">Category</label>
                    <select className="cp-select" name="category"
                      value={form.category} onChange={handleChange}>
                      {Object.entries(CAT).map(([k,v]) => (
                        <option key={k} value={k}>{v} {k}</option>
                      ))}
                    </select>
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Priority</label>
                    <div className="cp-chips">
                      {["Low","Medium","High"].map(p => (
                        <button key={p} type="button"
                          className={`cp-chip ${p.toLowerCase()} ${form.priority===p?"sel":""}`}
                          onClick={() => setForm(f => ({...f, priority:p}))}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="cp-field">
                  <label className="cp-label">Tell us more</label>
                  <textarea className="cp-textarea" name="description"
                    value={form.description} onChange={handleChange}
                    placeholder="Describe the problem — where it is, how long it's been happening, what you've tried…"
                    maxLength={500} />
                  <div className="cp-char">{form.description.length}/500</div>
                </div>

                <button className="cp-submit" type="submit" disabled={submitting}>
                  {submitting
                    ? <><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> Submitting…</>
                    : <>🔧 Submit Complaint</>
                  }
                </button>

                {msg.text && (
                  <div className={`cp-msg ${msg.type}`}>
                    {msg.type === "ok" ? "✅" : "⚠️"} {msg.text}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Panel */}
          <div className="cp-right">

            {/* Toolbar */}
            <div className="cp-toolbar">
              <div className="cp-search">
                <span className="cp-search-icon">🔍</span>
                <input placeholder="Search by title, category, room…"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="cp-tabs">
                {TABS.map(t => (
                  <button key={t.val} className={`cp-tab ${tab===t.val?"on":""}`}
                    onClick={() => setTab(t.val)}>{t.label}</button>
                ))}
              </div>
              <div className="cp-count">{filtered.length} result{filtered.length!==1?"s":""}</div>
            </div>

            {/* List */}
            <div className="cp-list">
              {loading && [1,2,3].map(i => (
                <div key={i} className="cp-skel" style={{ animationDelay:`${i*0.1}s` }} />
              ))}

              {!loading && filtered.length === 0 && (
                <div className="cp-empty">
                  <div className="cp-empty-icon">🔧</div>
                  <div className="cp-empty-title">Nothing here yet</div>
                  <div className="cp-empty-sub">
                    {tab === "all"
                      ? "Use the form on the left to submit your first complaint."
                      : `No ${tab} complaints to show.`}
                  </div>
                </div>
              )}

              {!loading && filtered.map((item, i) => {
                const cfg    = statusCfg(item.status);
                const catIco = CAT[item.category] || "🔧";
                return (
                  <div key={item._id || i} className="cp-card">
                    <div className="cp-card-stripe" style={{ background:cfg.stripe }} />

                    <div className="cp-card-inner">
                      <div>
                        <div className="cp-card-cat-row">
                          <span className="cp-cat-badge">{catIco} {item.category}</span>
                          {item.room?.roomNumber && (
                            <span className="cp-cat-badge">🏠 Room {item.room.roomNumber}</span>
                          )}
                        </div>
                        <div className="cp-card-title">{item.title}</div>
                        <div className="cp-card-desc">{item.description}</div>
                      </div>
                      <span className={`cp-badge ${cfg.cls}`}>
                        <span className="dot"/> {cfg.label}
                      </span>
                    </div>

                    <div className="cp-card-foot">
                      <span className="cp-pill">
                        <span className={`cp-prio-dot ${prioDot(item.priority)}`}/>
                        {item.priority} Priority
                      </span>
                      <span className="cp-pill">🕐 {timeAgo(item.createdAt)}</span>
                      {item.createdAt && (
                        <span className="cp-pill">
                          📅 {new Date(item.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                        </span>
                      )}
                      <span className="cp-id">#{item._id?.slice(-8).toUpperCase() || "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}