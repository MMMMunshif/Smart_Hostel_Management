import { useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #f8f9fb;
    color: #1a1d23;
  }

  /* ── Left panel ── */
  .auth-left {
    position: relative;
    background: linear-gradient(145deg, #0d1117 0%, #0a1628 60%, #0d2a2a 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 48px;
    overflow: hidden;
  }

  .auth-left::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,200,0.12) 0%, transparent 70%);
    top: -100px; left: -100px;
    pointer-events: none;
  }
  .auth-left::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,200,0.07) 0%, transparent 70%);
    bottom: 60px; right: -60px;
    pointer-events: none;
  }

  /* floating grid dots */
  .auth-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  .auth-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }
  .auth-logo-icon {
    width: 40px; height: 40px;
    background: #00d4c8;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    font-weight: 800;
    color: #0d1117;
    flex-shrink: 0;
  }
  .auth-logo-name {
    font-size: 1.2rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
  }

  .auth-left-body {
    position: relative;
    z-index: 1;
  }
  .auth-left-tagline {
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
  }
  .auth-left-tagline span { color: #00d4c8; }
  .auth-left-sub {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.5);
    line-height: 1.6;
    max-width: 340px;
  }

  /* stat pills */
  .auth-stats {
    display: flex;
    gap: 12px;
    margin-top: 36px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }
  .auth-stat-pill {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 12px 18px;
    backdrop-filter: blur(8px);
  }
  .auth-stat-pill .num {
    font-size: 1.3rem;
    font-weight: 800;
    color: #00d4c8;
    line-height: 1;
  }
  .auth-stat-pill .lbl {
    font-size: 0.68rem;
    color: rgba(255,255,255,0.45);
    margin-top: 2px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .auth-left-footer {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.25);
    position: relative;
    z-index: 1;
  }

  /* ── Right panel ── */
  .auth-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 32px;
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
    animation: fadeUp .4s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-card-header { margin-bottom: 32px; }
  .auth-card-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1a1d23;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }
  .auth-card-sub {
    font-size: 0.85rem;
    color: #8a90a0;
  }
  .auth-card-sub a {
    color: #00b8b0;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: opacity .15s;
  }
  .auth-card-sub a:hover { opacity: .75; }

  /* Role toggle */
  .role-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #f0f2f6;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 24px;
  }
  .role-btn {
    padding: 10px;
    border: none;
    border-radius: 9px;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s ease;
    background: transparent;
    color: #7a8090;
  }
  .role-btn.active {
    background: #fff;
    color: #1a1d23;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  /* Input group */
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 24px;
  }
  .input-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .input-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #4a5060;
  }
  .input-field-wrap {
    position: relative;
  }
  .input-field {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #e2e5ec;
    border-radius: 12px;
    font-family: inherit;
    font-size: 0.88rem;
    color: #1a1d23;
    background: #fff;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  .input-field::placeholder { color: #b0b6c3; }
  .input-field:focus {
    border-color: #00d4c8;
    box-shadow: 0 0 0 3px rgba(0,212,200,0.1);
  }
  .input-icon {
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    color: #b0b6c3;
    font-size: 1rem;
    cursor: pointer;
    user-select: none;
  }

  /* Forgot */
  .auth-forgot {
    text-align: right;
    margin-top: -8px;
    margin-bottom: 4px;
  }
  .auth-forgot a {
    font-size: 0.78rem;
    color: #00b8b0;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }
  .auth-forgot a:hover { opacity: .75; }

  /* Submit button */
  .auth-btn {
    width: 100%;
    padding: 14px;
    background: #00d4c8;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-bottom: 20px;
  }
  .auth-btn:hover { opacity: .88; }
  .auth-btn:active { transform: scale(.98); }
  .auth-btn:disabled { opacity: .6; cursor: not-allowed; }

  /* Divider */
  .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    font-size: 0.75rem;
    color: #c0c5d0;
  }
  .auth-divider::before, .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #eef0f4;
  }

  /* Social */
  .auth-social {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .social-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px;
    border: 1.5px solid #e2e5ec;
    border-radius: 11px;
    background: #fff;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    color: #4a5060;
    cursor: pointer;
    transition: border-color .15s;
  }
  .social-btn:hover { border-color: #00d4c8; }

  /* Error */
  .auth-error {
    background: #fff0f0;
    border: 1px solid #fdd;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 0.78rem;
    color: #c0392b;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  @media (max-width: 768px) {
    .auth-root { grid-template-columns: 1fr; }
    .auth-left  { display: none; }
    .auth-right { padding: 32px 20px; }
  }
`;

function Login() {
  const navigate = useNavigate();
  const [role, setRole]         = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);                // ✅ NEW
  const [form, setForm]         = useState({ email: "", password: "" });

  // ✅ UPDATED — calls real backend, checks MongoDB
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:    form.email,
          password: form.password,
          role:     role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend returned 401 / 403 / 400 — show the error message
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      // ✅ Success — save token + user info, then navigate
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("userId", data.user._id);

      if (data.user.role === "admin") navigate("/admin/dashboard");
      else navigate("/dashboard");

    } catch (err) {
      setError("Network error. Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="auth-root">

        {/* ── Left visual panel ── */}
        <div className="auth-left">
          <div className="auth-dots" />

          <div className="auth-logo">
            <div className="auth-logo-icon">N</div>
            <span className="auth-logo-name">NestMate</span>
          </div>

          <div className="auth-left-body">
            <div className="auth-left-tagline">
              Find your perfect<br /><span>roommate</span> &<br />hostel room.
            </div>
            <p className="auth-left-sub">
              AI-powered matching helps you connect with compatible roommates
              and discover the best available rooms on campus.
            </p>

            <div className="auth-stats">
              <div className="auth-stat-pill">
                <div className="num">850+</div>
                <div className="lbl">Rooms Listed</div>
              </div>
              <div className="auth-stat-pill">
                <div className="num">94%</div>
                <div className="lbl">Match Rate</div>
              </div>
              <div className="auth-stat-pill">
                <div className="num">2.4k</div>
                <div className="lbl">Students</div>
              </div>
            </div>
          </div>

          <div className="auth-left-footer">© 2026 NestMate. All rights reserved.</div>
        </div>

        {/* ── Right form panel ── */}
        <div className="auth-right">
          <div className="auth-card">

            <div className="auth-card-header">
              <div className="auth-card-title">Welcome back 👋</div>
              <div className="auth-card-sub">
                Don't have an account?{" "}
                <a onClick={() => navigate("/register")}>Sign up free</a>
              </div>
            </div>

            {/* Role toggle */}
            <div className="role-toggle">
              <button
                className={`role-btn ${role === "student" ? "active" : ""}`}
                onClick={() => setRole("student")}
              >
                🎓 Student
              </button>
              <button
                className={`role-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
              >
                🛡 Admin
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="auth-error">⚠ {error}</div>
            )}

            {/* Inputs */}
            <div className="input-group">
              <div className="input-wrap">
                <label className="input-label">Email address</label>
                <div className="input-field-wrap">
                  <input
                    className="input-field"
                    placeholder={role === "admin" ? "admin@nestmate.com" : "you@university.edu"}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-wrap">
                <label className="input-label">Password</label>
                <div className="input-field-wrap">
                  <input
                    className="input-field"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    style={{ paddingRight: "42px" }}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                  />
                  <span className="input-icon" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "🙈" : "👁"}
                  </span>
                </div>
              </div>
            </div>

            <div className="auth-forgot">
              <a>Forgot password?</a>
            </div>

            <br />

            {/* ✅ Disabled + shows loading text while waiting for API */}
            <button className="auth-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in…" : "Sign in to NestMate →"}
            </button>

            <div className="auth-divider">or continue with</div>

            <div className="auth-social">
              <button className="social-btn">
                <span>🔵</span> Google
              </button>
              <button className="social-btn">
                <span>🔷</span> Microsoft
              </button>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default Login;