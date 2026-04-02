import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";


const API = "http://localhost:5000/api";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [type, setType] = useState("all");

  // FETCH ROOMS
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API}/rooms`);
        setRooms(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // FILTER
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const searchMatch =
        !search ||
        room.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
        room.location?.toLowerCase().includes(search.toLowerCase()) ||
        room.district?.toLowerCase().includes(search.toLowerCase());

      const districtMatch =
        district === "all" || room.district === district;

      const typeMatch =
        type === "all" || room.type === type;

      return searchMatch && districtMatch && typeMatch;
    });
  }, [rooms, search, district, type]);

  // REQUEST ROOM
  const handleRequest = async (roomId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/requests`,
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Room requested successfully ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Request failed ❌");
    }
  };

  // UNIQUE DISTRICTS
  const districts = [
    "all",
    ...new Set(rooms.map((r) => r.district).filter(Boolean)),
  ];

  return (
    <Layout role="student">
      <div style={styles.container}>
        <h1 style={styles.title}>🏠 Available Rooms</h1>

        {/* FILTER BAR */}
        <div style={styles.filters}>
          <input
            placeholder="Search room, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            style={styles.select}
          >
            {districts.map((d) => (
              <option key={d}>{d === "all" ? "All Districts" : d}</option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Types</option>
            <option>Single</option>
            <option>Double</option>
            <option>Quad</option>
          </select>
        </div>

        {/* ROOMS GRID */}
        <div style={styles.grid}>
          {loading && <p>Loading...</p>}

          {!loading && filteredRooms.length === 0 && (
            <p>No rooms found</p>
          )}

          {filteredRooms.map((room) => {
            const img = room.images?.[0]
              ? `http://localhost:5000/${room.images[0]}`
              : null;

            return (
              <div key={room._id} style={styles.card}>
                {/* IMAGE */}
                <div style={styles.imageWrap}>
                  {img ? (
                    <img src={img} alt="" style={styles.image} />
                  ) : (
                    <div style={styles.noImage}>🏠</div>
                  )}

                  <div style={styles.price}>
                    LKR {room.price}/month
                  </div>
                </div>

                {/* BODY */}
                <div style={styles.body}>
                  <h3>{room.roomNumber}</h3>
                  <p style={styles.location}>
                    📍 {room.location}, {room.district}
                  </p>

                  <div style={styles.meta}>
                    <span>👥 {room.capacity}</span>
                    <span>🛏 {room.type}</span>
                  </div>

                  <div style={styles.features}>
                    {room.wifiAvailable && <span>📶 WiFi</span>}
                    {room.mealIncluded && <span>🍛 Meals</span>}
                    {room.parkingAvailable && <span>🚗 Parking</span>}
                  </div>

                  <button
                    style={styles.btn}
                    onClick={() => handleRequest(room._id)}
                  >
                    Request Room
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default Rooms;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "30px",
    background: "#f4f6fb",
    minHeight: "100vh",
  },

  title: {
    fontSize: "26px",
    marginBottom: "20px",
    fontWeight: "bold",
  },

  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    width: "200px",
  },

  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },

  imageWrap: {
    height: "160px",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  noImage: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
  },

  price: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    background: "black",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "6px",
  },

  body: {
    padding: "15px",
  },

  location: {
    fontSize: "14px",
    color: "#777",
  },

  meta: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 0",
  },

  features: {
    display: "flex",
    gap: "10px",
    fontSize: "13px",
    marginBottom: "10px",
  },

  btn: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#00bfa6",
    color: "#fff",
    cursor: "pointer",
  },
};