import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink: #0d0d0f;
    --paper: #f7f5f0;
    --paper2: #efece5;
    --accent: #c8a96e;
    --accent2: #e8d5b0;
    --muted: #9a9588;
    --border: rgba(13,13,15,0.08);
    --shadow: 0 2px 20px rgba(13,13,15,0.07);
    --shadow-lg: 0 8px 48px rgba(13,13,15,0.12);
    --serif: 'DM Serif Display', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
    --radius: 16px;
    --radius-sm: 10px;
  }

  .sd-root {
    font-family: var(--sans);
    background: var(--paper);
    min-height: 100vh;
    padding: 2rem 2.5rem 4rem;
    max-width: 1100px;
    margin: 0 auto;
    color: var(--ink);
  }

  /* ─── WELCOME ─── */
  .sd-welcome {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
    padding: 2.5rem;
    background: var(--ink);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
  }

  .sd-welcome::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,169,110,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .sd-welcome::after {
    content: '';
    position: absolute;
    bottom: -40px;
    left: 30%;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,169,110,0.10) 0%, transparent 70%);
    pointer-events: none;
  }

  .sd-welcome-text {
    position: relative;
    z-index: 1;
  }

  .sd-welcome-text h2 {
    font-family: var(--serif);
    font-size: 2rem;
    font-weight: 400;
    color: #f7f5f0;
    margin: 0 0 0.5rem;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .sd-welcome-text p {
    font-size: 0.82rem;
    color: rgba(247,245,240,0.5);
    margin: 0;
    font-weight: 300;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .sd-smart-match {
    position: relative;
    z-index: 1;
    background: rgba(200,169,110,0.15);
    border: 1px solid rgba(200,169,110,0.3);
    border-radius: var(--radius);
    padding: 1.25rem 1.5rem;
    min-width: 160px;
    text-align: right;
    backdrop-filter: blur(4px);
    flex-shrink: 0;
  }

  .sd-smart-match .label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 0.4rem;
  }

  .sd-smart-match .value {
    font-family: var(--serif);
    font-size: 1.4rem;
    color: #f7f5f0;
    line-height: 1.1;
    margin-bottom: 0.25rem;
  }

  .sd-smart-match .sub {
    font-size: 0.7rem;
    color: rgba(247,245,240,0.4);
    font-weight: 300;
  }

  /* ─── STATS ─── */
  .sd-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 800px) {
    .sd-stats { grid-template-columns: repeat(2, 1fr); }
  }

  .sd-stat-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.4rem 1.25rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: default;
  }

  .sd-stat-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }

  .sd-stat-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    opacity: 0;
    transition: opacity 0.2s;
  }

  .sd-stat-card:hover::after {
    opacity: 1;
  }

  .stat-icon-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
    background: var(--paper2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .stat-badge {
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.2em 0.6em;
    border-radius: 20px;
  }

  .stat-badge.up   { background: #e8f5e9; color: #2e7d32; }
  .stat-badge.info { background: #e3f2fd; color: #1565c0; }
  .stat-badge.pend { background: #fff8e1; color: #e65100; }

  .stat-num {
    font-family: var(--serif);
    font-size: 1.7rem;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 0.25rem;
    letter-spacing: -0.02em;
  }

  .stat-label {
    font-size: 0.72rem;
    color: var(--muted);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ─── CARD ─── */
  .sd-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  .sd-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.4rem 1.75rem 1rem;
    border-bottom: 1px solid var(--border);
  }

  .sd-card-title {
    font-family: var(--serif);
    font-size: 1.1rem;
    color: var(--ink);
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  /* ─── MATCH LIST ─── */
  .match-list {
    padding: 0.5rem 0;
  }

  .match-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.75rem;
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
    cursor: pointer;
  }

  .match-row:last-child {
    border-bottom: none;
  }

  .match-row:hover {
    background: var(--paper);
  }

  .match-avatar {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.78rem;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
    letter-spacing: 0.03em;
  }

  .match-info {
    flex: 1;
  }

  .match-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--ink);
    margin-bottom: 0.2rem;
  }

  .match-meta {
    font-size: 0.72rem;
    color: var(--muted);
    font-weight: 300;
  }

  .match-score {
    font-family: var(--serif);
    font-size: 0.95rem;
    color: var(--accent);
    font-weight: 400;
    letter-spacing: -0.01em;
    flex-shrink: 0;
  }

  .empty-state {
    padding: 3rem;
    text-align: center;
    color: var(--muted);
    font-size: 0.82rem;
    font-weight: 300;
    letter-spacing: 0.02em;
  }

  /* ─── ANIMATIONS ─── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .sd-welcome  { animation: fadeUp 0.5s ease both; }
  .sd-stats    { animation: fadeUp 0.5s 0.1s ease both; }
  .sd-card     { animation: fadeUp 0.5s 0.2s ease both; }
`;

const avatarGradients = [
  "linear-gradient(135deg,#c8a96e,#a07840)",
  "linear-gradient(135deg,#7eaed8,#4a7ea5)",
  "linear-gradient(135deg,#8bc4a8,#4d9175)",
  "linear-gradient(135deg,#d48fa0,#a05570)",
  "linear-gradient(135deg,#b0a0d4,#7060aa)",
];

function StudentDashboard() {
  const [matches, setMatches] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchMatches();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${API}/matches`);
      setMatches(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getHour = () => new Date().getHours();
  const greeting =
    getHour() < 12 ? "Good morning" : getHour() < 18 ? "Good afternoon" : "Good evening";

  return (
    <Layout role="student">
      <style>{styles}</style>
      <div className="sd-root">

        {/* ── WELCOME ── */}
        <div className="sd-welcome">
          <div className="sd-welcome-text">
            <h2>{greeting} {user ? `👋 ${user.name}` : "👋"}</h2>
            <p>
              {user
                ? `Sleep · ${user.preferences?.sleep || "—"}   ·   Study · ${user.preferences?.study || "—"}`
                : "Here's what's happening with your hostel life today."}
            </p>
          </div>

          <div className="sd-smart-match">
            <div className="label">✦ Smart Match</div>
            <div className="value">{matches.length} suggestions</div>
            <div className="sub">Based on your preferences</div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="sd-stats">
          {[
            { icon: "✦", num: matches[0]?.score ? `${matches[0].score}%` : "—", label: "Top Match Score", badge: "Live", badgeCls: "up" },
            { icon: "⊡", num: "Assigned", label: "My Room", badge: "Active", badgeCls: "info" },
            { icon: "☰", num: "0", label: "Pending Requests", badge: "Review", badgeCls: "pend" },
            { icon: "⚑", num: "0", label: "Open Complaints", badge: "Pending", badgeCls: "pend" },
          ].map((s, i) => (
            <div key={i} className="sd-stat-card">
              <div className="stat-icon-row">
                <div className="stat-icon">{s.icon}</div>
                <span className={`stat-badge ${s.badgeCls}`}>{s.badge}</span>
              </div>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MATCHES ── */}
        <div className="sd-card">
          <div className="sd-card-header">
            <span className="sd-card-title">Suggested Roommates</span>
          </div>

          <div className="match-list">
            {matches.length === 0 ? (
              <div className="empty-state">No matches found yet — check back soon.</div>
            ) : (
              matches.map((m, i) => (
                <div key={i} className="match-row">
                  <div
                    className="match-avatar"
                    style={{ background: avatarGradients[i % avatarGradients.length] }}
                  >
                    {m.user2?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="match-info">
                    <div className="match-name">{m.user2}</div>
                    <div className="match-meta">Compatible roommate</div>
                  </div>
                  <div className="match-score">{m.score}% Match</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default StudentDashboard;