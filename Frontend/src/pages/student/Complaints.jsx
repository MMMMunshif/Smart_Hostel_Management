import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

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
  @keyframes scaleIn {
    from { opacity:0; transform:scale(.96); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes skeletonShimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }

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
  .cp-sub { font-size: 0.84rem; color: var(--ink-muted); line-height: 1.5; max-width: 420px; }

  .cp-refresh-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; background: var(--ink); color: #fff;
    border: none; border-radius: 12px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.8rem; font-weight: 700; cursor: pointer;
    transition: all .2s; flex-shrink: 0;
  }
  .cp-refresh-btn:hover { background: #1e1a16; transform: translateY(-1px); box-shadow: var(--shadow-md); }

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
  }
  .cp-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
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

  .cp-body {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 20px; align-items: start;
    position: relative; z-index: 1;
  }

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
  .cp-priority-chip.high.sel   { border-color: var(--red);   background: rgba(239,68,68,.15);  color: var(--red); }
  .cp-priority-chip:not(.sel):hover { border-color: rgba(255,255,255,.2); color: #9a9488; }

  .cp-char-count {
    font-size: 0.68rem; color: #3a3830; text-align: right; margin-top: 2px;
  }

  .cp-upload-box {
    border: 1.5px dashed rgba(255,255,255,.14);
    border-radius: 14px;
    padding: 14px;
    background: rgba(255,255,255,.03);
  }
  .cp-upload-input {
    width: 100%;
    color: #c7c1b8;
    font-size: 0.8rem;
  }
  .cp-upload-note {
    margin-top: 8px;
    font-size: 0.7rem;
    color: #6f695f;
    line-height: 1.5;
  }
  .cp-preview-wrap {
    margin-top: 12px;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.08);
    background: #141210;
  }
  .cp-preview-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
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

  .cp-right { display: flex; flex-direction: column; gap: 16px; }

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

  .cp-status-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
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
  }

  .cp-card-image {
    margin-bottom: 14px;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--paper-3);
    background: #fff;
  }
  .cp-card-image img {
    display: block;
    width: 100%;
    max-height: 260px;
    object-fit: cover;
  }

  .cp-meta-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .cp-meta-pill {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 99px;
    background: var(--paper-2); border: 1px solid var(--paper-3);
    font-size: 0.71rem; font-weight: 600; color: var(--ink-soft);
  }
  .cp-meta-pill .pill-icon { font-size: 0.8rem; }

  .cp-priority-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .prio-low    { background: var(--green); }
  .prio-medium { background: var(--amber); }
  .prio-high   { background: var(--red); box-shadow: 0 0 6px rgba(239,68,68,.5); }

  .cp-card-footer {
    padding: 10px 20px 16px;
    display: flex; justify-content: space-between; align-items: center;
    gap: 10px; flex-wrap: wrap;
  }
  .cp-card-id {
    font-family: 'Geist Mono', monospace;
    font-size: 0.68rem; color: var(--ink-muted);
    background: var(--paper-2); padding: 3px 9px; border-radius: 6px;
  }
  .cp-card-time { font-size: 0.71rem; color: var(--ink-muted); }

  .cp-skeleton {
    height: 160px; border-radius: 20px;
    background: linear-gradient(90deg, var(--paper-2) 25%, var(--paper-3) 50%, var(--paper-2) 75%);
    background-size: 600px 100%;
    animation: skeletonShimmer 1.5s infinite;
  }

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
    .cp-result-count { margin-left: 0; }
  }
`;

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
  if (s === "resolved")    return { badge:"badge-resolved", accent:"accent-resolved", label:"Resolved" };
  if (s === "in progress") return { badge:"badge-progress", accent:"accent-progress", label:"In Progress" };
  return                          { badge:"badge-pending",  accent:"accent-pending",  label:"Pending" };
};

const priorityDot = (p = "") => {
  const s = p.toLowerCase();
  if (s === "high")   return "prio-high";
  if (s === "medium") return "prio-medium";
  return "prio-low";
};

const CATEGORY_ICONS = {
  Electrical: "⚡",
  Water: "💧",
  Furniture: "🪑",
  Cleanliness: "🧹",
  Internet: "📶",
  Security: "🔒",
  Other: "🔧",
};

const STATUS_TABS = [
  { label:"All",         value:"all" },
  { label:"Pending",     value:"pending" },
  { label:"In Progress", value:"in progress" },
  { label:"Resolved",    value:"resolved" },
];

function Complaints() {
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inlineMsg, setInlineMsg]   = useState({ type:"", text:"" });
  const [imageFile, setImageFile]   = useState(null);
  const [preview, setPreview]       = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    priority: "Medium",
  });

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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePriority = (priority) =>
    setForm((prev) => ({ ...prev, priority }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview("");
    }
  };

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
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("priority", form.priority);
      if (imageFile) formData.append("image", imageFile);

      await axios.post(`${API}/complaints`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({ title:"", description:"", category:"Other", priority:"Medium" });
      setImageFile(null);
      setPreview("");
      setInlineMsg({ type:"success", text:"Complaint submitted successfully!" });
      showToast("Complaint submitted ✅", "success");
      fetchComplaints();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to submit.";
      setInlineMsg({ type:"error", text: msg });
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = useMemo(() => ({
    total:      complaints.length,
    pending:    complaints.filter((c) => normalize(c.status) === "pending").length,
    inProgress: complaints.filter((c) => normalize(c.status) === "in progress").length,
    resolved:   complaints.filter((c) => normalize(c.status) === "resolved").length,
  }), [complaints]);

  const filtered = useMemo(() =>
    complaints.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.room?.roomNumber?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" ||
        normalize(c.status) === statusFilter;

      return matchSearch && matchStatus;
    }),
  [complaints, search, statusFilter]);

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="cp-root">
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

        <div className="cp-stats">
          {[
            { val:stats.total,      lbl:"Total",       sub:"All complaints",  bar:"linear-gradient(90deg,#6366f1,#818cf8)", bg:"⚑" },
            { val:stats.pending,    lbl:"Pending",     sub:"Awaiting review", bar:"linear-gradient(90deg,#f59e0b,#fbbf24)", bg:"⏳" },
            { val:stats.inProgress, lbl:"In Progress", sub:"Being handled",   bar:"linear-gradient(90deg,#f97316,#fb923c)", bg:"🛠" },
            { val:stats.resolved,   lbl:"Resolved",    sub:"Issues closed",   bar:"linear-gradient(90deg,#10b981,#34d399)", bg:"✅" },
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

        <div className="cp-body">
          <div className="cp-form-panel">
            <div className="cp-form-header">
              <div className="cp-form-eyebrow">New Issue</div>
              <div className="cp-form-title"><strong>Submit</strong> Complaint</div>
              <div className="cp-form-sub">
                Share the issue details clearly so admin can resolve it faster.
              </div>
            </div>

            <form className="cp-form-body" onSubmit={handleSubmit}>
              <div className="cp-field">
                <label className="cp-label">Title</label>
                <input
                  className="cp-input"
                  name="title"
                  placeholder="Broken light, no water, Wi-Fi issue..."
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="cp-row2">
                <div className="cp-field">
                  <label className="cp-label">Category</label>
                  <select
                    className="cp-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {Object.keys(CATEGORY_ICONS).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="cp-field">
                  <label className="cp-label">Priority</label>
                  <div className="cp-priority-chips">
                    {["Low", "Medium", "High"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`cp-priority-chip ${p.toLowerCase()} ${form.priority === p ? "sel" : ""}`}
                        onClick={() => handlePriority(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cp-field">
                <label className="cp-label">Description</label>
                <textarea
                  className="cp-textarea"
                  name="description"
                  placeholder="Describe the issue clearly, where it happens, and how urgent it is..."
                  value={form.description}
                  onChange={handleChange}
                />
                <div className="cp-char-count">
                  {form.description.length}/500
                </div>
              </div>

              <div className="cp-field">
                <label className="cp-label">Image Proof (Optional)</label>
                <div className="cp-upload-box">
                  <input
                    className="cp-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="cp-upload-note">
                    Upload a photo of the issue to help admin understand the complaint faster.
                  </div>

                  {preview && (
                    <div className="cp-preview-wrap">
                      <img src={preview} alt="Complaint preview" className="cp-preview-img" />
                    </div>
                  )}
                </div>
              </div>

              <button className="cp-submit-btn" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>

              {inlineMsg.text ? (
                <div className={`cp-inline-msg ${inlineMsg.type}`}>
                  {inlineMsg.text}
                </div>
              ) : null}
            </form>
          </div>

          <div className="cp-right">
            <div className="cp-toolbar">
              <div className="cp-search-box">
                <span>🔍</span>
                <input
                  placeholder="Search by title, category, room..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="cp-status-tabs">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    className={`cp-tab ${statusFilter === tab.value ? "active" : ""}`}
                    onClick={() => setStatusFilter(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="cp-result-count">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="cp-list">
              {loading ? (
                <>
                  <div className="cp-skeleton" />
                  <div className="cp-skeleton" />
                  <div className="cp-skeleton" />
                </>
              ) : filtered.length === 0 ? (
                <div className="cp-empty">
                  <div className="cp-empty-icon">📭</div>
                  <div className="cp-empty-title">No complaints found</div>
                  <div className="cp-empty-sub">
                    Try a different search or filter, or submit a new issue.
                  </div>
                </div>
              ) : (
                filtered.map((c) => {
                  const status = statusConfig(c.status);
                  const imageUrl = c.image
                    ? c.image.startsWith("http")
                      ? c.image
                      : `http://localhost:5000/${c.image.replace(/\\\\/g, "/")}`
                    : "";

                  return (
                    <div className="cp-card" key={c._id}>
                      <div className={`cp-card-accent ${status.accent}`} />

                      <div className="cp-card-head">
                        <div className="cp-card-left">
                          <div className="cp-card-title">{c.title}</div>
                          <div className="cp-card-room">
                            🏠 {c.room?.roomNumber || "Room not assigned"}
                          </div>
                        </div>

                        <div className={`cp-status-badge ${status.badge}`}>
                          <span className="dot" />
                          {status.label}
                        </div>
                      </div>

                      <div className="cp-card-body">
                        <div className="cp-card-desc">{c.description}</div>

                        {imageUrl && (
                          <div className="cp-card-image">
                            <img src={imageUrl} alt={c.title} />
                          </div>
                        )}

                        <div className="cp-meta-row">
                          <div className="cp-meta-pill">
                            <span className="pill-icon">{CATEGORY_ICONS[c.category] || "🔧"}</span>
                            {c.category || "Other"}
                          </div>

                          <div className="cp-meta-pill">
                            <span className={`cp-priority-dot ${priorityDot(c.priority)}`} />
                            {c.priority || "Low"} Priority
                          </div>
                        </div>
                      </div>

                      <div className="cp-card-footer">
                        <div className="cp-card-id">#{c._id?.slice(-6) || "—"}</div>
                        <div className="cp-card-time">{timeAgo(c.createdAt)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Complaints;