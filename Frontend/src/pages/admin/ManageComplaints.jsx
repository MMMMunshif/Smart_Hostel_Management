import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

function ManageComplaints() {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : [];

      // ✅ DEBUG - இத பாரு console-ல, student object வருதா இல்லையா
      console.log("Complaints data:", data);
      if (data.length > 0) {
        console.log("First complaint student field:", data[0].student);
        console.log("First complaint category field:", data[0].category);
      }

      setComplaints(data);
      setLoading(false);
    } catch (err) {
      showToast("Failed to load complaints.", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/complaints/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Status updated to "${status}".`, "success");
      fetchComplaints();
    } catch (err) {
      showToast("Failed to update complaint status.", "error");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return complaints.filter((c) => {
      // ── Status filter ──
      const matchesStatus =
        statusFilter === "all" ||
        (c.status ?? "").toLowerCase() === statusFilter.toLowerCase();

      if (!matchesStatus) return false;

      // ── Search filter ──
      if (query === "") return true;

      // student name - object ஆ இருந்தாலும் string ஆ இருந்தாலும் handle பண்ணும்
      const studentName =
        typeof c.student === "object"
          ? (c.student?.name ?? "").toLowerCase()
          : (c.student ?? "").toLowerCase();

      const title       = (c.title       ?? "").toLowerCase();
      const category    = (c.category    ?? "").toLowerCase();
      const description = (c.description ?? "").toLowerCase();

      return (
        title.includes(query) ||
        studentName.includes(query) ||
        category.includes(query) ||
        description.includes(query)
      );
    });
  }, [complaints, statusFilter, searchQuery]);

  return (
    <Layout role="admin">
      <div style={styles.container}>
        <h1 style={styles.title}>📋 Manage Complaints</h1>

        {/* ── SEARCH + FILTER BAR ── */}
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="🔍 Search by title, student name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          {(searchQuery || statusFilter !== "all") && (
            <button
              style={styles.clearBtn}
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── RESULT COUNT ── */}
        {!loading && (
          <p style={styles.resultCount}>
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{complaints.length}</strong> complaints
          </p>
        )}

        {loading && <p>Loading...</p>}

        {!loading && filtered.length === 0 && (
          <p style={styles.noResult}>
            No complaints found for "<strong>{searchQuery}</strong>"
          </p>
        )}

        {/* ── GRID ── */}
        <div style={styles.grid}>
          {filtered.map((c) => {
            // student name display - object or string both handle
            const studentName =
              typeof c.student === "object"
                ? c.student?.name ?? "Unknown"
                : c.student ?? "Unknown";

            const studentEmail =
              typeof c.student === "object"
                ? c.student?.email ?? "—"
                : "—";

            return (
              <div key={c._id} style={styles.card}>
                <div style={styles.header}>
                  <h3 style={styles.cardTitle}>{c.title}</h3>
                  <span style={statusStyle(c.status)}>{c.status}</span>
                </div>

                <p style={styles.desc}>{c.description}</p>

                <div style={styles.meta}>
                  <p>👤 {studentName}</p>
                  <p>📧 {studentEmail}</p>
                  <p>🏠 {c.room?.roomNumber || "No room"}</p>
                  <p>⚙️ {c.category}</p>
                  <p>🔥 {c.priority}</p>
                  <p>
                    🕐{" "}
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>

                <div style={styles.actions}>
                  <button
                    style={btn("orange")}
                    disabled={updating === c._id}
                    onClick={() => updateStatus(c._id, "In Progress")}
                  >
                    {updating === c._id ? "Updating..." : "In Progress"}
                  </button>

                  <button
                    style={btn("green")}
                    disabled={updating === c._id}
                    onClick={() => updateStatus(c._id, "Resolved")}
                  >
                    {updating === c._id ? "Updating..." : "Resolve"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default ManageComplaints;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "30px",
    background: "#f4f6fb",
    minHeight: "100vh",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: "220px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  clearBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#e74c3c",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  resultCount: {
    fontSize: "13px",
    color: "#888",
    marginBottom: "16px",
  },
  noResult: {
    color: "#999",
    marginTop: "20px",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "6px",
  },
  cardTitle: {
    fontSize: "15px",
    margin: 0,
  },
  desc: {
    margin: "8px 0",
    color: "#555",
    fontSize: "13px",
  },
  meta: {
    fontSize: "13px",
    color: "#444",
    lineHeight: "1.9",
    marginBottom: "12px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
};

const statusStyle = (status) => ({
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "12px",
  whiteSpace: "nowrap",
  color: "#fff",
  background:
    status === "Resolved"
      ? "#27ae60"
      : status === "In Progress"
      ? "#e67e22"
      : "#95a5a6",
});

const btn = (type) => ({
  flex: 1,
  padding: "8px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  color: "#fff",
  fontWeight: "500",
  background: type === "green" ? "#27ae60" : "#e67e22",
});