import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .mr-root {
    font-family: 'DM Sans', sans-serif;
    background: #f0f2f7;
    min-height: 100vh;
    padding: 32px;
    color: #0f1117;
  }

  .mr-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 26px;
    animation: fadeUp .35s ease both;
    flex-wrap: wrap;
  }

  .mr-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #9aa0b0;
    margin-bottom: 6px;
  }

  .mr-breadcrumb span {
    color: #00c4b8;
    font-weight: 600;
  }

  .mr-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: #0f1117;
    letter-spacing: -0.03em;
    margin-bottom: 4px;
  }

  .mr-header p {
    font-size: 0.82rem;
    color: #8a90a2;
  }

  .mr-header-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-outline {
    padding: 10px 16px;
    border: 1.5px solid #e2e7f0;
    border-radius: 11px;
    background: #fff;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 700;
    color: #4f5668;
    cursor: pointer;
    transition: all .2s;
  }

  .btn-outline:hover {
    border-color: #00d4c8;
    color: #00a99f;
  }

  .btn-primary {
    padding: 10px 16px;
    border: none;
    border-radius: 11px;
    background: #00d4c8;
    color: #fff;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all .2s;
    box-shadow: 0 6px 18px rgba(0, 212, 200, .26);
  }

  .btn-primary:hover {
    opacity: .9;
    transform: translateY(-1px);
  }

  .mr-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 22px;
  }

  .mr-stat {
    background: #fff;
    border: 1px solid #e8eaf0;
    border-radius: 18px;
    padding: 18px 20px;
    animation: fadeUp .4s ease both;
  }

  .mr-stat:nth-child(1){animation-delay:.04s}
  .mr-stat:nth-child(2){animation-delay:.08s}
  .mr-stat:nth-child(3){animation-delay:.12s}
  .mr-stat:nth-child(4){animation-delay:.16s}

  .mr-stat-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .mr-stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: #e8faf9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .mr-stat-chip {
    font-size: 0.66rem;
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 99px;
  }

  .chip-info { background: #e8f4ff; color: #2563eb; }
  .chip-success { background: #e6faf2; color: #00a36c; }
  .chip-warn { background: #fff8e6; color: #d4800a; }
  .chip-danger { background: #fff0f0; color: #e05555; }

  .mr-stat-val {
    font-size: 1.65rem;
    font-weight: 800;
    color: #0f1117;
    line-height: 1;
  }

  .mr-stat-lbl {
    font-size: 0.73rem;
    color: #98a0b0;
    margin-top: 5px;
  }

  .mr-panel {
    background: #fff;
    border: 1px solid #e8eaf0;
    border-radius: 20px;
    overflow: hidden;
    animation: fadeUp .42s ease .1s both;
  }

  .mr-panel-top {
    padding: 18px 20px;
    border-bottom: 1px solid #eef1f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .mr-panel-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #0f1117;
  }

  .mr-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .mr-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1.5px solid #e8eaf0;
    border-radius: 11px;
    padding: 10px 14px;
    min-width: 260px;
  }

  .mr-search input {
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.82rem;
    color: #0f1117;
    width: 100%;
  }

  .mr-search input::placeholder {
    color: #b0b6c8;
  }

  .mr-select {
    padding: 10px 14px;
    border: 1.5px solid #e8eaf0;
    border-radius: 11px;
    background: #fff;
    font-family: inherit;
    font-size: 0.8rem;
    color: #4f5668;
    outline: none;
  }

  .mr-grid {
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 18px;
  }

  .room-card {
    background: #fff;
    border: 1px solid #e9edf5;
    border-radius: 18px;
    overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }

  .room-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 36px rgba(15, 17, 23, .08);
    border-color: #d6f3f0;
  }

  .room-image-wrap {
    position: relative;
    height: 190px;
    overflow: hidden;
    background: linear-gradient(135deg, #e8faf9, #dff5ff);
  }

  .room-image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .room-image-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .room-status {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 5px 10px;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 800;
    background: rgba(255,255,255,.92);
    display: flex;
    align-items: center;
    gap: 6px;
    backdrop-filter: blur(8px);
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }

  .dot.available { background: #00c48c; }
  .dot.full { background: #ff5c72; }
  .dot.maintenance { background: #f59e0b; }

  .room-price {
    position: absolute;
    left: 12px;
    bottom: 12px;
    padding: 6px 10px;
    border-radius: 9px;
    font-size: 0.76rem;
    font-weight: 800;
    background: rgba(15,17,23,.72);
    color: #fff;
    backdrop-filter: blur(8px);
  }

  .room-body {
    padding: 16px 16px 16px;
  }

  .room-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 6px;
  }

  .room-number {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: #0f1117;
  }

  .room-type {
    font-size: 0.72rem;
    font-weight: 700;
    color: #00a99f;
    background: #e8faf9;
    padding: 4px 8px;
    border-radius: 999px;
    white-space: nowrap;
  }

  .room-location {
    font-size: 0.76rem;
    color: #8e96a8;
    margin-bottom: 14px;
    line-height: 1.45;
  }

  .room-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
  }

  .room-meta {
    background: #f7f9fc;
    border: 1px solid #edf1f7;
    border-radius: 12px;
    padding: 10px 12px;
  }

  .room-meta-lbl {
    font-size: 0.64rem;
    color: #9aa1b1;
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-bottom: 4px;
  }

  .room-meta-val {
    font-size: 0.77rem;
    font-weight: 700;
    color: #0f1117;
    line-height: 1.4;
    word-break: break-word;
  }

  .room-features {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 14px;
  }

  .room-feature {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 5px 9px;
    border-radius: 999px;
    background: #f5f7fb;
    color: #5f6678;
    border: 1px solid #ecf0f7;
  }

  .room-amenities {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;
  }

  .room-amenity {
    font-size: 0.67rem;
    font-weight: 600;
    color: #6e7586;
    background: #f6f7fb;
    padding: 4px 8px;
    border-radius: 8px;
  }

  .room-occ-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.73rem;
    color: #8e96a8;
    margin-bottom: 6px;
  }

  .room-occ-row strong {
    color: #0f1117;
  }

  .occ-track {
    height: 6px;
    border-radius: 999px;
    overflow: hidden;
    background: #eef2f8;
    margin-bottom: 14px;
  }

  .occ-fill {
    height: 100%;
    border-radius: 999px;
  }

  .fill-available { background: #00d4c8; }
  .fill-full { background: #ff5c72; }
  .fill-maintenance { background: #f59e0b; }

  .room-actions {
    display: flex;
    gap: 10px;
  }

  .action-btn {
    flex: 1;
    border: none;
    border-radius: 11px;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    transition: all .2s;
  }

  .btn-view {
    background: #f5f7fb;
    color: #566074;
  }

  .btn-view:hover {
    background: #ebf6f5;
    color: #00a99f;
  }

  .btn-delete {
    background: #fff1f1;
    color: #e05555;
  }

  .btn-delete:hover {
    background: #ffe4e4;
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 48px 18px;
    color: #96a0b2;
    font-size: 0.88rem;
  }

 

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1100px) {
    .mr-stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 760px) {
    .mr-root {
      padding: 16px;
    }

    .mr-stats {
      grid-template-columns: 1fr;
    }

    .mr-search {
      min-width: 100%;
    }

    .mr-grid {
      grid-template-columns: 1fr;
      padding: 16px;
    }
  }
`;

function formatLKR(value) {
  const num = Number(value || 0);
  return `LKR ${num.toLocaleString("en-LK")}`;
}

function normalize(v = "") {
  return v.toString().toLowerCase().trim();
}

function RoomCard({ room, onDelete, onView }) {
  const firstImage = room.images?.[0];
  const imgSrc = firstImage ? `http://localhost:5000/${firstImage}` : null;

  const status = room.status || "Available";
  const statusClass =
    normalize(status) === "full"
      ? "full"
      : normalize(status) === "maintenance"
      ? "maintenance"
      : "available";

  const occupancy = room.capacity > 0
    ? Math.round(((room.occupants?.length || 0) / room.capacity) * 100)
    : 0;

  const features = [
    room.genderCategory,
    room.bathroomType,
    room.wifiAvailable ? "Wi-Fi" : null,
    room.mealIncluded ? "Meals" : null,
    room.parkingAvailable ? "Parking" : null,
    room.securityAvailable ? "Security" : null,
  ].filter(Boolean);

  return (
    <div className="room-card">
      <div className="room-image-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={room.roomNumber} />
        ) : (
          <div className="room-image-fallback">🏠</div>
        )}

        <div className="room-status">
          <span className={`dot ${statusClass}`} />
          {status}
        </div>

        <div className="room-price">
          {formatLKR(room.price)} / month
        </div>
      </div>

      <div className="room-body">
        <div className="room-top">
          <div className="room-number">{room.roomNumber}</div>
          <div className="room-type">{room.type}</div>
        </div>

        <div className="room-location">
          📍 {room.location || "Location not set"}, {room.district || "District not set"}
          <br />
          {room.address || "Address not provided"}
        </div>

        <div className="room-meta-grid">
          <div className="room-meta">
            <div className="room-meta-lbl">Contact</div>
            <div className="room-meta-val">{room.contactNumber || "N/A"}</div>
          </div>

          <div className="room-meta">
            <div className="room-meta-lbl">Distance</div>
            <div className="room-meta-val">{room.distanceToCampus || "N/A"}</div>
          </div>

          <div className="room-meta">
            <div className="room-meta-lbl">Capacity</div>
            <div className="room-meta-val">{room.capacity || 0} Students</div>
          </div>

          <div className="room-meta">
            <div className="room-meta-lbl">Available From</div>
            <div className="room-meta-val">
              {room.availableFrom
                ? new Date(room.availableFrom).toLocaleDateString()
                : "Immediate"}
            </div>
          </div>
        </div>

        {features.length > 0 && (
          <div className="room-features">
            {features.map((item, index) => (
              <span key={index} className="room-feature">{item}</span>
            ))}
          </div>
        )}

        {room.amenities?.length > 0 && (
          <div className="room-amenities">
            {room.amenities.slice(0, 5).map((item, index) => (
              <span key={index} className="room-amenity">{item}</span>
            ))}
            {room.amenities.length > 5 && (
              <span className="room-amenity">+{room.amenities.length - 5}</span>
            )}
          </div>
        )}

        <div className="room-occ-row">
          <span>Occupancy</span>
          <strong>{room.occupants?.length || 0} / {room.capacity || 0}</strong>
        </div>

        <div className="occ-track">
          <div
            className={`occ-fill fill-${statusClass}`}
            style={{ width: `${occupancy}%` }}
          />
        </div>

        <div className="room-actions">
          <button className="action-btn btn-view" onClick={() => onView(room)}>
            View Details
          </button>
          <button className="action-btn btn-delete" onClick={() => onDelete(room._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ManageRooms() {
  const navigate = useNavigate();
  const { setToast } = useToast();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API}/rooms`);
      const data = Array.isArray(res.data) ? res.data : res.data.rooms || [];
      setRooms(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      showToast("Failed to load rooms", "error");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this room?");
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast("Room deleted successfully");
      fetchRooms();
    } catch (err) {
      console.error(err);
      showToast("Delete failed", "error");
    }
  };

  const handleView = (room) => {
    alert(
      `Room: ${room.roomNumber}\n` +
      `Location: ${room.location}, ${room.district}\n` +
      `Contact: ${room.contactNumber}\n` +
      `Rent: ${formatLKR(room.price)}\n` +
      `Status: ${room.status}`
    );
  };

  const districts = useMemo(() => {
    return ["all", ...new Set(rooms.map((r) => r.district).filter(Boolean))];
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        !searchValue ||
        room.roomNumber?.toLowerCase().includes(searchValue) ||
        room.location?.toLowerCase().includes(searchValue) ||
        room.district?.toLowerCase().includes(searchValue) ||
        room.address?.toLowerCase().includes(searchValue) ||
        room.contactNumber?.toLowerCase().includes(searchValue);

      const matchesDistrict =
        districtFilter === "all" || room.district === districtFilter;

      const matchesStatus =
        statusFilter === "all" ||
        normalize(room.status) === normalize(statusFilter);

      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [rooms, search, districtFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: rooms.length,
      available: rooms.filter((r) => normalize(r.status) === "available").length,
      full: rooms.filter((r) => normalize(r.status) === "full").length,
      maintenance: rooms.filter((r) => normalize(r.status) === "maintenance").length,
    };
  }, [rooms]);

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="mr-root">
        <div className="mr-header">
          <div>
            <div className="mr-breadcrumb">
              Dashboard › Admin › <span>Manage Rooms</span>
            </div>
            <h1>Manage Rooms</h1>
            <p>View, filter, and control all hostel rooms with Sri Lanka-specific details.</p>
          </div>

          <div className="mr-header-actions">
            <button className="btn-outline" onClick={fetchRooms}>↻ Refresh</button>
            <button className="btn-primary" onClick={() => navigate("/admin/add-room")}>
              ➕ Add New Room
            </button>
          </div>
        </div>

        <div className="mr-stats">
          <div className="mr-stat">
            <div className="mr-stat-top">
              <div className="mr-stat-icon">🏠</div>
              <div className="mr-stat-chip chip-info">All</div>
            </div>
            <div className="mr-stat-val">{stats.total}</div>
            <div className="mr-stat-lbl">Total Rooms</div>
          </div>

          <div className="mr-stat">
            <div className="mr-stat-top">
              <div className="mr-stat-icon">✅</div>
              <div className="mr-stat-chip chip-success">Open</div>
            </div>
            <div className="mr-stat-val">{stats.available}</div>
            <div className="mr-stat-lbl">Available Rooms</div>
          </div>

          <div className="mr-stat">
            <div className="mr-stat-top">
              <div className="mr-stat-icon">🛏️</div>
              <div className="mr-stat-chip chip-danger">Full</div>
            </div>
            <div className="mr-stat-val">{stats.full}</div>
            <div className="mr-stat-lbl">Full Rooms</div>
          </div>

          <div className="mr-stat">
            <div className="mr-stat-top">
              <div className="mr-stat-icon">🔧</div>
              <div className="mr-stat-chip chip-warn">Check</div>
            </div>
            <div className="mr-stat-val">{stats.maintenance}</div>
            <div className="mr-stat-lbl">Maintenance</div>
          </div>
        </div>

        <div className="mr-panel">
          <div className="mr-panel-top">
            <div className="mr-panel-title">Room Inventory</div>

            <div className="mr-filters">
              <div className="mr-search">
                <span style={{ color: "#b0b6c8" }}>🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search room, district, location, address..."
                />
              </div>

              <select
                className="mr-select"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d === "all" ? "All Districts" : d}
                  </option>
                ))}
              </select>

              <select
                className="mr-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="full">Full</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="mr-grid">
            {loading && <div className="empty-state">Loading rooms...</div>}

            {!loading && filteredRooms.length === 0 && (
              <div className="empty-state">No rooms found for the selected filters.</div>
            )}

            {!loading &&
              filteredRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
          </div>
        </div>

       
      </div>
    </Layout>
  );
}

export default ManageRooms;