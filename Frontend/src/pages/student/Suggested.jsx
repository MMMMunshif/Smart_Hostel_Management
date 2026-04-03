import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  .sg-root {
    font-family: 'DM Sans', sans-serif;
    background: #f0f2f7;
    min-height: 100vh;
    padding: 32px;
    color: #0f1117;
  }

  .sg-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 22px;
    flex-wrap: wrap;
  }

  .sg-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #9aa0b0;
    margin-bottom: 6px;
  }

  .sg-breadcrumb span {
    color: #00c4b8;
    font-weight: 600;
  }

  .sg-header h1 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 6px;
    color: #10131a;
  }

  .sg-header p {
    font-size: 0.9rem;
    color: #7f8899;
    max-width: 720px;
    line-height: 1.55;
  }

  .smart-box {
    background: linear-gradient(135deg, #e8fcfb, #dff7f4);
    border: 1px solid #d3f3ef;
    border-radius: 16px;
    padding: 16px 18px;
    min-width: 210px;
    box-shadow: 0 8px 20px rgba(0, 212, 200, .08);
  }

  .smart-label {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: #00a99f;
    margin-bottom: 6px;
  }

  .smart-value {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: #0f1117;
  }

  .smart-sub {
    margin-top: 3px;
    font-size: 0.75rem;
    color: #8090a0;
  }

  .sg-filter-wrap {
    background: #fff;
    border: 1px solid #e9edf5;
    border-radius: 18px;
    padding: 16px;
    display: grid;
    grid-template-columns: 1.1fr .8fr .8fr .8fr .9fr;
    gap: 12px;
    margin-bottom: 22px;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1.5px solid #e8ebf2;
    border-radius: 12px;
    padding: 11px 13px;
    background: #fff;
  }

  .search-box input {
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 0.84rem;
    width: 100%;
    color: #111827;
  }

  .search-box input::placeholder {
    color: #b1b8c5;
  }

  .filter-select {
    border: 1.5px solid #e8ebf2;
    border-radius: 12px;
    padding: 11px 13px;
    background: #fff;
    font-family: inherit;
    font-size: 0.82rem;
    color: #4a5262;
    outline: none;
  }

  .reset-btn {
    border: none;
    border-radius: 12px;
    background: #f3f8f8;
    color: #00a99f;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;
    transition: .18s ease;
  }

  .reset-btn:hover {
    background: #e9fbf9;
  }

  .sg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }

  .match-card {
    background: #fff;
    border: 1px solid #e9edf5;
    border-radius: 20px;
    overflow: hidden;
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  }

  .match-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 34px rgba(17, 24, 39, .08);
    border-color: #d8f2ef;
  }

  .match-top {
    padding: 18px 18px 14px;
  }

  .match-user-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .match-user-main {
    display: flex;
    gap: 12px;
    min-width: 0;
  }

  .avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d4c8, #5fd3ff);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  .user-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.02rem;
    font-weight: 800;
    line-height: 1.1;
    color: #0f1117;
    margin-bottom: 4px;
  }

  .user-meta {
    font-size: 0.76rem;
    color: #7d8797;
    line-height: 1.45;
  }

  .more-btn {
    border: none;
    background: transparent;
    color: #98a1b2;
    font-size: 1.1rem;
    cursor: pointer;
  }

  .compat-box {
    background: #f7fafb;
    border: 1px solid #eef2f6;
    border-radius: 12px;
    padding: 10px 12px;
    margin-bottom: 12px;
  }

  .compat-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 7px;
  }

  .compat-label {
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.11em;
    color: #8992a3;
  }

  .compat-score {
    font-size: 0.76rem;
    font-weight: 800;
    color: #1c2230;
  }

  .compat-score strong {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem;
    color: #00c4b8;
  }

  .compat-track {
    height: 6px;
    background: #e9eff3;
    border-radius: 999px;
    overflow: hidden;
  }

  .compat-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #00d4c8, #80e7e0);
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 14px;
  }

  .tag {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 6px 9px;
    border-radius: 999px;
    background: #f5f7fb;
    color: #5e6878;
    border: 1px solid #edf1f6;
  }

  .metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding-top: 10px;
    border-top: 1px solid #eff3f7;
  }

  .metric {
    min-width: 0;
  }

  .metric-label {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: .08em;
    color: #a0a8b6;
    margin-bottom: 4px;
  }

  .metric-value {
    font-size: 0.78rem;
    font-weight: 700;
    color: #283041;
    line-height: 1.4;
  }

  .match-bottom {
    padding: 14px 18px 18px;
    border-top: 1px solid #f0f3f7;
    display: flex;
    gap: 10px;
  }

  .btn-outline {
    flex: 1;
    border: 1.5px solid #e4e9f0;
    background: #fff;
    color: #465062;
    padding: 10px 12px;
    border-radius: 12px;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 800;
    cursor: pointer;
    transition: .18s ease;
  }

  .btn-outline:hover {
    border-color: #cfe8e5;
    color: #00a99f;
    background: #f8fffe;
  }

  .btn-primary {
    flex: 1;
    border: none;
    background: #52e0de;
    color: #103536;
    padding: 10px 12px;
    border-radius: 12px;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 800;
    cursor: pointer;
    transition: .18s ease;
  }

  .btn-primary:hover {
    filter: brightness(.98);
  }

  .state-box {
    grid-column: 1 / -1;
    text-align: center;
    padding: 70px 20px;
    background: #fff;
    border: 1px solid #e9edf5;
    border-radius: 18px;
    color: #97a0b1;
    font-size: 0.95rem;
  }

  .cta-strip {
    margin-top: 24px;
    background: #fff;
    border: 1px solid #e9edf5;
    border-radius: 18px;
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .cta-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 3px;
  }

  .cta-sub {
    font-size: 0.82rem;
    color: #7f8899;
  }

  .cta-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .cta-ghost {
    padding: 10px 16px;
    border-radius: 12px;
    border: 1.5px solid #e6ebf2;
    background: #fff;
    color: #4c5565;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;
  }

  .cta-solid {
    padding: 10px 16px;
    border-radius: 12px;
    border: none;
    background: #f5cc6d;
    color: #5d4714;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 800;
    cursor: pointer;
  }

  @media (max-width: 1180px) {
    .sg-filter-wrap {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 760px) {
    .sg-root {
      padding: 16px;
    }

    .sg-filter-wrap {
      grid-template-columns: 1fr;
    }

    .sg-grid {
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
  if (value === "low") return "Low";
  if (value === "medium") return "Moderate";
  if (value === "high") return "High";
  return "Flexible";
}

function prettySmoking(value) {
  if (value === "no") return "Non-smoker";
  if (value === "yes") return "Smoker";
  return "Unknown";
}

function Suggested() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMatches(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const prefs = m.preferences || {};

      const searchValue = search.toLowerCase();
      const searchMatch =
        !searchValue ||
        m.name?.toLowerCase().includes(searchValue) ||
        m.email?.toLowerCase().includes(searchValue) ||
        m.meta?.toLowerCase().includes(searchValue) ||
        m.reasons?.some((r) => r.toLowerCase().includes(searchValue));

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

  const resetFilters = () => {
    setSearch("");
    setSleepFilter("all");
    setStudyFilter("all");
    setSmokingFilter("all");
    setScoreFilter("all");
  };

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="sg-root">
        <div className="sg-header">
          <div>
            <div className="sg-breadcrumb">
              Dashboard › Student › <span>Suggested</span>
            </div>
            <h1>Suggested Roommates</h1>
            <p>
              Based on your sleep schedule, study habits, smoking preference,
              noise level, and cleanliness, we found the most compatible students for your next semester.
            </p>
          </div>

          <div className="smart-box">
            <div className="smart-label">SMART MATCH</div>
            <div className="smart-value">{matches.length} suggestions</div>
            <div className="smart-sub">Live compatibility results</div>
          </div>
        </div>

        <div className="sg-filter-wrap">
          <div className="search-box">
            <span style={{ color: "#b0b8c5" }}>🔍</span>
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
            <option value="all">All Sleep Types</option>
            <option value="early">Early Bird</option>
            <option value="late">Night Owl</option>
          </select>

          <select
            className="filter-select"
            value={studyFilter}
            onChange={(e) => setStudyFilter(e.target.value)}
          >
            <option value="all">All Study Styles</option>
            <option value="silent">Quiet Study</option>
            <option value="group">Group Study</option>
          </select>

          <select
            className="filter-select"
            value={smokingFilter}
            onChange={(e) => setSmokingFilter(e.target.value)}
          >
            <option value="all">All Smoking Prefs</option>
            <option value="no">Non-smoker</option>
            <option value="yes">Smoker</option>
          </select>

          <select
            className="filter-select"
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
          >
            <option value="all">All Scores</option>
            <option value="90">90% and above</option>
            <option value="80">80% and above</option>
            <option value="70">70% and above</option>
            <option value="60">60% and above</option>
          </select>

          <button className="reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        <div className="sg-grid">
          {loading && (
            <div className="state-box">Loading suggested roommates...</div>
          )}

          {!loading && filteredMatches.length === 0 && (
            <div className="state-box">No compatible roommates found for the selected filters.</div>
          )}

          {!loading &&
            filteredMatches.map((match) => {
              const prefs = match.preferences || {};

              return (
                <div className="match-card" key={match._id}>
                  <div className="match-top">
                    <div className="match-user-row">
                      <div className="match-user-main">
                        <div className="avatar">{initials(match.name)}</div>
                        <div style={{ minWidth: 0 }}>
                          <div className="user-name">{match.name}</div>
                          <div className="user-meta">
                            {match.meta || "Student lifestyle"}
                            <br />
                            {match.email}
                          </div>
                        </div>
                      </div>

                      <button className="more-btn">⋯</button>
                    </div>

                    <div className="compat-box">
                      <div className="compat-top">
                        <div className="compat-label">COMPATIBILITY</div>
                        <div className="compat-score">
                          <strong>{match.score}%</strong> Match
                        </div>
                      </div>

                      <div className="compat-track">
                        <div
                          className="compat-fill"
                          style={{ width: `${match.score}%` }}
                        />
                      </div>
                    </div>

                    <div className="tag-row">
                      {(match.reasons || []).length > 0 ? (
                        match.reasons.map((reason, i) => (
                          <span className="tag" key={i}>{reason}</span>
                        ))
                      ) : (
                        <span className="tag">Compatible Lifestyle</span>
                      )}
                    </div>

                    <div className="metrics">
                      <div className="metric">
                        <div className="metric-label">SLEEP PATTERN</div>
                        <div className="metric-value">{prettySleep(prefs.sleep)}</div>
                      </div>

                      <div className="metric">
                        <div className="metric-label">NOISE LEVEL</div>
                        <div className="metric-value">{prettyNoise(prefs.noise)}</div>
                      </div>

                      <div className="metric">
                        <div className="metric-label">STUDY STYLE</div>
                        <div className="metric-value">{prettyStudy(prefs.study)}</div>
                      </div>

                      <div className="metric">
                        <div className="metric-label">SMOKING</div>
                        <div className="metric-value">{prettySmoking(prefs.smoking)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="match-bottom">
                    <button
                      className="btn-outline"
                      onClick={() => alert(`Profile preview for ${match.name}`)}
                    >
                      ↗ Profile
                    </button>

                    <button
                      className="btn-primary"
                      onClick={() => alert(`Roommate request sent to ${match.name}`)}
                    >
                      ✦ Request
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="cta-strip">
          <div>
            <div className="cta-title">Not finding what you're looking for?</div>
            <div className="cta-sub">
              Try broadening your filters or check room listings before sending roommate requests.
            </div>
          </div>

          <div className="cta-actions">
            <button
              className="cta-ghost"
              onClick={() => (window.location.href = "/rooms")}
            >
              Browse Rooms
            </button>
            <button
              className="cta-solid"
              onClick={() => (window.location.href = "/requests")}
            >
              Check Requests
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Suggested;