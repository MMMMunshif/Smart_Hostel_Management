import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const statusCfg = {
  Pending: { bg: "rgba(245,158,11,.10)", color: "#b45309", border: "rgba(245,158,11,.30)", accent: "#f59e0b" },
  Approved: { bg: "rgba(16,185,129,.10)", color: "#065f46", border: "rgba(16,185,129,.30)", accent: "#10b981" },
  Rejected: { bg: "rgba(239,68,68,.10)", color: "#991b1b", border: "rgba(239,68,68,.30)", accent: "#ef4444" },
};

function StatusPill({ status }) {
  const c = statusCfg[status] || statusCfg.Pending;
  return (
    <span style={{
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: 999,
      padding: "4px 13px",
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: "0.7px",
      textTransform: "uppercase",
    }}>
      {status}
    </span>
  );
}

function TypePill({ type }) {
  const isPermanent = type === "permanent";

  return (
    <span style={{
      background: isPermanent ? "rgba(239,68,68,.10)" : "rgba(99,102,241,.10)",
      color: isPermanent ? "#991b1b" : "#3730a3",
      border: isPermanent ? "1px solid rgba(239,68,68,.25)" : "1px solid rgba(99,102,241,.25)",
      borderRadius: 999,
      padding: "4px 12px",
      fontSize: 10,
      fontWeight: 900,
      letterSpacing: ".7px",
      textTransform: "uppercase",
    }}>
      {isPermanent ? "Permanent Room Leave" : "Temporary Leave"}
    </span>
  );
}

function getDuration(from, to) {
  if (!from || !to) return "—";
  const diff = Math.round((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1;
  return `${diff} day${diff !== 1 ? "s" : ""}`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}

export default function ManageLeaves() {
  const { showToast } = useToast();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLeaves(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load leave requests.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status, leaveType) => {
    try {
      const confirmPermanent =
        status === "Approved" &&
        leaveType === "permanent"
          ? window.confirm(
              "Approving this permanent leave will remove the student from their assigned room. Continue?"
            )
          : true;

      if (!confirmPermanent) return;

      setUpdating(id + status);
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/leaves/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast(
        leaveType === "permanent" && status === "Approved"
          ? "Permanent room leave approved. Student removed from room."
          : `Leave request ${status.toLowerCase()}.`,
        "success"
      );

      fetchLeaves();
    } catch (err) {
      showToast(err.response?.data?.message || "Error updating leave status.", "error");
    } finally {
      setUpdating(null);
    }
  };

  const stats = useMemo(
    () => ({
      total: leaves.length,
      pending: leaves.filter((l) => l.status === "Pending").length,
      approved: leaves.filter((l) => l.status === "Approved").length,
      rejected: leaves.filter((l) => l.status === "Rejected").length,
      permanent: leaves.filter((l) => l.leaveType === "permanent").length,
    }),
    [leaves]
  );

  const filtered = useMemo(() => {
    return leaves.filter((l) => {
      const leaveType = l.leaveType || "temporary";

      const matchStatus = filter === "All" || l.status === filter;
      const matchType =
        typeFilter === "All" ||
        (typeFilter === "Temporary" && leaveType === "temporary") ||
        (typeFilter === "Permanent" && leaveType === "permanent");

      const q = search.toLowerCase();

      const matchSearch =
        !q ||
        l.student?.name?.toLowerCase().includes(q) ||
        l.student?.email?.toLowerCase().includes(q) ||
        l.reason?.toLowerCase().includes(q) ||
        l.room?.roomNumber?.toLowerCase().includes(q) ||
        leaveType.toLowerCase().includes(q);

      return matchStatus && matchType && matchSearch;
    });
  }, [leaves, filter, typeFilter, search]);

  return (
    <Layout role="admin">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        .ml * {
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-sizing: border-box;
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to { opacity:1; transform:translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .ml-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }

        .ml-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(99,102,241,0.13), 0 0 0 1px rgba(99,102,241,0.10) !important;
        }

        .ml-approve:hover:not(:disabled) {
          background: rgba(16,185,129,.2) !important;
          transform: translateY(-1px);
        }

        .ml-reject:hover:not(:disabled) {
          background: rgba(239,68,68,.2) !important;
          transform: translateY(-1px);
        }

        .ml-filter-btn:hover {
          background: rgba(99,102,241,.08) !important;
        }

        .ml-search:focus,
        .ml-select:focus {
          border-color: rgba(99,102,241,.45) !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,.10) !important;
          outline: none;
        }

        ::placeholder {
          color: #94a3b8 !important;
        }

        @media (max-width: 900px) {
          .ml-stats {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 560px) {
          .ml-stats {
            grid-template-columns: 1fr !important;
          }

          .ml-actions {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div
        className="ml"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #eef2ff 0%, #f0f9ff 35%, #faf5ff 65%, #ecfdf5 100%)",
          padding: "32px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: -160,
            left: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "fixed",
            bottom: -140,
            right: -100,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,.10) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1250, margin: "0 auto" }}>
          <div style={{ marginBottom: 28, animation: "fadeUp .4s ease both" }}>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#1e1b4b",
                letterSpacing: "-0.8px",
                margin: 0,
              }}
            >
              Leave Requests
            </h1>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>
              Review temporary leaves and permanent room leave requests.
            </p>
          </div>

          <div
            className="ml-stats"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 12,
              marginBottom: 28,
              animation: "fadeUp .4s ease .04s both",
            }}
          >
            {[
              { label: "Total", value: stats.total, color: "#6366f1", bg: "rgba(99,102,241,.08)", border: "rgba(99,102,241,.18)" },
              { label: "Pending", value: stats.pending, color: "#b45309", bg: "rgba(245,158,11,.08)", border: "rgba(245,158,11,.20)" },
              { label: "Approved", value: stats.approved, color: "#065f46", bg: "rgba(16,185,129,.08)", border: "rgba(16,185,129,.20)" },
              { label: "Rejected", value: stats.rejected, color: "#991b1b", bg: "rgba(239,68,68,.08)", border: "rgba(239,68,68,.20)" },
              { label: "Permanent", value: stats.permanent, color: "#be123c", bg: "rgba(244,63,94,.08)", border: "rgba(244,63,94,.20)" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${s.border}`,
                  borderRadius: 18,
                  padding: "18px 20px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    right: -16,
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    background: s.bg,
                    filter: "blur(10px)",
                  }}
                />
                <div style={{ fontSize: 30, fontWeight: 900, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    marginTop: 5,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 24,
              flexWrap: "wrap",
              alignItems: "center",
              animation: "fadeUp .4s ease .08s both",
            }}
          >
            <div style={{ position: "relative", flex: 1, minWidth: 220, maxWidth: 330 }}>
              <span
                style={{
                  position: "absolute",
                  left: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 14,
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>

              <input
                className="ml-search"
                placeholder="Search student, reason, room, type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 36px",
                  border: "1px solid rgba(99,102,241,.20)",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.70)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  fontSize: 13,
                  color: "#1e1b4b",
                  transition: "border-color .2s, box-shadow .2s",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 4,
                padding: 5,
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(99,102,241,.15)",
                borderRadius: 14,
                flexWrap: "wrap",
              }}
            >
              {["All", "Pending", "Approved", "Rejected"].map((f) => (
                <button
                  key={f}
                  className="ml-filter-btn"
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    transition: "all .18s",
                    background:
                      filter === f
                        ? f === "All"
                          ? "#1e1b4b"
                          : f === "Pending"
                          ? "rgba(245,158,11,.18)"
                          : f === "Approved"
                          ? "rgba(16,185,129,.18)"
                          : "rgba(239,68,68,.18)"
                        : "transparent",
                    color:
                      filter === f
                        ? f === "All"
                          ? "#fff"
                          : f === "Pending"
                          ? "#b45309"
                          : f === "Approved"
                          ? "#065f46"
                          : "#991b1b"
                        : "#6b7280",
                    boxShadow: filter === f && f === "All" ? "0 2px 8px rgba(30,27,75,.2)" : "none",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <select
              className="ml-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: "10px 14px",
                border: "1px solid rgba(99,102,241,.20)",
                borderRadius: 12,
                background: "rgba(255,255,255,0.75)",
                fontSize: 13,
                fontWeight: 700,
                color: "#1e1b4b",
              }}
            >
              <option>All</option>
              <option>Temporary</option>
              <option>Permanent</option>
            </select>

            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginLeft: 4 }}>
              {filtered.length} of {leaves.length}
            </span>
          </div>

          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "3px solid rgba(99,102,241,.2)",
                  borderTopColor: "#6366f1",
                  animation: "spin .8s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              <div style={{ color: "#94a3b8", fontSize: 13 }}>Loading leave requests...</div>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(99,102,241,.12)",
                borderRadius: 24,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", marginBottom: 6 }}>
                No leave requests found
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                Try adjusting your search or filters
              </div>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 18,
              }}
            >
              {filtered.map((l, i) => {
                const cfg = statusCfg[l.status] || statusCfg.Pending;
                const leaveType = l.leaveType || "temporary";
                const isPermanent = leaveType === "permanent";
                const duration = !isPermanent && l.fromDate && l.toDate ? getDuration(l.fromDate, l.toDate) : null;
                const isUpdating = updating?.startsWith(l._id);
                const initials = getInitials(l.student?.name);

                return (
                  <div
                    key={l._id}
                    className="ml-card"
                    style={{
                      background: "rgba(255,255,255,0.70)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      border: "1px solid rgba(255,255,255,0.85)",
                      borderTop: `3px solid ${isPermanent ? "#ef4444" : cfg.accent}`,
                      borderRadius: 22,
                      overflow: "hidden",
                      boxShadow:
                        "0 8px 32px rgba(99,102,241,0.07), 0 1px 0 rgba(255,255,255,0.9) inset",
                      animation: `fadeUp .35s ease ${i * 0.05}s both`,
                    }}
                  >
                    <div style={{ padding: "20px 20px 0" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 16,
                          gap: 12,
                        }}
                      >
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              flexShrink: 0,
                              background: `linear-gradient(135deg, ${cfg.accent}30, ${cfg.accent}15)`,
                              border: `1.5px solid ${cfg.accent}40`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 15,
                              fontWeight: 800,
                              color: cfg.color,
                            }}
                          >
                            {initials}
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 800,
                                color: "#1e1b4b",
                                lineHeight: 1.2,
                              }}
                            >
                              {l.student?.name || "Student"}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "#94a3b8",
                                marginTop: 3,
                                fontWeight: 600,
                              }}
                            >
                              {l.student?.email || "—"}
                            </div>
                          </div>
                        </div>

                        <StatusPill status={l.status} />
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                        <TypePill type={leaveType} />
                        {isPermanent && (
                          <span
                            style={{
                              background: "rgba(239,68,68,.10)",
                              color: "#991b1b",
                              border: "1px solid rgba(239,68,68,.25)",
                              borderRadius: 999,
                              padding: "4px 12px",
                              fontSize: 10,
                              fontWeight: 900,
                              letterSpacing: ".7px",
                              textTransform: "uppercase",
                            }}
                          >
                            Room removal request
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          background: "rgba(99,102,241,.05)",
                          border: "1px solid rgba(99,102,241,.10)",
                          borderRadius: 12,
                          padding: "11px 14px",
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: "#94a3b8",
                            letterSpacing: "0.6px",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          Reason
                        </div>
                        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, fontWeight: 500 }}>
                          {l.reason || "—"}
                        </div>
                      </div>

                      {isPermanent ? (
                        <div
                          style={{
                            background: "rgba(239,68,68,.08)",
                            border: "1px solid rgba(239,68,68,.18)",
                            borderRadius: 14,
                            padding: "13px 14px",
                            marginBottom: 16,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 900,
                              color: "#991b1b",
                              letterSpacing: ".6px",
                              textTransform: "uppercase",
                              marginBottom: 6,
                            }}
                          >
                            ⚠ Permanent room leave warning
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: "#7f1d1d",
                              lineHeight: 1.6,
                              fontWeight: 600,
                            }}
                          >
                            If approved, this student will be removed from their assigned room.
                          </div>
                        </div>
                      ) : null}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                          marginBottom: 16,
                        }}
                      >
                        {isPermanent
                          ? [
                              { icon: "🏠", label: "Current Room", val: l.room?.roomNumber || "N/A" },
                              { icon: "📌", label: "Request Type", val: "Permanent" },
                              { icon: "🕐", label: "Requested", val: formatDate(l.createdAt) },
                              { icon: "⚠️", label: "Action", val: "Remove Room" },
                            ].map((m) => (
                              <div
                                key={m.label}
                                style={{
                                  background: "rgba(255,255,255,0.65)",
                                  border: "1px solid rgba(239,68,68,.10)",
                                  borderRadius: 10,
                                  padding: "9px 11px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 800,
                                    color: "#94a3b8",
                                    letterSpacing: "0.6px",
                                    textTransform: "uppercase",
                                    marginBottom: 3,
                                  }}
                                >
                                  {m.icon} {m.label}
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b" }}>
                                  {m.val}
                                </div>
                              </div>
                            ))
                          : [
                              { icon: "📅", label: "From", val: l.fromDate ? formatDate(l.fromDate) : "—" },
                              { icon: "📅", label: "To", val: l.toDate ? formatDate(l.toDate) : "—" },
                              { icon: "⏱", label: "Duration", val: duration || "—" },
                              { icon: "🏠", label: "Room", val: l.room?.roomNumber || "N/A" },
                            ].map((m) => (
                              <div
                                key={m.label}
                                style={{
                                  background: "rgba(255,255,255,0.65)",
                                  border: "1px solid rgba(99,102,241,.08)",
                                  borderRadius: 10,
                                  padding: "9px 11px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 800,
                                    color: "#94a3b8",
                                    letterSpacing: "0.6px",
                                    textTransform: "uppercase",
                                    marginBottom: 3,
                                  }}
                                >
                                  {m.icon} {m.label}
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b" }}>
                                  {m.val}
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>

                    {l.status === "Pending" ? (
                      <div
                        className="ml-actions"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                          padding: "0 20px 20px",
                        }}
                      >
                        <button
                          className="ml-approve"
                          disabled={isUpdating}
                          onClick={() => updateStatus(l._id, "Approved", leaveType)}
                          style={{
                            padding: "12px 0",
                            borderRadius: 12,
                            border: "1.5px solid rgba(16,185,129,.35)",
                            background: "rgba(16,185,129,.12)",
                            color: "#065f46",
                            fontWeight: 800,
                            fontSize: 13,
                            cursor: isUpdating ? "not-allowed" : "pointer",
                            transition: "all .18s",
                            opacity: isUpdating ? 0.6 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                        >
                          {updating === l._id + "Approved" ? (
                            <span
                              style={{
                                width: 13,
                                height: 13,
                                borderRadius: "50%",
                                border: "2px solid rgba(16,185,129,.3)",
                                borderTopColor: "#10b981",
                                display: "inline-block",
                                animation: "spin .7s linear infinite",
                              }}
                            />
                          ) : (
                            "✓"
                          )}{" "}
                          Approve
                        </button>

                        <button
                          className="ml-reject"
                          disabled={isUpdating}
                          onClick={() => updateStatus(l._id, "Rejected", leaveType)}
                          style={{
                            padding: "12px 0",
                            borderRadius: 12,
                            border: "1.5px solid rgba(239,68,68,.35)",
                            background: "rgba(239,68,68,.10)",
                            color: "#991b1b",
                            fontWeight: 800,
                            fontSize: 13,
                            cursor: isUpdating ? "not-allowed" : "pointer",
                            transition: "all .18s",
                            opacity: isUpdating ? 0.6 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                        >
                          {updating === l._id + "Rejected" ? (
                            <span
                              style={{
                                width: 13,
                                height: 13,
                                borderRadius: "50%",
                                border: "2px solid rgba(239,68,68,.3)",
                                borderTopColor: "#ef4444",
                                display: "inline-block",
                                animation: "spin .7s linear infinite",
                              }}
                            />
                          ) : (
                            "✕"
                          )}{" "}
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          margin: "0 20px 20px",
                          padding: "10px 14px",
                          borderRadius: 12,
                          background:
                            l.status === "Approved"
                              ? "rgba(16,185,129,.08)"
                              : "rgba(239,68,68,.08)",
                          border: `1px solid ${
                            l.status === "Approved"
                              ? "rgba(16,185,129,.2)"
                              : "rgba(239,68,68,.2)"
                          }`,
                          fontSize: 12,
                          fontWeight: 700,
                          color: l.status === "Approved" ? "#065f46" : "#991b1b",
                          textAlign: "center",
                        }}
                      >
                        {l.status === "Approved"
                          ? isPermanent
                            ? "✓ Permanent leave approved. Student removed from room."
                            : "✓ This leave has been approved"
                          : "✕ This leave has been rejected"}
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