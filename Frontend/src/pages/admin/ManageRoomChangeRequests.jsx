import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .mrc-root {
    font-family: 'DM Sans', sans-serif;
    background: #f6f8fb;
    min-height: 100vh;
    padding: 28px;
    color: #111827;
  }

  .mrc-shell { display: grid; gap: 20px; }

  .mrc-hero {
    background: linear-gradient(135deg, #e8fbf8, #eef6ff);
    border: 1px solid #dfeef0;
    border-radius: 26px;
    padding: 24px;
    box-shadow: 0 10px 28px rgba(17,24,39,.04);
  }

  .mrc-breadcrumb {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: .76rem;
    color: #8a94a6;
    margin-bottom: 10px;
  }

  .mrc-breadcrumb span {
    color: #00b8ae;
    font-weight: 700;
  }

  .mrc-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -.03em;
    margin-bottom: 8px;
  }

  .mrc-sub {
    font-size: .95rem;
    color: #667085;
    line-height: 1.7;
    max-width: 760px;
  }

  .mrc-list {
    display: grid;
    gap: 14px;
  }

  .mrc-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
    padding: 20px;
  }

  .mrc-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  .mrc-name {
    font-weight: 800;
    font-size: 1rem;
    color: #111827;
    margin-bottom: 4px;
  }

  .mrc-meta {
    font-size: .82rem;
    color: #6b7280;
    line-height: 1.6;
  }

  .mrc-pill {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: .68rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .pill-pending { background: #fff7ed; color: #c2410c; }
  .pill-approved { background: #ecfdf5; color: #047857; }
  .pill-rejected { background: #fef2f2; color: #b91c1c; }

  .mrc-reason,
  .mrc-remark-wrap {
    margin-top: 12px;
    background: #f8fafc;
    border: 1px solid #edf1f7;
    border-radius: 14px;
    padding: 12px 14px;
    font-size: .84rem;
    color: #4b5563;
    line-height: 1.65;
  }

  .mrc-remark {
    width: 100%;
    margin-top: 12px;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    padding: 12px 14px;
    font-family: inherit;
    font-size: .86rem;
    outline: none;
    min-height: 90px;
    resize: vertical;
  }

  .mrc-actions {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  .mrc-btn-approve,
  .mrc-btn-reject {
    border: none;
    border-radius: 12px;
    padding: 11px 14px;
    font-size: .84rem;
    font-weight: 800;
    font-family: inherit;
    cursor: pointer;
  }

  .mrc-btn-approve {
    background: #58e4de;
    color: #0f3d3c;
  }

  .mrc-btn-reject {
    background: #fee2e2;
    color: #b91c1c;
  }

  .mrc-btn-approve:disabled,
  .mrc-btn-reject:disabled {
    opacity: .6;
    cursor: not-allowed;
  }

  .mrc-empty {
    font-size: .87rem;
    color: #6b7280;
    padding: 10px 0;
  }

  @media (max-width: 720px) {
    .mrc-root { padding: 16px; }
  }
`;

function normalize(v = "") {
  return v.toString().toLowerCase().trim();
}

function pillClass(status = "") {
  const s = normalize(status);
  if (s === "approved") return "pill-approved";
  if (s === "rejected") return "pill-rejected";
  return "pill-pending";
}

function ManageRoomChangeRequests() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [remarks, setRemarks] = useState({});

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/room-change-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to load room change requests", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequest = async (id, status) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/room-change-requests/${id}`,
        {
          status,
          adminRemark: remarks[id] || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast(`Request ${status.toLowerCase()}`, "success");
      fetchRequests();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update room change request",
        "error"
      );
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="mrc-root">
        <div className="mrc-shell">
          <div className="mrc-hero">
            <div className="mrc-breadcrumb">
              Dashboard › Admin › <span>Room Change Requests</span>
            </div>
            <div className="mrc-title">Manage Room Change Requests</div>
            <div className="mrc-sub">
              Review student room transfer requests, approve valid changes, or reject with remarks.
            </div>
          </div>

          <div className="mrc-list">
            {loading ? (
              <div className="mrc-empty">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="mrc-empty">No room change requests found.</div>
            ) : (
              requests.map((item) => (
                <div className="mrc-card" key={item._id}>
                  <div className="mrc-top">
                    <div>
                      <div className="mrc-name">{item.student?.name || "Student"}</div>
                      <div className="mrc-meta">
                        {item.student?.email || "No email"}
                        <br />
                        {item.currentRoom?.roomNumber || "No current room"} → {item.requestedRoom?.roomNumber || "Requested room"}
                      </div>
                    </div>

                    <span className={`mrc-pill ${pillClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="mrc-reason">
                    <strong>Reason:</strong> {item.reason}
                  </div>

                  {item.adminRemark ? (
                    <div className="mrc-remark-wrap">
                      <strong>Existing Remark:</strong> {item.adminRemark}
                    </div>
                  ) : null}

                  {normalize(item.status) === "pending" ? (
                    <>
                      <textarea
                        className="mrc-remark"
                        placeholder="Optional admin remark..."
                        value={remarks[item._id] || ""}
                        onChange={(e) =>
                          setRemarks((prev) => ({
                            ...prev,
                            [item._id]: e.target.value,
                          }))
                        }
                      />

                      <div className="mrc-actions">
                        <button
                          className="mrc-btn-approve"
                          disabled={updatingId === item._id}
                          onClick={() => updateRequest(item._id, "Approved")}
                        >
                          {updatingId === item._id ? "Updating..." : "Approve"}
                        </button>

                        <button
                          className="mrc-btn-reject"
                          disabled={updatingId === item._id}
                          onClick={() => updateRequest(item._id, "Rejected")}
                        >
                          {updatingId === item._id ? "Updating..." : "Reject"}
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ManageRoomChangeRequests;