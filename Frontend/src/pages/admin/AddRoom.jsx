import Layout from "../../components/Layout";
import { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .ar-root { font-family: 'Plus Jakarta Sans', sans-serif; }

  .ar-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    gap: 14px; margin-bottom: 22px; flex-wrap: wrap;
  }
  .ar-header h1 {
    font-size: 1.55rem; font-weight: 800; color: #1a1d23; letter-spacing: -0.02em;
  }
  .ar-header p {
    font-size: 0.84rem; color: #8a90a0; margin-top: 4px; line-height: 1.5;
  }

  .ar-actions { display: flex; gap: 10px; }
  .btn-outline {
    padding: 10px 16px; border: 1.5px solid #e2e5ec; border-radius: 10px;
    background: #fff; font-family: inherit; font-size: 0.82rem; font-weight: 600;
    color: #4a5060; cursor: pointer; transition: border-color .15s, color .15s;
  }
  .btn-outline:hover { border-color: #00d4c8; color: #00a99f; }

  .btn-primary {
    padding: 10px 16px; background: #00d4c8; color: #fff; border: none;
    border-radius: 10px; font-family: inherit; font-size: 0.82rem; font-weight: 700;
    cursor: pointer; transition: opacity .15s, transform .1s;
  }
  .btn-primary:hover { opacity: .88; }
  .btn-primary:active { transform: scale(.98); }
  .btn-primary:disabled, .btn-outline:disabled {
    opacity: .65; cursor: not-allowed;
  }

  .ar-grid {
    display: grid; grid-template-columns: 1.35fr 0.95fr; gap: 20px;
  }

  .ar-card {
    background: #fff; border: 1px solid #eef0f4; border-radius: 18px; padding: 20px 22px;
  }

  .ar-section + .ar-section {
    margin-top: 18px; padding-top: 18px; border-top: 1px solid #f1f3f7;
  }

  .section-title {
    font-size: 0.95rem; font-weight: 800; color: #1a1d23; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }

  .section-sub {
    font-size: 0.76rem; color: #8a90a0; margin-top: -6px; margin-bottom: 14px;
  }

  .form-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  }

  .field {
    display: flex; flex-direction: column; gap: 7px;
  }
  .field.full { grid-column: 1 / -1; }

  .label {
    font-size: 0.78rem; font-weight: 700; color: #4a5060;
  }

  .hint {
    font-size: 0.7rem; color: #9aa0ae; margin-top: -2px;
  }

  .input, .select, .textarea {
    width: 100%;
    border: 1.5px solid #e2e5ec;
    border-radius: 12px;
    background: #fff;
    padding: 12px 14px;
    font-family: inherit;
    font-size: 0.84rem;
    color: #1a1d23;
    outline: none;
    transition: border-color .15s, box-shadow .15s, background .15s;
  }

  .input:focus, .select:focus, .textarea:focus {
    border-color: #00d4c8;
    box-shadow: 0 0 0 3px rgba(0,212,200,.10);
  }

  .textarea {
    min-height: 98px; resize: vertical;
  }

  .feature-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  }

  .feature-chip {
    border: 1.5px solid #e7ebf2;
    border-radius: 14px;
    padding: 14px 14px;
    background: #fcfdff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    transition: border-color .15s, background .15s;
  }
  .feature-chip.active {
    border-color: #bdeee9;
    background: #f6fffd;
  }

  .feature-info {
    display: flex; flex-direction: column; gap: 3px;
  }
  .feature-title {
    font-size: 0.8rem; font-weight: 700; color: #1a1d23;
  }
  .feature-sub {
    font-size: 0.71rem; color: #8a90a0;
  }

  .toggle {
    appearance: none;
    width: 42px; height: 24px;
    background: #d9dee8;
    border-radius: 999px;
    position: relative;
    cursor: pointer;
    transition: background .15s;
    flex-shrink: 0;
  }
  .toggle::after {
    content: "";
    position: absolute;
    top: 3px; left: 3px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #fff;
    transition: transform .15s;
    box-shadow: 0 1px 3px rgba(0,0,0,.14);
  }
  .toggle:checked {
    background: #00d4c8;
  }
  .toggle:checked::after {
    transform: translateX(18px);
  }

  .upload-box {
    border: 1.5px dashed #cfd6e4;
    border-radius: 16px;
    padding: 22px;
    text-align: center;
    background: #fbfcfe;
    transition: border-color .15s, background .15s;
  }
  .upload-box:hover {
    border-color: #00d4c8;
    background: #f8fffe;
  }

  .upload-icon {
    font-size: 1.85rem; margin-bottom: 8px;
  }
  .upload-title {
    font-size: 0.88rem; font-weight: 800; color: #1a1d23;
  }
  .upload-sub {
    font-size: 0.75rem; color: #8a90a0; margin-top: 4px; line-height: 1.45;
  }

  .file-input {
    margin-top: 14px; font-family: inherit; font-size: 0.78rem;
  }

  .preview-grid {
    margin-top: 16px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }

  .preview-item {
    border: 1px solid #eef0f4;
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
  }
  .preview-item img {
    width: 100%; height: 120px; object-fit: cover; display: block;
  }
  .preview-name {
    padding: 8px 10px; font-size: 0.71rem; color: #6b7280;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .tips-list {
    display: flex; flex-direction: column; gap: 12px;
  }
  .tip {
    border: 1px solid #eef0f4; border-radius: 14px; padding: 14px; background: #fcfdff;
  }
  .tip-title {
    font-size: 0.81rem; font-weight: 700; color: #1a1d23; margin-bottom: 4px;
  }
  .tip-sub {
    font-size: 0.74rem; color: #8a90a0; line-height: 1.5;
  }

  .status-box {
    margin-bottom: 16px; border-radius: 12px; padding: 12px 14px;
    font-size: 0.82rem; font-weight: 600;
  }
  .status-box.success {
    background: #eafaf5; color: #0f9f6e; border: 1px solid #c9f0df;
  }
  .status-box.error {
    background: #fff3f3; color: #d64747; border: 1px solid #ffd4d4;
  }

  .summary-card {
    background: linear-gradient(135deg, #0d1117 0%, #0f1f25 100%);
    color: #fff;
    border-radius: 18px;
    padding: 18px 18px 16px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
  }
  .summary-card::before {
    content: "";
    position: absolute;
    width: 220px; height: 220px;
    right: -70px; top: -80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,200,.16) 0%, transparent 70%);
  }
  .summary-top {
    position: relative; z-index: 1;
  }
  .summary-label {
    font-size: 0.68rem; letter-spacing: .12em; text-transform: uppercase;
    color: rgba(255,255,255,.55); font-weight: 700;
  }
  .summary-value {
    margin-top: 8px;
    font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em;
  }
  .summary-sub {
    margin-top: 5px; font-size: 0.76rem; color: rgba(255,255,255,.62);
  }

  .submit-row {
    display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px;
  }

  @media (max-width: 980px) {
    .ar-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    .form-grid, .feature-grid, .preview-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Monaragala", "Ratnapura", "Kegalle"
];

function AddRoom() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    roomNumber: "",
    location: "",
    district: "",
    address: "",
    contactNumber: "",
    type: "",
    genderCategory: "Mixed",
    capacity: "",
    price: "",
    distanceToCampus: "",
    bathroomType: "",
    availableFrom: "",
    amenities: "",
  });

  const [features, setFeatures] = useState({
    mealIncluded: false,
    wifiAvailable: false,
    parkingAvailable: false,
    securityAvailable: false,
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const formattedPrice = useMemo(() => {
    if (!form.price) return "LKR 0";
    const value = Number(form.price);
    if (Number.isNaN(value)) return "LKR 0";
    return `LKR ${value.toLocaleString("en-LK")}`;
  }, [form.price]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckbox = (e) => {
    setFeatures((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImages(files);
    setPreviewUrls(files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    })));
  };

  const validate = () => {
    if (
      !form.roomNumber ||
      !form.location ||
      !form.district ||
      !form.address ||
      !form.contactNumber ||
      !form.type ||
      !form.capacity ||
      !form.price
    ) {
      return "Please fill all required fields.";
    }

    if (!/^0\d{9}$/.test(form.contactNumber)) {
      return "Enter a valid Sri Lankan contact number starting with 0.";
    }

    if (Number(form.capacity) < 1) {
      return "Capacity must be at least 1.";
    }

    if (Number(form.price) < 0) {
      return "Price cannot be negative.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const error = validate();
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      Object.keys(features).forEach((key) => {
        formData.append(key, features[key]);
      });

      const amenitiesArray = form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      amenitiesArray.forEach((a) => {
        formData.append("amenities[]", a);
      });

      images.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post(`${API}/rooms`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus({ type: "success", message: "Room added successfully." });

      setTimeout(() => {
        navigate("/admin/rooms");
      }, 900);
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to add room.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="admin">
      <style>{css}</style>

      <div className="ar-root">
        <div className="ar-header">
          <div>
            <h1>Add New Room</h1>
            <p>
              Create a Sri Lanka-ready hostel room listing with local location, contact, pricing,
              and facility details.
            </p>
          </div>

          <div className="ar-actions">
            <button
              className="btn-outline"
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              disabled={loading}
            >
              ← Back
            </button>
            <button
              className="btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Room"}
            </button>
          </div>
        </div>

        {status.message && (
          <div className={`status-box ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="ar-grid">
          <form className="ar-card" onSubmit={handleSubmit}>
            <div className="ar-section">
              <div className="section-title">🏠 Room Basics</div>
              <div className="section-sub">Basic room identity and assignment setup.</div>

              <div className="form-grid">
                <div className="field">
                  <label className="label">Room Number *</label>
                  <input
                    className="input"
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={handleChange}
                    placeholder="e.g. A-101"
                  />
                </div>

                <div className="field">
                  <label className="label">Room Type *</label>
                  <select className="select" name="type" value={form.type} onChange={handleChange}>
                    <option value="">Select type</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Quad">Quad</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label">Capacity *</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                  />
                </div>

                <div className="field">
                  <label className="label">Gender Category *</label>
                  <select
                    className="select"
                    name="genderCategory"
                    value={form.genderCategory}
                    onChange={handleChange}
                  >
                    <option value="Mixed">Mixed</option>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="ar-section">
              <div className="section-title">📍 Location & Contact</div>
              <div className="section-sub">Use local area and hostel contact details for Sri Lankan users.</div>

              <div className="form-grid">
                <div className="field">
                  <label className="label">Location *</label>
                  <input
                    className="input"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Malabe, Peradeniya, Wellawatte"
                  />
                </div>

                <div className="field">
                  <label className="label">District *</label>
                  <select
                    className="select"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                  >
                    <option value="">Select district</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="field full">
                  <label className="label">Address *</label>
                  <textarea
                    className="textarea"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full address of the hostel / boarding place"
                  />
                </div>

                <div className="field">
                  <label className="label">Contact Number *</label>
                  <input
                    className="input"
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleChange}
                    placeholder="e.g. 0771234567"
                  />
                  <div className="hint">Use a Sri Lankan mobile or hostel office number.</div>
                </div>

                <div className="field">
                  <label className="label">Distance to Campus</label>
                  <input
                    className="input"
                    name="distanceToCampus"
                    value={form.distanceToCampus}
                    onChange={handleChange}
                    placeholder="e.g. 1.2 km"
                  />
                </div>
              </div>
            </div>

            <div className="ar-section">
              <div className="section-title">💰 Pricing & Availability</div>

              <div className="form-grid">
                <div className="field">
                  <label className="label">Monthly Rent (LKR) *</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="e.g. 18000"
                  />
                  <div className="hint">{formattedPrice}</div>
                </div>

                <div className="field">
                  <label className="label">Available From</label>
                  <input
                    className="input"
                    type="date"
                    name="availableFrom"
                    value={form.availableFrom}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label className="label">Bathroom Type</label>
                  <select
                    className="select"
                    name="bathroomType"
                    value={form.bathroomType}
                    onChange={handleChange}
                  >
                    <option value="">Select bathroom type</option>
                    <option value="Attached">Attached</option>
                    <option value="Shared">Shared</option>
                  </select>
                </div>

                <div className="field">
                  <label className="label">Amenities</label>
                  <input
                    className="input"
                    name="amenities"
                    value={form.amenities}
                    onChange={handleChange}
                    placeholder="Wi-Fi, AC, Study Desk, Balcony"
                  />
                  <div className="hint">Separate each item with a comma.</div>
                </div>
              </div>
            </div>

            <div className="ar-section">
              <div className="section-title">✨ Facilities</div>

              <div className="feature-grid">
                <div className={`feature-chip ${features.mealIncluded ? "active" : ""}`}>
                  <div className="feature-info">
                    <div className="feature-title">Meals Included</div>
                    <div className="feature-sub">Breakfast / lunch / dinner availability</div>
                  </div>
                  <input
                    className="toggle"
                    type="checkbox"
                    name="mealIncluded"
                    checked={features.mealIncluded}
                    onChange={handleCheckbox}
                  />
                </div>

                <div className={`feature-chip ${features.wifiAvailable ? "active" : ""}`}>
                  <div className="feature-info">
                    <div className="feature-title">Wi-Fi</div>
                    <div className="feature-sub">Internet connectivity available</div>
                  </div>
                  <input
                    className="toggle"
                    type="checkbox"
                    name="wifiAvailable"
                    checked={features.wifiAvailable}
                    onChange={handleCheckbox}
                  />
                </div>

                <div className={`feature-chip ${features.parkingAvailable ? "active" : ""}`}>
                  <div className="feature-info">
                    <div className="feature-title">Parking</div>
                    <div className="feature-sub">Vehicle parking space available</div>
                  </div>
                  <input
                    className="toggle"
                    type="checkbox"
                    name="parkingAvailable"
                    checked={features.parkingAvailable}
                    onChange={handleCheckbox}
                  />
                </div>

                <div className={`feature-chip ${features.securityAvailable ? "active" : ""}`}>
                  <div className="feature-info">
                    <div className="feature-title">Security</div>
                    <div className="feature-sub">Warden / security / monitored entry</div>
                  </div>
                  <input
                    className="toggle"
                    type="checkbox"
                    name="securityAvailable"
                    checked={features.securityAvailable}
                    onChange={handleCheckbox}
                  />
                </div>
              </div>
            </div>

            <div className="submit-row">
              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate("/admin/dashboard")}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Add Room"}
              </button>
            </div>
          </form>

          <div>
            <div className="summary-card">
              <div className="summary-top">
                <div className="summary-label">Room Preview</div>
                <div className="summary-value">
                  {form.roomNumber || "New Room"}
                </div>
                <div className="summary-sub">
                  {form.location || "Location"} • {form.district || "District"} • {formattedPrice}
                </div>
              </div>
            </div>

            <div className="ar-card" style={{ marginBottom: "16px" }}>
              <div className="section-title">🖼 Upload Images</div>
              <div className="section-sub">Upload up to 5 room images. First image will be used as cover.</div>

              <div className="upload-box">
                <div className="upload-icon">📸</div>
                <div className="upload-title">Upload Room Photos</div>
                <div className="upload-sub">
                  JPG, JPEG, PNG supported. Use clear daylight photos for better visibility.
                </div>

                <input
                  className="file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                />
              </div>

              {previewUrls.length > 0 && (
                <div className="preview-grid">
                  {previewUrls.map((item, index) => (
                    <div key={index} className="preview-item">
                      <img src={item.url} alt={item.name} />
                      <div className="preview-name">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="ar-card">
              <div className="section-title">💡 Admin Tips</div>

              <div className="tips-list">
                <div className="tip">
                  <div className="tip-title">Use local place names</div>
                  <div className="tip-sub">
                    Prefer names like Malabe, Nugegoda, Kandy, Peradeniya, Jaffna, or Galle so students can filter easily.
                  </div>
                </div>

                <div className="tip">
                  <div className="tip-title">Always add contact details</div>
                  <div className="tip-sub">
                    Students in Sri Lanka often contact the hostel directly before requesting, so a valid number helps trust.
                  </div>
                </div>

                <div className="tip">
                  <div className="tip-title">Use LKR pricing</div>
                  <div className="tip-sub">
                    Keep monthly rent in rupees so the platform feels natural for local students and parents.
                  </div>
                </div>

                <div className="tip">
                  <div className="tip-title">Facilities improve conversions</div>
                  <div className="tip-sub">
                    Wi-Fi, meals, parking, security, and attached bathroom are strong decision factors for boarding selection.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AddRoom;