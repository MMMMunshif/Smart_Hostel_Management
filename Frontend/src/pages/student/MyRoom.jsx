import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

.mr-root {
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  padding: 30px;
  color: #0f172a;
  background:
    radial-gradient(circle at 10% 0%, rgba(88,228,222,.26), transparent 28%),
    radial-gradient(circle at 90% 8%, rgba(99,102,241,.17), transparent 28%),
    radial-gradient(circle at 50% 100%, rgba(16,185,129,.12), transparent 32%),
    linear-gradient(135deg, #effefd 0%, #f8faff 45%, #f8fafc 100%);
}

.mr-shell {
  max-width: 1450px;
  margin: 0 auto;
  display: grid;
  gap: 22px;
}

.mr-hero {
  display: grid;
  grid-template-columns: 1.35fr .85fr;
  gap: 20px;
}

.mr-hero-main,
.mr-hero-side,
.mr-card,
.mr-side-card,
.mr-empty {
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(255,255,255,.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 18px 45px rgba(15,23,42,.08);
}

.mr-hero-main {
  border-radius: 30px;
  padding: 28px;
  position: relative;
  overflow: hidden;
}

.mr-hero-main::after {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  right: -80px;
  top: -90px;
  background: rgba(88,228,222,.2);
}

.mr-breadcrumb {
  display: flex;
  gap: 6px;
  font-size: .76rem;
  color: #94a3b8;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.mr-breadcrumb span {
  color: #00a7a0;
  font-weight: 900;
}

.mr-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.35rem;
  font-weight: 900;
  letter-spacing: -.055em;
  line-height: 1.05;
  color: #0f172a;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.mr-sub {
  color: #64748b;
  line-height: 1.75;
  max-width: 760px;
  font-size: .95rem;
  position: relative;
  z-index: 1;
}

.mr-hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 22px;
  position: relative;
  z-index: 1;
}

.mr-btn {
  border: none;
  border-radius: 15px;
  padding: 12px 16px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
  transition: .18s;
}

.mr-btn.primary {
  background: linear-gradient(135deg, #00d4c8, #2dd4bf);
  color: #073b3a;
  box-shadow: 0 10px 24px rgba(45,212,191,.28);
}

.mr-btn.secondary {
  background: #fff;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.mr-btn:hover {
  transform: translateY(-2px);
}

.mr-hero-side {
  border-radius: 30px;
  padding: 24px;
  background:
    linear-gradient(135deg, rgba(15,23,42,.94), rgba(30,41,59,.9)),
    rgba(255,255,255,.75);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.mr-hero-side::after {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  right: -55px;
  top: -45px;
  background: rgba(88,228,222,.18);
}

.mr-side-label {
  font-size: .7rem;
  font-weight: 900;
  letter-spacing: .16em;
  color: #58e4de;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.mr-side-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: -.04em;
  margin-bottom: 6px;
  position: relative;
  z-index: 1;
}

.mr-side-text {
  color: #cbd5e1;
  line-height: 1.65;
  font-size: .88rem;
  position: relative;
  z-index: 1;
}

.mr-grid {
  display: grid;
  grid-template-columns: 1.25fr .75fr;
  gap: 22px;
  align-items: start;
}

.mr-card {
  border-radius: 30px;
  overflow: hidden;
}

.mr-image-wrap {
  position: relative;
  height: 320px;
  overflow: hidden;
  background: linear-gradient(135deg, #dff8f6, #eef8ff);
}

.mr-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: .4s ease;
}

.mr-card:hover .mr-image {
  transform: scale(1.04);
}

.mr-image-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 4rem;
}

.mr-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15,23,42,.58), transparent 58%);
}

.mr-img-price {
  position: absolute;
  bottom: 18px;
  left: 18px;
  background: rgba(15,23,42,.84);
  color: #fff;
  padding: 9px 14px;
  border-radius: 14px;
  font-size: .88rem;
  font-weight: 900;
}

.mr-img-status {
  position: absolute;
  top: 18px;
  left: 18px;
  background: rgba(255,255,255,.92);
  color: #334155;
  backdrop-filter: blur(8px);
  padding: 7px 12px;
  border-radius: 999px;
  font-size: .72rem;
  font-weight: 900;
  display: flex;
  gap: 7px;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.mr-img-status::before {
  content: "";
  width: 7px;
  height: 7px;
  background: #22c55e;
  border-radius: 50%;
}

.mr-main-pad {
  padding: 24px;
}

.mr-badge-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.mr-pill {
  padding: 7px 12px;
  border-radius: 999px;
  font-size: .72rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.pill-room {
  background: #ecfeff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.pill-full {
  background: #fee2e2;
  color: #b91c1c;
}

.pill-available {
  background: #ecfdf5;
  color: #047857;
}

.pill-maintenance {
  background: #fff7ed;
  color: #c2410c;
}

.mr-room-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -.04em;
  color: #0f172a;
  margin-bottom: 18px;
}

.mr-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.mr-info-box {
  background: #f8fafc;
  border: 1px solid #e8eef6;
  border-radius: 18px;
  padding: 16px;
}

.mr-info-label {
  font-size: .65rem;
  color: #94a3b8;
  font-weight: 900;
  letter-spacing: .1em;
  margin-bottom: 7px;
}

.mr-info-value {
  font-size: .96rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.4;
}

.mr-info-sub {
  margin-top: 5px;
  font-size: .78rem;
  color: #64748b;
  line-height: 1.5;
}

.mr-side {
  display: grid;
  gap: 20px;
}

.mr-side-card {
  border-radius: 28px;
  padding: 22px;
}

.mr-section-title,
.mr-side-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.05rem;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 5px;
}

.mr-section-sub,
.mr-side-sub {
  font-size: .84rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 16px;
}

.mr-progress-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: .82rem;
  margin-bottom: 8px;
}

.mr-progress-label,
.mr-progress-value {
  font-weight: 900;
  color: #475569;
}

.mr-track {
  height: 11px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.mr-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #00d4c8, #60a5fa);
}

.mr-meta-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.mr-meta-item {
  background: #f8fafc;
  border: 1px solid #e8eef6;
  border-radius: 16px;
  padding: 14px;
}

.mr-meta-kicker {
  font-size: .64rem;
  color: #94a3b8;
  font-weight: 900;
  letter-spacing: .09em;
  margin-bottom: 6px;
}

.mr-meta-value {
  font-size: .9rem;
  font-weight: 900;
  color: #0f172a;
}

.mr-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mr-amenity {
  padding: 9px 12px;
  border-radius: 999px;
  background: #ecfeff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  font-size: .78rem;
  font-weight: 900;
}

.mr-roommates-card {
  border-radius: 30px;
  padding: 24px;
}

.mr-roommates {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.mr-roommate {
  border: 1px solid #e8eef6;
  border-radius: 20px;
  padding: 16px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.mr-roommate-left {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.mr-avatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #00d4c8, #60a5fa);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 900;
  flex-shrink: 0;
}

.mr-name {
  font-size: .94rem;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 4px;
}

.mr-email {
  font-size: .78rem;
  color: #64748b;
  word-break: break-word;
}

.mr-status {
  padding: 6px 10px;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
  font-size: .72rem;
  font-weight: 900;
  white-space: nowrap;
}

.mr-empty {
  border-radius: 30px;
  padding: 60px 24px;
  text-align: center;
}

.mr-empty-icon {
  font-size: 3.4rem;
  margin-bottom: 12px;
}

.mr-empty-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.35rem;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 8px;
}

.mr-empty-sub {
  color: #64748b;
  line-height: 1.7;
  max-width: 620px;
  margin: 0 auto 20px;
}

@media (max-width: 1150px) {
  .mr-hero,
  .mr-grid {
    grid-template-columns: 1fr;
  }

  .mr-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .mr-root {
    padding: 16px;
  }

  .mr-title {
    font-size: 1.7rem;
  }

  .mr-info-grid,
  .mr-meta-list {
    grid-template-columns: 1fr;
  }

  .mr-image-wrap {
    height: 230px;
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
    } catch (err) {
      console.error(err);
      setRoom(null);
    } finally {
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
            <div className="mr-empty-icon">⏳</div>
            <div className="mr-empty-title">Loading room details...</div>
            <div className="mr-empty-sub">Please wait while we prepare your room information.</div>
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
            <button className="mr-btn primary" onClick={() => (window.location.href = "/rooms")}>
              Browse Rooms
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const usedSlots = Array.isArray(room.occupants) ? room.occupants.length : 0;
  const availableSlots = Math.max(0, Number(room.capacity || 0) - usedSlots);

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="mr-root">
        <div className="mr-shell">
          <div className="mr-hero">
            <div className="mr-hero-main">
              <div className="mr-breadcrumb">
                Dashboard › Student › <span>My Room</span>
              </div>

              <div className="mr-title">My Assigned Room</div>

              <div className="mr-sub">
                View your current room details, roommates, amenities, occupancy, and residence information.
              </div>

              <div className="mr-hero-actions">
                <button className="mr-btn primary" onClick={() => (window.location.href = "/warden-support")}>
                  Contact Warden
                </button>
                <button className="mr-btn secondary" onClick={() => (window.location.href = "/leaves")}>
                  Request Leave
                </button>
                <button className="mr-btn secondary" onClick={() => (window.location.href = "/rooms")}>
                  Browse Rooms
                </button>
              </div>
            </div>

            <div className="mr-hero-side">
              <div className="mr-side-label">CURRENT ROOM</div>
              <div className="mr-side-value">{room.roomNumber || "Room"}</div>
              <div className="mr-side-text">
                {room.type || "Standard Room"} · {room.location || room.wing || "Hostel Residence"}
              </div>
            </div>
          </div>

          <div className="mr-grid">
            <div className="mr-card">
              <div className="mr-image-wrap">
                {roomImage ? (
                  <img src={roomImage} alt="Room" className="mr-image" />
                ) : (
                  <div className="mr-image-fallback">🏢</div>
                )}

                <div className="mr-img-overlay" />
                <div className="mr-img-status">{room.status || "Assigned"}</div>
                <div className="mr-img-price">{formatLKR(room.price)} / month</div>
              </div>

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
                    <div className="mr-info-sub">Residence block location</div>
                  </div>

                  <div className="mr-info-box">
                    <div className="mr-info-label">CAPACITY</div>
                    <div className="mr-info-value">{room.capacity || "N/A"} students</div>
                    <div className="mr-info-sub">Maximum occupancy</div>
                  </div>

                  <div className="mr-info-box">
                    <div className="mr-info-label">PRICE</div>
                    <div className="mr-info-value">{formatLKR(room.price)}</div>
                    <div className="mr-info-sub">Monthly room fee</div>
                  </div>

                  <div className="mr-info-box">
                    <div className="mr-info-label">LOCATION</div>
                    <div className="mr-info-value">{room.location || room.wing || "N/A"}</div>
                    <div className="mr-info-sub">{room.district || "Hostel residence area"}</div>
                  </div>

                  <div className="mr-info-box">
                    <div className="mr-info-label">CONTACT</div>
                    <div className="mr-info-value">{room.contactNo || "N/A"}</div>
                    <div className="mr-info-sub">Room / hostel contact</div>
                  </div>

                  <div className="mr-info-box">
                    <div className="mr-info-label">ROOM STATUS</div>
                    <div className="mr-info-value">{room.status || "Assigned"}</div>
                    <div className="mr-info-sub">Current allocation state</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mr-side">
              <div className="mr-side-card">
                <div className="mr-side-title">Occupancy Overview</div>
                <div className="mr-side-sub">Current usage and available room slots</div>

                <div className="mr-progress-top">
                  <div className="mr-progress-label">Filled Slots</div>
                  <div className="mr-progress-value">
                    {usedSlots} / {room.capacity || 0}
                  </div>
                </div>

                <div className="mr-track">
                  <div className="mr-fill" style={{ width: `${occupancyPercent}%` }} />
                </div>

                <div className="mr-meta-list">
                  <div className="mr-meta-item">
                    <div className="mr-meta-kicker">AVAILABLE</div>
                    <div className="mr-meta-value">{availableSlots}</div>
                  </div>

                  <div className="mr-meta-item">
                    <div className="mr-meta-kicker">OCCUPANCY</div>
                    <div className="mr-meta-value">{occupancyPercent}%</div>
                  </div>

                  <div className="mr-meta-item">
                    <div className="mr-meta-kicker">ROOM TYPE</div>
                    <div className="mr-meta-value">{room.type || "N/A"}</div>
                  </div>

                  <div className="mr-meta-item">
                    <div className="mr-meta-kicker">STUDENTS</div>
                    <div className="mr-meta-value">{usedSlots}</div>
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
                    <>
                      {room.wifiAvailable && <span className="mr-amenity">📶 Wi-Fi</span>}
                      {room.mealIncluded && <span className="mr-amenity">🍛 Meals</span>}
                      {room.parkingAvailable && <span className="mr-amenity">🚗 Parking</span>}
                      {!room.wifiAvailable && !room.mealIncluded && !room.parkingAvailable && (
                        <span className="mr-amenity">🏠 Standard Facilities</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mr-card mr-roommates-card">
            <div className="mr-section-title">Roommates</div>
            <div className="mr-section-sub">Students currently assigned to this room</div>

            <div className="mr-roommates">
              {(room.occupants || []).length > 0 ? (
                room.occupants.map((student) => (
                  <div key={student._id || student.email || student.name} className="mr-roommate">
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
    </Layout>
  );
}

export default MyRoom;