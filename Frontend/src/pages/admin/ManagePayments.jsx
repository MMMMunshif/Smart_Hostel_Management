import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const glass = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 20,
};

const glassStrong = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(32px)",
  WebkitBackdropFilter: "blur(32px)",
  border: "1px solid rgba(255,255,255,0.13)",
  borderRadius: 20,
};

const inputBase = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: 13,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s",
};

const LABEL = {
  fontSize: 10,
  fontWeight: 700,
  color: "rgba(255,255,255,0.4)",
  letterSpacing: "0.7px",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 7,
};

const statusCfg = {
  Pending:   { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
  Submitted: { bg: "rgba(99,179,237,0.12)",  color: "#63b3ed", border: "rgba(99,179,237,0.3)" },
  Paid:      { bg: "rgba(52,211,153,0.12)",  color: "#34d399", border: "rgba(52,211,153,0.3)" },
  Rejected:  { bg: "rgba(251,113,133,0.12)", color: "#fb7185", border: "rgba(251,113,133,0.3)" },
  Overdue:   { bg: "rgba(251,146,60,0.12)",  color: "#fb923c", border: "rgba(251,146,60,0.3)" },
};

function Pill({ status }) {
  const c = statusCfg[status] || statusCfg.Pending;
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: 999, padding: "4px 12px",
      fontSize: 10, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase",
    }}>{status === "Paid" ? "Approved" : status === "Submitted" ? "Under Review" : status}</span>
  );
}

export default function ManagePayments() {
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState("review");
  const [remarks, setRemarks] = useState({});
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ student: "", month: "", amount: "", dueDate: "", utilityAmount: "" });
  const [bulk, setBulk] = useState({ month: "", amount: "", dueDate: "", utilityAmount: "" });
  const [createBusy, setCreateBusy] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [reminderBusy, setReminderBusy] = useState(false);
  const [dueSoonBusy, setDueSoonBusy] = useState(false);

  const fetch = async () => {
    try {
      const h = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [p, s] = await Promise.all([
        axios.get(`${API}/payments`, { headers: h }),
        axios.get(`${API}/users`, { headers: h }),
      ]);
      setPayments(Array.isArray(p.data) ? p.data : []);
      setStudents((Array.isArray(s.data) ? s.data : s.data.users || []).filter(u => u.role === "student"));
    } catch { showToast("Failed to load data", "error"); }
  };

  useEffect(() => { fetch(); }, []);

  const stats = useMemo(() => ({
    total: payments.length,
    review: payments.filter(p => p.status === "Submitted").length,
    approved: payments.filter(p => p.status === "Paid").length,
    overdue: payments.filter(p => p.status === "Overdue").length,
  }), [payments]);

  const queue = useMemo(() =>
    payments.filter(p => p.status === "Submitted").sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [payments]);

  const allFiltered = useMemo(() =>
    filter === "All" ? payments : payments.filter(p => p.status === filter),
    [payments, filter]);

  const doCreate = async (e) => {
    e.preventDefault(); setCreateBusy(true);
    try {
      await axios.post(`${API}/payments`, form, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      showToast("Payment request created successfully", "success");
      setForm({ student: "", month: "", amount: "", dueDate: "", utilityAmount: "" });
      await fetch();
    } catch (err) { showToast(err.response?.data?.message || "Failed", "error"); }
    finally { setCreateBusy(false); }
  };

  const doBulk = async (e) => {
    e.preventDefault(); setBulkBusy(true);
    try {
      const res = await axios.post(`${API}/payments/generate-all`, bulk, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      showToast(`Generated for ${res.data.createdCount} students (${res.data.skippedCount} skipped)`, "success");
      setBulk({ month: "", amount: "", dueDate: "", utilityAmount: "" });
      await fetch();
    } catch (err) { showToast(err.response?.data?.message || "Failed", "error"); }
    finally { setBulkBusy(false); }
  };

  const doStatus = async (id, status) => {
    try {
      await axios.put(`${API}/payments/${id}/status`,
        { status, adminRemark: remarks[id] || "" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      showToast(status === "Paid" ? "Approved — student notified ✓" : "Rejected — student notified", "success");
      fetch();
    } catch (err) { showToast(err.response?.data?.message || "Failed", "error"); }
  };

  const sendDueSoonReminders = async () => {
    setDueSoonBusy(true);
    try {
      const res = await axios.post(
        `${API}/payments/send-due-soon-reminders`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      showToast(`Due soon reminders sent to ${res.data.sentCount || 0} students`, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send reminders", "error");
    } finally { setDueSoonBusy(false); }
  };

  const sendOverdueReminders = async () => {
    setReminderBusy(true);
    try {
      const res = await axios.post(
        `${API}/payments/send-overdue-reminders`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      showToast(`Overdue reminders sent to ${res.data.sentCount || 0} students`, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send reminders", "error");
    } finally { setReminderBusy(false); }
  };

  const TABS = [
    { id: "review", label: "Review Queue", badge: stats.review },
    { id: "create", label: "Create Requests" },
    { id: "all",    label: "All Payments"  },
  ];

  return (
    <Layout role="admin">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .mp * { font-family:'Plus Jakarta Sans',sans-serif; box-sizing:border-box; }
        .mp select option { background:#0d1728; color:#fff; }
        .mp input,.mp select,.mp textarea { color:#fff !important; }
        input[type=month]::-webkit-calendar-picker-indicator,
        input[type=date]::-webkit-calendar-picker-indicator { filter:invert(1) opacity(.4); }
        ::placeholder { color:rgba(255,255,255,.22) !important; }
        .mp-inp:focus { border-color:rgba(99,179,237,.55) !important; box-shadow:0 0 0 3px rgba(99,179,237,.1); }
        .tab-btn:hover { background:rgba(255,255,255,.08) !important; }
        .approve-btn:hover { background:rgba(52,211,153,.22) !important; }
        .reject-btn:hover { background:rgba(251,113,133,.22) !important; }
        .filter-btn:hover { background:rgba(255,255,255,.1) !important; }
        .stat-card:hover { transform:translateY(-2px); }
        .stat-card { transition:transform .2s; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .reminder-btn:not(:disabled):hover { background:linear-gradient(135deg,rgba(251,146,60,.30),rgba(251,191,36,.20)) !important; box-shadow:0 0 16px rgba(251,146,60,.2); }
        .due-soon-btn:not(:disabled):hover { background:linear-gradient(135deg,rgba(139,92,246,.30),rgba(99,102,241,.22)) !important; box-shadow:0 0 16px rgba(139,92,246,.2); }
      `}</style>

      <div className="mp" style={{
        minHeight: "100vh",
        background: "linear-gradient(140deg, #05101f 0%, #091628 45%, #0c1e3b 75%, #07121e 100%)",
        padding: "32px 28px", position: "relative", overflow: "hidden",
      }}>
        {/* Ambient glow orbs */}
        <div style={{ position:"fixed", top:-150, left:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,179,237,.10) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", bottom:-100, right:-80, width:550, height:550, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,.09) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", top:"50%", right:"5%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle, rgba(52,211,153,.05) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:960, margin:"0 auto" }}>

          {/* ── Header ── */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:28 }}>
            <div>
              <h1 style={{ fontSize:30, fontWeight:800, color:"#fff", margin:0, letterSpacing:"-0.7px" }}>Payment Management</h1>
              <p style={{ color:"rgba(255,255,255,.38)", fontSize:13, marginTop:6 }}>Review bank slips · Approve payments · Create rent requests</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              {stats.review > 0 && (
                <div style={{
                  ...glass, padding:"10px 18px",
                  color:"#63b3ed", fontWeight:700, fontSize:12,
                  display:"flex", alignItems:"center", gap:8, borderRadius:12,
                  borderColor:"rgba(99,179,237,.25)",
                }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:"#63b3ed", display:"inline-block", boxShadow:"0 0 8px #63b3ed" }} />
                  {stats.review} slip{stats.review > 1 ? "s" : ""} awaiting review
                </div>
              )}
              <button
                className="reminder-btn"
                onClick={sendOverdueReminders}
                disabled={reminderBusy}
                style={{
                  display:"flex", alignItems:"center", gap:9,
                  padding:"10px 18px", borderRadius:12, border:"1px solid rgba(251,146,60,.35)",
                  cursor: reminderBusy ? "not-allowed" : "pointer",
                  background: reminderBusy
                    ? "rgba(251,146,60,.05)"
                    : "linear-gradient(135deg, rgba(251,146,60,.20), rgba(251,191,36,.12))",
                  backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
                  color: reminderBusy ? "rgba(251,146,60,.4)" : "#fb923c",
                  fontWeight:700, fontSize:12,
                  transition:"all .2s", whiteSpace:"nowrap",
                }}
              >
                {reminderBusy ? (
                  <>
                    <span style={{ width:13, height:13, borderRadius:"50%", border:"2px solid rgba(251,146,60,.25)", borderTopColor:"#fb923c", display:"inline-block", animation:"spin .7s linear infinite" }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <span style={{ fontSize:13 }}>⚠</span>
                    Send Overdue Reminders
                    {stats.overdue > 0 && (
                      <span style={{ background:"rgba(251,146,60,.25)", color:"#fb923c", borderRadius:999, fontSize:10, fontWeight:800, padding:"1px 7px", border:"1px solid rgba(251,146,60,.35)" }}>
                        {stats.overdue}
                      </span>
                    )}
                  </>
                )}
              </button>
              <button
                className="due-soon-btn"
                onClick={sendDueSoonReminders}
                disabled={dueSoonBusy}
                style={{
                  display:"flex", alignItems:"center", gap:9,
                  padding:"10px 18px", borderRadius:12, border:"1px solid rgba(139,92,246,.35)",
                  cursor: dueSoonBusy ? "not-allowed" : "pointer",
                  background: dueSoonBusy
                    ? "rgba(139,92,246,.05)"
                    : "linear-gradient(135deg, rgba(139,92,246,.20), rgba(99,102,241,.12))",
                  backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
                  color: dueSoonBusy ? "rgba(139,92,246,.4)" : "#a78bfa",
                  fontWeight:700, fontSize:12,
                  transition:"all .2s", whiteSpace:"nowrap",
                }}
              >
                {dueSoonBusy ? (
                  <>
                    <span style={{ width:13, height:13, borderRadius:"50%", border:"2px solid rgba(139,92,246,.25)", borderTopColor:"#a78bfa", display:"inline-block", animation:"spin .7s linear infinite" }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <span style={{ fontSize:13 }}>🔔</span>
                    Send Due Soon Reminders
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:28 }}>
            {[
              { label:"Total Records",    value:stats.total,    icon:"◈", accent:"rgba(255,255,255,.75)" },
              { label:"Awaiting Review",  value:stats.review,   icon:"◉", accent:"#63b3ed" },
              { label:"Approved",         value:stats.approved, icon:"✦", accent:"#34d399" },
              { label:"Overdue",          value:stats.overdue,  icon:"◆", accent:"#fb923c" },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ ...glass, padding:"20px 22px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-25, right:-25, width:90, height:90, borderRadius:"50%", background:`radial-gradient(circle, ${s.accent}18 0%, transparent 70%)`, filter:"blur(12px)" }} />
                <div style={{ fontSize:18, color:s.accent, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:32, fontWeight:800, color:s.accent, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.38)", marginTop:5, fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Tab bar ── */}
          <div style={{ ...glass, padding:5, display:"inline-flex", gap:4, marginBottom:24, borderRadius:16 }}>
            {TABS.map(t => (
              <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)} style={{
                padding:"9px 22px", borderRadius:12, border:"none", cursor:"pointer",
                fontSize:13, fontWeight:600, transition:"all .2s",
                display:"flex", alignItems:"center", gap:8,
                background: tab === t.id
                  ? "linear-gradient(135deg, rgba(99,179,237,.22), rgba(139,92,246,.18))"
                  : "transparent",
                color: tab === t.id ? "#fff" : "rgba(255,255,255,.4)",
                boxShadow: tab === t.id ? "0 0 0 1px rgba(99,179,237,.28)" : "none",
              }}>
                {t.label}
                {t.badge > 0 && (
                  <span style={{ background:"#ef4444", color:"#fff", borderRadius:999, fontSize:10, fontWeight:800, padding:"1px 6px", boxShadow:"0 0 8px rgba(239,68,68,.5)" }}>{t.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── REVIEW ── */}
          {tab === "review" && (
            <div>
              {queue.length === 0 ? (
                <div style={{ ...glass, padding:"64px 0", textAlign:"center" }}>
                  <div style={{ fontSize:44, marginBottom:12, color:"rgba(255,255,255,.2)" }}>✦</div>
                  <div style={{ color:"rgba(255,255,255,.35)", fontSize:14 }}>All caught up — no slips awaiting review</div>
                </div>
              ) : queue.map((item, i) => (
                <div key={item._id} style={{
                  ...glassStrong, padding:"22px 24px", marginBottom:14,
                  borderLeft:"3px solid rgba(99,179,237,.45)",
                  animation:`fadeUp .3s ease ${i * .06}s both`,
                  transition:"box-shadow .2s",
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:18 }}>
                    <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                      <div style={{
                        width:44, height:44, borderRadius:12, flexShrink:0,
                        background:"linear-gradient(135deg, rgba(99,179,237,.25), rgba(139,92,246,.25))",
                        border:"1px solid rgba(99,179,237,.28)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:18, fontWeight:800, color:"#63b3ed",
                      }}>{(item.student?.name || "?")[0].toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>{item.student?.name}</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,.38)", marginTop:2 }}>{item.student?.email}</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,.38)", marginTop:2 }}>
                          Room {item.room?.roomNumber || "N/A"} · {item.month} · LKR {Number(item.amount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <Pill status={item.status} />
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.28)", marginTop:7 }}>
                        {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString("en-LK", { day:"numeric", month:"short", year:"numeric" }) : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Slip row */}
                  <div style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)",
                    borderRadius:12, padding:"12px 16px", marginBottom:14,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:22 }}>🧾</span>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,.8)" }}>{item.receiptFileName || "Bank slip"}</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,.32)" }}>Payment proof · uploaded by student</div>
                      </div>
                    </div>
                    {item.receipt && (
                      <a href={`${API}/payments/receipt/${item.downloadToken}`} target="_blank" rel="noreferrer" style={{
                        background:"rgba(99,179,237,.15)", color:"#63b3ed",
                        border:"1px solid rgba(99,179,237,.3)", borderRadius:9,
                        padding:"7px 14px", fontSize:12, fontWeight:700, textDecoration:"none",
                      }}>View slip ↗</a>
                    )}
                  </div>

                  <textarea
                    className="mp-inp"
                    placeholder="Admin remark (optional for approval, required for rejection)..."
                    value={remarks[item._id] || ""}
                    onChange={e => setRemarks(p => ({ ...p, [item._id]: e.target.value }))}
                    style={{ ...inputBase, minHeight:70, resize:"vertical", marginBottom:12 }}
                  />

                  <div style={{ display:"flex", gap:10 }}>
                    <button className="approve-btn" onClick={() => doStatus(item._id, "Paid")} style={{
                      flex:1, padding:"12px 0", borderRadius:12, cursor:"pointer",
                      border:"1px solid rgba(52,211,153,.4)", background:"rgba(52,211,153,.1)",
                      color:"#34d399", fontWeight:700, fontSize:13, transition:"background .2s",
                    }}>✓ Approve &amp; Notify</button>
                    <button className="reject-btn" onClick={() => doStatus(item._id, "Rejected")} style={{
                      flex:1, padding:"12px 0", borderRadius:12, cursor:"pointer",
                      border:"1px solid rgba(251,113,133,.4)", background:"rgba(251,113,133,.1)",
                      color:"#fb7185", fontWeight:700, fontSize:13, transition:"background .2s",
                    }}>✕ Reject &amp; Notify</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CREATE ── */}
          {tab === "create" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                { title:"Single Request", desc:"Create a payment for one student", isBulk: false },
                { title:"Bulk — All Students", desc:"Generate for every enrolled student at once", isBulk: true },
              ].map(({ title, desc, isBulk }) => {
                const f = isBulk ? bulk : form;
                const setF = isBulk ? setBulk : setForm;
                return (
                  <form key={title} onSubmit={isBulk ? doBulk : doCreate} style={{ ...glassStrong, padding:26, display:"flex", flexDirection:"column" }}>
                    <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:4 }}>{title}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", marginBottom:22 }}>{desc}</div>

                    {!isBulk && (
                      <>
                        <label style={LABEL}>Student</label>
                        <select value={f.student} onChange={e => setF({ ...f, student: e.target.value })} style={{ ...inputBase, marginBottom:16 }} required className="mp-inp">
                          <option value="">Select student...</option>
                          {students.map(s => <option key={s._id} value={s._id}>{s.name} · {s.email}</option>)}
                        </select>
                      </>
                    )}

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                      <div>
                        <label style={LABEL}>Month</label>
                        <input type="month" className="mp-inp" value={f.month} onChange={e => setF({ ...f, month: e.target.value })} style={inputBase} required />
                      </div>
                      <div>
                        <label style={LABEL}>Due Date</label>
                        <input type="date" className="mp-inp" value={f.dueDate} onChange={e => setF({ ...f, dueDate: e.target.value })} style={inputBase} required />
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom: isBulk ? 16 : 24 }}>
                      <div>
                        <label style={LABEL}>Rent (LKR)</label>
                        <input type="number" className="mp-inp" placeholder="12000" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} style={inputBase} required />
                      </div>
                      <div>
                        <label style={LABEL}>Utilities (LKR)</label>
                        <input type="number" className="mp-inp" placeholder="500" value={f.utilityAmount} onChange={e => setF({ ...f, utilityAmount: e.target.value })} style={inputBase} />
                      </div>
                    </div>

                    {isBulk && (
                      <div style={{ background:"rgba(251,191,36,.07)", border:"1px solid rgba(251,191,36,.2)", borderRadius:10, padding:"9px 13px", fontSize:11, color:"rgba(251,191,36,.75)", marginBottom:22 }}>
                        Existing records for the same month are skipped automatically.
                      </div>
                    )}

                    <button type="submit" disabled={isBulk ? bulkBusy : createBusy} style={{
                      marginTop:"auto", padding:"13px 0", borderRadius:12, border:"none",
                      background: isBulk
                        ? "linear-gradient(135deg, rgba(139,92,246,.32), rgba(99,179,237,.28))"
                        : "linear-gradient(135deg, rgba(99,179,237,.30), rgba(139,92,246,.26))",
                      boxShadow: `0 0 0 1px ${isBulk ? "rgba(139,92,246,.3)" : "rgba(99,179,237,.3)"}`,
                      color:"#fff", fontWeight:800, fontSize:14, cursor: (isBulk ? bulkBusy : createBusy) ? "not-allowed" : "pointer",
                      opacity: (isBulk ? bulkBusy : createBusy) ? 0.6 : 1, transition:"opacity .2s",
                    }}>
                      {isBulk
                        ? (bulkBusy ? "Generating..." : `Generate for All ${students.length} Students`)
                        : (createBusy ? "Creating..." : "Create Payment Request")
                      }
                    </button>
                  </form>
                );
              })}
            </div>
          )}

          {/* ── ALL ── */}
          {tab === "all" && (
            <div>
              <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                {["All","Pending","Submitted","Paid","Rejected","Overdue"].map(s => (
                  <button key={s} className="filter-btn" onClick={() => setFilter(s)} style={{
                    padding:"6px 16px", borderRadius:999, cursor:"pointer", transition:"all .15s",
                    border:"1px solid rgba(255,255,255,.1)",
                    background: filter === s ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.04)",
                    color: filter === s ? "#fff" : "rgba(255,255,255,.4)",
                    fontSize:11, fontWeight:700, letterSpacing:"0.4px",
                  }}>{s}</button>
                ))}
              </div>
              {allFiltered.map((item, i) => (
                <div key={item._id} style={{
                  ...glass, padding:"14px 20px", marginBottom:8,
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  flexWrap:"wrap", gap:10,
                  animation:`fadeUp .2s ease ${i * .03}s both`,
                }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{item.student?.name || "—"}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.38)", marginTop:3 }}>
                      {item.student?.email} · Room {item.room?.roomNumber || "N/A"} · {item.month} · LKR {Number(item.amount).toLocaleString()}
                    </div>
                    {item.adminRemark && <div style={{ fontSize:11, color:"rgba(251,146,60,.75)", marginTop:4 }}>Remark: {item.adminRemark}</div>}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {item.receipt && (
                      <a href={`${API}/payments/receipt/${item.downloadToken}`} target="_blank" rel="noreferrer"
                        style={{ fontSize:11, color:"#63b3ed", textDecoration:"none", fontWeight:700 }}>Slip ↗</a>
                    )}
                    <Pill status={item.status} />
                  </div>
                </div>
              ))}
              {allFiltered.length === 0 && (
                <div style={{ ...glass, padding:48, textAlign:"center", color:"rgba(255,255,255,.3)", fontSize:13 }}>No payments match this filter</div>
              )}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}