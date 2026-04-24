import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.rm-root {
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  color: #111827;
  background:
    radial-gradient(circle at top left, rgba(88,228,222,.22), transparent 35%),
    radial-gradient(circle at top right, rgba(99,102,241,.16), transparent 32%),
    linear-gradient(135deg, #eef8f8 0%, #f6f7ff 45%, #f8fafc 100%);
}

.rm-page {
  padding: 30px;
  max-width: 1440px;
  margin: 0 auto;
}

.rm-hero {
  border-radius: 28px;
  padding: 28px;
  margin-bottom: 22px;
  background: rgba(255,255,255,.72);
  border: 1px solid rgba(255,255,255,.85);
  backdrop-filter: blur(20px);
  box-shadow: 0 18px 45px rgba(15,23,42,.08);
  display: grid;
  grid-template-columns: 1.3fr .9fr;
  gap: 18px;
  align-items: stretch;
}

.rm-title h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: -.05em;
  color: #0f172a;
  margin-bottom: 8px;
}

.rm-title p {
  font-size: .95rem;
  color: #64748b;
  line-height: 1.7;
  max-width: 680px;
}

.rm-hero-card {
  border-radius: 22px;
  padding: 20px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.rm-hero-card::after {
  content: "";
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  right: -45px;
  top: -50px;
  background: rgba(88,228,222,.18);
}

.rm-hero-card h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.rm-hero-card p {
  color: #cbd5e1;
  font-size: .85rem;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.rm-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 22px;
}

.rm-stat {
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(255,255,255,.9);
  backdrop-filter: blur(18px);
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 10px 28px rgba(15,23,42,.06);
}

.rm-stat-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1;
}

.rm-stat-label {
  margin-top: 7px;
  font-size: .72rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.rm-toolbar {
  background: rgba(255,255,255,.75);
  border: 1px solid rgba(255,255,255,.9);
  backdrop-filter: blur(18px);
  border-radius: 22px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 10px 28px rgba(15,23,42,.06);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.rm-search-wrap {
  position: relative;
  flex: 1;
  min-width: 240px;
}

.rm-search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.rm-input,
.rm-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  background: #fff;
  font-family: inherit;
  font-size: .9rem;
  color: #0f172a;
  outline: none;
  transition: .18s;
}

.rm-input {
  padding-left: 40px;
}

.rm-input:focus,
.rm-select:focus {
  border-color: #58e4de;
  box-shadow: 0 0 0 4px rgba(88,228,222,.14);
}

.rm-select {
  max-width: 175px;
  font-weight: 700;
}

.rm-count-chip {
  margin-left: auto;
  background: #0f172a;
  color: #fff;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: .82rem;
  font-weight: 800;
  white-space: nowrap;
}

.rm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 22px;
}

.rm-card {
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(255,255,255,.95);
  backdrop-filter: blur(18px);
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 14px 35px rgba(15,23,42,.08);
  transition: .24s ease;
  display: flex;
  flex-direction: column;
}

.rm-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 55px rgba(15,23,42,.14);
}

.rm-image-wrap {
  position: relative;
  height: 195px;
  overflow: hidden;
  background: linear-gradient(135deg, #dff7f5, #e5e7ff);
}

.rm-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: .4s;
}

.rm-card:hover .rm-image {
  transform: scale(1.06);
}

.rm-no-image {
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 3.3rem;
}

.rm-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15,23,42,.58), transparent 55%);
}

.rm-status {
  position: absolute;
  top: 13px;
  left: 13px;
  background: rgba(255,255,255,.9);
  color: #334155;
  backdrop-filter: blur(8px);
  padding: 6px 11px;
  border-radius: 999px;
  font-size: .7rem;
  font-weight: 900;
  display: flex;
  gap: 6px;
  align-items: center;
}

.rm-status::before {
  content: "";
  width: 7px;
  height: 7px;
  background: #22c55e;
  border-radius: 50%;
}

.rm-status.unavailable::before {
  background: #f59e0b;
}

.rm-type {
  position: absolute;
  top: 13px;
  right: 13px;
  background: #58e4de;
  color: #073b3a;
  padding: 6px 11px;
  border-radius: 999px;
  font-size: .68rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.rm-price {
  position: absolute;
  bottom: 13px;
  left: 13px;
  background: rgba(15,23,42,.84);
  color: #fff;
  padding: 8px 13px;
  border-radius: 12px;
  font-size: .85rem;
  font-weight: 800;
}

.rm-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.rm-topline {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.rm-room-number {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.35rem;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -.03em;
}

.rm-location {
  margin-top: 5px;
  color: #64748b;
  font-size: .86rem;
  line-height: 1.5;
}

.rm-room-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #eefdfa;
  color: #0f766e;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.rm-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.rm-meta-box {
  background: #f8fafc;
  border: 1px solid #e8eef6;
  border-radius: 14px;
  padding: 11px;
}

.rm-meta-label {
  font-size: .65rem;
  color: #94a3b8;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .08em;
  margin-bottom: 4px;
}

.rm-meta-value {
  font-size: .88rem;
  color: #0f172a;
  font-weight: 800;
}

.rm-occ {
  display: grid;
  gap: 7px;
}

.rm-occ-top {
  display: flex;
  justify-content: space-between;
  font-size: .78rem;
  color: #64748b;
  font-weight: 800;
}

.rm-occ-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.rm-occ-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #58e4de, #22c55e);
}

.rm-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.rm-feature {
  background: #ecfeff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: .72rem;
  font-weight: 800;
}

.rm-footer {
  margin-top: auto;
  padding-top: 4px;
}

.rm-btn {
  width: 100%;
  border: none;
  border-radius: 15px;
  padding: 13px 14px;
  background: linear-gradient(135deg, #58e4de, #2dd4bf);
  color: #073b3a;
  font-family: inherit;
  font-size: .9rem;
  font-weight: 900;
  cursor: pointer;
  transition: .18s;
  box-shadow: 0 8px 20px rgba(45,212,191,.28);
}

.rm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(45,212,191,.38);
}

.rm-btn:disabled {
  background: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.rm-message {
  grid-column: 1 / -1;
  background: rgba(255,255,255,.72);
  border: 1px solid rgba(255,255,255,.9);
  border-radius: 24px;
  padding: 70px 20px;
  text-align: center;
  color: #64748b;
  font-weight: 700;
  box-shadow: 0 12px 32px rgba(15,23,42,.06);
}

.rm-empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

@media (max-width: 980px) {
  .rm-hero {
    grid-template-columns: 1fr;
  }

  .rm-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .rm-select {
    max-width: none;
    flex: 1;
  }
}

@media (max-width: 650px) {
  .rm-page {
    padding: 16px;
  }

  .rm-title h1 {
    font-size: 1.65rem;
  }

  .rm-stats {
    grid-template-columns: 1fr;
  }

  .rm-grid {
    grid-template-columns: 1fr;
  }

  .rm-count-chip {
    width: 100%;
    text-align: center;
  }
}
`;

function Rooms() {
  const { showToast } = useToast();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState("");
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API}/rooms`);
      setRooms(Array.isArray(res.data) ? res.data : res.data.rooms || []);
    } catch (err) {
      showToast("Failed to load rooms", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const districts = useMemo(
    () => ["all", ...new Set(rooms.map((r) => r.district).filter(Boolean))],
    [rooms]
  );

  const types = useMemo(
    () => ["all", ...new Set(rooms.map((r) => r.type).filter(Boolean))],
    [rooms]
  );

  const filteredRooms = useMemo(() => {
    const q = search.toLowerCase();

    return rooms.filter((room) => {
      const roomStatus = (room.status || "").toLowerCase();

      const searchMatch =
        !q ||
        room.roomNumber?.toLowerCase().includes(q) ||
        room.location?.toLowerCase().includes(q) ||
        room.district?.toLowerCase().includes(q) ||
        room.type?.toLowerCase().includes(q);

      const districtMatch = district === "all" || room.district === district;
      const typeMatch = type === "all" || room.type === type;
      const statusMatch = status === "all" || roomStatus === status;

      return searchMatch && districtMatch && typeMatch && statusMatch;
    });
  }, [rooms, search, district, type, status]);

  const stats = useMemo(() => {
    const available = rooms.filter((r) => (r.status || "").toLowerCase() === "available").length;
    const occupied = rooms.filter((r) => (r.status || "").toLowerCase() !== "available").length;
    const avgPrice =
      rooms.length > 0
        ? Math.round(rooms.reduce((sum, r) => sum + Number(r.price || 0), 0) / rooms.length)
        : 0;

    return {
      total: rooms.length,
      available,
      occupied,
      avgPrice,
    };
  }, [rooms]);

  const handleRequest = async (roomId) => {
    try {
      setRequesting(roomId);
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/requests`,
        { roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Room requested successfully ✅", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Request failed ❌", "error");
    } finally {
      setRequesting("");
    }
  };

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="rm-root">
        <div className="rm-page">
          <div className="rm-hero">
            <div className="rm-title">
              <h1>Find Your Perfect Room</h1>
              <p>
                Explore available hostel rooms, compare facilities, check occupancy,
                and request the best room for your stay.
              </p>
            </div>

            <div className="rm-hero-card">
              <h3>Smart Room Selection</h3>
              <p>
                Choose rooms based on location, capacity, monthly fee, and facilities.
                Your request will be reviewed by the hostel admin.
              </p>
            </div>
          </div>

          <div className="rm-stats">
            <div className="rm-stat">
              <div className="rm-stat-value">{stats.total}</div>
              <div className="rm-stat-label">Total Rooms</div>
            </div>
            <div className="rm-stat">
              <div className="rm-stat-value">{stats.available}</div>
              <div className="rm-stat-label">Available</div>
            </div>
            <div className="rm-stat">
              <div className="rm-stat-value">{stats.occupied}</div>
              <div className="rm-stat-label">Occupied / Other</div>
            </div>
            <div className="rm-stat">
              <div className="rm-stat-value">
                LKR {Number(stats.avgPrice || 0).toLocaleString("en-LK")}
              </div>
              <div className="rm-stat-label">Average Fee</div>
            </div>
          </div>

          <div className="rm-toolbar">
            <div className="rm-search-wrap">
              <span className="rm-search-icon">🔍</span>
              <input
                className="rm-input"
                placeholder="Search room, location, district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select className="rm-select" value={district} onChange={(e) => setDistrict(e.target.value)}>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All Districts" : d}
                </option>
              ))}
            </select>

            <select className="rm-select" value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All Types" : t}
                </option>
              ))}
            </select>

            <select className="rm-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="full">Full</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <div className="rm-count-chip">
              {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} found
            </div>
          </div>

          <div className="rm-grid">
            {loading && (
              <div className="rm-message">
                <div className="rm-empty-icon">⏳</div>
                Loading rooms...
              </div>
            )}

            {!loading && filteredRooms.length === 0 && (
              <div className="rm-message">
                <div className="rm-empty-icon">🏠</div>
                No rooms match your filters.
              </div>
            )}

            {!loading &&
              filteredRooms.map((room) => {
                const img = room.images?.[0]
                  ? `http://localhost:5000/${room.images[0]}`
                  : null;

                const isAvailable = (room.status || "").toLowerCase() === "available";
                const occupants = room.occupants?.length || 0;
                const capacity = Number(room.capacity || 1);
                const occupancy = Math.min(Math.round((occupants / capacity) * 100), 100);

                return (
                  <div key={room._id} className="rm-card">
                    <div className="rm-image-wrap">
                      {img ? (
                        <img src={img} alt={room.roomNumber} className="rm-image" />
                      ) : (
                        <div className="rm-no-image">🏢</div>
                      )}

                      <div className="rm-overlay" />

                      <div className={`rm-status${isAvailable ? "" : " unavailable"}`}>
                        {room.status || "Unknown"}
                      </div>

                      {room.type && <div className="rm-type">{room.type}</div>}

                      <div className="rm-price">
                        LKR {Number(room.price || 0).toLocaleString("en-LK")} / month
                      </div>
                    </div>

                    <div className="rm-body">
                      <div className="rm-topline">
                        <div>
                          <div className="rm-room-number">{room.roomNumber || "Room"}</div>
                          <div className="rm-location">
                            📍 {[room.location, room.district].filter(Boolean).join(", ") || "Campus"}
                          </div>
                        </div>
                        <div className="rm-room-icon">🛏️</div>
                      </div>

                      <div className="rm-meta">
                        <div className="rm-meta-box">
                          <div className="rm-meta-label">Capacity</div>
                          <div className="rm-meta-value">{capacity} Students</div>
                        </div>
                        <div className="rm-meta-box">
                          <div className="rm-meta-label">Occupants</div>
                          <div className="rm-meta-value">{occupants}/{capacity}</div>
                        </div>
                        <div className="rm-meta-box">
                          <div className="rm-meta-label">Type</div>
                          <div className="rm-meta-value">{room.type || "N/A"}</div>
                        </div>
                        <div className="rm-meta-box">
                          <div className="rm-meta-label">Status</div>
                          <div className="rm-meta-value">{room.status || "N/A"}</div>
                        </div>
                      </div>

                      <div className="rm-occ">
                        <div className="rm-occ-top">
                          <span>Occupancy</span>
                          <span>{occupancy}%</span>
                        </div>
                        <div className="rm-occ-bar">
                          <div className="rm-occ-fill" style={{ width: `${occupancy}%` }} />
                        </div>
                      </div>

                      <div className="rm-features">
                        {room.wifiAvailable && <span className="rm-feature">📶 Wi-Fi</span>}
                        {room.mealIncluded && <span className="rm-feature">🍛 Meals</span>}
                        {room.parkingAvailable && <span className="rm-feature">🚗 Parking</span>}
                        {!room.wifiAvailable && !room.mealIncluded && !room.parkingAvailable && (
                          <span className="rm-feature">🏠 Standard Facilities</span>
                        )}
                      </div>

                      <div className="rm-footer">
                        <button
                          className="rm-btn"
                          disabled={!isAvailable || requesting === room._id}
                          onClick={() => handleRequest(room._id)}
                        >
                          {requesting === room._id
                            ? "Requesting..."
                            : isAvailable
                            ? "Request Room →"
                            : "Currently Unavailable"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Rooms;