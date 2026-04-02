import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function ManageLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLeaves(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/leaves/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchLeaves();
    } catch (err) {
      alert("Error updating");
    }
  };

  return (
    <Layout role="admin">
      <div style={styles.container}>
        <h1 style={styles.title}>📋 Manage Leave Requests</h1>

        {loading && <p>Loading...</p>}

        {!loading && leaves.length === 0 && (
          <p>No leave requests</p>
        )}

        <div style={styles.grid}>
          {leaves.map((l) => (
            <div key={l._id} style={styles.card}>
              <div style={styles.top}>
                <h3>{l.student?.name || "Student"}</h3>
                <span style={statusStyle(l.status)}>
                  {l.status}
                </span>
              </div>

              <p style={styles.reason}>{l.reason}</p>

              <p style={styles.date}>
                {new Date(l.fromDate).toDateString()} →{" "}
                {new Date(l.toDate).toDateString()}
              </p>

              <p style={styles.meta}>
                Room: {l.room?.roomNumber || "N/A"}
              </p>

              {l.status === "Pending" && (
                <div style={styles.actions}>
                  <button
                    style={styles.approve}
                    onClick={() => updateStatus(l._id, "Approved")}
                  >
                    Approve
                  </button>

                  <button
                    style={styles.reject}
                    onClick={() => updateStatus(l._id, "Rejected")}
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

export default ManageLeaves;

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
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  reason: {
    fontWeight: "500",
    marginBottom: "8px",
  },

  date: {
    fontSize: "14px",
    color: "#666",
  },

  meta: {
    fontSize: "13px",
    color: "#999",
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
  padding: "5px 10px",
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