import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  .ep-root {
    font-family: 'Inter', sans-serif;
    background: #f4f7fb;
    min-height: 100vh;
    padding: 28px;
    color: #111827;
  }

  .ep-shell {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    gap: 20px;
  }

  .ep-hero {
    background: linear-gradient(135deg, #dff8f6, #eef8ff);
    border: 1px solid #e5f3f1;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 28px rgba(17,24,39,.04);
  }

  .ep-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #8b95a7;
    margin-bottom: 10px;
  }

  .ep-breadcrumb span {
    color: #00b8ae;
    font-weight: 700;
  }

  .ep-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }

  .ep-sub {
    font-size: 0.95rem;
    color: #667085;
    line-height: 1.6;
    max-width: 760px;
  }

  .ep-grid {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 20px;
  }

  .ep-card {
    background: #fff;
    border: 1px solid #e8edf4;
    border-radius: 22px;
    box-shadow: 0 10px 26px rgba(17,24,39,.04);
  }

  .ep-side {
    padding: 20px;
    align-self: start;
    position: sticky;
    top: 84px;
  }

  .ep-avatar {
    width: 82px;
    height: 82px;
    border-radius: 50%;
    background: linear-gradient(135deg, #58e4de, #93c5fd);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    margin-bottom: 14px;
  }

  .ep-side-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .ep-side-sub {
    font-size: 0.86rem;
    color: #6b7280;
    line-height: 1.5;
    margin-bottom: 18px;
  }

  .ep-mini-grid {
    display: grid;
    gap: 12px;
  }

  .ep-mini {
    background: #f8fafc;
    border: 1px solid #edf1f7;
    border-radius: 16px;
    padding: 14px;
  }

  .ep-mini-label {
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #9ca3af;
    margin-bottom: 5px;
  }

  .ep-mini-value {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.4;
  }

  .ep-main {
    padding: 22px;
  }

  .ep-section + .ep-section {
    margin-top: 26px;
    padding-top: 24px;
    border-top: 1px solid #edf2f7;
  }

  .ep-section-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .ep-section-sub {
    font-size: 0.86rem;
    color: #6b7280;
    margin-bottom: 16px;
  }

  .ep-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .ep-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .ep-field.full {
    grid-column: 1 / -1;
  }

  .ep-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #374151;
  }

  .ep-input,
  .ep-select {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    background: #fff;
    padding: 12px 14px;
    font-family: inherit;
    font-size: 0.88rem;
    color: #111827;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
  }

  .ep-input:focus,
  .ep-select:focus {
    border-color: #58e4de;
    box-shadow: 0 0 0 3px rgba(88,228,222,.12);
  }

  .ep-clean-wrap {
    grid-column: 1 / -1;
  }

  .ep-clean-row {
    display: flex;
    gap: 8px;
    margin-top: 6px;
  }

  .ep-clean-dot {
    flex: 1;
    height: 12px;
    border-radius: 999px;
    background: #edf2f7;
    cursor: pointer;
    transition: .15s ease;
  }

  .ep-clean-dot.active {
    background: linear-gradient(90deg, #58e4de, #7dd3fc);
  }

  .ep-note {
    margin-top: 8px;
    font-size: 0.76rem;
    color: #6b7280;
  }

  .ep-actions {
    margin-top: 26px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }

  .ep-btn-outline {
    border: 1.5px solid #e5e7eb;
    background: #fff;
    color: #4b5563;
    border-radius: 14px;
    padding: 12px 16px;
    font-size: 0.86rem;
    font-weight: 700;
    cursor: pointer;
  }

  .ep-btn-primary {
    border: none;
    background: #58e4de;
    color: #0f3d3c;
    border-radius: 14px;
    padding: 12px 18px;
    font-size: 0.86rem;
    font-weight: 800;
    cursor: pointer;
  }

  .ep-btn-primary:disabled {
    opacity: .65;
    cursor: not-allowed;
  }

  .ep-message {
    margin-top: 16px;
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 0.84rem;
    font-weight: 700;
  }

  .ep-message.success {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #c7f0d8;
  }

  .ep-message.error {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }

  @media (max-width: 980px) {
    .ep-grid {
      grid-template-columns: 1fr;
    }

    .ep-side {
      position: static;
    }
  }

  @media (max-width: 720px) {
    .ep-root {
      padding: 16px;
    }

    .ep-form-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function initials(name = "ST") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function profileIntegrity(form) {
  let score = 0;

  if (form.name?.trim()) score += 20;
  if (form.email?.trim()) score += 20;
  if (form.sleep) score += 15;
  if (form.study) score += 15;
  if (form.smoking) score += 10;
  if (form.noise) score += 10;
  if (form.cleanliness) score += 10;

  return score;
}

function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    sleep: "",
    cleanliness: 3,
    study: "",
    smoking: "",
    noise: "",
  });
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data?.user || res.data;
      const prefs = user?.preferences || {};

      setForm({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        sleep: prefs.sleep || "",
        cleanliness: prefs.cleanliness ?? 3,
        study: prefs.study || "",
        smoking: prefs.smoking || "",
        noise: prefs.noise || "",
      });

      setLoading(false);
    } catch (err) {
  showToast("Failed to load profile.", "error");
  setLoading(false);
}
  };

const handleSave = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    const token = localStorage.getItem("token");

    const payload = {
      name: form.name,
      email: form.email,
      preferences: {
        sleep: form.sleep,
        cleanliness: form.cleanliness,
        study: form.study,
        smoking: form.smoking,
        noise: form.noise,
      },
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    const res = await axios.put(`${API}/users/me`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const updatedUser = res.data?.user || res.data;

    if (updatedUser?.name) {
      localStorage.setItem("name", updatedUser.name);
    }

    setForm((prev) => ({ ...prev, password: "" }));
    showToast("Profile updated successfully!", "success");
    setSaving(false);
  } catch (err) {
    showToast(
      err.response?.data?.error || "Failed to update profile.",
      "error"
    );
    setSaving(false);
  }
};

if (loading) {
    return (
      <Layout role="student">
        <style>{css}</style>
        <div className="ep-root">
          <div className="ep-card" style={{ padding: 20 }}>Loading profile editor...</div>
        </div>
      </Layout>
    );
  }

  const score = profileIntegrity(form);

  return (
    <Layout role="student">
      <style>{css}</style>

      <div className="ep-root">
        <div className="ep-shell">
          <div className="ep-hero">
            <div className="ep-breadcrumb">
              Dashboard › Student › <span>Edit Profile</span>
            </div>
            <div className="ep-title">Edit Profile & Preferences</div>
            <div className="ep-sub">
              Keep your personal information and lifestyle preferences updated to improve roommate compatibility and recommendations.
            </div>
          </div>

          <div className="ep-grid">
            <div className="ep-card ep-side">
              <div className="ep-avatar">{initials(form.name || "Student")}</div>
              <div className="ep-side-name">{form.name || "Student"}</div>
              <div className="ep-side-sub">
                Student Account
                <br />
                {form.email || "No email"}
              </div>

              <div className="ep-mini-grid">
                <div className="ep-mini">
                  <div className="ep-mini-label">PROFILE QUALITY</div>
                  <div className="ep-mini-value">{score}% Complete</div>
                </div>

                <div className="ep-mini">
                  <div className="ep-mini-label">SLEEP STYLE</div>
                  <div className="ep-mini-value">{form.sleep || "Not set"}</div>
                </div>

                <div className="ep-mini">
                  <div className="ep-mini-label">STUDY STYLE</div>
                  <div className="ep-mini-value">{form.study || "Not set"}</div>
                </div>

                <div className="ep-mini">
                  <div className="ep-mini-label">SMOKING</div>
                  <div className="ep-mini-value">{form.smoking || "Not set"}</div>
                </div>
              </div>
            </div>

            <form className="ep-card ep-main" onSubmit={handleSave}>
              <div className="ep-section">
                <div className="ep-section-title">Basic Information</div>
                <div className="ep-section-sub">
                  Update your core account details.
                </div>

                <div className="ep-form-grid">
                  <div className="ep-field">
                    <label className="ep-label">Full Name</label>
                    <input
                      className="ep-input"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="ep-field">
                    <label className="ep-label">Email Address</label>
                    <input
                      className="ep-input"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="ep-field full">
                    <label className="ep-label">New Password</label>
                    <input
                      type="password"
                      className="ep-input"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Leave empty if you do not want to change password"
                    />
                  </div>
                </div>
              </div>

              <div className="ep-section">
                <div className="ep-section-title">Lifestyle Preferences</div>
                <div className="ep-section-sub">
                  These settings are used for roommate compatibility and suggested matches.
                </div>

                <div className="ep-form-grid">
                  <div className="ep-field">
                    <label className="ep-label">Sleep Schedule</label>
                    <select
                      className="ep-select"
                      value={form.sleep}
                      onChange={(e) => setForm({ ...form, sleep: e.target.value })}
                    >
                      <option value="">Select sleep schedule</option>
                      <option value="early">Early Bird</option>
                      <option value="late">Night Owl</option>
                    </select>
                  </div>

                  <div className="ep-field">
                    <label className="ep-label">Study Style</label>
                    <select
                      className="ep-select"
                      value={form.study}
                      onChange={(e) => setForm({ ...form, study: e.target.value })}
                    >
                      <option value="">Select study style</option>
                      <option value="silent">Silent Solo</option>
                      <option value="group">Group Study</option>
                    </select>
                  </div>

                  <div className="ep-field">
                    <label className="ep-label">Smoking Preference</label>
                    <select
                      className="ep-select"
                      value={form.smoking}
                      onChange={(e) => setForm({ ...form, smoking: e.target.value })}
                    >
                      <option value="">Select preference</option>
                      <option value="no">Non-Smoker</option>
                      <option value="yes">Smoker</option>
                    </select>
                  </div>

                  <div className="ep-field">
                    <label className="ep-label">Noise Tolerance</label>
                    <select
                      className="ep-select"
                      value={form.noise}
                      onChange={(e) => setForm({ ...form, noise: e.target.value })}
                    >
                      <option value="">Select noise tolerance</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="ep-field ep-clean-wrap">
                    <label className="ep-label">
                      Cleanliness Level — {form.cleanliness}/5
                    </label>

                    <div className="ep-clean-row">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className={`ep-clean-dot ${n <= form.cleanliness ? "active" : ""}`}
                          onClick={() => setForm({ ...form, cleanliness: n })}
                        />
                      ))}
                    </div>

                    <div className="ep-note">
                      Higher values indicate stronger preference for neat and tidy shared spaces.
                    </div>
                  </div>
                </div>
              </div>

              <div className="ep-actions">
                <button
                  type="button"
                  className="ep-btn-outline"
                  onClick={() => window.location.href = "/profile"}
                >
                  Cancel
                </button>

                <button type="submit" className="ep-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

             
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditProfile;