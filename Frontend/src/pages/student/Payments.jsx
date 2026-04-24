import Layout from "../../components/Layout";
import { useEffect, useState, useRef } from "react";
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

const statusCfg = {
  Pending:   { bg:"rgba(251,191,36,.12)",  color:"#fbbf24", border:"rgba(251,191,36,.3)",  label:"Pending Payment",  accent:"rgba(251,191,36,.35)" },
  Submitted: { bg:"rgba(99,179,237,.12)",  color:"#63b3ed", border:"rgba(99,179,237,.3)",  label:"Under Review",     accent:"rgba(99,179,237,.35)" },
  Paid:      { bg:"rgba(52,211,153,.12)",  color:"#34d399", border:"rgba(52,211,153,.3)",  label:"Approved ✓",       accent:"rgba(52,211,153,.35)" },
  Rejected:  { bg:"rgba(251,113,133,.12)", color:"#fb7185", border:"rgba(251,113,133,.3)", label:"Rejected",         accent:"rgba(251,113,133,.35)" },
  Overdue:   { bg:"rgba(251,146,60,.12)",  color:"#fb923c", border:"rgba(251,146,60,.3)",  label:"Overdue",          accent:"rgba(251,146,60,.35)" },
};

function Pill({ status }) {
  const c = statusCfg[status] || statusCfg.Pending;
  return (
    <span style={{
      background:c.bg, color:c.color, border:`1px solid ${c.border}`,
      borderRadius:999, padding:"4px 12px",
      fontSize:10, fontWeight:700, letterSpacing:"0.6px", textTransform:"uppercase",
    }}>{c.label}</span>
  );
}

function generateReceiptPDF(payment, studentName) {
  const hostelName = "Greenview Student Hostel";
  const hostelAddress = "123 Kandy Road, Colombo 05, Sri Lanka";
  const hostelTel = "+94 11 234 5678";
  const rent = Number(payment.amount || 0);
  const util = Number(payment.utilityAmount || 0);
  const total = rent + util;
  const receiptNo = `REC-${new Date(payment.createdAt).getFullYear()}-${String(payment._id).slice(-5).toUpperCase()}`;
  const dateStr = new Date(payment.updatedAt || payment.paymentDate || Date.now())
    .toLocaleDateString("en-LK", { day:"numeric", month:"long", year:"numeric" });

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>${receiptNo}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#fff;color:#0d1728;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.wrap{max-width:340px;margin:0 auto;padding:32px 28px;}
.top-bar{background:#0d1728;color:#fff;borderRadius:16px;padding:20px;margin-bottom:24px;position:relative;overflow:hidden;}
.orb{position:absolute;border-radius:50%;background:rgba(99,179,237,.2);}
.hostel{font-size:14px;font-weight:800;letter-spacing:-.3px;margin-bottom:4px;}
.address{font-size:10px;opacity:.55;}
.receipt-label{font-size:22px;font-weight:800;margin-top:16px;letter-spacing:-.5px;}
.receipt-no{font-family:'JetBrains Mono',monospace;font-size:11px;opacity:.5;margin-top:4px;}
.divider{border:none;border-top:1px dashed #d1d5db;margin:14px 0;}
.solid{border:none;border-top:1px solid #e5e7eb;margin:14px 0;}
.row{display:flex;justify-content:space-between;font-size:12px;padding:4px 0;}
.row-label{color:#6b7280;}
.row-val{font-weight:600;color:#0d1728;}
.total{display:flex;justify-content:space-between;font-size:16px;font-weight:800;padding:10px 0 0;}
.stamp-wrap{text-align:center;margin-top:22px;}
.stamp{display:inline-flex;align-items:center;gap:6px;padding:7px 18px;background:#f0fdf4;border:1.5px solid #86efac;border-radius:999px;font-size:12px;font-weight:800;color:#166534;}
.footer{margin-top:18px;font-size:9px;color:#9ca3af;text-align:center;line-height:1.6;}
@media print{.wrap{padding:16px;}}
</style></head><body>
<div class="wrap">
  <div class="top-bar">
    <div class="orb" style="width:100px;height:100px;top:-30px;right:-30px;"></div>
    <div class="orb" style="width:60px;height:60px;bottom:-20px;left:20px;background:rgba(139,92,246,.15);"></div>
    <div class="hostel">${hostelName}</div>
    <div class="address">${hostelAddress} · ${hostelTel}</div>
    <div class="receipt-label">Official Receipt</div>
    <div class="receipt-no">${receiptNo}</div>
  </div>

  <div class="row"><span class="row-label">Student name</span><span class="row-val">${studentName}</span></div>
  <div class="row"><span class="row-label">Room number</span><span class="row-val">${payment.room?.roomNumber || "N/A"}</span></div>
  <div class="row"><span class="row-label">Period</span><span class="row-val">${payment.month}</span></div>
  <div class="row"><span class="row-label">Payment date</span><span class="row-val">${dateStr}</span></div>
  <div class="row"><span class="row-label">Method</span><span class="row-val">Bank Transfer</span></div>

  <div class="divider"></div>

  <div class="row"><span class="row-label">Hostel rent</span><span class="row-val">LKR ${rent.toLocaleString("en-LK",{minimumFractionDigits:2})}</span></div>
  ${util > 0 ? `<div class="row"><span class="row-label">Utilities levy</span><span class="row-val">LKR ${util.toLocaleString("en-LK",{minimumFractionDigits:2})}</span></div>` : ""}

  <div class="solid"></div>
  <div class="total"><span>Total Paid</span><span>LKR ${total.toLocaleString("en-LK",{minimumFractionDigits:2})}</span></div>

  <div class="stamp-wrap"><span class="stamp">✓ Verified &amp; Approved</span></div>
  <div class="footer">
    Approved by hostel administration · ${dateStr}<br/>
    Computer-generated receipt — no signature required
  </div>
</div>
</body></html>`;

  const w = window.open("", "_blank", "width=420,height=700,scrollbars=yes");
  w.document.write(html);
  w.document.close();
  w.onload = () => w.print();
}

export default function Payments() {
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [uploadingId, setUploadingId] = useState("");
  const fileRefs = useRef({});

  const fetch = async () => {
    try {
      const res = await axios.get(`${API}/payments/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch { showToast("Failed to load payments", "error"); }
  };

  useEffect(() => { fetch(); }, []);

  const handleUpload = async (id, file) => {
    if (!file) return;
    if (!["image/jpeg","image/png","image/jpg","application/pdf"].includes(file.type)) {
      showToast("Only JPG, PNG or PDF allowed", "error"); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("File must be under 5MB", "error"); return;
    }
    try {
      setUploadingId(id);
      const fd = new FormData();
      fd.append("file", file);
      await axios.put(`${API}/payments/${id}/receipt`, fd, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" },
      });
      showToast("Bank slip uploaded — awaiting admin review", "success");
      fetch();
    } catch (err) { showToast(err.response?.data?.message || "Upload failed", "error"); }
    finally { setUploadingId(""); }
  };

  const daysLeft = (due) => due ? Math.ceil((new Date(due) - new Date()) / 86400000) : null;
  const studentName = payments[0]?.student?.name || "Student";
  const summary = {
    pending: payments.filter(p => p.status === "Pending").length,
    approved: payments.filter(p => p.status === "Paid").length,
    total: payments.reduce((a, p) => a + Number(p.amount || 0), 0),
  };

  return (
    <Layout role="student">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sp * { font-family:'Plus Jakarta Sans',sans-serif; box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        .pay-card { transition:box-shadow .2s; }
        .pay-card:hover { box-shadow:0 0 0 1px rgba(99,179,237,.18), 0 16px 48px rgba(0,0,0,.35) !important; }
        .upload-zone:hover { border-color:rgba(99,179,237,.5) !important; background:rgba(99,179,237,.07) !important; }
        .receipt-btn:hover { background:linear-gradient(135deg,rgba(52,211,153,.32),rgba(99,179,237,.28)) !important; }
        .reupload-btn:hover { background:rgba(255,255,255,.12) !important; }
      `}</style>

      <div className="sp" style={{
        minHeight:"100vh",
        background:"linear-gradient(140deg, #05101f 0%, #091628 45%, #0c1e3b 75%, #07121e 100%)",
        padding:"32px 24px",
        position:"relative", overflow:"hidden",
      }}>
        {/* Ambient orbs */}
        <div style={{ position:"fixed", top:-120, right:-80, width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,.10) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", bottom:-100, left:-60, width:440, height:440, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,179,237,.09) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:680, margin:"0 auto" }}>

          {/* ── Header ── */}
          <div style={{ marginBottom:24, animation:"fadeUp .4s ease both" }}>
            <h1 style={{ fontSize:30, fontWeight:800, color:"#fff", margin:0, letterSpacing:"-0.7px" }}>My Payments</h1>
            <p style={{ color:"rgba(255,255,255,.38)", fontSize:13, marginTop:6 }}>
              Upload your bank slip after each payment — admin will verify and approve
            </p>
          </div>

          {/* ── Summary strip ── */}
          <div style={{
            ...glass, padding:"18px 24px", marginBottom:24,
            display:"flex", alignItems:"center", gap:0,
            animation:"fadeUp .4s ease .05s both",
          }}>
            {[
              { val: summary.pending,  lbl:"Pending",  color:"#fbbf24" },
              { val: summary.approved, lbl:"Approved", color:"#34d399" },
              { val: `LKR ${summary.total.toLocaleString()}`, lbl:"Total Charged", color:"rgba(255,255,255,.75)", small:true },
            ].map((s, i) => (
              <>
                <div key={s.lbl} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize: s.small ? 16 : 26, fontWeight:800, color:s.color }}>{s.val}</span>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:600, letterSpacing:"0.4px" }}>{s.lbl}</span>
                </div>
                {i < 2 && <div style={{ width:1, height:36, background:"rgba(255,255,255,.08)", margin:"0 4px" }} />}
              </>
            ))}
          </div>

          {/* ── Payment cards ── */}
          {payments.length === 0 ? (
            <div style={{ ...glass, padding:"60px 20px", textAlign:"center" }}>
              <div style={{ fontSize:40, color:"rgba(255,255,255,.18)", marginBottom:12 }}>◈</div>
              <div style={{ color:"rgba(255,255,255,.35)", fontSize:14 }}>No payment records yet.</div>
            </div>
          ) : payments.map((item, i) => {
            const cfg = statusCfg[item.status] || statusCfg.Pending;
            const days = daysLeft(item.dueDate);
            const isOpen = expandedId === item._id;
            const canUpload = ["Pending","Rejected","Overdue"].includes(item.status);
            const isApproved = item.status === "Paid";

            return (
              <div key={item._id} className="pay-card" style={{
                ...glass,
                borderLeft:`3px solid ${cfg.accent}`,
                marginBottom:10,
                animation:`fadeUp .3s ease ${i * .06}s both`,
                overflow:"hidden",
              }}>
                {/* Card header — clickable */}
                <div
                  onClick={() => setExpandedId(isOpen ? null : item._id)}
                  style={{ padding:"18px 20px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}
                >
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:5 }}>
                      {item.month} — Hostel Rent
                    </div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", lineHeight:1.8 }}>
                      Room {item.room?.roomNumber || "N/A"}
                      &nbsp;·&nbsp;LKR {Number(item.amount).toLocaleString()}
                      {item.dueDate && (
                        <>
                          &nbsp;·&nbsp;Due {new Date(item.dueDate).toLocaleDateString("en-LK", { day:"numeric", month:"short" })}
                          {days !== null && days <= 5 && days > 0 && item.status === "Pending" && (
                            <span style={{ color:"#fb923c", fontWeight:700 }}> · {days}d left</span>
                          )}
                          {days !== null && days < 0 && item.status === "Overdue" && (
                            <span style={{ color:"#fb7185", fontWeight:700 }}> · {Math.abs(days)}d overdue</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                    <Pill status={item.status} />
                    <span style={{ fontSize:9, color:"rgba(255,255,255,.25)", fontWeight:600, letterSpacing:"0.5px" }}>
                      {isOpen ? "▲ COLLAPSE" : "▼ EXPAND"}
                    </span>
                  </div>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div style={{ padding:"0 20px 20px", borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:16 }}>

                    {/* Admin remark */}
                    {item.adminRemark && (
                      <div style={{
                        background:"rgba(251,146,60,.10)", border:"1px solid rgba(251,146,60,.25)",
                        borderLeft:"3px solid rgba(251,146,60,.6)", borderRadius:"0 10px 10px 0",
                        padding:"10px 14px", fontSize:12, color:"rgba(251,146,60,.9)", marginBottom:14,
                      }}>
                        <strong>Admin note:</strong> {item.adminRemark}
                      </div>
                    )}

                    {/* Info banners */}
                    {item.status === "Submitted" && (
                      <div style={{
                        background:"rgba(99,179,237,.08)", border:"1px solid rgba(99,179,237,.2)",
                        borderRadius:10, padding:"10px 14px", fontSize:12, color:"rgba(99,179,237,.9)", marginBottom:14,
                        display:"flex", alignItems:"center", gap:8,
                      }}>
                        <span style={{ animation:"shimmer 2s infinite", fontSize:14 }}>◉</span>
                        Slip uploaded — admin is reviewing your payment. You'll be notified by email.
                      </div>
                    )}
                    {isApproved && (
                      <div style={{
                        background:"rgba(52,211,153,.08)", border:"1px solid rgba(52,211,153,.2)",
                        borderRadius:10, padding:"10px 14px", fontSize:12, color:"rgba(52,211,153,.9)", marginBottom:14,
                      }}>
                        ✦ Payment approved! Download your official receipt below.
                      </div>
                    )}

                    {/* Upload zone */}
                    {canUpload && (
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.38)", letterSpacing:"0.7px", textTransform:"uppercase", marginBottom:8 }}>
                          {item.status === "Rejected" ? "Re-upload bank slip" : "Upload bank slip"}
                        </div>
                        <div
                          className="upload-zone"
                          onClick={() => fileRefs.current[item._id]?.click()}
                          style={{
                            border:"1.5px dashed rgba(255,255,255,.15)", borderRadius:14,
                            padding:"24px 16px", textAlign:"center", cursor:"pointer",
                            background:"rgba(255,255,255,.03)", transition:"all .2s", marginBottom:14,
                          }}
                        >
                          {uploadingId === item._id ? (
                            <div style={{ color:"rgba(255,255,255,.45)", fontSize:13 }}>Uploading...</div>
                          ) : (
                            <>
                              <div style={{ fontSize:28, marginBottom:8 }}>📎</div>
                              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.7)", marginBottom:4 }}>
                                Click to upload bank slip
                              </div>
                              <div style={{ fontSize:11, color:"rgba(255,255,255,.28)" }}>
                                BOC · Commercial Bank · Sampath · People's Bank · HNB
                              </div>
                              <div style={{ fontSize:10, color:"rgba(255,255,255,.2)", marginTop:4 }}>
                                JPG, PNG or PDF · Max 5MB
                              </div>
                            </>
                          )}
                          <input
                            ref={el => fileRefs.current[item._id] = el}
                            type="file" accept=".jpg,.jpeg,.png,.pdf"
                            style={{ display:"none" }}
                            onChange={e => handleUpload(item._id, e.target.files?.[0])}
                          />
                        </div>
                      </div>
                    )}

                    {/* Existing slip (non-approved) */}
                    {item.receipt && !isApproved && (
                      <div style={{
                        display:"flex", alignItems:"center", justifyContent:"space-between",
                        background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)",
                        borderRadius:10, padding:"10px 14px", marginBottom:14,
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontSize:20 }}>🧾</span>
                          <div>
                            <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.75)" }}>{item.receiptFileName || "Bank slip"}</div>
                            <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", marginTop:2 }}>
                              {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString("en-LK", { day:"numeric", month:"short", year:"numeric" }) : "—"}
                            </div>
                          </div>
                        </div>
                        <a href={`${API}/payments/receipt/${item.downloadToken}`} target="_blank" rel="noreferrer"
                          style={{ fontSize:11, color:"#63b3ed", textDecoration:"none", fontWeight:700 }}>View ↗</a>
                      </div>
                    )}

                    {/* Official receipt download */}
                    {isApproved && (
                      <button
                        className="receipt-btn"
                        onClick={() => generateReceiptPDF(item, studentName)}
                        style={{
                          width:"100%", padding:"14px 0", borderRadius:12, border:"none",
                          background:"linear-gradient(135deg, rgba(52,211,153,.22), rgba(99,179,237,.18))",
                          boxShadow:"0 0 0 1px rgba(52,211,153,.3)",
                          color:"#34d399", fontWeight:800, fontSize:14, cursor:"pointer",
                          transition:"background .2s",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                        }}
                      >
                        ⬇ Download Official Receipt
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>
    </Layout>
  );
}