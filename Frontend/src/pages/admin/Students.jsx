import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .st-root {
    font-family: 'DM Sans', sans-serif;
    background: #f0f2f7;
    min-height: 100vh;
    padding: 32px;
    color: #0f1117;
  }

  .st-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 26px;
    animation: fadeUp .35s ease both;
    flex-wrap: wrap;
  }

  .st-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #9aa0b0;
    margin-bottom: 6px;
  }

  .st-breadcrumb span {
    color: #00c4b8;
    font-weight: 600;
  }

  .st-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: #0f1117;
    letter-spacing: -0.03em;
    margin-bottom: 4px;
  }

  .st-header p {
    font-size: 0.82rem;
    color: #8a90a2;
  }

  .st-header-actions {
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

  .st-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 22px;
  }

  .st-stat {
    background: #fff;
    border: 1px solid #e8eaf0;
    border-radius: 18px;
    padding: 18px 20px;
    animation: fadeUp .4s ease both;
  }

  .st-stat:nth-child(1){animation-delay:.04s}
  .st-stat:nth-child(2){animation-delay:.08s}
  .st-stat:nth-child(3){animation-delay:.12s}
  .st-stat:nth-child(4){animation-delay:.16s}

  .st-stat-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .st-stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: #e8faf9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .st-stat-chip {
    font-size: 0.66rem;
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 99px;
  }

  .chip-info { background: #e8f4ff; color: #2563eb; }
  .chip-success { background: #e6faf2; color: #00a36c; }
  .chip-warn { background: #fff8e6; color: #d4800a; }
  .chip-dark { background: #eef1f6; color: #4b5565; }

  .st-stat-val {
    font-size: 1.65rem;
    font-weight: 800;
    color: #0f1117;
    line-height: 1;
  }

  .st-stat-lbl {
    font-size: 0.73rem;
    color: #98a0b0;
    margin-top: 5px;
  }

  .st-panel {
    background: #fff;
    border: 1px solid #e8eaf0;
    border-radius: 20px;
    overflow: hidden;
    animation: fadeUp .42s ease .1s both;
  }

  .st-panel-top {
    padding: 18px 20px;
    border-bottom: 1px solid #eef1f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .st-panel-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #0f1117;
  }

  .st-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .st-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1.5px solid #e8eaf0;
    border-radius: 11px;
    padding: 10px 14px;
    min-width: 260px;
  }

  .st-search input {
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.82rem;
    color: #0f1117;
    width: 100%;
  }

  .st-search input::placeholder {
    color: #b0b6c8;
  }

  .st-select {
    padding: 10px 14px;
    border: 1.5px solid #e8eaf0;
    border-radius: 11px;
    background: #fff;
    font-family: inherit;
    font-size: 0.8rem;
    color: #4f5668;
    outline: none;
  }

  .student-grid {
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 18px;
  }

  .student-card {
    background: #fff;
    border: 1px solid #e9edf5;
    border-radius: 18px;
    overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }

  .student-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 36px rgba(15, 17, 23, .08);
    border-color: #d6f3f0;
  }

  .student-top {
    padding: 16px 16px 14px;
    background: linear-gradient(135deg, #fbfcff, #f6fbfb);
    border-bottom: 1px solid #eef2f7;
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .student-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d4c8, #0099a8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.84rem;
    font-weight: 800;
    flex-shrink: 0;
  }

  .student-main {
    min-width: 0;
    flex: 1;
  }

  .student-name {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: #0f1117;
    margin-bottom: 3px;
  }

  .student-email {
    font-size: 0.76rem;
    color: #8e96a8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .student-role {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 999px;
    background: #e8faf9;
    color: #00a99f;
    white-space: nowrap;
  }

  .student-body {
    padding: 16px;
  }

  .student-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
  }

  .student-meta {
    background: #f7f9fc;
    border: 1px solid #edf1f7;
    border-radius: 12px;
    padding: 10px 12px;
  }

  .student-meta-lbl {
    font-size: 0.64rem;
    color: #9aa1b1;
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-bottom: 4px;
  }

  .student-meta-val {
    font-size: 0.77rem;
    font-weight: 700;
    color: #0f1117;
    line-height: 1.4;
    word-break: break-word;
  }

  .pref-block {
    border: 1px solid #edf1f7;
    background: #fafbfd;
    border-radius: 14px;
    padding: 12px;
    margin-bottom: 14px;
  }

  .pref-title {
    font-size: 0.72rem;
    font-weight: 800;
    color: #0f1117;
    margin-bottom: 8px;
  }

  .pref-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .pref-chip {
    font-size: 0.67rem;
    font-weight: 700;
    padding: 5px 9px;
    border-radius: 999px;
    background: #f5f7fb;
    color: #5f6678;
    border: 1px solid #ecf0f7;
  }

  .student-actions {
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

  .btn-soft {
    background: #f5f7fb;
    color: #566074;
  }

  .btn-soft:hover {
    background: #ebf6f5;
    color: #00a99f;
  }

  .btn-danger {
    background: #fff1f1;
    color: #e05555;
  }

  .btn-danger:hover {
    background: #ffe4e4;
  }

  .btn-disabled {
    background: #f5f6f8;
    color: #a0a7b5;
    cursor: default;
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 48px 18px;
    color: #96a0b2;
    font-size: 0.88rem;
  }

  .toast {
    position: fixed;
    right: 28px;
    bottom: 28px;
    z-index: 9999;
    padding: 14px 18px;
    border-radius: 12px;
    color: #fff;
    font-size: 0.84rem;
    font-weight: 700;
    box-shadow: 0 10px 28px rgba(0,0,0,.14);
    animation: fadeUp .3s ease;
  }

  .toast.success { background: #00c48c; }
  .toast.error { background: #ff5c72; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1100px) {
    .st-stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 760px) {
    .st-root {
      padding: 16px;
    }

    .st-stats {
      grid-template-columns: 1fr;
    }

    .st-search {
      min-width: 100%;
    }

    .student-grid {
      grid-template-columns: 1fr;
      padding: 16px;
    }
  }
`;

function initialsFromName(name = "Student") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalize(v = "") {
  return v.toString().toLowerCase().trim();
}

function formatPreferenceLabel(key, value) {
  if (value === "" || value === null || value === undefined) return null;
  const labels = {
    sleep: `Sleep: ${value}`,
    cleanliness: `Cleanliness: ${value}/5`,
    study: `Study: ${value}`,
    smoking: `Smoking: ${value}`,
    noise: `Noise: ${value}`,
  };
  return labels[key] || `${key}: ${value}`;
}

function StudentCard({ student, room, onRemoveRoom }) {
  const preferences = student.preferences || {};

  const prefList = [
    formatPreferenceLabel("sleep", preferences.sleep),
    formatPreferenceLabel("cleanliness", preferences.cleanliness),
    formatPreferenceLabel("study", preferences.study),
    formatPreferenceLabel("smoking", preferences.smoking),
    formatPreferenceLabel("noise", preferences.noise),
  ].filter(Boolean);

  return (
    <div className="student-card">
      <div className="student-top">
        <div className="student-avatar">{initialsFromName(student.name)}</div>

        <div className="student-main">
          <div className="student-name">{student.name}</div>
          <div className="student-email">{student.email}</div>
        </div>

        <div className="student-role">{student.role}</div>
      </div>

      <div className="student-body">
        <div className="student-meta-grid">
          <div className="student-meta">
            <div className="student-meta-lbl">Assigned Room</div>
            <div className="student-meta-val">
              {room ? room.roomNumber : "No room assigned"}
            </div>
          </div>

          <div className="student-meta">
            <div className="student-meta-lbl">Location</div>
            <div className="student-meta-val">
              {room ? `${room.location || "N/A"}, ${room.district || ""}` : "N/A"}
            </div>
          </div>

          <div className="student-meta">
            <div className="student-meta-lbl">Room Type</div>
            <div className="student-meta-val">{room ? room.type : "N/A"}</div>
          </div>

          <div className="student-meta">
            <div className="student-meta-lbl">Joined</div>
            <div className="student-meta-val">
              {student.createdAt
                ? new Date(student.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>

        {prefList.length > 0 && (
          <div className="pref-block">
            <div className="pref-title">Preference Profile</div>
            <div className="pref-chips">
              {prefList.map((item, index) => (
                <span key={index} className="pref-chip">{item}</span>
              ))}
            </div>
          </div>
        )}

        <div className="student-actions">
          <button
            className={`action-btn ${room ? "btn-danger" : "btn-disabled"}`}
            onClick={() => room && onRemoveRoom(student._id, room._id)}
            disabled={!room}
          >
            {room ? "Remove From Room" : "No Assigned Room"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Students() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roomFilter, setRoomFilter] = useState("all");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, roomsRes] = await Promise.all([
        axios.get(`${API}/users`, { headers }),
        axios.get(`${API}/rooms`, { headers }),
      ]);

      const usersData = Array.isArray(usersRes.data)
        ? usersRes.data
        : usersRes.data.users || [];

      const roomsData = Array.isArray(roomsRes.data)
        ? roomsRes.data
        : roomsRes.data.rooms || [];

      const onlyStudents = usersData.filter((u) => normalize(u.role) === "student");

      setStudents(onlyStudents);
      setRooms(roomsData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      showToast("Failed to load students", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const roomByStudent = useMemo(() => {
    const map = {};
    rooms.forEach((room) => {
      (room.occupants || []).forEach((occ) => {
        const id = typeof occ === "string" ? occ : occ?._id;
        if (id) map[id] = room;
      });
    });
    return map;
  }, [rooms]);

  const handleRemoveRoom = async (studentId, roomId) => {
    const ok = window.confirm("Remove this student from the assigned room?");
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/rooms/remove-student`,
        { studentId, roomId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showToast("Student removed from room successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Failed to remove student from room",
        "error"
      );
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const room = roomByStudent[student._id];
      const searchValue = search.toLowerCase();

      const matchesSearch =
        !searchValue ||
        student.name?.toLowerCase().includes(searchValue) ||
        student.email?.toLowerCase().includes(searchValue) ||
        room?.roomNumber?.toLowerCase().includes(searchValue);

      const matchesRoomFilter =
        roomFilter === "all" ||
        (roomFilter === "assigned" && !!room) ||
        (roomFilter === "unassigned" && !room);

      return matchesSearch && matchesRoomFilter;
    });
  }, [students, roomByStudent, search, roomFilter]);

  const stats = useMemo(() => {
    const assigned = students.filter((s) => !!roomByStudent[s._id]).length;
    const unassigned = students.length - assigned;
    const withPrefs = students.filter((s) => {
      const p = s.preferences || {};
      return Object.values(p).some((v) => v !== "" && v !== null && v !== undefined);
    }).length;

    return {
      total: students.length,
      assigned,
      unassigned,
      withPrefs,
    };
  }, [students, roomByStudent]);

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="st-root">
        <div className="st-header">
          <div>
            <div className="st-breadcrumb">
              Dashboard › Admin › <span>Students</span>
            </div>
            <h1>Manage Students</h1>
            <p>Review student profiles, assigned rooms, and matching preferences.</p>
          </div>

          <div className="st-header-actions">
            <button className="btn-outline" onClick={fetchData}>↻ Refresh</button>
          </div>
        </div>

        <div className="st-stats">
          <div className="st-stat">
            <div className="st-stat-top">
              <div className="st-stat-icon">👥</div>
              <div className="st-stat-chip chip-info">All</div>
            </div>
            <div className="st-stat-val">{stats.total}</div>
            <div className="st-stat-lbl">Total Students</div>
          </div>

          <div className="st-stat">
            <div className="st-stat-top">
              <div className="st-stat-icon">🏠</div>
              <div className="st-stat-chip chip-success">Assigned</div>
            </div>
            <div className="st-stat-val">{stats.assigned}</div>
            <div className="st-stat-lbl">Assigned To Rooms</div>
          </div>

          <div className="st-stat">
            <div className="st-stat-top">
              <div className="st-stat-icon">🛏️</div>
              <div className="st-stat-chip chip-warn">Open</div>
            </div>
            <div className="st-stat-val">{stats.unassigned}</div>
            <div className="st-stat-lbl">Unassigned Students</div>
          </div>

          <div className="st-stat">
            <div className="st-stat-top">
              <div className="st-stat-icon">✨</div>
              <div className="st-stat-chip chip-dark">Prefs</div>
            </div>
            <div className="st-stat-val">{stats.withPrefs}</div>
            <div className="st-stat-lbl">Profiles With Preferences</div>
          </div>
        </div>

        <div className="st-panel">
          <div className="st-panel-top">
            <div className="st-panel-title">Student Directory</div>

            <div className="st-filters">
              <div className="st-search">
                <span style={{ color: "#b0b6c8" }}>🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by student, email, room..."
                />
              </div>

              <select
                className="st-select"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
              >
                <option value="all">All Students</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          </div>

          <div className="student-grid">
            {loading && <div className="empty-state">Loading students...</div>}

            {!loading && filteredStudents.length === 0 && (
              <div className="empty-state">No students found for the selected filters.</div>
            )}

            {!loading &&
              filteredStudents.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  room={roomByStudent[student._id]}
                  onRemoveRoom={handleRemoveRoom}
                />
              ))}
          </div>
        </div>

        {toast && (
          <div className={`toast ${toast.type}`}>{toast.msg}</div>
        )}
      </div>
    </Layout>
  );
}

export default Students;