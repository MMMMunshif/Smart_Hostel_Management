import { useState } from "react";

/* ─────────────────────── CSS ─────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rd-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8f9fb;
    min-height: 100vh;
    color: #1a1d23;
    padding-bottom: 64px;
  }

  /* ── Breadcrumb ── */
  .rd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 24px 32px 0;
    font-size: 0.78rem;
    color: #9aa0ae;
    flex-wrap: wrap;
  }
  .rd-breadcrumb a {
    color: #9aa0ae;
    text-decoration: none;
    cursor: pointer;
    transition: color .15s;
  }
  .rd-breadcrumb a:hover { color: #00b8b0; }
  .rd-breadcrumb .sep { color: #c8cdd8; }
  .rd-breadcrumb .current { color: #1a1d23; font-weight: 600; }

  /* ── Main layout ── */
  .rd-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 28px;
    padding: 20px 32px 0;
    align-items: start;
  }

  /* ── Left column ── */
  /* Hero image */
  .rd-hero {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    height: 340px;
    animation: fadeUp .4s ease both;
  }
  .rd-hero img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }
  .rd-hero-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 28px 24px 20px;
    background: linear-gradient(to top, rgba(10,12,18,.75) 0%, transparent 100%);
  }
  .rd-room-number {
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .rd-room-location {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.82rem; color: rgba(255,255,255,.75);
    margin-top: 4px;
  }
  .rd-hero-tags {
    position: absolute;
    top: 14px; left: 14px;
    display: flex; gap: 8px;
  }
  .rd-hero-tag {
    padding: 5px 13px;
    border-radius: 99px;
    font-size: 0.72rem; font-weight: 700;
    backdrop-filter: blur(10px);
  }
  .rd-hero-tag.primary { background: #00d4c8; color: #fff; }
  .rd-hero-tag.secondary { background: rgba(30,32,40,.65); color: #fff; }

  /* Description */
  .rd-section {
    background: #fff;
    border: 1px solid #eef0f4;
    border-radius: 16px;
    padding: 24px;
    margin-top: 20px;
    animation: fadeUp .4s ease .08s both;
  }
  .rd-section-title {
    font-size: 1rem;
    font-weight: 800;
    color: #1a1d23;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }
  .rd-desc {
    font-size: 0.85rem;
    color: #5a6070;
    line-height: 1.7;
  }

  /* Amenities grid */
  .amenities-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 4px;
  }
  .amenity-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border: 1.5px solid #eef0f4;
    border-radius: 12px;
    background: #fafbfd;
    font-size: 0.8rem;
    font-weight: 600;
    color: #3a4050;
    transition: border-color .15s, background .15s;
    cursor: default;
  }
  .amenity-card:hover { border-color: #00d4c8; background: #f0faf9; }
  .amenity-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: #e8faf9;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Right column (booking panel) ── */
  .rd-panel {
    position: sticky;
    top: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    animation: fadeUp .4s ease .04s both;
  }

  /* Price card */
  .panel-price-card {
    background: #00d4c8;
    border-radius: 18px;
    padding: 22px 24px;
    position: relative;
    overflow: hidden;
  }
  .panel-price-card::before {
    content: '';
    position: absolute;
    right: -20px; top: -20px;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: rgba(255,255,255,.1);
  }
  .panel-price-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,.75);
    margin-bottom: 6px;
  }
  .panel-price-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }
  .panel-price-amount {
    font-size: 2.2rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .panel-price-per {
    font-size: 0.82rem;
    color: rgba(255,255,255,.75);
    margin-bottom: 4px;
  }
  .panel-price-badge {
    padding: 4px 10px;
    background: rgba(255,255,255,.2);
    border-radius: 99px;
    font-size: 0.68rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }

  /* Info card */
  .panel-info-card {
    background: #fff;
    border: 1px solid #eef0f4;
    border-radius: 16px;
    overflow: hidden;
  }
  .panel-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid #f0f2f6;
    font-size: 0.82rem;
  }
  .panel-info-row:last-child { border-bottom: none; }
  .panel-info-label { color: #7a8090; display: flex; align-items: center; gap: 7px; }
  .panel-info-value { font-weight: 700; color: #1a1d23; }

  /* Bed select */
  .panel-bed-card {
    background: #fff;
    border: 1px solid #eef0f4;
    border-radius: 16px;
    padding: 18px 20px;
  }
  .panel-bed-title {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9aa0ae;
    margin-bottom: 12px;
  }
  .bed-option {
    border: 1.5px solid #eef0f4;
    border-radius: 12px;
    padding: 13px 16px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: border-color .15s, background .15s;
  }
  .bed-option:last-child { margin-bottom: 0; }
  .bed-option.selected { border-color: #00d4c8; background: #f0faf9; }
  .bed-option.occupied { opacity: .6; cursor: not-allowed; }
  .bed-option-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
  .bed-name { font-size: 0.88rem; font-weight: 700; color: #1a1d23; }
  .bed-lock { font-size: 0.85rem; color: #c0c5d0; }
  .bed-radio {
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 2px solid #00d4c8;
    background: #00d4c8;
    display: flex; align-items: center; justify-content: center;
  }
  .bed-radio-inner {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #fff;
  }
  .bed-status-text { font-size: 0.72rem; color: #9aa0ae; margin-bottom: 8px; }
  .bed-status-text.available { color: #00b8b0; }

  /* Roommate preview */
  .bed-roommate {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    background: #f5f6f8;
    border-radius: 8px;
  }
  .bed-roommate-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a6c8f4, #00d4c8);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; color: #fff;
    flex-shrink: 0;
  }
  .bed-roommate-name { font-size: 0.78rem; font-weight: 700; color: #1a1d23; }
  .bed-roommate-major { font-size: 0.68rem; color: #9aa0ae; }
  .bed-roommate-match {
    margin-left: auto;
    font-size: 0.72rem; font-weight: 700; color: #00b8b0;
  }

  /* CTA */
  .panel-cta {
    width: 100%;
    padding: 15px;
    background: #00d4c8;
    color: #fff;
    border: none;
    border-radius: 14px;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity .15s, transform .1s;
    letter-spacing: 0.01em;
  }
  .panel-cta:hover { opacity: .88; }
  .panel-cta:active { transform: scale(.98); }

  /* Note */
  .panel-note {
    display: flex;
    gap: 8px;
    font-size: 0.72rem;
    color: #9aa0ae;
    line-height: 1.5;
    padding: 0 4px;
  }
  .panel-note-icon { flex-shrink: 0; margin-top: 1px; }

  /* Virtual tour */
  .panel-vr-card {
    background: #fff;
    border: 1px solid #eef0f4;
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .vr-icon-wrap {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: #e8faf9;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  .vr-text { flex: 1; }
  .vr-text strong { font-size: 0.85rem; font-weight: 700; color: #1a1d23; display: block; }
  .vr-text span { font-size: 0.72rem; color: #9aa0ae; }
  .vr-link {
    font-size: 0.82rem; font-weight: 700; color: #00b8b0;
    background: none; border: none; cursor: pointer; font-family: inherit;
    transition: opacity .15s;
  }
  .vr-link:hover { opacity: .75; }

  /* Responsive */
  @media (max-width: 860px) {
    .rd-layout {
      grid-template-columns: 1fr;
      padding: 16px 16px 0;
    }
    .rd-panel { position: static; }
    .rd-breadcrumb { padding: 20px 16px 0; }
    .amenities-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

/* ─────────────────────── Data ─────────────────────── */
const ROOM_DETAIL = {
  id: "RM-402",
  building: "Global Heights North",
  floor: "4th Floor",
  type: "Premium Twin Sharing",
  price: 1250,
  capacity: 2,
  availableSlots: 1,
  adminFee: 50,
  image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85",
  description:
    "A spacious, naturally lit twin room on the 4th floor. Features high-speed fiber internet, individual study stations, and a shared en-suite bathroom. Recently renovated with modern soft-close cabinetry.",
  amenities: [
    { icon: "📶", label: "Gigabit Wi-Fi" },
    { icon: "❄️", label: "Central AC" },
    { icon: "🖥", label: "Personal Desk" },
    { icon: "🍳", label: "Shared Kitchenette" },
    { icon: "🔐", label: "Smart Lock" },
    { icon: "🏡", label: "Balcony Access" },
  ],
  beds: [
    {
      id: "A",
      label: "Bed A (Window Side)",
      occupied: true,
      roommate: { initials: "MC", name: "Marcus Chen", major: "Computer Science", match: 94 },
    },
    {
      id: "B",
      label: "Bed B (Door Side)",
      occupied: false,
      roommate: null,
    },
  ],
};

/* ─────────────────────── Component ─────────────────────── */
function RoomDetail({ room: propRoom, onBack }) {
  const room = propRoom || ROOM_DETAIL;
  const [selectedBed, setSelectedBed] = useState("B");

  return (
    <>
      <style>{css}</style>
      <div className="rd-page">

        {/* Breadcrumb */}
        <div className="rd-breadcrumb">
          <a onClick={onBack}>‹ Back to Listing</a>
          <span className="sep">/</span>
          <a>{room.building}</a>
          <span className="sep">/</span>
          <span className="current">{room.id}</span>
        </div>

        {/* Main layout */}
        <div className="rd-layout">

          {/* ── LEFT ── */}
          <div>
            {/* Hero */}
            <div className="rd-hero">
              <img src={room.image} alt={room.id} />
              <div className="rd-hero-tags">
                <span className="rd-hero-tag primary">{room.type}</span>
                <span className="rd-hero-tag secondary">{room.floor}</span>
              </div>
              <div className="rd-hero-overlay">
                <div className="rd-room-number">{room.id}</div>
                <div className="rd-room-location">📍 {room.building}</div>
              </div>
            </div>

            {/* Description */}
            <div className="rd-section">
              <div className="rd-section-title">Room Description</div>
              <p className="rd-desc">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="rd-section">
              <div className="rd-section-title">Core Amenities</div>
              <div className="amenities-grid">
                {room.amenities.map(a => (
                  <div key={a.label} className="amenity-card">
                    <div className="amenity-icon">{a.icon}</div>
                    {a.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT (booking panel) ── */}
          <div className="rd-panel">

            {/* Price */}
            <div className="panel-price-card">
              <div className="panel-price-label">Semester Rent</div>
              <div className="panel-price-row">
                <div className="panel-price-amount">${room.price.toLocaleString()}</div>
                <div className="panel-price-per">/sem</div>
                <div className="panel-price-badge">Inclusive of Utilities</div>
              </div>
            </div>

            {/* Info rows */}
            <div className="panel-info-card">
              <div className="panel-info-row">
                <span className="panel-info-label">🛏 Capacity</span>
                <span className="panel-info-value">{room.capacity} Persons</span>
              </div>
              <div className="panel-info-row">
                <span className="panel-info-label">👤 Available Slots</span>
                <span className="panel-info-value">{room.availableSlots} Left</span>
              </div>
              <div className="panel-info-row">
                <span className="panel-info-label">💳 Admin Fee</span>
                <span className="panel-info-value">${room.adminFee}.00</span>
              </div>
            </div>

            {/* Bed selection */}
            <div className="panel-bed-card">
              <div className="panel-bed-title">Select a Bed Slot</div>

              {room.beds.map(bed => (
                <div
                  key={bed.id}
                  className={`bed-option ${bed.occupied ? "occupied" : ""} ${selectedBed === bed.id && !bed.occupied ? "selected" : ""}`}
                  onClick={() => !bed.occupied && setSelectedBed(bed.id)}
                >
                  <div className="bed-option-header">
                    <span className="bed-name">{bed.label}</span>
                    {bed.occupied
                      ? <span className="bed-lock">🔒</span>
                      : selectedBed === bed.id
                        ? <div className="bed-radio"><div className="bed-radio-inner" /></div>
                        : <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid #d0d4dc" }} />
                    }
                  </div>

                  <div className={`bed-status-text ${bed.occupied ? "" : "available"}`}>
                    {bed.occupied ? "Occupied" : "Available for Request"}
                  </div>

                  {bed.roommate && (
                    <div className="bed-roommate">
                      <div className="bed-roommate-avatar">{bed.roommate.initials}</div>
                      <div>
                        <div className="bed-roommate-name">{bed.roommate.name}</div>
                        <div className="bed-roommate-major">{bed.roommate.major}</div>
                      </div>
                      <div className="bed-roommate-match">{bed.roommate.match}% Match</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="panel-cta">
              Request This Room →
            </button>

            {/* Note */}
            <div className="panel-note">
              <span className="panel-note-icon">ⓘ</span>
              Requests are processed on a first-come, first-served basis. Matching with existing roommates is prioritized based on your preferences.
            </div>

            {/* Virtual tour */}
            <div className="panel-vr-card">
              <div className="vr-icon-wrap">🥽</div>
              <div className="vr-text">
                <strong>Virtual Tour Available</strong>
                <span>Explore this room in 360° VR</span>
              </div>
              <button className="vr-link">View</button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default RoomDetail;