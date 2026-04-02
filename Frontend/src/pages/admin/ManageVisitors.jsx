import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function ManageVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // FETCH
  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/visitors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVisitors(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/visitors/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchVisitors();
    } catch (err) {
      alert("Error updating");
    }
  };

  // FILTER
  const filtered = useMemo(() => {
    return visitors.filter(
      (v) =>
        filter === "all" ||
        v.status.toLowerCase() === filter
    );
  }, [visitors, filter]);

  return (
    <Layout role="admin">
      <div style={styles.container}>
        <h1 style={styles.title}>👥 Visitor Management</h1>

        {/* FILTER */}
        <div style={styles.topBar}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && filtered.length === 0 && (
          <p>No visitor requests</p>
        )}

        {/* LIST */}
        <div style={styles.grid}>
          {filtered.map((v) => (
            <div key={v._id} style={styles.card}>
              {/* HEADER */}
              <div style={styles.rowTop}>
                <h3>{v.visitorName}</h3>
                <span style={statusStyle(v.status)}>
                  {v.status}
                </span>
              </div>

              {/* DETAILS */}
              <p style={styles.meta}>
                👤 {v.student?.name} ({v.student?.email})
              </p>

              <p style={styles.meta}>
                🏠 Room {v.room?.roomNumber} • {v.room?.wing}
              </p>

              <p style={styles.meta}>
                📞 {v.visitorPhone}
              </p>

              <p style={styles.meta}>
                🪪 {v.visitorNIC}
              </p>

              <p style={styles.meta}>
                🤝 {v.relation}
              </p>

              <p style={styles.meta}>
                📅 {new Date(v.visitDate).toDateString()}
              </p>

              <p style={styles.meta}>
                ⏰ {v.inTime} → {v.outTime}
              </p>

              <p style={styles.purpose}>
                {v.purpose}
              </p>

              {/* ACTIONS */}
              {v.status === "Pending" && (
                <div style={styles.actions}>
                  <button
                    style={styles.approve}
                    onClick={() =>
                      updateStatus(v._id, "Approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    style={styles.reject}
                    onClick={() =>
                      updateStatus(v._id, "Rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ManageVisitors;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "30px",
    background: "#f4f6fb",
    minHeight: "100vh",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  topBar: {
    marginBottom: "15px",
  },

  select: {
    padding: "10px",
    borderRadius: "8px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  },

  rowTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  meta: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "3px",
  },

  purpose: {
    marginTop: "8px",
    fontWeight: "500",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },

  approve: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#10b981",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  reject: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
};

const statusStyle = (status) => ({
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "12px",
  color: "#fff",
  background:
    status === "Approved"
      ? "#10b981"
      : status === "Rejected"
      ? "#ef4444"
      : "#f59e0b",
});