import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .rr-root {
    font-family: 'Inter', sans-serif;
    background: #f4f7fb;
    min-height: 100vh;
    padding: 28px;
  }
  .rr-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 8px;
    color: #111827;
  }
  .rr-sub {
    color: #6b7280;
    margin-bottom: 20px;
  }
  .rr-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .rr-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
    padding: 20px;
  }
  .rr-card-title {
    font-size: 1.1rem;
    font-weight: 800;
    margin-bottom: 14px;
    color: #111827;
  }
  .rr-list {
    display: grid;
    gap: 12px;
  }
  .rr-item {
    border: 1px solid #edf1f7;
    border-radius: 16px;
    padding: 14px;
    background: #fff;
  }
  .rr-item-top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  .rr-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }
  .rr-meta {
    font-size: 0.8rem;
    color: #6b7280;
    line-height: 1.5;
  }
  .rr-pill {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 800;
    white-space: nowrap;
  }
  .pill-pending { background: #fff7ed; color: #c2410c; }
  .pill-accepted { background: #ecfdf5; color: #047857; }
  .pill-rejected { background: #fef2f2; color: #b91c1c; }
  .rr-actions {
    display: flex;
    gap: 10px;
    margin-top: 12px;
  }
  .rr-btn-accept {
    flex: 1;
    border: none;
    background: #58e4de;
    color: #0f3d3c;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;
  }
  .rr-btn-reject {
    flex: 1;
    border: none;
    background: #fee2e2;
    color: #b91c1c;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;
  }
  .rr-empty {
    color: #6b7280;
    font-size: 0.88rem;
    padding: 10px 0;
  }

  @media (max-width: 860px) {
    .rr-root { padding: 16px; }
    .rr-grid { grid-template-columns: 1fr; }
  }
`;

function pillClass(status = "") {
  const s = status.toLowerCase();
  if (s === "accepted") return "pill-accepted";
  if (s === "rejected") return "pill-rejected";
  return "pill-pending";
}

function RoommateRequests() {
  const { showToast } = useToast();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/roommate-requests/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIncoming(res.data?.incoming || []);
      setOutgoing(res.data?.outgoing || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to load roommate requests", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/roommate-requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast(`Request ${status.toLowerCase()}`, "success");
      fetchRequests();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update request", "error");
    }
  };

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="rr-root">
        <div className="rr-title">Roommate Requests</div>
        <div className="rr-sub">Manage incoming and outgoing roommate requests.</div>

        <div className="rr-grid">
          <div className="rr-card">
            <div className="rr-card-title">Incoming Requests</div>

            <div className="rr-list">
              {loading ? (
                <div className="rr-empty">Loading...</div>
              ) : incoming.length === 0 ? (
                <div className="rr-empty">No incoming requests.</div>
              ) : (
                incoming.map((item) => (
                  <div className="rr-item" key={item._id}>
                    <div className="rr-item-top">
                      <div>
                        <div className="rr-name">{item.fromStudent?.name || "Student"}</div>
                        <div className="rr-meta">
                          {item.fromStudent?.email || "No email"}
                          <br />
                          {item.message || "No message"}
                        </div>
                      </div>

                      <span className={`rr-pill ${pillClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>

                    {item.status === "Pending" && (
                      <div className="rr-actions">
                        <button
                          className="rr-btn-accept"
                          onClick={() => updateStatus(item._id, "Accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="rr-btn-reject"
                          onClick={() => updateStatus(item._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rr-card">
            <div className="rr-card-title">Outgoing Requests</div>

            <div className="rr-list">
              {loading ? (
                <div className="rr-empty">Loading...</div>
              ) : outgoing.length === 0 ? (
                <div className="rr-empty">No outgoing requests.</div>
              ) : (
                outgoing.map((item) => (
                  <div className="rr-item" key={item._id}>
                    <div className="rr-item-top">
                      <div>
                        <div className="rr-name">{item.toStudent?.name || "Student"}</div>
                        <div className="rr-meta">
                          {item.toStudent?.email || "No email"}
                          <br />
                          {item.message || "No message"}
                        </div>
                      </div>

                      <span className={`rr-pill ${pillClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RoommateRequests;