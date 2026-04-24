import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

/* ── STATUS CONFIG ─────────────────────────────────────────────────────────── */
const statusCfg = {
  Pending:  { bg: "rgba(245,158,11,.10)",  color: "#b45309", border: "rgba(245,158,11,.30)",  accent: "#f59e0b" },
  Approved: { bg: "rgba(16,185,129,.10)",  color: "#065f46", border: "rgba(16,185,129,.30)",  accent: "#10b981" },
  Rejected: { bg: "rgba(239,68,68,.10)",   color: "#991b1b", border: "rgba(239,68,68,.30)",   accent: "#ef4444" },
};

function StatusPill({ status }) {
  const c = statusCfg[status] || statusCfg.Pending;
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: 999, padding: "4px 13px",
      fontSize: 10, fontWeight: 800, letterSpacing: "0.7px", textTransform: "uppercase",
    }}>{status}</span>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" });
}

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

/* ── META ROW COMPONENT ────────────────────────────────────────────────────── */
function MetaItem({ icon, label, value }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.65)",
      border: "1px solid rgba(99,102,241,.08)",
      borderRadius: 10, padding: "9px 11px",
    }}>
      <div style={{ fontSize: 9, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 3 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b", wordBreak: "break-word" }}>{value || "—"}</div>
    </div>
  );
}

/* ── MAIN ──────────────────────────────────────────────────────────────────── */
export default function ManageVisitors() {
  const { showToast } = useToast();
  const [visitors, setVisitors]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [updating, setUpdating]   = useState(null);
  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");

  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/visitors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(res.data || []);
    } catch {
      showToast("Failed to load visitor requests.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVisitors(); }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id + status);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/visitors/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Visitor request ${status.toLowerCase()}.`, "success");
      fetchVisitors();
    } catch {
      showToast("Error updating visitor status.", "error");
    } finally {
      setUpdating(null);
    }
  };

  const stats = useMemo(() => ({
    total:    visitors.length,
    pending:  visitors.filter(v => v.status === "Pending").length,
    approved: visitors.filter(v => v.status === "Approved").length,
    rejected: visitors.filter(v => v.status === "Rejected").length,
  }), [visitors]);

  const filtered = useMemo(() => {
    return visitors.filter(v => {
      const matchFilter = filter === "All" || v.status === filter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        v.visitorName?.toLowerCase().includes(q) ||
        v.student?.name?.toLowerCase().includes(q) ||
        v.student?.email?.toLowerCase().includes(q) ||
        v.visitorPhone?.toLowerCase().includes(q) ||
        v.visitorNIC?.toLowerCase().includes(q) ||
        v.relation?.toLowerCase().includes(q) ||
        v.purpose?.toLowerCase().includes(q) ||
        v.room?.roomNumber?.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [visitors, filter, search]);

  return (
    <Layout role="admin">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .mv * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
        .mv-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .mv-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(99,102,241,0.13), 0 0 0 1px rgba(99,102,241,0.10) !important; }
        .mv-approve:hover:not(:disabled) { background: rgba(16,185,129,.22) !important; transform: translateY(-1px); }
        .mv-reject:hover:not(:disabled)  { background: rgba(239,68,68,.20)  !important; transform: translateY(-1px); }
        .mv-filter-btn:hover { background: rgba(99,102,241,.08) !important; }
        .mv-search:focus { border-color: rgba(99,102,241,.45) !important; box-shadow: 0 0 0 3px rgba(99,102,241,.10) !important; outline: none; }
        ::placeholder { color: #94a3b8 !important; }
      `}</style>

      <div className="mv" style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff 0%, #f0f9ff 35%, #faf5ff 65%, #ecfdf5 100%)",
        padding: "32px 28px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{ position:"fixed", top:-160, left:-120, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", bottom:-140, right:-100, width:520, height:520, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,.10) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", top:"40%", right:"8%", width:340, height:340, borderRadius:"50%", background:"radial-gradient(circle, rgba(16,185,129,.07) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto" }}>

          {/* ── HEADER ── */}
          <div style={{ marginBottom:28, animation:"fadeUp .4s ease both" }}>
            <h1 style={{ fontSize:30, fontWeight:900, color:"#1e1b4b", letterSpacing:"-0.8px", margin:0 }}>
              Visitor Management
            </h1>
            <p style={{ color:"#6b7280", fontSize:14, marginTop:6 }}>
              Review and manage student visitor requests
            </p>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28, animation:"fadeUp .4s ease .04s both" }}>
            {[
              { label:"Total",    value:stats.total,    color:"#6366f1", border:"rgba(99,102,241,.18)",  bg:"rgba(99,102,241,.08)"  },
              { label:"Pending",  value:stats.pending,  color:"#b45309", border:"rgba(245,158,11,.20)",  bg:"rgba(245,158,11,.08)"  },
              { label:"Approved", value:stats.approved, color:"#065f46", border:"rgba(16,185,129,.20)",  bg:"rgba(16,185,129,.08)"  },
              { label:"Rejected", value:stats.rejected, color:"#991b1b", border:"rgba(239,68,68,.20)",   bg:"rgba(239,68,68,.08)"   },
            ].map(s => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${s.border}`,
                borderRadius: 18,
                padding: "18px 20px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position:"absolute", top:-16, right:-16, width:70, height:70, borderRadius:"50%", background:s.bg, filter:"blur(10px)" }} />
                <div style={{ fontSize:30, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginTop:5, letterSpacing:"0.5px", textTransform:"uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── FILTER BAR ── */}
          <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap", alignItems:"center", animation:"fadeUp .4s ease .08s both" }}>
            {/* Search */}
            <div style={{ position:"relative", flex:1, minWidth:220, maxWidth:340 }}>
              <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#94a3b8", pointerEvents:"none" }}>🔍</span>
              <input
                className="mv-search"
                placeholder="Search visitor, student, NIC, purpose..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width:"100%", padding:"10px 14px 10px 36px",
                  border:"1px solid rgba(99,102,241,.20)",
                  borderRadius:12,
                  background:"rgba(255,255,255,0.70)",
                  backdropFilter:"blur(12px)",
                  WebkitBackdropFilter:"blur(12px)",
                  fontSize:13, color:"#1e1b4b",
                  transition:"border-color .2s, box-shadow .2s",
                }}
              />
            </div>

            {/* Filter tabs */}
            <div style={{
              display:"flex", gap:4, padding:5,
              background:"rgba(255,255,255,0.65)",
              backdropFilter:"blur(16px)",
              WebkitBackdropFilter:"blur(16px)",
              border:"1px solid rgba(99,102,241,.15)",
              borderRadius:14,
            }}>
              {["All","Pending","Approved","Rejected"].map(f => (
                <button key={f} className="mv-filter-btn" onClick={() => setFilter(f)} style={{
                  padding:"8px 16px", borderRadius:10, border:"none", cursor:"pointer",
                  fontSize:12, fontWeight:700, transition:"all .18s",
                  background: filter === f
                    ? f === "All"      ? "#1e1b4b"
                    : f === "Pending"  ? "rgba(245,158,11,.18)"
                    : f === "Approved" ? "rgba(16,185,129,.18)"
                    :                   "rgba(239,68,68,.18)"
                    : "transparent",
                  color: filter === f
                    ? f === "All"      ? "#fff"
                    : f === "Pending"  ? "#b45309"
                    : f === "Approved" ? "#065f46"
                    :                   "#991b1b"
                    : "#6b7280",
                  boxShadow: filter === f && f === "All" ? "0 2px 8px rgba(30,27,75,.2)" : "none",
                }}>{f}</button>
              ))}
            </div>

            <span style={{ fontSize:12, color:"#94a3b8", fontWeight:600, marginLeft:4 }}>
              {filtered.length} of {visitors.length}
            </span>
          </div>

          {/* ── LOADING ── */}
          {loading && (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", border:"3px solid rgba(99,102,241,.2)", borderTopColor:"#6366f1", animation:"spin .8s linear infinite", margin:"0 auto 12px" }} />
              <div style={{ color:"#94a3b8", fontSize:13 }}>Loading visitor requests...</div>
            </div>
          )}

          {/* ── EMPTY ── */}
          {!loading && filtered.length === 0 && (
            <div style={{
              textAlign:"center", padding:"80px 20px",
              background:"rgba(255,255,255,0.55)",
              backdropFilter:"blur(16px)",
              WebkitBackdropFilter:"blur(16px)",
              border:"1px solid rgba(99,102,241,.12)",
              borderRadius:24,
            }}>
              <div style={{ fontSize:48, marginBottom:14 }}>👥</div>
              <div style={{ fontSize:16, fontWeight:700, color:"#1e1b4b", marginBottom:6 }}>No visitor requests found</div>
              <div style={{ fontSize:13, color:"#94a3b8" }}>Try adjusting your search or filter</div>
            </div>
          )}

          {/* ── CARDS GRID ── */}
          {!loading && filtered.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:18 }}>
              {filtered.map((v, i) => {
                const cfg = statusCfg[v.status] || statusCfg.Pending;
                const isUpdating = updating?.startsWith(v._id);
                const visitorInitials = getInitials(v.visitorName);

                return (
                  <div key={v._id} className="mv-card" style={{
                    background: "rgba(255,255,255,0.70)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.85)",
                    borderTop: `3px solid ${cfg.accent}`,
                    borderRadius: 22,
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(99,102,241,0.07), 0 1px 0 rgba(255,255,255,0.9) inset",
                    animation: `fadeUp .35s ease ${i * 0.05}s both`,
                  }}>
                    <div style={{ padding:"20px 20px 0" }}>

                      {/* Visitor identity row */}
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                          <div style={{
                            width:46, height:46, borderRadius:13, flexShrink:0,
                            background:`linear-gradient(135deg, ${cfg.accent}30, ${cfg.accent}15)`,
                            border:`1.5px solid ${cfg.accent}40`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:16, fontWeight:800, color:cfg.color,
                          }}>{visitorInitials}</div>
                          <div>
                            <div style={{ fontSize:16, fontWeight:800, color:"#1e1b4b", lineHeight:1.2 }}>
                              {v.visitorName || "Visitor"}
                            </div>
                            <div style={{ fontSize:11, color:"#94a3b8", marginTop:3, fontWeight:600 }}>
                              {v.relation || "—"}
                            </div>
                          </div>
                        </div>
                        <StatusPill status={v.status} />
                      </div>

                      {/* Student info strip */}
                      <div style={{
                        background:"rgba(99,102,241,.05)",
                        border:"1px solid rgba(99,102,241,.10)",
                        borderRadius:12, padding:"10px 14px", marginBottom:14,
                        display:"flex", alignItems:"center", gap:10,
                      }}>
                        <div style={{
                          width:30, height:30, borderRadius:8, flexShrink:0,
                          background:"rgba(99,102,241,.12)", border:"1px solid rgba(99,102,241,.2)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:12, fontWeight:800, color:"#6366f1",
                        }}>{getInitials(v.student?.name)}</div>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:"#1e1b4b" }}>
                            {v.student?.name || "—"}
                          </div>
                          <div style={{ fontSize:11, color:"#94a3b8", marginTop:1 }}>
                            {v.student?.email || "—"} · Room {v.room?.roomNumber || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Purpose box */}
                      {v.purpose && (
                        <div style={{
                          background:"rgba(99,102,241,.05)",
                          border:"1px solid rgba(99,102,241,.10)",
                          borderRadius:12, padding:"10px 14px", marginBottom:14,
                        }}>
                          <div style={{ fontSize:9, fontWeight:800, color:"#94a3b8", letterSpacing:"0.6px", textTransform:"uppercase", marginBottom:4 }}>Purpose of visit</div>
                          <div style={{ fontSize:13, color:"#374151", lineHeight:1.6, fontWeight:500 }}>{v.purpose}</div>
                        </div>
                      )}

                      {/* Meta grid */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                        <MetaItem icon="📅" label="Visit Date"  value={v.visitDate ? formatDate(v.visitDate) : "—"} />
                        <MetaItem icon="⏰" label="Time"        value={v.inTime && v.outTime ? `${v.inTime} – ${v.outTime}` : v.inTime || "—"} />
                        <MetaItem icon="📞" label="Phone"       value={v.visitorPhone} />
                        <MetaItem icon="🪪" label="NIC"         value={v.visitorNIC} />
                      </div>
                    </div>

                    {/* Action buttons */}
                    {v.status === "Pending" ? (
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"0 20px 20px" }}>
                        <button
                          className="mv-approve"
                          disabled={isUpdating}
                          onClick={() => updateStatus(v._id, "Approved")}
                          style={{
                            padding:"12px 0", borderRadius:12,
                            border:"1.5px solid rgba(16,185,129,.35)",
                            background:"rgba(16,185,129,.12)", color:"#065f46",
                            fontWeight:800, fontSize:13,
                            cursor: isUpdating ? "not-allowed" : "pointer",
                            transition:"all .18s", opacity: isUpdating ? 0.6 : 1,
                            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                          }}
                        >
                          {updating === v._id + "Approved" ? (
                            <span style={{ width:13, height:13, borderRadius:"50%", border:"2px solid rgba(16,185,129,.3)", borderTopColor:"#10b981", display:"inline-block", animation:"spin .7s linear infinite" }} />
                          ) : "✓"} Approve
                        </button>
                        <button
                          className="mv-reject"
                          disabled={isUpdating}
                          onClick={() => updateStatus(v._id, "Rejected")}
                          style={{
                            padding:"12px 0", borderRadius:12,
                            border:"1.5px solid rgba(239,68,68,.35)",
                            background:"rgba(239,68,68,.10)", color:"#991b1b",
                            fontWeight:800, fontSize:13,
                            cursor: isUpdating ? "not-allowed" : "pointer",
                            transition:"all .18s", opacity: isUpdating ? 0.6 : 1,
                            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                          }}
                        >
                          {updating === v._id + "Rejected" ? (
                            <span style={{ width:13, height:13, borderRadius:"50%", border:"2px solid rgba(239,68,68,.3)", borderTopColor:"#ef4444", display:"inline-block", animation:"spin .7s linear infinite" }} />
                          ) : "✕"} Reject
                        </button>
                      </div>
                    ) : (
                      <div style={{
                        margin:"0 20px 20px",
                        padding:"10px 14px", borderRadius:12, textAlign:"center",
                        background: v.status === "Approved" ? "rgba(16,185,129,.08)" : "rgba(239,68,68,.08)",
                        border: `1px solid ${v.status === "Approved" ? "rgba(16,185,129,.2)" : "rgba(239,68,68,.2)"}`,
                        fontSize:12, fontWeight:700,
                        color: v.status === "Approved" ? "#065f46" : "#991b1b",
                      }}>
                        {v.status === "Approved" ? "✓ This visit has been approved" : "✕ This visit has been rejected"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}