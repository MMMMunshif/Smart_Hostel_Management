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

  .auth-left {
    position: relative;
    background: linear-gradient(145deg, #0d1117 0%, #0a1628 60%, #0d2a2a 100%);
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 40px 48px; overflow: hidden;
  }
  .auth-left::before {
    content: ''; position: absolute;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,200,0.12) 0%, transparent 70%);
    top: -100px; left: -100px; pointer-events: none;
  }
  .auth-left::after {
    content: ''; position: absolute;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,200,0.07) 0%, transparent 70%);
    bottom: 60px; right: -60px; pointer-events: none;
  }
  .auth-dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 32px 32px; pointer-events: none;
  }
  .auth-logo { display: flex; align-items: center; gap: 10px; position: relative; z-index: 1; }
  .auth-logo-icon {
    width: 40px; height: 40px; background: #00d4c8; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; font-weight: 800; color: #0d1117; flex-shrink: 0;
  }
  .auth-logo-name { font-size: 1.2rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
  .auth-left-body { position: relative; z-index: 1; }
  .auth-left-tagline {
    font-size: clamp(1.6rem, 2.5vw, 2.4rem); font-weight: 800; color: #fff;
    line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 16px;
  }
  .auth-left-tagline span { color: #00d4c8; }
  .auth-left-sub { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.6; max-width: 340px; }

  .steps-preview { margin-top: 36px; display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 1; }
  .step-item { display: flex; align-items: flex-start; gap: 14px; }
  .step-num {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800;
  }
  .step-num.done    { background: #00d4c8; color: #0d1117; }
  .step-num.active  { background: rgba(0,212,200,0.2); color: #00d4c8; border: 1.5px solid #00d4c8; }
  .step-num.pending { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.3); }
  .step-label { font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.5); padding-top: 6px; }
  .step-label.active-label { color: #fff; }
  .auth-left-footer { font-size: 0.72rem; color: rgba(255,255,255,0.25); position: relative; z-index: 1; }

  .auth-right {
    display: flex; align-items: center; justify-content: center;
    padding: 40px 32px; overflow-y: auto;
  }
  .auth-card { width: 100%; max-width: 440px; animation: fadeUp .4s ease both; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .progress-wrap { margin-bottom: 28px; }
  .progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .progress-label { font-size: 0.72rem; font-weight: 600; color: #9aa0ae; letter-spacing: 0.06em; text-transform: uppercase; }
  .progress-step  { font-size: 0.72rem; font-weight: 700; color: #00b8b0; }
  .progress-track { height: 4px; background: #eef0f4; border-radius: 99px; overflow: hidden; }
  .progress-fill  { height: 100%; background: linear-gradient(90deg, #00d4c8, #00b8b0); border-radius: 99px; transition: width .4s ease; }

  .auth-card-header { margin-bottom: 24px; }
  .auth-card-title  { font-size: 1.5rem; font-weight: 800; color: #1a1d23; letter-spacing: -0.02em; margin-bottom: 4px; }
  .auth-card-sub    { font-size: 0.82rem; color: #8a90a0; }
  .auth-card-sub a  { color: #00b8b0; font-weight: 600; text-decoration: none; cursor: pointer; }
  .auth-card-sub a:hover { opacity: .75; }

  .role-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px; }
  .role-card {
    border: 2px solid #e2e5ec; border-radius: 14px; padding: 20px 16px;
    cursor: pointer; text-align: center; transition: all .2s ease; background: #fff;
  }
  .role-card:hover    { border-color: #00d4c8; background: #f8fffe; }
  .role-card.selected { border-color: #00d4c8; background: #f0faf9; }
  .role-card-icon { font-size: 1.8rem; margin-bottom: 8px; }
  .role-card-name { font-size: 0.9rem; font-weight: 700; color: #1a1d23; margin-bottom: 4px; }
  .role-card-desc { font-size: 0.7rem; color: #9aa0ae; line-height: 1.4; }
  .role-card.selected .role-card-name { color: #00b8b0; }

  .input-group { display: flex; flex-direction: column; gap: 14px; margin-bottom: 8px; }
  .input-wrap  { display: flex; flex-direction: column; gap: 6px; }
  .input-label { font-size: 0.78rem; font-weight: 600; color: #4a5060; }
  .input-field-wrap { position: relative; }
  .input-field {
    width: 100%; padding: 12px 16px; border: 1.5px solid #e2e5ec; border-radius: 12px;
    font-family: inherit; font-size: 0.88rem; color: #1a1d23;
    background: #fff; outline: none; transition: border-color .15s, box-shadow .15s;
  }
  .input-field::placeholder { color: #b0b6c3; }
  .input-field:focus { border-color: #00d4c8; box-shadow: 0 0 0 3px rgba(0,212,200,0.1); }
  .input-icon {
    position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%); color: #b0b6c3; font-size: 1rem; cursor: pointer;
  }

  .pref-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px; }
  .pref-item  { display: flex; flex-direction: column; gap: 6px; }
  .pref-label { font-size: 0.75rem; font-weight: 600; color: #4a5060; }
  .pref-select {
    padding: 10px 14px; border: 1.5px solid #e2e5ec; border-radius: 11px;
    font-family: inherit; font-size: 0.82rem; color: #1a1d23;
    background: #fff; outline: none; cursor: pointer; transition: border-color .15s;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239aa0ae' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px;
  }
  .pref-select:focus { border-color: #00d4c8; }

  .clean-wrap  { grid-column: 1 / -1; }
  .clean-track { display: flex; gap: 6px; margin-top: 2px; }
  .clean-dot {
    flex: 1; height: 6px; border-radius: 99px;
    background: #eef0f4; cursor: pointer; transition: background .15s;
  }
  .clean-dot.filled { background: #00d4c8; }

  .auth-nav { display: flex; gap: 10px; margin-top: 24px; }
  .btn-back {
    padding: 13px 20px; border: 1.5px solid #e2e5ec; border-radius: 12px;
    background: #fff; font-family: inherit; font-size: 0.88rem; font-weight: 600;
    color: #4a5060; cursor: pointer; transition: border-color .15s;
  }
  .btn-back:hover    { border-color: #00d4c8; }
  .btn-back:disabled { opacity: .5; cursor: not-allowed; }
  .btn-next {
    flex: 1; padding: 13px; background: #00d4c8; color: #fff; border: none;
    border-radius: 12px; font-family: inherit; font-size: 0.92rem; font-weight: 700;
    cursor: pointer; transition: opacity .15s, transform .1s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-next:hover    { opacity: .88; }
  .btn-next:active   { transform: scale(.98); }
  .btn-next:disabled { opacity: .6; cursor: not-allowed; }
  .btn-next.success  { background: linear-gradient(135deg, #00c48c, #00b8b0); }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff; border-radius: 50%;
    animation: spin .7s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .auth-error {
    background: #fff0f0; border: 1px solid #fdd; border-radius: 10px;
    padding: 10px 14px; font-size: 0.78rem; color: #c0392b;
    margin-bottom: 14px; display: flex; align-items: center; gap: 6px;
  }
  .auth-success {
    background: #f0faf9; border: 1px solid #d0f0ed; border-radius: 10px;
    padding: 10px 14px; font-size: 0.78rem; color: #00a36c;
    margin-bottom: 14px; display: flex; align-items: center; gap: 6px;
  }

  .admin-note {
    background: #f0faf9; border: 1px solid #d0f0ed; border-radius: 12px;
    padding: 16px 18px; font-size: 0.82rem; color: #2a7060; line-height: 1.5; margin-bottom: 8px;
  }
  .admin-note strong { font-weight: 700; }

  @media (max-width: 768px) {
    .auth-root  { grid-template-columns: 1fr; }
    .auth-left  { display: none; }
    .auth-right { padding: 28px 16px; }
    .pref-grid  { grid-template-columns: 1fr; }
  }
`;

const STEPS = ["Your Role", "Basic Info", "Preferences"];

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    sleep: "",
    cleanliness: 3,
    study: "",
    smoking: "",
    noise: "",
  });

  const handleNext = () => {
    setError("");

    if (step === 1 && !form.role) {
      setError("Please select a role to continue.");
      return;
    }

    if (step === 2) {
      if (!form.name || !form.email || !form.password) {
        setError("All fields are required.");
        return;
      }
      if (!form.email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    if (step < 3) setStep((s) => s + 1);
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        ...(form.role === "student" && {
          preferences: {
            sleep: form.sleep,
            cleanliness: form.cleanliness,
            study: form.study,
            smoking: form.smoking,
            noise: form.noise,
          },
        }),
      };

      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Registration failed. Please try again.");
        return;
      }

      setSuccess("Account created. OTP sent to your email. Redirecting...");

      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email: data?.data?.email || form.email },
        });
      }, 1000);
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  return (
    <>
      <style>{css}</style>
      <div className="auth-root">
        <div className="auth-left">
          <div className="auth-dots" />

          <div className="auth-logo">
            <div className="auth-logo-icon">N</div>
            <span className="auth-logo-name">NestMate</span>
          </div>

          <div className="auth-left-body">
            <div className="auth-left-tagline">
              Join <span>thousands</span> of
              <br />
              students finding
              <br />
              their perfect home.
            </div>
            <p className="auth-left-sub">
              Set up your profile in minutes. Our AI will handle the rest —
              matching you with compatible roommates and ideal rooms.
            </p>

            <div className="steps-preview">
              {STEPS.map((s, i) => {
                const n = i + 1;
                const cls = n < step ? "done" : n === step ? "active" : "pending";
                return (
                  <div key={s} className="step-item">
                    <div className={`step-num ${cls}`}>{n < step ? "✓" : n}</div>
                    <div className={`step-label ${n === step ? "active-label" : ""}`}>{s}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="auth-left-footer">© 2026 NestMate. All rights reserved.</div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <div className="progress-wrap">
              <div className="progress-top">
                <span className="progress-label">Registration</span>
                <span className="progress-step">
                  Step {step} of {STEPS.length}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                />
              </div>
            </div>

            {error && <div className="auth-error">⚠ {error}</div>}
            {success && <div className="auth-success">✓ {success}</div>}

            {step === 1 && (
              <>
                <div className="auth-card-header">
                  <div className="auth-card-title">Who are you? 🏠</div>
                  <div className="auth-card-sub">
                    Already have an account? <a onClick={() => navigate("/login")}>Sign in</a>
                  </div>
                </div>

                <div className="role-cards">
                  <div
                    className={`role-card ${form.role === "student" ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, role: "student" })}
                  >
                    <div className="role-card-icon">🎓</div>
                    <div className="role-card-name">Student</div>
                    <div className="role-card-desc">
                      Looking for a room and compatible roommates
                    </div>
                  </div>
                  <div
                    className={`role-card ${form.role === "admin" ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, role: "admin" })}
                  >
                    <div className="role-card-icon">🛡</div>
                    <div className="role-card-name">Admin</div>
                    <div className="role-card-desc">
                      Managing hostel rooms and student requests
                    </div>
                  </div>
                </div>

                <div className="auth-nav">
                  <button className="btn-next" onClick={handleNext}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="auth-card-header">
                  <div className="auth-card-title">Basic Info ✏️</div>
                  <div className="auth-card-sub">Set up your NestMate account</div>
                </div>

                <div className="input-group">
                  <div className="input-wrap">
                    <label className="input-label">Full Name</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Alex Johnson"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="input-wrap">
                    <label className="input-label">Email Address</label>
                    <input
                      className="input-field"
                      placeholder="you@university.edu"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="input-wrap">
                    <label className="input-label">Password</label>
                    <div className="input-field-wrap">
                      <input
                        className="input-field"
                        type={showPass ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        style={{ paddingRight: "42px" }}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleNext()}
                      />
                      <span className="input-icon" onClick={() => setShowPass((p) => !p)}>
                        {showPass ? "🙈" : "👁"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="auth-nav">
                  <button className="btn-back" onClick={goBack}>
                    ← Back
                  </button>
                  <button className="btn-next" onClick={handleNext}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {step === 3 && form.role === "student" && (
              <>
                <div className="auth-card-header">
                  <div className="auth-card-title">Your Preferences 🌙</div>
                  <div className="auth-card-sub">Help us find your ideal roommate match</div>
                </div>

                <div className="pref-grid">
                  <div className="pref-item">
                    <label className="pref-label">🌙 Sleep Schedule</label>
                    <select
                      className="pref-select"
                      value={form.sleep}
                      onChange={(e) => setForm({ ...form, sleep: e.target.value })}
                    >
                      <option value="">Select...</option>
                      <option value="early">Early Bird</option>
                      <option value="late">Night Owl</option>
                    </select>
                  </div>

                  <div className="pref-item">
                    <label className="pref-label">📚 Study Style</label>
                    <select
                      className="pref-select"
                      value={form.study}
                      onChange={(e) => setForm({ ...form, study: e.target.value })}
                    >
                      <option value="">Select...</option>
                      <option value="silent">Silent Solo</option>
                      <option value="group">Group Study</option>
                    </select>
                  </div>

                  <div className="pref-item">
                    <label className="pref-label">🚬 Smoking</label>
                    <select
                      className="pref-select"
                      value={form.smoking}
                      onChange={(e) => setForm({ ...form, smoking: e.target.value })}
                    >
                      <option value="">Select...</option>
                      <option value="no">Non-Smoker</option>
                      <option value="yes">Smoker</option>
                    </select>
                  </div>

                  <div className="pref-item">
                    <label className="pref-label">🔊 Noise Tolerance</label>
                    <select
                      className="pref-select"
                      value={form.noise}
                      onChange={(e) => setForm({ ...form, noise: e.target.value })}
                    >
                      <option value="">Select...</option>
                      <option value="low">Low — Quiet space</option>
                      <option value="medium">Medium — Some noise ok</option>
                      <option value="high">High — Very social</option>
                    </select>
                  </div>

                  <div className="pref-item clean-wrap">
                    <label className="pref-label">🧹 Cleanliness Level — {form.cleanliness}/5</label>
                    <div className="clean-track">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className={`clean-dot ${n <= form.cleanliness ? "filled" : ""}`}
                          onClick={() => setForm({ ...form, cleanliness: n })}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="auth-nav">
                  <button className="btn-back" onClick={goBack} disabled={loading}>
                    ← Back
                  </button>
                  <button className="btn-next success" onClick={handleRegister} disabled={loading}>
                    {loading ? (
                      <>
                        <div className="spinner" /> Creating...
                      </>
                    ) : (
                      "✓ Create Account"
                    )}
                  </button>
                </div>
              </>
            )}

            {step === 3 && form.role === "admin" && (
              <>
                <div className="auth-card-header">
                  <div className="auth-card-title">Admin Setup 🛡</div>
                  <div className="auth-card-sub">
                    No lifestyle preferences needed for admin accounts
                  </div>
                </div>

                <div className="admin-note">
                  <strong>You're registering as an Admin.</strong>
                  <br />
                  Your account will have access to room management, student request approvals,
                  and system analytics.
                </div>

                <div className="auth-nav">
                  <button className="btn-back" onClick={goBack} disabled={loading}>
                    ← Back
                  </button>
                  <button className="btn-next success" onClick={handleRegister} disabled={loading}>
                    {loading ? (
                      <>
                        <div className="spinner" /> Registering...
                      </>
                    ) : (
                      "✓ Register as Admin"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;