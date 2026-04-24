import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

const Icons = {
  Dashboard: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="2" fill="#6366f1" opacity="0.9"/>
      <rect x="14" y="3" width="7" height="7" rx="2" fill="#8b5cf6" opacity="0.9"/>
      <rect x="3" y="14" width="7" height="7" rx="2" fill="#a78bfa" opacity="0.8"/>
      <rect x="14" y="14" width="7" height="7" rx="2" fill="#c4b5fd" opacity="0.8"/>
    </svg>
  ),
  Profile: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill="#0ea5e9"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  Suggested: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f59e0b"/>
    </svg>
  ),
  RoommateRequests: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="8" r="3.5" fill="#10b981"/>
      <path d="M1 20c0-3.3 3.1-6 7-6" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="8" r="3.5" fill="#34d399"/>
      <path d="M23 20c0-3.3-3.1-6-7-6" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Rooms: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="#f97316" opacity="0.9"/>
      <rect x="9" y="13" width="6" height="8" rx="1" fill="#fff" opacity="0.9"/>
    </svg>
  ),
  MyRoom: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="#14b8a6" opacity="0.9"/>
      <circle cx="12" cy="13" r="2.5" fill="#fff" opacity="0.95"/>
      <path d="M12 15.5v3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  RoomChange: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17 3l4 4-4 4" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 21l-4-4 4-4" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Complaints: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M10.29 4.86L2.5 18a1.5 1.5 0 0 0 1.29 2.25h15.42A1.5 1.5 0 0 0 20.5 18L12.71 4.86a1.5 1.5 0 0 0-2.42 0z" fill="#ef4444" opacity="0.9"/>
      <line x1="12" y1="10" x2="12" y2="14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="1" fill="#fff"/>
    </svg>
  ),
  Leave: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="11" height="14" rx="2" fill="#0ea5e9" opacity="0.8"/>
      <path d="M9 9h5M9 12h3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 10l6 5-6 5V10z" fill="#38bdf8"/>
    </svg>
  ),
  Visitors: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="4" fill="#f59e0b"/>
      <path d="M2 20c0-3.5 3.1-6 7-6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="19" cy="11" r="3.2" fill="#fbbf24" stroke="#fff" strokeWidth="1.5"/>
      <line x1="19" y1="8.5" x2="19" y2="13.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16.5" y1="11" x2="21.5" y2="11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Notices: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 9A6 6 0 0 0 6 9c0 6.5-2.5 8.5-2.5 8.5h17S18 15.5 18 9z" fill="#ec4899" opacity="0.9"/>
      <path d="M10.3 20.5a2 2 0 0 0 3.4 0" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="18" cy="5" r="3" fill="#f43f5e"/>
    </svg>
  ),
  WardenSupport: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#6366f1" opacity="0.9"/>
      <circle cx="9" cy="10" r="1.2" fill="#fff"/>
      <circle cx="12" cy="10" r="1.2" fill="#fff"/>
      <circle cx="15" cy="10" r="1.2" fill="#fff"/>
    </svg>
  ),
  Payments: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="3" fill="#10b981" opacity="0.9"/>
      <rect x="2" y="9" width="20" height="3" fill="#fff" opacity="0.3"/>
      <rect x="5" y="14" width="4" height="2" rx="1" fill="#fff" opacity="0.8"/>
      <rect x="11" y="14" width="6" height="2" rx="1" fill="#fff" opacity="0.5"/>
    </svg>
  ),
  Students: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="7" r="3.5" fill="#0ea5e9"/>
      <path d="M1 19c0-3.3 3.1-6 7-6" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="7" r="3.5" fill="#38bdf8"/>
      <path d="M23 19c0-3.3-3.1-6-7-6" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Requests: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="3" fill="#8b5cf6" opacity="0.9"/>
      <line x1="8" y1="8" x2="16" y2="8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="12" x2="16" y2="12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="16" x2="12" y2="16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  RoommatePairs: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#f43f5e" opacity="0.9"/>
    </svg>
  ),
  Analytics: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="12" width="4" height="9" rx="1" fill="#6366f1" opacity="0.6"/>
      <rect x="10" y="7" width="4" height="14" rx="1" fill="#6366f1" opacity="0.8"/>
      <rect x="17" y="3" width="4" height="18" rx="1" fill="#6366f1"/>
    </svg>
  ),
  AddRoom: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="#f97316" opacity="0.85"/>
      <circle cx="12" cy="15" r="4" fill="#fff"/>
      <line x1="12" y1="13" x2="12" y2="17" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="10" y1="15" x2="14" y2="15" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  WardenInbox: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="3" fill="#14b8a6" opacity="0.9"/>
      <path d="M2 8l10 7 10-7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  Notification: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Search: ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#b8bdc8" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Help: ({ size = 17 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Logout: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  CollapseLeft: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .layout-root { font-family: 'Plus Jakarta Sans', sans-serif; display: flex; min-height: 100vh; background: #f4f6fb; color: #1a1d23; }
  .sidebar { width: 242px; min-height: 100vh; background: #ffffff; border-right: 1px solid #eef0f5; display: flex; flex-direction: column; position: fixed; left: 0; top: 0; bottom: 0; z-index: 100; transition: width .25s cubic-bezier(.4,0,.2,1); overflow: hidden; box-shadow: 2px 0 16px rgba(0,0,0,0.04); }
  .sidebar.collapsed { width: 68px; }
  .sidebar-logo { display: flex; align-items: center; gap: 11px; padding: 22px 16px 18px; border-bottom: 1px solid #f0f2f7; flex-shrink: 0; overflow: hidden; cursor: pointer; }
  .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #00d4c8 0%, #00a8a0 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; color: #fff; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,212,200,0.3); }
  .logo-name { font-size: 1.12rem; font-weight: 800; color: #1a1d23; letter-spacing: -0.03em; white-space: nowrap; transition: opacity .2s; }
  .sidebar.collapsed .logo-name { opacity: 0; pointer-events: none; }
  .sidebar-nav { flex: 1; padding: 12px 8px; overflow-y: auto; overflow-x: hidden; scrollbar-width: none; }
  .sidebar-nav::-webkit-scrollbar { display: none; }
  .nav-section-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #c0c6d4; padding: 10px 10px 5px; white-space: nowrap; overflow: hidden; transition: opacity .2s; }
  .sidebar.collapsed .nav-section-label { opacity: 0; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 12px; cursor: pointer; transition: background .15s, transform .1s; margin-bottom: 2px; color: #6b7280; white-space: nowrap; overflow: hidden; position: relative; text-decoration: none; }
  .nav-item:hover { background: #f5f7fb; transform: translateX(2px); }
  .nav-item.active { background: #f8f7ff; color: #5b50d6; box-shadow: inset 3px 0 0 #6366f1; border-radius: 0 12px 12px 0; }
  .nav-icon { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .nav-label { font-size: 0.83rem; font-weight: 600; transition: opacity .2s; flex: 1; overflow: hidden; text-overflow: ellipsis; color: inherit; }
  .sidebar.collapsed .nav-label { opacity: 0; pointer-events: none; }
  .nav-badge { background: #00d4c8; color: #fff; font-size: 0.58rem; font-weight: 700; padding: 2px 6px; border-radius: 99px; transition: opacity .2s; }
  .sidebar.collapsed .nav-badge { opacity: 0; }
  .nav-tooltip { position: absolute; left: calc(100% + 14px); top: 50%; transform: translateY(-50%); background: #1a1d23; color: #fff; font-size: 0.73rem; font-weight: 600; padding: 5px 11px; border-radius: 8px; white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity .15s; z-index: 999; }
  .sidebar.collapsed .nav-item:hover .nav-tooltip { opacity: 1; }
  .nav-tooltip::before { content: ''; position: absolute; right: 100%; top: 50%; transform: translateY(-50%); border: 5px solid transparent; border-right-color: #1a1d23; }
  .sidebar-collapse-btn { margin: 0 8px 12px; padding: 8px 10px; border-radius: 10px; border: 1px solid #eef0f5; background: #fafbfc; cursor: pointer; display: flex; align-items: center; gap: 10px; color: #8a92a6; font-family: inherit; font-size: 0.8rem; font-weight: 600; transition: border-color .15s, color .15s, background .15s; white-space: nowrap; overflow: hidden; flex-shrink: 0; }
  .sidebar-collapse-btn:hover { border-color: #00d4c8; color: #00a8a0; background: #f0fffe; }
  .collapse-icon { width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform .25s; color: #8a92a6; }
  .sidebar.collapsed .collapse-icon { transform: rotate(180deg); }
  .collapse-label { transition: opacity .2s; }
  .sidebar.collapsed .collapse-label { opacity: 0; }
  .sidebar-user { padding: 12px 10px; border-top: 1px solid #f0f2f7; display: flex; align-items: center; gap: 10px; flex-shrink: 0; overflow: hidden; background: #fafbfc; }
  .user-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #00d4c8, #0099a8); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: #fff; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,180,170,0.3); }
  .user-info { flex: 1; min-width: 0; transition: opacity .2s; }
  .sidebar.collapsed .user-info { opacity: 0; }
  .user-name { font-size: 0.78rem; font-weight: 700; color: #1a1d23; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 0.66rem; color: #9aa0ae; margin-top: 1px; }
  .logout-btn { background: none; border: none; cursor: pointer; color: #c5cad5; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; transition: color .15s, background .15s, opacity .2s; flex-shrink: 0; }
  .sidebar.collapsed .logout-btn { opacity: 0; pointer-events: none; }
  .logout-btn:hover { color: #ef4444; background: #fef2f2; }
  .layout-main { flex: 1; margin-left: 242px; transition: margin-left .25s cubic-bezier(.4,0,.2,1); min-height: 100vh; display: flex; flex-direction: column; }
  .layout-main.collapsed { margin-left: 68px; }
  .topbar { height: 62px; background: #ffffff; border-bottom: 1px solid #eef0f5; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; position: sticky; top: 0; z-index: 50; flex-shrink: 0; box-shadow: 0 1px 6px rgba(0,0,0,0.04); }
  .topbar-search { display: flex; align-items: center; gap: 9px; background: #f5f7fb; border-radius: 12px; padding: 9px 16px; min-width: 300px; border: 1.5px solid transparent; transition: border-color .15s, background .15s, box-shadow .15s; }
  .topbar-search:focus-within { border-color: #00d4c8; background: #fff; box-shadow: 0 0 0 3px rgba(0,212,200,0.12); }
  .topbar-search input { border: none; outline: none; background: transparent; font-family: inherit; font-size: 0.82rem; color: #1a1d23; width: 100%; }
  .topbar-search input::placeholder { color: #b8bdc8; }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .topbar-icon-wrap { position: relative; }
  .topbar-icon-btn { width: 38px; height: 38px; border-radius: 11px; border: 1px solid #eef0f5; background: #fafbfc; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7280; transition: background .15s, border-color .15s, color .15s; }
  .topbar-icon-btn:hover { background: #e8faf9; border-color: #b3f0ee; color: #00a8a0; }
  .notif-count { position: absolute; top: -4px; right: -4px; min-width: 17px; height: 17px; border-radius: 99px; background: #ef4444; color: #fff; font-size: 0.58rem; font-weight: 700; display: flex; align-items: center; justify-content: center; padding: 0 4px; border: 2px solid #fff; font-family: inherit; }
  .notif-menu { position: absolute; top: 46px; right: 0; width: 360px; max-height: 440px; overflow-y: auto; background: #fff; border: 1px solid #e8ecf4; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.13); z-index: 200; padding: 8px 0; }
  .notif-menu-header { padding: 10px 16px 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f3f8; }
  .notif-menu-title { font-size: 0.9rem; font-weight: 800; color: #1a1d23; }
  .notif-menu-action { border: none; background: none; color: #00a8a0; font-size: 0.72rem; font-weight: 700; cursor: pointer; font-family: inherit; padding: 4px 8px; border-radius: 6px; transition: background .15s; }
  .notif-menu-action:hover { background: #e6faf9; }
  .notif-empty { padding: 28px 16px; text-align: center; font-size: 0.82rem; color: #a0a8b8; }
  .notif-item { padding: 11px 16px; display: flex; gap: 11px; align-items: flex-start; cursor: pointer; transition: background .15s; border-left: 3px solid transparent; }
  .notif-item:hover { background: #f8fafe; }
  .notif-item.unread { background: #f4fffe; border-left-color: #00d4c8; }
  .notif-icon-wrap { width: 36px; height: 36px; border-radius: 11px; background: #f5f6ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .notif-body { min-width: 0; flex: 1; }
  .notif-title { font-size: 0.79rem; font-weight: 700; color: #1a1d23; margin-bottom: 3px; }
  .notif-message { font-size: 0.72rem; color: #697386; line-height: 1.45; margin-bottom: 4px; }
  .notif-time { font-size: 0.64rem; color: #a8b0bf; }
  .topbar-divider { width: 1px; height: 24px; background: #eef0f5; }
  .topbar-user { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 6px 10px; border-radius: 12px; transition: background .15s; border: 1px solid transparent; }
  .topbar-user:hover { background: #f5f7fb; border-color: #eef0f5; }
  .topbar-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #00d4c8, #0099a8); display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 800; color: #fff; box-shadow: 0 2px 8px rgba(0,180,170,0.25); }
  .topbar-user-name { font-size: 0.8rem; font-weight: 700; color: #1a1d23; line-height: 1.2; }
  .topbar-user-sub { font-size: 0.66rem; color: #9aa0ae; }
  .page-content { flex: 1; padding: 28px; }
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); box-shadow: none; }
    .sidebar.mobile-open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,0.12); }
    .layout-main { margin-left: 0 !important; }
    .notif-menu { width: min(340px, calc(100vw - 24px)); right: -40px; }
    .topbar-search { min-width: 160px; }
  }
`;

const STUDENT_NAV = [
  { section: null, items: [{ icon: "Dashboard", label: "Dashboard", path: "/dashboard" }] },
  { section: "Profile", items: [{ icon: "Profile", label: "My Profile", path: "/profile" }] },
  {
    section: "Matching",
    items: [
      { icon: "Suggested", label: "Suggested", path: "/matching" },
      { icon: "RoommateRequests", label: "Roommate Requests", path: "/roommate-requests" },
    ],
  },
  {
    section: "Hostel",
    items: [
      { icon: "Rooms", label: "Rooms", path: "/rooms" },
      { icon: "MyRoom", label: "My Room", path: "/my-room" },
      { icon: "RoomChange", label: "Room Change Requests", path: "/room-change-requests" },
      { icon: "Complaints", label: "Complaints", path: "/complaints" },
      { icon: "Leave", label: "Leave", path: "/leave" },
      { icon: "Visitors", label: "Visitors", path: "/visitors" },
      { icon: "Notices", label: "Notices", path: "/notices" },
      { icon: "WardenSupport", label: "Warden Support", path: "/warden-support" },
      { icon: "Payments", label: "Payments", path: "/payments" },
    ],
  },
];

const ADMIN_NAV = [
  { section: null, items: [{ icon: "Dashboard", label: "Dashboard", path: "/admin/dashboard" }] },
  {
    section: "Management",
    items: [
      { icon: "Rooms", label: "Rooms", path: "/admin/rooms" },
      { icon: "Students", label: "Students", path: "/admin/students" },
      { icon: "Requests", label: "Requests", path: "/admin/requests" },
      { icon: "RoommatePairs", label: "Roommate Pairs", path: "/admin/roommate-pairs" },
      { icon: "Analytics", label: "Analytics", path: "/admin/analytics" },
      { icon: "Payments", label: "Payments", path: "/admin/payments" },
    ],
  },
  {
    section: "Hostel Ops",
    items: [
      { icon: "Complaints", label: "Complaints", path: "/admin/complaints" },
      { icon: "Leave", label: "Leave Req.", path: "/admin/leaves" },
      { icon: "Visitors", label: "Visitors", path: "/admin/visitors" },
      { icon: "RoomChange", label: "Room Change Requests", path: "/admin/room-change-requests" },
      { icon: "AddRoom", label: "Add Room", path: "/admin/add-room" },
      { icon: "Notices", label: "Notices", path: "/admin/notices" },
      { icon: "WardenInbox", label: "Warden Inbox", path: "/admin/warden-inbox" },
    ],
  },
];

function timeAgo(dateStr) {
  if (!dateStr) return "Now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

const NOTIF_ICONS = {
  request: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="3" fill="#8b5cf6" opacity="0.9"/><line x1="8" y1="8" x2="16" y2="8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  complaint: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 4.86L2.5 18a1.5 1.5 0 0 0 1.29 2.25h15.42A1.5 1.5 0 0 0 20.5 18L12.71 4.86a1.5 1.5 0 0 0-2.42 0z" fill="#ef4444" opacity="0.9"/><line x1="12" y1="10" x2="12" y2="14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17" r="1" fill="#fff"/></svg>,
  leave: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="11" height="14" rx="2" fill="#0ea5e9" opacity="0.8"/><path d="M15 10l6 5-6 5V10z" fill="#38bdf8"/></svg>,
  visitor: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" fill="#f59e0b"/><path d="M2 20c0-3.5 3.1-6 7-6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/><circle cx="19" cy="11" r="3.2" fill="#fbbf24" stroke="#fff" strokeWidth="1.5"/><line x1="19" y1="8.5" x2="19" y2="13.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/><line x1="16.5" y1="11" x2="21.5" y2="11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  notice: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 9A6 6 0 0 0 6 9c0 6.5-2.5 8.5-2.5 8.5h17S18 15.5 18 9z" fill="#ec4899" opacity="0.9"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/></svg>,
};
const DEFAULT_NOTIF = <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 9A6 6 0 0 0 6 9c0 6.5-2.5 8.5-2.5 8.5h17S18 15.5 18 9z" fill="#6366f1" opacity="0.9"/><path d="M10.3 20.5a2 2 0 0 0 3.4 0" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/></svg>;

function getNotifIcon(type) { return NOTIF_ICONS[type] || DEFAULT_NOTIF; }

function Sidebar({ role, collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navConfig = role === "admin" ? ADMIN_NAV : STUDENT_NAV;
  const name = localStorage.getItem("name") || (role === "admin" ? "Admin User" : "Student User");
  const user = {
    name,
    sub: role === "admin" ? "Administrator" : "Student",
    initials: name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
  };
  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo" onClick={() => navigate(role === "admin" ? "/admin/dashboard" : "/dashboard")}>
        <div className="logo-icon">N</div>
        <span className="logo-name">NestMate</span>
      </div>
      <nav className="sidebar-nav">
        {navConfig.map((group, gi) => (
          <div key={gi}>
            {group.section && <div className="nav-section-label">{group.section}</div>}
            {group.items.map((item) => {
              const IconComp = Icons[item.icon];
              return (
                <div
                  key={item.path}
                  className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="nav-icon">{IconComp ? <IconComp /> : null}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                  <span className="nav-tooltip">{item.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </nav>
      <button className="sidebar-collapse-btn" onClick={onToggle}>
        <span className="collapse-icon"><Icons.CollapseLeft /></span>
        <span className="collapse-label">Collapse</span>
      </button>
      <div className="sidebar-user">
        <div className="user-avatar">{user.initials}</div>
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.sub}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout"><Icons.Logout /></button>
      </div>
    </div>
  );
}

function TopBar({ role }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);
  const name = localStorage.getItem("name") || (role === "admin" ? "Admin User" : "Student User");
  const user = {
    name,
    sub: role === "admin" ? "Administrator" : "Student",
    initials: name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const [notifRes, countRes] = await Promise.all([
        axios.get(`${API}/notifications`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/notifications/unread-count`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
      setUnreadCount(countRes.data?.count || 0);
    } catch (err) { console.error(err); }
  };

  const markAsRead = async (id, link) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await fetchNotifications();
      if (link) navigate(link);
    } catch (err) { console.error(err); if (link) navigate(link); }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/notifications/read-all`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await fetchNotifications();
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 15000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  return (
    <div className="topbar">
      <div className="topbar-search">
        <Icons.Search />
        <input placeholder="Search rooms, students, or requests..." />
      </div>
      <div className="topbar-right">
        <div className="topbar-icon-wrap" ref={menuRef}>
          <button className="topbar-icon-btn" onClick={() => setOpen((p) => !p)} title="Notifications">
            <Icons.Notification />
            {unreadCount > 0 && <span className="notif-count">{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </button>
          {open && (
            <div className="notif-menu">
              <div className="notif-menu-header">
                <div className="notif-menu-title">Notifications</div>
                <button className="notif-menu-action" onClick={markAllAsRead}>Mark all read</button>
              </div>
              {notifications.length === 0 ? (
                <div className="notif-empty">No notifications yet.</div>
              ) : (
                notifications.map((item) => (
                  <div key={item._id} className={`notif-item ${item.isRead ? "" : "unread"}`} onClick={() => markAsRead(item._id, item.link)}>
                    <div className="notif-icon-wrap">{getNotifIcon(item.type)}</div>
                    <div className="notif-body">
                      <div className="notif-title">{item.title}</div>
                      <div className="notif-message">{item.message}</div>
                      <div className="notif-time">{timeAgo(item.createdAt)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <button className="topbar-icon-btn" title="Help"><Icons.Help /></button>
        <div className="topbar-divider" />
        <div className="topbar-user">
          <div className="topbar-user-avatar">{user.initials}</div>
          <div>
            <div className="topbar-user-name">{user.name}</div>
            <div className="topbar-user-sub">{user.sub}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Layout({ children, role }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <style>{css}</style>
      <div className="layout-root">
        <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className={`layout-main ${collapsed ? "collapsed" : ""}`}>
          <TopBar role={role} />
          <div className="page-content">{children}</div>
        </div>
      </div>
    </>
  );
}

export { Layout, Sidebar, TopBar };
export default Layout;