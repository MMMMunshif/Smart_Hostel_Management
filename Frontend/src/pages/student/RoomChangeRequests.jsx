import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .rcr-root {
    font-family: 'DM Sans', sans-serif;
    background: #f6f8fb;
    min-height: 100vh;
    padding: 28px;
    color: #111827;
  }

  .rcr-shell { display: grid; gap: 20px; }

  .rcr-hero {
    background: linear-gradient(135deg, #e8fbf8, #eef6ff);
    border: 1px solid #dfeef0;
    border-radius: 26px;
    padding: 24px;
    box-shadow: 0 10px 28px rgba(17,24,39,.04);
  }

  .rcr-breadcrumb {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: .76rem;
    color: #8a94a6;
    margin-bottom: 10px;
  }

  .rcr-breadcrumb span {
    color: #00b8ae;
    font-weight: 700;
  }

  .rcr-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -.03em;
    margin-bottom: 8px;
  }

  .rcr-sub {
    font-size: .95rem;
    color: #667085;
    line-height: 1.7;
    max-width: 760px;
  }

  .rcr-grid {
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 18px;
    align-items: start;
  }

  .rcr-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
    padding: 20px;
  }

  .rcr-card-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.05rem;
    font-weight: 800;
    margin-bottom: 6px;
  }

  .rcr-card-sub {
    font-size: .84rem;
    color: #6b7280;
    margin-bottom: 16px;
  }

  .rcr-field {
    display: grid;
    gap: 8px;
    margin-bottom: 14px;
  }

  .rcr-label {
    font-size: .78rem;
    font-weight: 700;
    color: #374151;
  }

  .rcr-select,
  .rcr-textarea {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    background: #fff;
    padding: 12px 14px;
    font-family: inherit;
    font-size: .88rem;
    color: #111827;
    outline: none;
  }

  .rcr-textarea {
    min-height: 120px;
    resize: vertical;
    line-height: 1.6;
  }

  .rcr-select:focus,
  .rcr-textarea:focus {
    border-color: #58e4de;
    box-shadow: 0 0 0 3px rgba(88,228,222,.12);
  }

  .rcr-btn {
    border: none;
    background: #58e4de;
    color: #0f3d3c;
    border-radius: 14px;
    padding: 12px 16px;
    font-size: .86rem;
    font-weight: 800;
    font-family: inherit;
    cursor: pointer;
    width: 100%;
  }

  .rcr-btn:disabled {
    opacity: .6;
    cursor: not-allowed;
  }

  .rcr-list {
    display: grid;
    gap: 12px;
  }

  .rcr-item {
    border: 1px solid #edf1f7;
    border-radius: 18px;
    padding: 16px;
    background: #fff;
  }

  .rcr-item-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .rcr-item-title {
    font-weight: 800;
    font-size: .95rem;
    color: #111827;
    margin-bottom: 4px;
  }

  .rcr-item-sub {
    font-size: .8rem;
    color: #6b7280;
    line-height: 1.55;
  }

  .rcr-pill {
    padding: 6px 10px;
    border-radius: 999px;
    font-size: .68rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .pill-pending { background: #fff7ed; color: #c2410c; }
  .pill-approved { background: #ecfdf5; color: #047857; }
  .pill-rejected { background: #fef2f2; color: #b91c1c; }

  .rcr-reason {
    margin-top: 12px;
    background: #f8fafc;
    border: 1px solid #edf1f7;
    border-radius: 14px;
    padding: 12px 14px;
    font-size: .83rem;
    color: #4b5563;
    line-height: 1.65;
  }

  .rcr-remark {
    margin-top: 10px;
    background: #fffaf0;
    border: 1px solid #f5e6c3;
    border-radius: 14px;
    padding: 12px 14px;
    font-size: .82rem;
    color: #7c5a10;
    line-height: 1.6;
  }

  .rcr-empty {
    font-size: .87rem;
    color: #6b7280;
    padding: 10px 0;
  }

  @media (max-width: 980px) {
    .rcr-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 720px) {
    .rcr-root { padding: 16px; }
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

function RoomChangeRequests() {
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    requestedRoom: "",
    reason: "",
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [reqRes, roomsRes] = await Promise.all([
        axios.get(`${API}/room-change-requests/my`, { headers }),
        axios.get(`${API}/rooms`, { headers }),
      ]);

      setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data.rooms || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to load room change data", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingExists = useMemo(
    () => requests.some((r) => normalize(r.status) === "pending"),
    [requests]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.requestedRoom || !form.reason.trim()) {
      showToast("Please select a room and enter a reason", "error");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/room-change-requests`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Room change request submitted", "success");
      setForm({ requestedRoom: "", reason: "" });
      fetchData();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to submit room change request",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="rcr-root">
        <div className="rcr-shell">
          <div className="rcr-hero">
            <div className="rcr-breadcrumb">
              Dashboard › Student › <span>Room Change Requests</span>
            </div>
            <div className="rcr-title">Room Change Request</div>
            <div className="rcr-sub">
              Submit a request to move from your current room to another available room. Admin will review and approve or reject it.
            </div>
          </div>

          <div className="rcr-grid">
            <div className="rcr-card">
              <div className="rcr-card-title">New Request</div>
              <div className="rcr-card-sub">
                You can only keep one pending room change request at a time.
              </div>

              <form onSubmit={handleSubmit}>
                <div className="rcr-field">
                  <label className="rcr-label">Requested Room</label>
                  <select
                    className="rcr-select"
                    value={form.requestedRoom}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, requestedRoom: e.target.value }))
                    }
                    disabled={pendingExists}
                  >
                    <option value="">Select a room</option>
                    {rooms.map((room) => (
                      <option key={room._id} value={room._id}>
                        {room.roomNumber} • {room.wing} • {room.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rcr-field">
                  <label className="rcr-label">Reason</label>
                  <textarea
                    className="rcr-textarea"
                    placeholder="Explain why you want to change your room..."
                    value={form.reason}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, reason: e.target.value }))
                    }
                    disabled={pendingExists}
                  />
                </div>

                <button
                  className="rcr-btn"
                  type="submit"
                  disabled={submitting || pendingExists}
                >
                  {pendingExists
                    ? "Pending Request Already Exists"
                    : submitting
                    ? "Submitting..."
                    : "Submit Room Change Request"}
                </button>
              </form>
            </div>

            <div className="rcr-card">
              <div className="rcr-card-title">My Requests</div>
              <div className="rcr-card-sub">
                Track the status of your submitted room change requests.
              </div>

              <div className="rcr-list">
                {loading ? (
                  <div className="rcr-empty">Loading requests...</div>
                ) : requests.length === 0 ? (
                  <div className="rcr-empty">No room change requests yet.</div>
                ) : (
                  requests.map((item) => (
                    <div className="rcr-item" key={item._id}>
                      <div className="rcr-item-top">
                        <div>
                          <div className="rcr-item-title">
                            {item.currentRoom?.roomNumber || "Current room"} → {item.requestedRoom?.roomNumber || "Requested room"}
                          </div>
                          <div className="rcr-item-sub">
                            {item.currentRoom?.wing || "—"} → {item.requestedRoom?.wing || "—"}
                          </div>
                        </div>

                        <span className={`rcr-pill ${pillClass(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="rcr-reason">
                        <strong>Reason:</strong> {item.reason}
                      </div>

                      {item.adminRemark ? (
                        <div className="rcr-remark">
                          <strong>Admin Remark:</strong> {item.adminRemark}
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RoomChangeRequests;