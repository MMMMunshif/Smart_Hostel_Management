import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComplaints(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/complaints/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchComplaints();
    } catch (err) {
      alert("Update failed");
    }
  };

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      return (
        statusFilter === "all" ||
        c.status?.toLowerCase() === statusFilter
      );
    });
  }, [complaints, statusFilter]);

  return (
    <Layout role="admin">
      <div style={styles.container}>
        <h1 style={styles.title}>📋 Manage Complaints</h1>

        {/* FILTER */}
        <div style={styles.filterBar}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* LIST */}
        {loading && <p>Loading...</p>}

        {!loading && filtered.length === 0 && (
          <p>No complaints</p>
        )}

        <div style={styles.grid}>
          {filtered.map((c) => (
            <div key={c._id} style={styles.card}>
              <div style={styles.header}>
                <h3>{c.title}</h3>
                <span style={statusStyle(c.status)}>
                  {c.status}
                </span>
              </div>

              <p style={styles.desc}>{c.description}</p>

              <div style={styles.meta}>
                <p>👤 {c.student?.name}</p>
                <p>📧 {c.student?.email}</p>
                <p>
                  🏠 {c.room?.roomNumber || "No room"}
                </p>
                <p>⚙ {c.category}</p>
                <p>🔥 {c.priority}</p>
              </div>

              <div style={styles.actions}>
                <button
                  style={btn("orange")}
                  onClick={() =>
                    updateStatus(c._id, "In Progress")
                  }
                >
                  In Progress
                </button>

                <button
                  style={btn("green")}
                  onClick={() =>
                    updateStatus(c._id, "Resolved")
                  }
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
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
    marginBottom: "20px",
  },

  select: {
    padding: "10px",
    borderRadius: "8px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
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
  },

  desc: {
    margin: "10px 0",
    color: "#555",
  },

  meta: {
    fontSize: "13px",
    marginBottom: "10px",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },
};

const statusStyle = (status) => ({
  padding: "5px 10px",
  borderRadius: "6px",
  background:
    status === "Resolved"
      ? "green"
      : status === "In Progress"
      ? "orange"
      : "gray",
  color: "#fff",
});

const btn = (type) => ({
  flex: 1,
  padding: "8px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  color: "#fff",
  background: type === "green" ? "green" : "orange",
});