import Layout from "../../components/Layout";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ══════════════════════════════════════
   ROOT & BACKGROUND
══════════════════════════════════════ */
.sd-root {
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  color: #0f172a;
  position: relative;
  overflow-x: hidden;
  background: #e8f4f8;
}

/* Mesh gradient background */
.sd-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 10% 0%, rgba(88,228,222,0.22) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 90% 10%, rgba(147,197,253,0.2) 0%, transparent 55%),
    radial-gradient(ellipse 50% 60% at 50% 100%, rgba(196,181,253,0.15) 0%, transparent 60%),
    radial-gradient(ellipse 70% 40% at 80% 80%, rgba(110,231,183,0.12) 0%, transparent 50%),
    linear-gradient(160deg, #dff6f5 0%, #e8f0fb 40%, #ede8fc 100%);
  z-index: 0;
  pointer-events: none;
}

/* Floating orbs */
.sd-root::after {
  content: '';
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(88,228,222,0.12) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  z-index: 0;
  pointer-events: none;
  animation: orb-drift 12s ease-in-out infinite alternate;
}

@keyframes orb-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-40px, 60px) scale(1.1); }
}

.sd-page {
  position: relative;
  z-index: 1;
  padding: 28px 32px;
  max-width: 1440px;
  margin: 0 auto;
}

/* ══════════════════════════════════════
   GLASS UTILITY
══════════════════════════════════════ */
.glass {
  background: rgba(255,255,255,0.58);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border: 1px solid rgba(255,255,255,0.75);
  box-shadow: 0 8px 32px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.9);
}

.glass-dark {
  background: rgba(15,23,42,0.72);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}

.glass-teal {
  background: rgba(88,228,222,0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(88,228,222,0.35);
  box-shadow: 0 4px 20px rgba(88,228,222,0.15);
}

/* ══════════════════════════════════════
   HEADER
══════════════════════════════════════ */
.sd-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.sd-title-wrap h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.1rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #0f172a;
  line-height: 1.05;
  margin-bottom: 5px;
}

.sd-title-wrap p {
  font-size: 0.94rem;
  color: #64748b;
  font-weight: 400;
}

.sd-header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sd-date-chip {
  border-radius: 14px;
  padding: 10px 18px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
}

.sd-notif-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  border: none;
  position: relative;
}

.sd-notif-btn .dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #fff;
}

/* ══════════════════════════════════════
   STAT CARDS ROW
══════════════════════════════════════ */
.sd-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.sd-stat {
  border-radius: 22px;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.sd-stat:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(15,23,42,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
}

.sd-stat::after {
  content: '';
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  pointer-events: none;
}

.sd-stat-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.sd-stat-kicker {
  font-size: 0.68rem;
  letter-spacing: 0.13em;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
}

.sd-stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}

.sd-stat-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.1rem;
  font-weight: 900;
  line-height: 1;
  color: #0f172a;
  letter-spacing: -0.04em;
}

.sd-stat-sub {
  font-size: 0.83rem;
  color: #475569;
  line-height: 1.45;
  font-weight: 500;
}

.sd-stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(34,197,94,0.12);
  color: #16a34a;
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 0.7rem;
  font-weight: 800;
}

/* ══════════════════════════════════════
   MAIN GRID LAYOUT
══════════════════════════════════════ */
.sd-main {
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.85fr;
  gap: 20px;
  margin-bottom: 20px;
  align-items: start;
}

/* ══════════════════════════════════════
   ROOM CARD
══════════════════════════════════════ */
.sd-room-card {
  border-radius: 24px;
  overflow: hidden;
}

.sd-room-image-wrap {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.sd-room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.sd-room-card:hover .sd-room-image {
  transform: scale(1.04);
}

.sd-room-fallback {
  height: 180px;
  background: linear-gradient(135deg, rgba(88,228,222,0.3), rgba(147,197,253,0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.sd-room-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15,23,42,0.55) 0%, transparent 55%);
}

.sd-room-img-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(88,228,222,0.9);
  backdrop-filter: blur(8px);
  color: #0a3534;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.sd-room-img-price {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: rgba(15,23,42,0.75);
  backdrop-filter: blur(8px);
  color: #fff;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
}

.sd-room-body {
  padding: 20px;
}

.sd-room-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.55rem;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
  line-height: 1.1;
}

.sd-room-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
  margin-bottom: 18px;
}

.sd-meta-label {
  font-size: 0.64rem;
  color: #94a3b8;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.sd-meta-value {
  font-size: 0.92rem;
  color: #1e293b;
  font-weight: 700;
  line-height: 1.4;
}

/* Occupancy progress bar */
.sd-occupancy {
  margin-bottom: 18px;
}

.sd-occupancy-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
}

.sd-occupancy-label span {
  font-size: 0.78rem;
  font-weight: 700;
  color: #64748b;
}

.sd-occ-bar {
  height: 7px;
  border-radius: 999px;
  background: rgba(15,23,42,0.08);
  overflow: hidden;
}

.sd-occ-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #58e4de, #34d399);
  transition: width 0.6s ease;
}

.sd-room-footer {
  border-top: 1px solid rgba(15,23,42,0.07);
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.sd-location {
  font-size: 0.84rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.sd-action-outline {
  border: 1px solid rgba(88,228,222,0.5);
  background: rgba(88,228,222,0.1);
  color: #0f766e;
  border-radius: 12px;
  padding: 9px 16px;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.18s;
}

.sd-action-outline:hover {
  background: rgba(88,228,222,0.2);
}

/* ══════════════════════════════════════
   ROOMMATE MATCH CARD
══════════════════════════════════════ */
.sd-match-card {
  border-radius: 24px;
  padding: 22px;
}

.sd-match-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}

.sd-match-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 3px;
}

.sd-match-sub {
  font-size: 0.82rem;
  color: #64748b;
}

.sd-score-ring {
  position: relative;
  width: 66px;
  height: 66px;
  flex-shrink: 0;
}

.sd-score-ring svg {
  transform: rotate(-90deg);
}

.sd-score-ring circle {
  fill: none;
  stroke-width: 6;
}

.sd-score-ring .track { stroke: rgba(15,23,42,0.08); }
.sd-score-ring .fill  { stroke: #58e4de; stroke-linecap: round; transition: stroke-dashoffset 0.8s ease; }

.sd-score-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.sd-score-num {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1;
}

.sd-score-pct {
  font-size: 0.55rem;
  color: #64748b;
  font-weight: 700;
}

.sd-match-person {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 16px;
  border-radius: 18px;
  background: rgba(88,228,222,0.08);
  border: 1px solid rgba(88,228,222,0.2);
  margin-bottom: 16px;
}

.sd-avatar {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #58e4de, #93c5fd);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 900;
  font-family: 'Plus Jakarta Sans', sans-serif;
  flex-shrink: 0;
  position: relative;
}

.sd-online-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #fff;
}

.sd-person-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 3px;
}

.sd-person-sub {
  font-size: 0.82rem;
  color: #64748b;
}

/* Compatibility bars */
.sd-compat-list {
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}

.sd-compat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sd-compat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  width: 90px;
  flex-shrink: 0;
}

.sd-compat-bar {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: rgba(15,23,42,0.07);
  overflow: hidden;
}

.sd-compat-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #58e4de, #34d399);
}

.sd-compat-pct {
  font-size: 0.72rem;
  font-weight: 800;
  color: #0f172a;
  width: 32px;
  text-align: right;
  flex-shrink: 0;
}

.sd-pill-row {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.sd-pill {
  padding: 5px 11px;
  background: rgba(15,23,42,0.05);
  border: 1px solid rgba(15,23,42,0.09);
  color: #475569;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.sd-btn-col { display: grid; gap: 10px; }

.sd-primary-btn {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #58e4de, #34c7c1);
  color: #0a3534;
  border-radius: 14px;
  padding: 13px 14px;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: transform 0.16s, box-shadow 0.16s;
  box-shadow: 0 4px 16px rgba(88,228,222,0.35);
}

.sd-primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(88,228,222,0.45);
}

.sd-secondary-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.sd-soft-btn {
  border: 1px solid rgba(15,23,42,0.1);
  background: rgba(255,255,255,0.7);
  color: #374151;
  border-radius: 13px;
  padding: 11px 12px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.16s;
}

.sd-soft-btn:hover { background: rgba(255,255,255,0.95); }

/* ══════════════════════════════════════
   RIGHT SIDEBAR STACK
══════════════════════════════════════ */
.sd-side-stack { display: grid; gap: 16px; }

/* Quick Actions */
.sd-quick-card {
  border-radius: 22px;
  padding: 20px;
}

.sd-section-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.92rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}

.quick-list { display: grid; gap: 8px; }

.quick-btn {
  border: 1px solid rgba(15,23,42,0.08);
  background: rgba(255,255,255,0.65);
  border-radius: 14px;
  padding: 13px 15px;
  font-size: 0.86rem;
  font-weight: 700;
  color: #1e293b;
  text-align: left;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.18s;
}

.quick-btn:hover {
  background: rgba(255,255,255,0.9);
  transform: translateX(3px);
}

.quick-btn.primary {
  background: linear-gradient(135deg, #58e4de, #34c7c1);
  color: #0a3534;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(88,228,222,0.3);
}

.quick-btn.primary:hover {
  transform: translateX(3px);
  box-shadow: 0 6px 20px rgba(88,228,222,0.4);
}

.quick-btn-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* Facility Status */
.sd-facility-card {
  border-radius: 22px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(219,243,255,0.7), rgba(220,252,246,0.7));
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.75);
}

.facility-sub {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 14px;
  font-weight: 500;
}

.facility-list { display: grid; gap: 8px; }

.facility-item {
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.8);
  border-radius: 13px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.facility-name {
  font-size: 0.84rem;
  font-weight: 700;
  color: #1e293b;
}

.facility-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #16a34a;
}

.facility-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

/* ══════════════════════════════════════
   BOTTOM GRID (feed + notices + weather)
══════════════════════════════════════ */
.sd-bottom {
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.85fr;
  gap: 20px;
}

/* Activity Feed */
.sd-feed-card {
  border-radius: 24px;
  padding: 22px;
}

.sd-feed-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
  gap: 12px;
}

.sd-feed-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 3px;
}

.sd-feed-sub {
  font-size: 0.82rem;
  color: #64748b;
}

.sd-view-link {
  border: none;
  background: rgba(88,228,222,0.12);
  color: #0f766e;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  border-radius: 999px;
  padding: 6px 14px;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
  border: 1px solid rgba(88,228,222,0.3);
}

.sd-activity-list { display: grid; }

.sd-activity-item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  padding: 14px 0;
  border-top: 1px solid rgba(15,23,42,0.05);
}

.sd-activity-item:first-child { border-top: none; }

.sd-activity-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sd-activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 13px;
  background: rgba(15,23,42,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.sd-activity-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
}

.sd-activity-time {
  font-size: 0.78rem;
  color: #94a3b8;
}

.sd-activity-badge {
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  white-space: nowrap;
}

.badge-progress { background: rgba(59,130,246,0.1); color: #1d4ed8; }
.badge-action   { background: rgba(245,158,11,0.12); color: #b45309; }
.badge-success  { background: rgba(34,197,94,0.12); color: #15803d; }
.badge-pending  { background: rgba(15,23,42,0.07); color: #475569; }

.sd-empty {
  font-size: 0.88rem;
  color: #94a3b8;
  padding: 20px 0 6px;
  text-align: center;
}

/* ══════════════════════════════════════
   NOTICES CARD
══════════════════════════════════════ */
.sd-notices-card {
  border-radius: 24px;
  padding: 22px;
}

.sd-notice-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 13px 0;
  border-top: 1px solid rgba(15,23,42,0.05);
}

.sd-notice-item:first-child { border-top: none; }

.sd-notice-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.dot-teal   { background: #58e4de; }
.dot-amber  { background: #f59e0b; }
.dot-blue   { background: #60a5fa; }
.dot-green  { background: #34d399; }

.sd-notice-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3px;
}

.sd-notice-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* ══════════════════════════════════════
   HELP CARD
══════════════════════════════════════ */
.sd-help-card {
  border-radius: 24px;
  padding: 22px;
  background: linear-gradient(145deg, rgba(15,23,42,0.82), rgba(30,41,59,0.85));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sd-help-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: rgba(88,228,222,0.15);
  border: 1px solid rgba(88,228,222,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.sd-help-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 6px;
}

.sd-help-sub {
  font-size: 0.83rem;
  color: #94a3b8;
  line-height: 1.65;
}

.sd-help-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.sd-help-stat {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 12px;
}

.sd-help-stat-val {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.3rem;
  font-weight: 900;
  color: #58e4de;
  margin-bottom: 2px;
}

.sd-help-stat-label {
  font-size: 0.68rem;
  color: #64748b;
  font-weight: 700;
}

.sd-help-btn {
  border: none;
  background: linear-gradient(135deg, #58e4de, #34c7c1);
  color: #0a3534;
  border-radius: 14px;
  padding: 13px;
  font-size: 0.86rem;
  font-weight: 800;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  text-align: center;
  transition: transform 0.16s, box-shadow 0.16s;
  box-shadow: 0 4px 16px rgba(88,228,222,0.3);
}

.sd-help-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(88,228,222,0.4);
}

/* ══════════════════════════════════════
   LOADING
══════════════════════════════════════ */
.sd-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-size: 0.95rem;
  color: #64748b;
  gap: 10px;
}

/* ══════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════ */
@media (max-width: 1280px) {
  .sd-stats { grid-template-columns: repeat(2, 1fr); }
  .sd-main  { grid-template-columns: 1fr 1fr; }
  .sd-bottom { grid-template-columns: 1fr 1fr; }
  .sd-side-stack { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
}

@media (max-width: 900px) {
  .sd-main   { grid-template-columns: 1fr; }
  .sd-bottom { grid-template-columns: 1fr; }
  .sd-side-stack { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .sd-page  { padding: 16px; }
  .sd-stats { grid-template-columns: 1fr 1fr; }
  .sd-title-wrap h1 { font-size: 1.6rem; }
}
`;

/* ══ HELPERS ══ */
function initials(name = "Student") {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function timeAgo(dateStr) {
  if (!dateStr) return "Unknown time";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString();
}

function formatLKR(value) {
  if (value == null || value === "") return "N/A";
  return `LKR ${Number(value).toLocaleString("en-LK")}`;
}

function statusBadge(text = "") {
  const v = text.toLowerCase();
  if (v.includes("progress")) return "badge-progress";
  if (v.includes("required") || v.includes("action")) return "badge-action";
  if (v.includes("success") || v.includes("approved") || v.includes("resolved")) return "badge-success";
  return "badge-pending";
}

/* Score ring component */
function ScoreRing({ score }) {
  const r = 27;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="sd-score-ring">
      <svg width="66" height="66" viewBox="0 0 66 66">
        <circle className="track" cx="33" cy="33" r={r} />
        <circle
          className="fill"
          cx="33"
          cy="33"
          r={r}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="sd-score-text">
        <span className="sd-score-num">{score}</span>
        <span className="sd-score-pct">%</span>
      </div>
    </div>
  );
}

const NOTICES = [
  { color: "dot-amber", title: "Hostel fees due by 15th April", date: "2 days ago" },
  { color: "dot-teal",  title: "Water maintenance on Sunday 7–9 AM", date: "3 days ago" },
  { color: "dot-blue",  title: "Room inspection scheduled next week", date: "5 days ago" },
  { color: "dot-green", title: "Laundry room hours extended to 10 PM", date: "1 week ago" },
];

function StudentDashboard() {
  const [user,       setUser]       = useState(null);
  const [rooms,      setRooms]      = useState([]);
  const [matches,    setMatches]    = useState([]);
  const [requests,   setRequests]   = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [leaves,     setLeaves]     = useState([]);
  const [visitors,   setVisitors]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const { showToast } = useToast();

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [meRes, roomsRes, matchesRes, requestsRes, complaintsRes, leavesRes, visitorsRes] =
        await Promise.all([
          axios.get(`${API}/users/me`,       { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/rooms`,           { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/matches/me`,      { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/requests/my`,     { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/complaints/my`,   { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/leaves/my`,       { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/visitors/my`,     { headers: { Authorization: `Bearer ${token}` } }),
        ]);

      setUser(meRes.data?.user || meRes.data);
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data.rooms || []);
      setMatches(Array.isArray(matchesRes.data) ? matchesRes.data : []);
      setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : requestsRes.data.requests || []);
      setComplaints(Array.isArray(complaintsRes.data) ? complaintsRes.data : complaintsRes.data.complaints || []);
      setLeaves(Array.isArray(leavesRes.data) ? leavesRes.data : leavesRes.data.leaves || []);
      setVisitors(Array.isArray(visitorsRes.data) ? visitorsRes.data : visitorsRes.data.visitors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assignedRoom = useMemo(() => {
    if (!user?._id) return null;
    return rooms.find((room) =>
      (room.occupants || []).some((occ) => {
        const id = typeof occ === "string" ? occ : occ?._id;
        return id === user._id;
      })
    );
  }, [rooms, user]);

  const topMatch       = useMemo(() => (matches.length ? matches[0] : null), [matches]);
  const pendingReqs    = useMemo(() => requests.filter((r) => (r.status || "").toLowerCase() === "pending").length, [requests]);
  const resolvedComps  = useMemo(() => complaints.filter((c) => (c.status || "").toLowerCase().includes("resolv")).length, [complaints]);

  const occupancyPct = assignedRoom
    ? Math.round(((assignedRoom.occupants?.length || 1) / (assignedRoom.capacity || 2)) * 100)
    : 0;

  const roomImage = assignedRoom?.images?.[0] ? `http://localhost:5000/${assignedRoom.images[0]}` : null;

  const activityFeed = useMemo(() => {
    const items = [];
    complaints.forEach((c) => items.push({ icon: "⚠️", title: `${c.title || "Complaint"} updated`, time: c.updatedAt || c.createdAt, badge: c.status || "Pending" }));
    requests.forEach((r)   => items.push({ icon: "👥", title: `Room request – ${r.room?.roomNumber || "pending"}`, time: r.createdAt, badge: (r.status || "").toLowerCase() === "pending" ? "Action Required" : r.status || "Pending" }));
    leaves.forEach((l)     => items.push({ icon: "🛫", title: "Leave request submitted", time: l.createdAt, badge: l.status || "Pending" }));
    visitors.forEach((v)   => items.push({ icon: "👤", title: `Visitor – ${v.visitorName || "pending"}`, time: v.createdAt, badge: v.status || "Pending" }));
    return items.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);
  }, [complaints, requests, leaves, visitors]);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  if (loading) {
    return (
      <Layout role="student">
        <style>{css}</style>
        <div className="sd-root">
          <div className="sd-page">
            <div className="sd-loading">⏳ Loading your dashboard…</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="student">
      <style>{css}</style>
      <div className="sd-root">
        <div className="sd-page">

          {/* ── HEADER ── */}
          <div className="sd-header">
            <div className="sd-title-wrap">
              <h1>Welcome back, {user?.name?.split(" ")[0] || "Student"} 👋</h1>
              <p>Here's everything happening with your residence today.</p>
            </div>
            <div className="sd-header-right">
              <div className="sd-date-chip glass">{today}</div>
              <button className="sd-notif-btn glass">
                🔔
                <span className="dot" />
              </button>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="sd-stats">
            <div className="sd-stat glass">
              <div className="sd-stat-top">
                <span className="sd-stat-kicker">Room Status</span>
                <div className="sd-stat-icon">🏠</div>
              </div>
              <div>
                <div className="sd-stat-value">{assignedRoom ? "Assigned" : "Open"}</div>
                <div className="sd-stat-sub">
                  {assignedRoom
                    ? `${assignedRoom.roomNumber}${assignedRoom.location ? ` · ${assignedRoom.location}` : ""}`
                    : "No room assigned yet"}
                </div>
              </div>
              {assignedRoom && <span className="sd-stat-trend">✓ Active</span>}
            </div>

            <div className="sd-stat glass">
              <div className="sd-stat-top">
                <span className="sd-stat-kicker">Top Match</span>
                <div className="sd-stat-icon">👥</div>
              </div>
              <div>
                <div className="sd-stat-value">{topMatch ? `${topMatch.score}%` : "--"}</div>
                <div className="sd-stat-sub">
                  {topMatch ? `Best match: ${topMatch.name}` : "Complete preferences to match"}
                </div>
              </div>
            </div>

            <div className="sd-stat glass">
              <div className="sd-stat-top">
                <span className="sd-stat-kicker">Pending</span>
                <div className="sd-stat-icon">🕒</div>
              </div>
              <div>
                <div className="sd-stat-value">{String(pendingReqs).padStart(2, "0")}</div>
                <div className="sd-stat-sub">{requests.length} total request{requests.length !== 1 ? "s" : ""}</div>
              </div>
            </div>

            <div className="sd-stat glass">
              <div className="sd-stat-top">
                <span className="sd-stat-kicker">Complaints</span>
                <div className="sd-stat-icon">✅</div>
              </div>
              <div>
                <div className="sd-stat-value">{resolvedComps}</div>
                <div className="sd-stat-sub">{complaints.length} total, {resolvedComps} resolved</div>
              </div>
              {resolvedComps > 0 && <span className="sd-stat-trend">↑ Resolved</span>}
            </div>
          </div>

          {/* ── MAIN 3-COL ── */}
          <div className="sd-main">

            {/* Room Card */}
            <div className="sd-room-card glass">
              <div className="sd-room-image-wrap">
                {roomImage
                  ? <img src={roomImage} alt="Room" className="sd-room-image" />
                  : <div className="sd-room-fallback">🏢</div>
                }
                <div className="sd-room-overlay" />
                <div className="sd-room-img-badge">{assignedRoom ? "Assigned" : "No Room"}</div>
                {assignedRoom?.price && (
                  <div className="sd-room-img-price">{formatLKR(assignedRoom.price)} / mo</div>
                )}
              </div>

              <div className="sd-room-body">
                <div className="sd-room-name">
                  {assignedRoom
                    ? `${assignedRoom.roomNumber}${assignedRoom.type ? ` · ${assignedRoom.type}` : ""}`
                    : "Browse Available Rooms"}
                </div>

                <div className="sd-room-grid">
                  <div>
                    <div className="sd-meta-label">Room Number</div>
                    <div className="sd-meta-value">{assignedRoom?.roomNumber || "N/A"}</div>
                  </div>
                  <div>
                    <div className="sd-meta-label">Type</div>
                    <div className="sd-meta-value">{assignedRoom?.type || "N/A"}</div>
                  </div>
                  <div>
                    <div className="sd-meta-label">Price</div>
                    <div className="sd-meta-value">{formatLKR(assignedRoom?.price)}</div>
                  </div>
                  <div>
                    <div className="sd-meta-label">Capacity</div>
                    <div className="sd-meta-value">{assignedRoom?.capacity ? `${assignedRoom.capacity} Students` : "N/A"}</div>
                  </div>
                  <div>
                    <div className="sd-meta-label">Status</div>
                    <div className="sd-meta-value">{assignedRoom?.status || "Not assigned"}</div>
                  </div>
                  <div>
                    <div className="sd-meta-label">Last Request</div>
                    <div className="sd-meta-value">{requests.length ? formatDate(requests[0]?.createdAt) : "None"}</div>
                  </div>
                </div>

                {assignedRoom && (
                  <div className="sd-occupancy">
                    <div className="sd-occupancy-label">
                      <span>Occupancy</span>
                      <span>{assignedRoom.occupants?.length || 1}/{assignedRoom.capacity || 2} students</span>
                    </div>
                    <div className="sd-occ-bar">
                      <div className="sd-occ-fill" style={{ width: `${occupancyPct}%` }} />
                    </div>
                  </div>
                )}

                <div className="sd-room-footer">
                  <div className="sd-location">
                    📍 {assignedRoom?.location || "Campus"}
                    {assignedRoom?.district ? `, ${assignedRoom.district}` : ""}
                  </div>
                  <button className="sd-action-outline" onClick={() => window.location.href = "/rooms"}>
                    View Details →
                  </button>
                </div>
              </div>
            </div>

            {/* Roommate Match Card */}
            <div className="sd-match-card glass">
              <div className="sd-match-header">
                <div>
                  <div className="sd-match-title">Best Roommate Match</div>
                  <div className="sd-match-sub">Based on your preference profile</div>
                </div>
                {topMatch && <ScoreRing score={topMatch.score} />}
              </div>

              {topMatch ? (
                <>
                  <div className="sd-match-person">
                    <div className="sd-avatar" style={{ position: "relative" }}>
                      {initials(topMatch.name)}
                      <div className="sd-online-dot" />
                    </div>
                    <div>
                      <div className="sd-person-name">{topMatch.name}</div>
                      <div className="sd-person-sub">{topMatch.meta || "Compatible roommate"}</div>
                    </div>
                  </div>

                  {/* Compatibility bars */}
                  <div className="sd-compat-list">
                    <div className="sd-compat-item">
                      <span className="sd-compat-label">Sleep schedule</span>
                      <div className="sd-compat-bar"><div className="sd-compat-fill" style={{ width: "88%" }} /></div>
                      <span className="sd-compat-pct">88%</span>
                    </div>
                    <div className="sd-compat-item">
                      <span className="sd-compat-label">Study habits</span>
                      <div className="sd-compat-bar"><div className="sd-compat-fill" style={{ width: "74%" }} /></div>
                      <span className="sd-compat-pct">74%</span>
                    </div>
                    <div className="sd-compat-item">
                      <span className="sd-compat-label">Cleanliness</span>
                      <div className="sd-compat-bar"><div className="sd-compat-fill" style={{ width: `${topMatch.score || 80}%` }} /></div>
                      <span className="sd-compat-pct">{topMatch.score || 80}%</span>
                    </div>
                  </div>

                  <div className="sd-pill-row">
                    {(topMatch.reasons || []).length
                      ? topMatch.reasons.map((r, i) => <span key={i} className="sd-pill">{r}</span>)
                      : <>
                          <span className="sd-pill">Early Bird</span>
                          <span className="sd-pill">Quiet Study</span>
                          <span className="sd-pill">Clean Space</span>
                        </>
                    }
                  </div>

                  <div className="sd-btn-col">
                    <button className="sd-primary-btn" onClick={() => window.location.href = "/matching"}>
                      Find Roommates →
                    </button>
                    <div className="sd-secondary-row">
                      <button className="sd-soft-btn" onClick={() => alert("Messaging coming soon")}>💬 Message</button>
                      <button className="sd-soft-btn" onClick={() => window.location.href = "/profile"}>👤 Profile</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="sd-empty">Complete your preferences to see roommate suggestions.</div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="sd-side-stack">
              <div className="sd-quick-card glass">
                <div className="sd-section-title">Quick Actions</div>
                <div className="quick-list">
                  <button className="quick-btn primary" onClick={() => window.location.href = "/complaints"}>
                    <span className="quick-btn-icon">➕</span> Raise Complaint
                  </button>
                  <button className="quick-btn" onClick={() => window.location.href = "/profile"}>
                    <span className="quick-btn-icon">✏️</span> Edit Profile
                  </button>
                  <button className="quick-btn" onClick={() => window.location.href = "/matching"}>
                    <span className="quick-btn-icon">⚙️</span> Matching Prefs
                  </button>
                  <button className="quick-btn" onClick={() => window.location.href = "/leaves"}>
                    <span className="quick-btn-icon">🛫</span> Apply for Leave
                  </button>
                  <button className="quick-btn" onClick={() => window.location.href = "/visitors"}>
                    <span className="quick-btn-icon">👤</span> Register Visitor
                  </button>
                </div>
              </div>

              <div className="sd-facility-card">
                <div className="sd-section-title">Facility Status</div>
                <div className="facility-sub">Live building services</div>
                <div className="facility-list">
                  <div className="facility-item">
                    <div className="facility-name">📶 High-Speed Wi-Fi</div>
                    <div className="facility-badge">LIVE</div>
                  </div>
                  <div className="facility-item">
                    <div className="facility-name">⚡ Electricity</div>
                    <div className="facility-badge">LIVE</div>
                  </div>
                  <div className="facility-item">
                    <div className="facility-name">💧 Water Supply</div>
                    <div className="facility-badge">LIVE</div>
                  </div>
                  <div className="facility-item">
                    <div className="facility-name">🧺 Laundry</div>
                    <div className="facility-badge">LIVE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div className="sd-bottom">

            {/* Activity Feed */}
            <div className="sd-feed-card glass">
              <div className="sd-feed-head">
                <div>
                  <div className="sd-feed-title">Activity Feed</div>
                  <div className="sd-feed-sub">Your latest housing updates</div>
                </div>
                <button className="sd-view-link" onClick={() => window.location.href = "/requests"}>
                  View all →
                </button>
              </div>
              <div className="sd-activity-list">
                {activityFeed.length
                  ? activityFeed.map((item, i) => (
                    <div className="sd-activity-item" key={i}>
                      <div className="sd-activity-left">
                        <div className="sd-activity-icon">{item.icon}</div>
                        <div>
                          <div className="sd-activity-title">{item.title}</div>
                          <div className="sd-activity-time">{timeAgo(item.time)}</div>
                        </div>
                      </div>
                      <div className={`sd-activity-badge ${statusBadge(item.badge)}`}>{item.badge}</div>
                    </div>
                  ))
                  : <div className="sd-empty">No recent activity yet.</div>
                }
              </div>
            </div>

            {/* Notices */}
            <div className="sd-notices-card glass">
              <div className="sd-feed-head" style={{ marginBottom: 4 }}>
                <div>
                  <div className="sd-feed-title">📢 Notices</div>
                  <div className="sd-feed-sub">Announcements from management</div>
                </div>
              </div>
              {NOTICES.map((n, i) => (
                <div className="sd-notice-item" key={i}>
                  <div className={`sd-notice-dot ${n.color}`} />
                  <div>
                    <div className="sd-notice-title">{n.title}</div>
                    <div className="sd-notice-date">{n.date}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Help / Warden Contact */}
            <div className="sd-help-card">
              <div className="sd-help-icon">💬</div>
              <div>
                <div className="sd-help-title">Need Assistance?</div>
                <div className="sd-help-sub">
                  Our support team is available for urgent hostel matters 24/7.
                </div>
              </div>
              <div className="sd-help-stats">
                <div className="sd-help-stat">
                  <div className="sd-help-stat-val">24/7</div>
                  <div className="sd-help-stat-label">Support</div>
                </div>
                <div className="sd-help-stat">
                  <div className="sd-help-stat-val">&lt;2h</div>
                  <div className="sd-help-stat-label">Response</div>
                </div>
              </div>
              <button className="sd-help-btn" onClick={() =>  window.location.href = "/warden-support"}>
                Contact Warden →
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default StudentDashboard;