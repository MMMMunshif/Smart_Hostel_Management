import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.rm-root {
  font-family: 'DM Sans', sans-serif;
  background: #f4f7fb;
  min-height: 100vh;
  color: #111827;
}

.rm-page {
  padding: 28px;
}

/* ── HEADER ── */
.rm-header {
  margin-bottom: 24px;
}

.rm-header h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111827;
  margin-bottom: 4px;
}

.rm-header p {
  font-size: 0.92rem;
  color: #6b7280;
}

/* ── FILTER BAR ── */
.rm-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.rm-search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 340px;
}

.rm-search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #9ca3af;
  pointer-events: none;
}

.rm-search {
  width: 100%;
  padding: 11px 14px 11px 38px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: #111827;
  outline: none;
  box-shadow: 0 2px 8px rgba(17,24,39,0.04);
  transition: border-color 0.18s, box-shadow 0.18s;
}

.rm-search:focus {
  border-color: #58e4de;
  box-shadow: 0 0 0 3px rgba(88,228,222,0.15);
}

.rm-select {
  padding: 11px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: #374151;
  outline: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(17,24,39,0.04);
  transition: border-color 0.18s;
}

.rm-select:focus {
  border-color: #58e4de;
}

.rm-count-chip {
  margin-left: auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #6b7280;
  box-shadow: 0 2px 8px rgba(17,24,39,0.04);
  white-space: nowrap;
}

/* ── GRID ── */
.rm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
}

/* ── CARD ── */
.rm-card {
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(17,24,39,0.05);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  display: flex;
  flex-direction: column;
}

.rm-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(17,24,39,0.10);
}

/* Image area */
.rm-image-wrap {
  position: relative;
  height: 175px;
  overflow: hidden;
  background: linear-gradient(135deg, #dff7f5, #e4eefb);
}

.rm-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.rm-card:hover .rm-image {
  transform: scale(1.04);
}

.rm-no-image {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
}

.rm-price-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(15, 20, 30, 0.82);
  backdrop-filter: blur(6px);
  color: #fff;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.rm-type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #58e4de;
  color: #0f3d3c;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.rm-status-dot {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(6px);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #374151;
}

.rm-status-dot::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
}

.rm-status-dot.unavailable::before {
  background: #f59e0b;
}

/* Card body */
.rm-body {
  padding: 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rm-room-number {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.rm-location {
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rm-meta-row {
  display: flex;
  gap: 8px;
}

.rm-meta-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f4f6fa;
  border: 1px solid #ebeef5;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
}

.rm-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.rm-feature {
  background: #f0fffe;
  border: 1px solid #c4f4f2;
  color: #0f7b78;
  border-radius: 8px;
  padding: 4px 9px;
  font-size: 0.72rem;
  font-weight: 700;
}

.rm-divider {
  border: none;
  border-top: 1px solid #f0f3f7;
}

/* Request button */
.rm-btn {
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 13px;
  background: #58e4de;
  color: #0a3534;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.18s, transform 0.15s;
  margin-top: auto;
}

.rm-btn:hover {
  background: #3dd6d0;
  transform: translateY(-1px);
}

.rm-btn:active {
  transform: translateY(0);
}

/* ── EMPTY / LOADING ── */
.rm-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-size: 1rem;
}

.rm-empty-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

/* ── RESPONSIVE ── */
@media (max-width: 700px) {
  .rm-page { padding: 16px; }
  .rm-count-chip { display: none; }
}
`;

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [type, setType] = useState("all");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API}/rooms`);
        setRooms(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const searchMatch =
        !search ||
        room.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
        room.location?.toLowerCase().includes(search.toLowerCase()) ||
        room.district?.toLowerCase().includes(search.toLowerCase());
      const districtMatch = district === "all" || room.district === district;
      const typeMatch = type === "all" || room.type === type;
      return searchMatch && districtMatch && typeMatch;
    });
  }, [rooms, search, district, type]);

  const handleRequest = async (roomId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/requests`,
        { roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Room requested successfully ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Request failed ❌");
    }
  };

  const districts = ["all", ...new Set(rooms.map((r) => r.district).filter(Boolean))];

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="rm-root">
        <div className="rm-page">

          {/* HEADER */}
          <div className="rm-header">
            <h1>Available Rooms</h1>
            <p>Browse and request your ideal hostel accommodation.</p>
          </div>

          {/* FILTER BAR */}
          <div className="rm-filters">
            <div className="rm-search-wrap">
              <span className="rm-search-icon">🔍</span>
              <input
                className="rm-search"
                placeholder="Search room, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="rm-select"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All Districts" : d}
                </option>
              ))}
            </select>

            <select
              className="rm-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option>Single</option>
              <option>Double</option>
              <option>Quad</option>
            </select>

            <div className="rm-count-chip">
              {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* GRID */}
          <div className="rm-grid">
            {loading && (
              <div className="rm-message">
                <div className="rm-empty-icon">⏳</div>
                <div>Loading rooms...</div>
              </div>
            )}

            {!loading && filteredRooms.length === 0 && (
              <div className="rm-message">
                <div className="rm-empty-icon">🏠</div>
                <div>No rooms match your filters.</div>
              </div>
            )}

            {filteredRooms.map((room) => {
              const img = room.images?.[0]
                ? `http://localhost:5000/${room.images[0]}`
                : null;

              const isAvailable = (room.status || "").toLowerCase() === "available";

              return (
                <div key={room._id} className="rm-card">

                  {/* IMAGE */}
                  <div className="rm-image-wrap">
                    {img ? (
                      <img src={img} alt={room.roomNumber} className="rm-image" />
                    ) : (
                      <div className="rm-no-image">🏢</div>
                    )}

                    <div className={`rm-status-dot${isAvailable ? "" : " unavailable"}`}>
                      {isAvailable ? "Available" : "Occupied"}
                    </div>

                    {room.type && (
                      <div className="rm-type-badge">{room.type}</div>
                    )}

                    <div className="rm-price-badge">
                      LKR {Number(room.price || 0).toLocaleString("en-LK")} / month
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="rm-body">
                    <div>
                      <div className="rm-room-number">{room.roomNumber}</div>
                      <div className="rm-location">
                        📍 {[room.location, room.district].filter(Boolean).join(", ")}
                      </div>
                    </div>

                    <div className="rm-meta-row">
                      {room.capacity && (
                        <div className="rm-meta-chip">👥 {room.capacity} Students</div>
                      )}
                      {room.type && (
                        <div className="rm-meta-chip">🛏 {room.type}</div>
                      )}
                    </div>

                    {(room.wifiAvailable || room.mealIncluded || room.parkingAvailable) && (
                      <div className="rm-features">
                        {room.wifiAvailable && <span className="rm-feature">📶 Wi-Fi</span>}
                        {room.mealIncluded && <span className="rm-feature">🍛 Meals</span>}
                        {room.parkingAvailable && <span className="rm-feature">🚗 Parking</span>}
                      </div>
                    )}

                    <hr className="rm-divider" />

                    <button
                      className="rm-btn"
                      onClick={() => handleRequest(room._id)}
                    >
                      Request Room →
                    </button>
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