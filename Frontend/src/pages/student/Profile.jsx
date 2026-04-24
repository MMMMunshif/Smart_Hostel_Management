import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  .sp-root {
    font-family: 'DM Sans', sans-serif;
    background: #f0f2f7;
    min-height: 100vh;
    padding: 32px;
    color: #10131a;
  }

  .sp-shell {
    display: grid;
    grid-template-columns: 270px 1fr;
    gap: 22px;
  }

  .sp-card {
    background: #fff;
    border: 1px solid #e9edf5;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(16,19,26,.04);
  }

  .sp-side {
    padding: 18px;
    align-self: start;
    position: sticky;
    top: 84px;
  }

  .sp-side-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-bottom: 18px;
    border-bottom: 1px solid #eef2f7;
    margin-bottom: 18px;
  }

  .sp-avatar {
    width: 86px;
    height: 86px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d4c8, #7ce8ff);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.45rem;
    font-weight: 800;
    margin-bottom: 12px;
  }

  .sp-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 4px;
  }

  .sp-sub {
    font-size: 0.8rem;
    color: #7d8797;
    line-height: 1.45;
  }

  .sp-score-wrap {
    margin-top: 16px;
    width: 100%;
    text-align: left;
  }

  .sp-score-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .sp-score-label {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: .1em;
    color: #97a0b1;
  }

  .sp-score-value {
    font-size: 0.82rem;
    font-weight: 800;
    color: #00b8ae;
  }

  .sp-track {
    height: 8px;
    border-radius: 999px;
    background: #edf2f7;
    overflow: hidden;
  }

  .sp-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #00d4c8, #6fe8db);
  }

  .sp-side-list {
    display: grid;
    gap: 10px;
  }

  .sp-mini {
    background: #f8fafc;
    border: 1px solid #edf1f7;
    border-radius: 14px;
    padding: 12px 13px;
  }

  .sp-mini-label {
    font-size: 0.63rem;
    font-weight: 800;
    letter-spacing: .1em;
    color: #a0a8b6;
    margin-bottom: 5px;
  }

  .sp-mini-value {
    font-size: 0.82rem;
    font-weight: 700;
    color: #273043;
    line-height: 1.4;
    word-break: break-word;
  }

  .sp-main {
    display: grid;
    gap: 20px;
  }

  .sp-hero {
    padding: 22px;
    background: linear-gradient(135deg, #dff8f6, #ecfbfb 48%, #eef6ff);
  }

  .sp-hero-top {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .sp-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #9aa0b0;
    margin-bottom: 8px;
  }

  .sp-breadcrumb span {
    color: #00c4b8;
    font-weight: 600;
  }

  .sp-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2rem;
    line-height: 1.02;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }

  .sp-title-sub {
    font-size: 0.92rem;
    color: #667287;
    line-height: 1.6;
    max-width: 760px;
  }

  .sp-hero-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-primary {
    border: none;
    background: #4fe0dd;
    color: #0f3d3c;
    padding: 11px 16px;
    border-radius: 12px;
    font-family: inherit;
    font-size: 0.83rem;
    font-weight: 800;
    cursor: pointer;
  }

  .btn-soft {
    border: 1.5px solid #d9ece9;
    background: rgba(255,255,255,.72);
    color: #466071;
    padding: 11px 16px;
    border-radius: 12px;
    font-family: inherit;
    font-size: 0.83rem;
    font-weight: 800;
    cursor: pointer;
  }

  .sp-chip-row {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .sp-chip {
    background: rgba(255,255,255,.8);
    border: 1px solid #e3efef;
    border-radius: 999px;
    padding: 7px 11px;
    font-size: 0.72rem;
    font-weight: 700;
    color: #506071;
  }

  .sp-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .sp-section {
    padding: 20px;
  }

  .sp-section-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.08rem;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .sp-section-sub {
    font-size: 0.8rem;
    color: #7e8797;
    margin-bottom: 16px;
  }

  .pref-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .pref-card {
    background: #fbfcfe;
    border: 1px solid #edf1f7;
    border-radius: 16px;
    padding: 14px;
  }

  .pref-label {
    font-size: 0.67rem;
    font-weight: 800;
    color: #9aa1b1;
    letter-spacing: .08em;
    margin-bottom: 6px;
  }

  .pref-value {
    font-size: 0.88rem;
    font-weight: 800;
    color: #1e2634;
    margin-bottom: 6px;
  }

  .pref-desc {
    font-size: 0.76rem;
    color: #7c8697;
    line-height: 1.5;
  }

  .about-box {
    background: #f5fffe;
    border: 1px solid #dff5f2;
    border-radius: 18px;
    padding: 18px;
    font-size: 0.9rem;
    line-height: 1.8;
    color: #304052;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .tag {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 7px 11px;
    border-radius: 999px;
    background: #f7f8fc;
    border: 1px solid #ebeff6;
    color: #566173;
  }

  .residence-box {
    background: #f9fbfe;
    border: 1px solid #edf1f7;
    border-radius: 18px;
    padding: 16px;
  }

  .residence-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 12px;
  }

  .residence-item {
    background: #fff;
    border: 1px solid #edf1f7;
    border-radius: 14px;
    padding: 12px;
  }

  .residence-label {
    font-size: 0.64rem;
    font-weight: 800;
    color: #9aa1b1;
    letter-spacing: .08em;
    margin-bottom: 5px;
  }

  .residence-value {
    font-size: 0.84rem;
    font-weight: 800;
    color: #202839;
    line-height: 1.5;
  }

  .cta-banner {
    background: linear-gradient(135deg, #4fe0dd, #5fdff0);
    border-radius: 22px;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .cta-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.3rem;
    font-weight: 800;
    color: #083234;
    margin-bottom: 6px;
  }

  .cta-sub {
    font-size: 0.92rem;
    color: #195054;
    line-height: 1.7;
    max-width: 620px;
  }

  .cta-btn {
    border: none;
    background: #fff;
    color: #3ad2cf;
    padding: 16px 24px;
    border-radius: 18px;
    font-family: inherit;
    font-size: 0.92rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(255,255,255,.28);
  }

  .empty-box {
    padding: 24px;
    font-size: 0.88rem;
    color: #8a92a2;
  }

  @media (max-width: 1100px) {
    .sp-shell {
      grid-template-columns: 1fr;
    }

    .sp-side {
      position: static;
    }

    .sp-grid-2 {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .sp-root {
      padding: 16px;
    }

    .pref-grid,
    .residence-grid {
      grid-template-columns: 1fr;
    }

    .sp-title {
      font-size: 1.6rem;
    }
  }
`;

function initials(name = "Student") {
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

function prettySleep(value) {
  if (value === "early") return "Early Bird";
  if (value === "late") return "Night Owl";
  return "Not set";
}

function prettyStudy(value) {
  if (value === "silent") return "Quiet Environment";
  if (value === "group") return "Group Study";
  return "Not set";
}

function prettyNoise(value) {
  if (value === "low") return "Low";
  if (value === "medium") return "Medium";
  if (value === "high") return "High";
  return "Not set";
}

function prettySmoking(value) {
  if (value === "no") return "Non-smoker";
  if (value === "yes") return "Smoker";
  return "Not set";
}

function profileScore(user) {
  let score = 20;
  const p = user?.preferences || {};

  if (user?.name) score += 10;
  if (user?.email) score += 10;
  if (p.sleep) score += 15;
  if (p.cleanliness !== undefined && p.cleanliness !== null && p.cleanliness !== "") score += 15;
  if (p.study) score += 10;
  if (p.smoking) score += 10;
  if (p.noise) score += 10;

  return Math.min(score, 100);
}

function findAssignedRoom(rooms, userId) {
  return rooms.find((room) =>
    (room.occupants || []).some((occ) => {
      const id = typeof occ === "string" ? occ : occ?._id;
      return id === userId;
    })
  );
}

function Profile() {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [topMatch, setTopMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const [meRes, roomsRes, matchRes] = await Promise.all([
        axios.get(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/matches/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const me = meRes.data?.user || meRes.data;
      const roomData = Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data.rooms || [];
      const matchData = Array.isArray(matchRes.data) ? matchRes.data : [];

      setUser(me || { _id: userId });
      setRooms(roomData);
      setTopMatch(matchData.length ? matchData[0] : null);
      setLoading(false);
    } catch (err) {
  showToast("Failed to load profile data.", "error");
  setLoading(false);
}
  };

  const assignedRoom = useMemo(() => {
    if (!user?._id) return null;
    return findAssignedRoom(rooms, user._id);
  }, [rooms, user]);

  const score = useMemo(() => profileScore(user), [user]);

  const preferenceTags = useMemo(() => {
    if (!user) return [];
    const p = user.preferences || [];
    const tags = [];

    if (p.sleep) tags.push(prettySleep(p.sleep));
    if (p.study) tags.push(prettyStudy(p.study));
    if (p.smoking) tags.push(prettySmoking(p.smoking));
    if (p.noise) tags.push(`${prettyNoise(p.noise)} Noise`);
    if (p.cleanliness !== undefined && p.cleanliness !== null && p.cleanliness !== "") {
      tags.push(`Cleanliness ${p.cleanliness}/5`);
    }

    return tags;
  }, [user]);

  if (loading) {
    return (
      <Layout role="student">
        <style>{css}</style>
        <div className="sp-root">
          <div className="sp-card empty-box">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="sp-root">
        <div className="sp-shell">
          <div className="sp-card sp-side">
            <div className="sp-side-top">
              <div className="sp-avatar">{initials(user?.name || "Student")}</div>
              <div className="sp-name">{user?.name || "Student"}</div>
              <div className="sp-sub">
                {user?.role || "student"}
                <br />
                {user?.email || "No email"}
              </div>

              <div className="sp-score-wrap">
                <div className="sp-score-top">
                  <span className="sp-score-label">PROFILE INTEGRITY</span>
                  <span className="sp-score-value">{score}%</span>
                </div>
                <div className="sp-track">
                  <div className="sp-fill" style={{ width: `${score}%` }} />
                </div>
              </div>
            </div>

            <div className="sp-side-list">
              <div className="sp-mini">
                <div className="sp-mini-label">EMAIL</div>
                <div className="sp-mini-value">{user?.email || "Not set"}</div>
              </div>

              <div className="sp-mini">
                <div className="sp-mini-label">ACCOUNT TYPE</div>
                <div className="sp-mini-value">{user?.role || "Student"}</div>
              </div>

              <div className="sp-mini">
                <div className="sp-mini-label">CURRENT ROOM</div>
                <div className="sp-mini-value">
                  {assignedRoom ? assignedRoom.roomNumber : "No room assigned"}
                </div>
              </div>

              <div className="sp-mini">
                <div className="sp-mini-label">TOP MATCH</div>
                <div className="sp-mini-value">
                  {topMatch ? `${topMatch.name} • ${topMatch.score}%` : "No match yet"}
                </div>
              </div>
            </div>
          </div>

          <div className="sp-main">
            <div className="sp-card sp-hero">
              <div className="sp-hero-top">
                <div>
                  <div className="sp-breadcrumb">
                    Dashboard › Student › <span>Profile</span>
                  </div>
                  <div className="sp-title">{user?.name || "Student Profile"}</div>
                  <div className="sp-title-sub">
                    Manage your preferences and profile information to improve roommate compatibility and room recommendations.
                  </div>
                </div>

                <div className="sp-hero-actions">
                  <button className="btn-primary" onClick={() => (window.location.href = "/profile/edit")}>
  ✎ Edit Profile
</button>
                 <button className="btn-soft" onClick={() => (window.location.href = "/profile/edit")}>
  Preferences
</button>
                </div>
              </div>

              <div className="sp-chip-row">
                {preferenceTags.length > 0 ? (
                  preferenceTags.map((tag, index) => (
                    <span className="sp-chip" key={index}>{tag}</span>
                  ))
                ) : (
                  <span className="sp-chip">Complete your lifestyle preferences</span>
                )}
              </div>
            </div>

            <div className="sp-grid-2">
              <div className="sp-card sp-section">
                <div className="sp-section-title">Lifestyle Preferences</div>
                <div className="sp-section-sub">
                  Your current compatibility settings used for matching.
                </div>

                <div className="pref-grid">
                  <div className="pref-card">
                    <div className="pref-label">SLEEP SCHEDULE</div>
                    <div className="pref-value">{prettySleep(user?.preferences?.sleep)}</div>
                    <div className="pref-desc">How early or late you prefer to sleep and wake up.</div>
                  </div>

                  <div className="pref-card">
                    <div className="pref-label">CLEANLINESS</div>
                    <div className="pref-value">
                      {user?.preferences?.cleanliness !== undefined &&
                      user?.preferences?.cleanliness !== null &&
                      user?.preferences?.cleanliness !== ""
                        ? `${user.preferences.cleanliness}/5`
                        : "Not set"}
                    </div>
                    <div className="pref-desc">Your preference for tidiness and shared space care.</div>
                  </div>

                  <div className="pref-card">
                    <div className="pref-label">STUDY STYLE</div>
                    <div className="pref-value">{prettyStudy(user?.preferences?.study)}</div>
                    <div className="pref-desc">Whether you prefer quiet study or collaborative work.</div>
                  </div>

                  <div className="pref-card">
                    <div className="pref-label">NOISE TOLERANCE</div>
                    <div className="pref-value">{prettyNoise(user?.preferences?.noise)}</div>
                    <div className="pref-desc">How comfortable you are with music, talking, or activity.</div>
                  </div>

                  <div className="pref-card">
                    <div className="pref-label">SMOKING</div>
                    <div className="pref-value">{prettySmoking(user?.preferences?.smoking)}</div>
                    <div className="pref-desc">Used as a strong compatibility factor for roommate matching.</div>
                  </div>

                  <div className="pref-card">
                    <div className="pref-label">MATCH QUALITY</div>
                    <div className="pref-value">
                      {topMatch ? `${topMatch.score}% top compatibility` : "No top match yet"}
                    </div>
                    <div className="pref-desc">A better completed profile improves suggested roommate accuracy.</div>
                  </div>
                </div>
              </div>

              <div className="sp-card sp-section">
                <div className="sp-section-title">Current Residence</div>
                <div className="sp-section-sub">
                  Your current assigned room and roommate information.
                </div>

                {assignedRoom ? (
                  <div className="residence-box">
                    <div className="residence-grid">
                      <div className="residence-item">
                        <div className="residence-label">ROOM NUMBER</div>
                        <div className="residence-value">{assignedRoom.roomNumber}</div>
                      </div>

                      <div className="residence-item">
                        <div className="residence-label">TYPE</div>
                        <div className="residence-value">{assignedRoom.type || "N/A"}</div>
                      </div>

                      <div className="residence-item">
                        <div className="residence-label">LOCATION</div>
                        <div className="residence-value">
                          {assignedRoom.location || "N/A"}
                          {assignedRoom.district ? `, ${assignedRoom.district}` : ""}
                        </div>
                      </div>

                      <div className="residence-item">
                        <div className="residence-label">PRICE</div>
                        <div className="residence-value">
                          {assignedRoom.price
                            ? `LKR ${Number(assignedRoom.price).toLocaleString("en-LK")}`
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="tag-list" style={{ marginTop: 14 }}>
                      {(assignedRoom.amenities || []).length > 0 ? (
                        assignedRoom.amenities.slice(0, 6).map((item, i) => (
                          <span key={i} className="tag">{item}</span>
                        ))
                      ) : (
                        <span className="tag">No amenities listed</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="about-box">
                    You do not currently have an assigned room. Browse available rooms and submit a room request to get started.
                  </div>
                )}
              </div>
            </div>

            <div className="sp-card sp-section">
              <div className="sp-section-title">About My Living Style</div>
              <div className="sp-section-sub">
                A profile summary based on your lifestyle settings and room preferences.
              </div>

              <div className="about-box">
                {user?.name || "This student"} prefers a {prettyStudy(user?.preferences?.study).toLowerCase()} environment,
                has a {prettySleep(user?.preferences?.sleep).toLowerCase()} routine, and is
                {" "}{prettySmoking(user?.preferences?.smoking).toLowerCase()} with
                {" "}{prettyNoise(user?.preferences?.noise).toLowerCase()} noise tolerance.
                {user?.preferences?.cleanliness !== undefined &&
                user?.preferences?.cleanliness !== null &&
                user?.preferences?.cleanliness !== ""
                  ? ` Their cleanliness preference is ${user.preferences.cleanliness}/5, which helps improve compatibility suggestions.`
                  : " Completing cleanliness preference will improve matching quality."}

                <div className="tag-list">
                  {preferenceTags.length > 0 ? (
                    preferenceTags.map((tag, index) => (
                      <span className="tag" key={index}>{tag}</span>
                    ))
                  ) : (
                    <span className="tag">Complete profile to improve matching</span>
                  )}
                </div>
              </div>
            </div>

            <div className="cta-banner">
              <div>
                <div className="cta-title">Ready for a better living experience?</div>
                <div className="cta-sub">
                  Keep your profile and lifestyle preferences updated so the system can give you better roommate suggestions and smarter room recommendations.
                </div>
              </div>

              <button className="cta-btn" onClick={() => (window.location.href = "/matching")}>
                Explore New Matches
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;