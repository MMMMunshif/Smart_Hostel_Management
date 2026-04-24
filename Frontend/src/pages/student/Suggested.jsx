import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.sg-root {
  min-height: 100vh;
  padding: 30px;
  font-family: 'DM Sans', sans-serif;
  color: #0f172a;
  background:
    radial-gradient(circle at 10% 0%, rgba(88,228,222,.28), transparent 28%),
    radial-gradient(circle at 90% 8%, rgba(99,102,241,.18), transparent 28%),
    radial-gradient(circle at 50% 100%, rgba(16,185,129,.12), transparent 32%),
    linear-gradient(135deg, #effefd 0%, #f8faff 45%, #f8fafc 100%);
}

.sg-shell {
  max-width: 1450px;
  margin: 0 auto;
}

.sg-hero {
  display: grid;
  grid-template-columns: 1.45fr .85fr;
  gap: 20px;
  margin-bottom: 22px;
}

.sg-hero-main,
.sg-insight-card,
.sg-filter-wrap,
.match-card,
.state-box {
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(255,255,255,.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 18px 45px rgba(15,23,42,.08);
}

.sg-hero-main {
  border-radius: 30px;
  padding: 28px;
  position: relative;
  overflow: hidden;
}

.sg-hero-main::after {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  right: -80px;
  top: -90px;
  background: rgba(88,228,222,.2);
}

.sg-breadcrumb {
  display: flex;
  gap: 6px;
  font-size: .76rem;
  color: #94a3b8;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.sg-breadcrumb span {
  color: #00a7a0;
  font-weight: 900;
}

.sg-title {
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

.sg-subtitle {
  color: #64748b;
  line-height: 1.75;
  max-width: 720px;
  font-size: .95rem;
  position: relative;
  z-index: 1;
}

.sg-hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 22px;
  position: relative;
  z-index: 1;
}

.sg-hero-btn {
  border: none;
  border-radius: 15px;
  padding: 12px 16px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
  transition: .18s;
}

.sg-hero-btn.primary {
  background: linear-gradient(135deg, #00d4c8, #2dd4bf);
  color: #073b3a;
  box-shadow: 0 10px 24px rgba(45,212,191,.28);
}

.sg-hero-btn.secondary {
  background: #fff;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.sg-hero-btn:hover {
  transform: translateY(-2px);
}

.sg-insight-card {
  border-radius: 30px;
  padding: 24px;
  background:
    linear-gradient(135deg, rgba(15,23,42,.94), rgba(30,41,59,.9)),
    rgba(255,255,255,.75);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.sg-insight-card::after {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  right: -55px;
  top: -45px;
  background: rgba(88,228,222,.18);
}

.sg-insight-label {
  font-size: .7rem;
  font-weight: 900;
  letter-spacing: .16em;
  color: #58e4de;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.sg-insight-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.4rem;
  font-weight: 900;
  letter-spacing: -.04em;
  margin-bottom: 6px;
  position: relative;
  z-index: 1;
}

.sg-insight-sub {
  color: #cbd5e1;
  line-height: 1.65;
  font-size: .88rem;
  position: relative;
  z-index: 1;
}

.sg-mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 20px;
  position: relative;
  z-index: 1;
}

.sg-mini-stat {
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 16px;
  padding: 13px;
}

.sg-mini-stat strong {
  display: block;
  color: #58e4de;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.15rem;
  font-weight: 900;
}

.sg-mini-stat span {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
  font-size: .7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
}

.sg-filter-wrap {
  border-radius: 24px;
  padding: 16px;
  display: grid;
  grid-template-columns: 1.35fr repeat(4, 1fr) auto;
  gap: 12px;
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  padding: 12px 14px;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-family: inherit;
  font-size: .88rem;
  color: #0f172a;
}

.filter-select {
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 15px;
  padding: 12px 14px;
  font-family: inherit;
  font-size: .84rem;
  font-weight: 800;
  color: #475569;
  outline: none;
}

.reset-btn {
  border: none;
  border-radius: 15px;
  padding: 12px 16px;
  background: #0f172a;
  color: #fff;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;
}

.sg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 22px;
}

.match-card {
  border-radius: 28px;
  overflow: hidden;
  transition: .25s ease;
}

.match-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 28px 58px rgba(15,23,42,.15);
}

.match-top {
  padding: 22px;
}

.match-user-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.match-user-main {
  display: flex;
  gap: 14px;
  min-width: 0;
}

.avatar {
  width: 62px;
  height: 62px;
  border-radius: 20px;
  background:
    linear-gradient(135deg, #00d4c8, #60a5fa);
  color: #fff;
  display: grid;
  place-items: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.05rem;
  font-weight: 900;
  box-shadow: 0 12px 24px rgba(45,212,191,.25);
  flex-shrink: 0;
}

.user-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 5px;
}

.user-meta {
  font-size: .78rem;
  color: #64748b;
  line-height: 1.55;
  word-break: break-word;
}

.score-badge {
  min-width: 72px;
  height: 72px;
  border-radius: 22px;
  background: #ecfeff;
  border: 1px solid #bae6fd;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.score-badge strong {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.22rem;
  font-weight: 900;
  color: #0891b2;
}

.score-badge span {
  font-size: .66rem;
  color: #64748b;
  font-weight: 900;
  text-transform: uppercase;
}

.compat-box {
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 18px;
  padding: 15px;
  margin-bottom: 15px;
}

.compat-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 9px;
}

.compat-label {
  font-size: .68rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: .12em;
}

.compat-score {
  font-size: .84rem;
  font-weight: 900;
  color: #334155;
}

.compat-score strong {
  color: #00a7a0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.08rem;
}

.compat-track {
  height: 9px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.compat-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #00d4c8, #60a5fa);
}

.tag-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.tag {
  background: #ecfeff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: .72rem;
  font-weight: 900;
}

.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
  padding-top: 14px;
  border-top: 1px solid #eef2f7;
}

.metric-box {
  background: #f8fafc;
  border: 1px solid #e8eef6;
  border-radius: 15px;
  padding: 11px;
}

.metric-label {
  font-size: .63rem;
  color: #94a3b8;
  font-weight: 900;
  letter-spacing: .1em;
  margin-bottom: 5px;
}

.metric-value {
  font-size: .83rem;
  font-weight: 900;
  color: #0f172a;
}

.match-bottom {
  padding: 16px 22px 22px;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 12px;
}

.btn-outline,
.btn-primary {
  border: none;
  border-radius: 16px;
  padding: 13px;
  font-family: inherit;
  font-size: .86rem;
  font-weight: 900;
  cursor: pointer;
  transition: .18s;
}

.btn-outline {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
}

.btn-primary {
  background: linear-gradient(135deg, #00d4c8, #2dd4bf);
  color: #073b3a;
  box-shadow: 0 10px 24px rgba(45,212,191,.25);
}

.btn-primary:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.btn-outline:hover,
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.state-box {
  grid-column: 1 / -1;
  border-radius: 28px;
  padding: 75px 20px;
  text-align: center;
  color: #64748b;
  font-weight: 800;
}

.state-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

@media(max-width:1200px) {
  .sg-hero {
    grid-template-columns: 1fr;
  }

  .sg-filter-wrap {
    grid-template-columns: 1fr 1fr;
  }

  .reset-btn {
    grid-column: span 2;
  }
}

@media(max-width:720px) {
  .sg-root {
    padding: 16px;
  }

  .sg-title {
    font-size: 1.65rem;
  }

  .sg-mini-stats {
    grid-template-columns: 1fr;
  }

  .sg-filter-wrap {
    grid-template-columns: 1fr;
  }

  .reset-btn {
    grid-column: auto;
  }

  .sg-grid {
    grid-template-columns: 1fr;
  }

  .match-bottom {
    grid-template-columns: 1fr;
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

function prettySleep(value) {
  if (value === "early") return "Early Bird";
  if (value === "late") return "Night Owl";
  return "Flexible";
}

function prettyStudy(value) {
  if (value === "silent") return "Quiet Study";
  if (value === "group") return "Group Study";
  return "Balanced Study";
}

function prettyNoise(value) {
  if (value === "low") return "Low Noise";
  if (value === "medium") return "Moderate Noise";
  if (value === "high") return "Social / High";
  return "Flexible";
}

function prettySmoking(value) {
  if (value === "no") return "Non-smoker";
  if (value === "yes") return "Smoker";
  return "Unknown";
}

function Suggested() {
  const { showToast } = useToast();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState("");

  const [search, setSearch] = useState("");
  const [sleepFilter, setSleepFilter] = useState("all");
  const [studyFilter, setStudyFilter] = useState("all");
  const [smokingFilter, setSmokingFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/matches/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMatches(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load matches", "error");
    } finally {
      setLoading(false);
    }
  };

  const sendRoommateRequest = async (toStudentId, name) => {
    try {
      setSendingId(toStudentId);
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/roommate-requests`,
        {
          toStudent: toStudentId,
          message: "Hi, I’d like to connect as a potential roommate.",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showToast(`Roommate request sent to ${name}`, "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to send roommate request",
        "error"
      );
    } finally {
      setSendingId("");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSleepFilter("all");
    setStudyFilter("all");
    setSmokingFilter("all");
    setScoreFilter("all");
  };

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const prefs = m.preferences || {};
      const q = search.toLowerCase();

      const searchMatch =
        !q ||
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.meta?.toLowerCase().includes(q) ||
        m.reasons?.some((r) => r.toLowerCase().includes(q));

      const sleepMatch = sleepFilter === "all" || prefs.sleep === sleepFilter;
      const studyMatch = studyFilter === "all" || prefs.study === studyFilter;
      const smokingMatch = smokingFilter === "all" || prefs.smoking === smokingFilter;

      let scoreMatch = true;
      if (scoreFilter === "90") scoreMatch = m.score >= 90;
      if (scoreFilter === "80") scoreMatch = m.score >= 80;
      if (scoreFilter === "70") scoreMatch = m.score >= 70;
      if (scoreFilter === "60") scoreMatch = m.score >= 60;

      return searchMatch && sleepMatch && studyMatch && smokingMatch && scoreMatch;
    });
  }, [matches, search, sleepFilter, studyFilter, smokingFilter, scoreFilter]);

  const bestScore = useMemo(() => {
    if (!matches.length) return 0;
    return Math.max(...matches.map((m) => Number(m.score || 0)));
  }, [matches]);

  const strongMatches = useMemo(
    () => matches.filter((m) => Number(m.score || 0) >= 80).length,
    [matches]
  );

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="sg-root">
        <div className="sg-shell">
          <div className="sg-hero">
            <div className="sg-hero-main">
              <div className="sg-breadcrumb">
                Dashboard › Student › <span>Suggested Roommates</span>
              </div>

              <h1 className="sg-title">Find your most compatible roommate</h1>

              <p className="sg-subtitle">
                Discover students who match your lifestyle, study habits, sleep schedule,
                cleanliness level, and room-sharing preferences.
              </p>

              <div className="sg-hero-actions">
                <button className="sg-hero-btn primary" onClick={fetchMatches}>
                  Refresh Matches
                </button>
                <button
                  className="sg-hero-btn secondary"
                  onClick={() => (window.location.href = "/profile")}
                >
                  Edit Preferences
                </button>
              </div>
            </div>

            <div className="sg-insight-card">
              <div className="sg-insight-label">SMART MATCH ENGINE</div>
              <div className="sg-insight-value">{matches.length}</div>
              <div className="sg-insight-sub">
                Suggested roommate profiles generated from your current preference data.
              </div>

              <div className="sg-mini-stats">
                <div className="sg-mini-stat">
                  <strong>{bestScore}%</strong>
                  <span>Best Score</span>
                </div>
                <div className="sg-mini-stat">
                  <strong>{strongMatches}</strong>
                  <span>Strong</span>
                </div>
                <div className="sg-mini-stat">
                  <strong>{filteredMatches.length}</strong>
                  <span>Visible</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sg-filter-wrap">
            <div className="search-box">
              <span style={{ color: "#94a3b8" }}>🔍</span>
              <input
                placeholder="Search by name, email, or match reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={sleepFilter}
              onChange={(e) => setSleepFilter(e.target.value)}
            >
              <option value="all">All Sleep</option>
              <option value="early">Early Bird</option>
              <option value="late">Night Owl</option>
            </select>

            <select
              className="filter-select"
              value={studyFilter}
              onChange={(e) => setStudyFilter(e.target.value)}
            >
              <option value="all">All Study</option>
              <option value="silent">Quiet Study</option>
              <option value="group">Group Study</option>
            </select>

            <select
              className="filter-select"
              value={smokingFilter}
              onChange={(e) => setSmokingFilter(e.target.value)}
            >
              <option value="all">All Smoking</option>
              <option value="no">Non-smoker</option>
              <option value="yes">Smoker</option>
            </select>

            <select
              className="filter-select"
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
            >
              <option value="all">All Scores</option>
              <option value="90">90%+</option>
              <option value="80">80%+</option>
              <option value="70">70%+</option>
              <option value="60">60%+</option>
            </select>

            <button className="reset-btn" onClick={resetFilters}>
              Reset
            </button>
          </div>

          <div className="sg-grid">
            {loading && (
              <div className="state-box">
                <div className="state-icon">⏳</div>
                Loading suggested roommates...
              </div>
            )}

            {!loading && filteredMatches.length === 0 && (
              <div className="state-box">
                <div className="state-icon">👥</div>
                No compatible roommates found.
              </div>
            )}

            {!loading &&
              filteredMatches.map((match) => {
                const prefs = match.preferences || {};
                const score = Number(match.score || 0);

                return (
                  <div className="match-card" key={match._id}>
                    <div className="match-top">
                      <div className="match-user-row">
                        <div className="match-user-main">
                          <div className="avatar">{initials(match.name)}</div>

                          <div>
                            <div className="user-name">{match.name}</div>
                            <div className="user-meta">
                              {match.meta || "Student lifestyle"}
                              <br />
                              {match.email}
                            </div>
                          </div>
                        </div>

                        <div className="score-badge">
                          <div>
                            <strong>{score}%</strong>
                            <span>Match</span>
                          </div>
                        </div>
                      </div>

                      <div className="compat-box">
                        <div className="compat-top">
                          <div className="compat-label">COMPATIBILITY SCORE</div>
                          <div className="compat-score">
                            <strong>{score}%</strong> matched
                          </div>
                        </div>

                        <div className="compat-track">
                          <div className="compat-fill" style={{ width: `${score}%` }} />
                        </div>
                      </div>

                      <div className="tag-row">
                        {(match.reasons || []).length ? (
                          match.reasons.map((reason, i) => (
                            <span className="tag" key={i}>
                              {reason}
                            </span>
                          ))
                        ) : (
                          <>
                            <span className="tag">Compatible Lifestyle</span>
                            <span className="tag">Shared Preferences</span>
                          </>
                        )}
                      </div>

                      <div className="metrics">
                        <div className="metric-box">
                          <div className="metric-label">SLEEP</div>
                          <div className="metric-value">{prettySleep(prefs.sleep)}</div>
                        </div>

                        <div className="metric-box">
                          <div className="metric-label">NOISE</div>
                          <div className="metric-value">{prettyNoise(prefs.noise)}</div>
                        </div>

                        <div className="metric-box">
                          <div className="metric-label">STUDY</div>
                          <div className="metric-value">{prettyStudy(prefs.study)}</div>
                        </div>

                        <div className="metric-box">
                          <div className="metric-label">SMOKING</div>
                          <div className="metric-value">{prettySmoking(prefs.smoking)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="match-bottom">
                      <button
                        className="btn-outline"
                        onClick={() => (window.location.href = "/profile")}
                      >
                        View Profile
                      </button>

                      <button
                        className="btn-primary"
                        disabled={sendingId === match._id}
                        onClick={() => sendRoommateRequest(match._id, match.name)}
                      >
                        {sendingId === match._id ? "Sending..." : "Send Request"}
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

export default Suggested;