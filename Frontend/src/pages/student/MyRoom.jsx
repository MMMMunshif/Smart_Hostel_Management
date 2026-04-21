import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  .mr-root {
    font-family: 'Inter', sans-serif;
    background: #f4f7fb;
    min-height: 100vh;
    padding: 28px;
    color: #111827;
  }

  .mr-shell {
    display: grid;
    gap: 20px;
  }

  .mr-hero {
    background: linear-gradient(135deg, #e8fbf8, #eef7ff);
    border: 1px solid #e2f2f0;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 28px rgba(17,24,39,.04);
  }

  .mr-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #8b95a7;
    margin-bottom: 10px;
  }

  .mr-breadcrumb span {
    color: #00b8ae;
    font-weight: 700;
  }

  .mr-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }

  .mr-sub {
    font-size: 0.95rem;
    color: #667085;
    line-height: 1.6;
    max-width: 760px;
  }

  .mr-grid {
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 20px;
    align-items: start;
  }

  .mr-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
    overflow: hidden;
  }

  .mr-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    display: block;
    background: #edf2f7;
  }

  .mr-image-fallback {
    width: 100%;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #dff8f6, #eef8ff);
    font-size: 3.2rem;
  }

  .mr-main-pad {
    padding: 22px;
  }

  .mr-badge-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .mr-pill {
    padding: 7px 11px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 800;
  }

  .pill-room { background: #ecfeff; color: #0f766e; }
  .pill-full { background: #fee2e2; color: #b91c1c; }
  .pill-available { background: #ecfdf5; color: #047857; }
  .pill-maintenance { background: #fff7ed; color: #c2410c; }

  .mr-room-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.9rem;
    font-weight: 800;
    line-height: 1.02;
    margin-bottom: 16px;
    color: #111827;
  }

  .mr-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .mr-info-box {
    background: #f8fafc;
    border: 1px solid #edf1f7;
    border-radius: 18px;
    padding: 16px;
  }

  .mr-info-label {
    font-size: 0.68rem;
    color: #9ca3af;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 7px;
  }

  .mr-info-value {
    font-size: 0.96rem;
    font-weight: 800;
    color: #111827;
    line-height: 1.45;
  }

  .mr-info-sub {
    margin-top: 5px;
    font-size: 0.8rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .mr-section {
    padding: 20px;
  }

  .mr-section-title {
    font-size: 1.08rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .mr-section-sub {
    font-size: 0.84rem;
    color: #6b7280;
    margin-bottom: 16px;
  }

  .mr-roommates {
    display: grid;
    gap: 12px;
  }

  .mr-roommate {
    border: 1px solid #edf1f7;
    border-radius: 18px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: #fff;
  }

  .mr-roommate-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .mr-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #58e4de, #93c5fd);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    flex-shrink: 0;
  }

  .mr-name {
    font-size: 0.92rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .mr-email {
    font-size: 0.78rem;
    color: #6b7280;
    line-height: 1.5;
    word-break: break-word;
  }

  .mr-status {
    padding: 6px 10px;
    border-radius: 999px;
    background: #ecfdf5;
    color: #047857;
    font-size: 0.72rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .mr-amenities {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .mr-amenity {
    padding: 8px 12px;
    border-radius: 999px;
    background: #f8fafc;
    border: 1px solid #edf1f7;
    color: #374151;
    font-size: 0.78rem;
    font-weight: 700;
  }

  .mr-side {
    display: grid;
    gap: 20px;
  }

  .mr-side-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
    padding: 20px;
  }

  .mr-side-title {
    font-size: 1rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 6px;
  }

  .mr-side-sub {
    font-size: 0.82rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 14px;
  }

  .mr-progress-top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    font-size: 0.82rem;
    margin-bottom: 8px;
  }

  .mr-progress-label {
    font-weight: 700;
    color: #374151;
  }

  .mr-progress-value {
    color: #6b7280;
    font-weight: 700;
  }

  .mr-track {
    height: 10px;
    background: #eef2f7;
    border-radius: 999px;
    overflow: hidden;
  }

  .mr-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #58e4de, #93c5fd);
  }

  .mr-meta-list {
    display: grid;
    gap: 12px;
    margin-top: 14px;
  }

  .mr-meta-item {
    background: #f8fafc;
    border: 1px solid #edf1f7;
    border-radius: 16px;
    padding: 14px;
  }

  .mr-meta-kicker {
    font-size: 0.66rem;
    color: #9ca3af;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }

  .mr-meta-value {
    font-size: 0.88rem;
    font-weight: 800;
    color: #111827;
    line-height: 1.5;
  }

  .mr-empty {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
    padding: 34px;
    text-align: center;
  }

  .mr-empty-icon {
    font-size: 2.6rem;
    margin-bottom: 10px;
  }

  .mr-empty-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 6px;
  }

  .mr-empty-sub {
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.7;
    max-width: 620px;
    margin: 0 auto 18px;
  }

  .mr-btn {
    border: none;
    background: #58e4de;
    color: #0f3d3c;
    border-radius: 14px;
    padding: 12px 18px;
    font-size: 0.86rem;
    font-weight: 800;
    cursor: pointer;
  }

  @media (max-width: 1100px) {
    .mr-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .mr-root {
      padding: 16px;
    }

    .mr-info-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function initials(name = "ST") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function roomStatusClass(status = "") {
  const s = status.toLowerCase();
  if (s === "full") return "pill-full";
  if (s === "maintenance") return "pill-maintenance";
  return "pill-available";
}

function formatLKR(value) {
  if (value === undefined || value === null || value === "") return "N/A";
  return `LKR ${Number(value).toLocaleString("en-LK")}`;
}

function MyRoom() {
  const { showToast } = useToast();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoom = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/rooms/my-room`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRoom(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setRoom(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  const occupancyPercent = useMemo(() => {
    if (!room?.capacity) return 0;
    const used = Array.isArray(room.occupants) ? room.occupants.length : 0;
    return Math.min(100, Math.round((used / room.capacity) * 100));
  }, [room]);

  const roomImage = room?.images?.[0]
    ? `http://localhost:5000/${room.images[0]}`
    : room?.image
    ? room.image.startsWith("http")
      ? room.image
      : `http://localhost:5000/${room.image}`
    : null;

  if (loading) {
    return (
      <Layout role="student">
        <style>{css}</style>
        <div className="mr-root">
          <div className="mr-empty">
            <div className="mr-empty-title">Loading room details...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout role="student">
        <style>{css}</style>
        <div className="mr-root">
          <div className="mr-empty">
            <div className="mr-empty-icon">🏠</div>
            <div className="mr-empty-title">No Room Assigned Yet</div>
            <div className="mr-empty-sub">
              You do not currently have an assigned room. Browse available rooms and submit a request.
            </div>
            <button
              className="mr-btn"
              onClick={() => {
                window.location.href = "/rooms";
              }}
            >
              Browse Rooms
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="mr-root">
        <div className="mr-shell">
          <div className="mr-hero">
            <div className="mr-breadcrumb">
              Dashboard › Student › <span>My Room</span>
            </div>
            <div className="mr-title">My Assigned Room</div>
            <div className="mr-sub">
              View your current room details, roommates, amenities, occupancy, and residence information.
            </div>
          </div>

          <div className="mr-grid">
            <div className="mr-card">
              {roomImage ? (
                <img src={roomImage} alt="Room" className="mr-image" />
              ) : (
                <div className="mr-image-fallback">🏢</div>
              )}

              <div className="mr-main-pad">
                <div className="mr-badge-row">
                  <span className="mr-pill pill-room">Assigned Room</span>
                  <span className={`mr-pill ${roomStatusClass(room.status)}`}>
                    {room.status || "Available"}
                  </span>
                </div>

                <div className="mr-room-title">
                  {room.roomNumber} {room.type ? `· ${room.type}` : ""}
                </div>

                <div className="mr-info-grid">
                  <div className="mr-info-box">
                    <div className="mr-info-label">WING</div>
                    <div className="mr-info-value">{room.wing || "N/A"}</div>
                    <div className="mr-info-sub">Residence block / wing location</div>
                  </div>

                  <div className="mr-info-box">
                    <div className="mr-info-label">CAPACITY</div>
                    <div className="mr-info-value">{room.capacity || "N/A"} students</div>
                    <div className="mr-info-sub">Maximum occupancy for this room</div>
                  </div>

                  <div className="mr-info-box">
                    <div className="mr-info-label">PRICE</div>
                    <div className="mr-info-value">{formatLKR(room.price)}</div>
                    <div className="mr-info-sub">Monthly room cost</div>
                  </div>

                  <div className="mr-info-box">
                    <div className="mr-info-label">LOCATION</div>
                    <div className="mr-info-value">
                      {room.location || room.wing || "N/A"}
                    </div>
                    <div className="mr-info-sub">
                      {room.district || "Hostel residence area"}
                    </div>
                  </div>

                  <div className="mr-info-box">
                    <div className="mr-info-label">CONTACT</div>
                    <div className="mr-info-value">{room.contactNo || "N/A"}</div>
                    <div className="mr-info-sub">Room / hostel contact number</div>
                  </div>

                  <div className="mr-info-box">
                    <div className="mr-info-label">ROOM STATUS</div>
                    <div className="mr-info-value">{room.status || "Available"}</div>
                    <div className="mr-info-sub">Current system allocation state</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mr-side">
              <div className="mr-side-card">
                <div className="mr-side-title">Occupancy</div>
                <div className="mr-side-sub">Current usage of this room</div>

                <div className="mr-progress-top">
                  <div className="mr-progress-label">Filled Slots</div>
                  <div className="mr-progress-value">
                    {(room.occupants || []).length} / {room.capacity}
                  </div>
                </div>

                <div className="mr-track">
                  <div className="mr-fill" style={{ width: `${occupancyPercent}%` }} />
                </div>

                <div className="mr-meta-list">
                  <div className="mr-meta-item">
                    <div className="mr-meta-kicker">AVAILABLE SLOTS</div>
                    <div className="mr-meta-value">
                      {Math.max(0, Number(room.capacity || 0) - (room.occupants || []).length)}
                    </div>
                  </div>

                  <div className="mr-meta-item">
                    <div className="mr-meta-kicker">ROOM TYPE</div>
                    <div className="mr-meta-value">{room.type || "N/A"}</div>
                  </div>
                </div>
              </div>

              <div className="mr-side-card">
                <div className="mr-side-title">Amenities</div>
                <div className="mr-side-sub">Facilities available in your room</div>

                <div className="mr-amenities">
                  {(room.amenities || []).length > 0 ? (
                    room.amenities.map((item, index) => (
                      <span key={index} className="mr-amenity">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="mr-amenity">No amenities listed</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mr-card">
            <div className="mr-section">
              <div className="mr-section-title">Roommates</div>
              <div className="mr-section-sub">
                Students currently assigned to this room
              </div>

              <div className="mr-roommates">
                {(room.occupants || []).length > 0 ? (
                  room.occupants.map((student) => (
                    <div key={student._id} className="mr-roommate">
                      <div className="mr-roommate-left">
                        <div className="mr-avatar">{initials(student.name || "S")}</div>
                        <div>
                          <div className="mr-name">{student.name || "Student"}</div>
                          <div className="mr-email">{student.email || "No email"}</div>
                        </div>
                      </div>

                      <div className="mr-status">Active</div>
                    </div>
                  ))
                ) : (
                  <div className="mr-empty-sub">No roommate data available.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default MyRoom;