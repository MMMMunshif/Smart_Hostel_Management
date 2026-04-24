import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

// ─── SVG Icon Library ───────────────────────────────────────────────
const Icons = {
  Dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  Suggested: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  RoommateRequests: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Rooms: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  MyRoom: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <path d="M9 22V12h6v10"/><circle cx="12" cy="8" r="1" fill="currentColor"/>
    </svg>
  ),
  RoomChange: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  Complaints: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Leave: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2c-.8.1-1.1 1.1-.5 1.6l4.3 4.3-1.2 5.6c-.2.8.6 1.4 1.3 1l5-2.5 5 2.5c.7.4 1.5-.2 1.3-1z"/>
    </svg>
  ),
  Visitors: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  ),
  Notices: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Support: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Payments: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Students: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  Requests: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/>
    </svg>
  ),
  RoommatePairs: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  AddRoom: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <line x1="12" y1="12" x2="12" y2="18"/><line x1="9" y1="15" x2="15" y2="15"/>
    </svg>
  ),
  WardenInbox: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  ),
  Logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Collapse: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  Bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  ChevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sidebar-w: 240px;
    --sidebar-collapsed-w: 70px;
    --topbar-h: 64px;
    --accent: #7c3aed;
    --accent2: #06b6d4;
    --sidebar-bg: linear-gradient(180deg, #1e1b4b 0%, #312e81 60%, #1e3a5f 100%);
    --sidebar-text: rgba(255,255,255,0.65);
    --sidebar-active-bg: rgba(255,255,255,0.12);
    --sidebar-active-text: #fff;
    --sidebar-hover-bg: rgba(255,255,255,0.07);
    --topbar-bg: #ffffff;
    --page-bg: linear-gradient(145deg, #f0f4ff 0%, #fdf4ff 40%, #f0fff8 100%);
    --radius: 14px;
    --font: 'Nunito', sans-serif;
  }

  .layout-root {
    font-family: var(--font);
    display: flex;
    min-height: 100vh;
    background: var(--page-bg);
    color: #1e1b4b;
  }

  /* ── Sidebar ─────────────────────────────────────────── */
  .sidebar {
    width: var(--sidebar-w);
    min-height: 100vh;
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0; top: 0; bottom: 0;
    z-index: 100;
    transition: width .28s cubic-bezier(.4,0,.2,1);
    overflow: hidden;
    box-shadow: 4px 0 24px rgba(30,27,75,0.18);
  }
  .sidebar.collapsed { width: var(--sidebar-collapsed-w); }

  /* Logo */
  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 22px 18px 18px;
    cursor: pointer;
    overflow: hidden;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
  }
  .logo-icon {
    width: 38px; height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, #a78bfa, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 900; color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(124,58,237,0.5);
    letter-spacing: -1px;
  }
  .logo-text {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: opacity .2s, width .28s;
  }
  .sidebar.collapsed .logo-text { opacity: 0; width: 0; }
  .logo-name {
    font-size: 1.05rem; font-weight: 900;
    color: #fff; letter-spacing: -0.3px;
    white-space: nowrap;
  }
  .logo-tagline {
    font-size: 0.62rem; font-weight: 700;
    color: rgba(255,255,255,0.4);
    letter-spacing: .06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* Nav */
  .sidebar-nav {
    flex: 1;
    padding: 12px 10px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }
  .sidebar-nav::-webkit-scrollbar { display: none; }

  .nav-section-label {
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    padding: 12px 10px 5px;
    white-space: nowrap;
    overflow: hidden;
    transition: opacity .2s;
  }
  .sidebar.collapsed .nav-section-label { opacity: 0; }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 10px 10px;
    border-radius: 12px;
    cursor: pointer;
    transition: background .15s, color .15s, transform .12s;
    margin-bottom: 2px;
    text-decoration: none;
    color: var(--sidebar-text);
    white-space: nowrap;
    overflow: hidden;
    position: relative;
  }
  .nav-item:hover {
    background: var(--sidebar-hover-bg);
    color: rgba(255,255,255,0.9);
    transform: translateX(2px);
  }
  .nav-item.active {
    background: rgba(255,255,255,0.13);
    color: #fff;
    box-shadow: inset 3px 0 0 #a78bfa;
  }
  .nav-item.active .nav-icon-wrap {
    background: rgba(167,139,250,0.25);
    color: #c4b5fd;
  }

  .nav-icon-wrap {
    width: 32px; height: 32px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background .15s, color .15s;
    color: rgba(255,255,255,0.6);
  }
  .nav-item:hover .nav-icon-wrap {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }

  .nav-label {
    font-size: 0.83rem;
    font-weight: 700;
    transition: opacity .2s;
    flex: 1;
    color: inherit;
  }
  .sidebar.collapsed .nav-label { opacity: 0; pointer-events: none; }

  .nav-badge {
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    color: #fff;
    font-size: 0.58rem;
    font-weight: 800;
    padding: 2px 7px;
    border-radius: 99px;
    transition: opacity .2s;
  }
  .sidebar.collapsed .nav-badge { opacity: 0; }

  /* Collapse button */
  .sidebar-collapse-btn {
    margin: 0 10px 12px;
    padding: 9px 10px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255,255,255,0.5);
    font-family: var(--font);
    font-size: 0.8rem;
    font-weight: 700;
    transition: border-color .15s, background .15s, color .15s;
    white-space: nowrap;
    overflow: hidden;
    flex-shrink: 0;
  }
  .sidebar-collapse-btn:hover {
    border-color: rgba(167,139,250,0.5);
    background: rgba(167,139,250,0.1);
    color: #c4b5fd;
  }
  .collapse-icon {
    flex-shrink: 0;
    transition: transform .28s;
    display: flex; align-items: center;
    color: rgba(255,255,255,0.6);
  }
  .sidebar.collapsed .collapse-icon { transform: rotate(180deg); }
  .collapse-label { transition: opacity .2s; }
  .sidebar.collapsed .collapse-label { opacity: 0; }

  /* User area */
  .sidebar-user {
    padding: 12px 12px;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    overflow: hidden;
    background: rgba(0,0,0,0.12);
  }
  .user-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a78bfa, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem; font-weight: 900; color: #fff;
    flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(124,58,237,0.4);
    border: 2px solid rgba(255,255,255,0.2);
  }
  .user-info { flex: 1; min-width: 0; transition: opacity .2s; }
  .sidebar.collapsed .user-info { opacity: 0; }
  .user-name { font-size: 0.8rem; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 0.65rem; color: rgba(255,255,255,0.45); font-weight: 600; }
  .logout-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.35);
    display: flex; align-items: center;
    transition: color .15s, opacity .2s;
    flex-shrink: 0;
    padding: 4px;
    border-radius: 8px;
  }
  .sidebar.collapsed .logout-btn { opacity: 0; pointer-events: none; }
  .logout-btn:hover { color: #fca5a5; background: rgba(239,68,68,0.15); }

  /* ── Main area ─────────────────────────────────────── */
  .layout-main {
    flex: 1;
    margin-left: var(--sidebar-w);
    transition: margin-left .28s cubic-bezier(.4,0,.2,1);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .layout-main.collapsed { margin-left: var(--sidebar-collapsed-w); }

  /* ── Topbar ──────────────────────────────────────── */
  .topbar {
    height: var(--topbar-h);
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(124,58,237,0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    position: sticky;
    top: 0;
    z-index: 50;
    flex-shrink: 0;
    box-shadow: 0 2px 20px rgba(124,58,237,0.06);
  }

  .topbar-search {
    display: flex; align-items: center; gap: 10px;
    background: rgba(124,58,237,0.06);
    border-radius: 14px;
    padding: 9px 16px;
    min-width: 300px;
    border: 1.5px solid transparent;
    transition: border-color .15s, background .15s, box-shadow .15s;
  }
  .topbar-search:focus-within {
    border-color: #a78bfa;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(167,139,250,0.12);
  }
  .topbar-search-icon { color: #a78bfa; display: flex; }
  .topbar-search input {
    border: none; outline: none; background: transparent;
    font-family: var(--font); font-size: 0.83rem;
    color: #1e1b4b; width: 100%; font-weight: 600;
  }
  .topbar-search input::placeholder { color: #c4b5fd; }

  .topbar-right { display: flex; align-items: center; gap: 10px; }

  .topbar-icon-btn {
    width: 38px; height: 38px; border-radius: 12px;
    border: 1.5px solid rgba(124,58,237,0.12);
    background: rgba(124,58,237,0.04);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #7c3aed;
    position: relative;
    transition: background .15s, border-color .15s, box-shadow .15s;
  }
  .topbar-icon-btn:hover {
    background: rgba(124,58,237,0.1);
    border-color: #a78bfa;
    box-shadow: 0 4px 14px rgba(124,58,237,0.15);
  }

  .notif-count {
    position: absolute; top: -4px; right: -4px;
    min-width: 18px; height: 18px; border-radius: 99px;
    background: linear-gradient(135deg, #ef4444, #f87171);
    color: #fff; font-size: 0.6rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    padding: 0 4px; border: 2px solid #fff;
    box-shadow: 0 2px 6px rgba(239,68,68,0.4);
  }

  /* Notif dropdown */
  .notif-menu {
    position: absolute; top: 48px; right: 0;
    width: 370px; max-height: 460px; overflow-y: auto;
    background: #fff;
    border: 1.5px solid rgba(124,58,237,0.12);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(30,27,75,0.16);
    z-index: 200;
    padding: 8px 0;
  }
  .notif-menu::-webkit-scrollbar { width: 4px; }
  .notif-menu::-webkit-scrollbar-track { background: transparent; }
  .notif-menu::-webkit-scrollbar-thumb { background: #e0d9ff; border-radius: 99px; }

  .notif-menu-header {
    padding: 10px 16px 12px;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid rgba(124,58,237,0.08);
    margin-bottom: 4px;
  }
  .notif-menu-title { font-size: 0.95rem; font-weight: 900; color: #1e1b4b; }
  .notif-menu-action {
    border: none; background: rgba(124,58,237,0.08); color: #7c3aed;
    font-size: 0.72rem; font-weight: 800; cursor: pointer;
    font-family: var(--font); border-radius: 8px; padding: 4px 10px;
    transition: background .15s;
  }
  .notif-menu-action:hover { background: rgba(124,58,237,0.15); }

  .notif-empty {
    padding: 30px 16px; text-align: center;
    font-size: 0.82rem; color: #a78bfa; font-weight: 700;
  }

  .notif-item {
    padding: 11px 16px;
    display: flex; gap: 12px; align-items: flex-start;
    cursor: pointer; transition: background .15s;
    border-left: 3px solid transparent;
  }
  .notif-item:hover { background: rgba(124,58,237,0.04); }
  .notif-item.unread { background: rgba(167,139,250,0.06); border-left-color: #a78bfa; }

  .notif-icon-wrap {
    width: 36px; height: 36px; border-radius: 12px;
    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #7c3aed;
  }
  .notif-body { min-width: 0; flex: 1; }
  .notif-title { font-size: 0.8rem; font-weight: 800; color: #1e1b4b; margin-bottom: 3px; }
  .notif-message { font-size: 0.73rem; color: #64748b; line-height: 1.45; margin-bottom: 4px; font-weight: 600; }
  .notif-time { font-size: 0.65rem; color: #a78bfa; font-weight: 700; }

  /* Topbar user */
  .topbar-user {
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; padding: 6px 12px; border-radius: 14px;
    border: 1.5px solid rgba(124,58,237,0.1);
    transition: background .15s, border-color .15s;
    background: rgba(124,58,237,0.04);
  }
  .topbar-user:hover { background: rgba(124,58,237,0.09); border-color: #a78bfa; }
  .topbar-user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #a78bfa, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 900; color: #fff;
    box-shadow: 0 3px 8px rgba(124,58,237,0.35);
  }
  .topbar-user-name { font-size: 0.82rem; font-weight: 800; color: #1e1b4b; }
  .topbar-user-sub  { font-size: 0.67rem; color: #a78bfa; font-weight: 700; }
  .topbar-user-chevron { color: #c4b5fd; display: flex; }

  /* Divider between topbar sections */
  .topbar-divider {
    width: 1px; height: 24px;
    background: rgba(124,58,237,0.12);
    margin: 0 2px;
  }

  /* Page */
  .page-content { flex: 1; padding: 28px; }

  /* Tooltip for collapsed sidebar */
  .nav-item[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    left: calc(100% + 12px);
    top: 50%;
    transform: translateY(-50%);
    background: #1e1b4b;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: 8px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 300;
    box-shadow: 0 4px 16px rgba(30,27,75,0.3);
  }
  .sidebar:not(.collapsed) .nav-item[data-tooltip]:hover::after { display: none; }

  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.mobile-open { transform: translateX(0); }
    .layout-main { margin-left: 0 !important; }
    .notif-menu { width: min(360px, calc(100vw - 24px)); right: -50px; }
    .topbar-search { min-width: 180px; }
  }
`;

// ─── Nav Configs ────────────────────────────────────────────────────
const STUDENT_NAV = [
  {
    section: null,
    items: [{ icon: "Dashboard", label: "Dashboard", path: "/dashboard" }],
  },
  {
    section: "Profile",
    items: [{ icon: "Profile", label: "My Profile", path: "/profile" }],
  },
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
      { icon: "Support", label: "Warden Support", path: "/warden-support" },
      { icon: "Payments", label: "Payments", path: "/payments" },
    ],
  },
];

const ADMIN_NAV = [
  {
    section: null,
    items: [{ icon: "Dashboard", label: "Dashboard", path: "/admin/dashboard" }],
  },
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
      { icon: "Leave", label: "Leave Requests", path: "/admin/leaves" },
      { icon: "Visitors", label: "Visitors", path: "/admin/visitors" },
      { icon: "RoomChange", label: "Room Change Requests", path: "/admin/room-change-requests" },
      { icon: "AddRoom", label: "Add Room", path: "/admin/add-room" },
      { icon: "Notices", label: "Notices", path: "/admin/notices" },
      { icon: "WardenInbox", label: "Warden Inbox", path: "/admin/warden-inbox" },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return "Just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getNotifIcon(type = "general") {
  switch (type) {
    case "request":   return Icons.Requests;
    case "complaint": return Icons.Complaints;
    case "leave":     return Icons.Leave;
    case "visitor":   return Icons.Visitors;
    case "notice":    return Icons.Notices;
    default:          return Icons.Bell;
  }
}

// ─── Sidebar Component ───────────────────────────────────────────────
function Sidebar({ role, collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navConfig = role === "admin" ? ADMIN_NAV : STUDENT_NAV;
  const name = localStorage.getItem("name") || (role === "admin" ? "Admin User" : "Student User");
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navigate(role === "admin" ? "/admin/dashboard" : "/dashboard")}>
        <div className="logo-icon">N</div>
        <div className="logo-text">
          <span className="logo-name">NestMate</span>
          <span className="logo-tagline">Hostel Management</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navConfig.map((group, gi) => (
          <div key={gi}>
            {group.section && <div className="nav-section-label">{group.section}</div>}
            {group.items.map((item) => (
              <div
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
                data-tooltip={item.label}
              >
                <div className="nav-icon-wrap">
                  {Icons[item.icon] || Icons.Dashboard}
                </div>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse */}
      <button className="sidebar-collapse-btn" onClick={onToggle}>
        <span className="collapse-icon">{Icons.Collapse}</span>
        <span className="collapse-label">Collapse sidebar</span>
      </button>

      {/* User */}
      <div className="sidebar-user">
        <div className="user-avatar">{initials}</div>
        <div className="user-info">
          <div className="user-name">{name}</div>
          <div className="user-role">{role === "admin" ? "Administrator" : "Student"}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          {Icons.Logout}
        </button>
      </div>
    </div>
  );
}

// ─── TopBar Component ─────────────────────────────────────────────────
function TopBar({ role }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);

  const name = localStorage.getItem("name") || (role === "admin" ? "Admin User" : "Student User");
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const [notifRes, countRes] = await Promise.all([
        axios.get(`${API}/notifications`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/notifications/unread-count`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
      setUnreadCount(countRes.data?.count || 0);
    } catch {}
  };

  const markAsRead = async (id, link) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await fetchNotifications();
      if (link) navigate(link);
    } catch { if (link) navigate(link); }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/notifications/read-all`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await fetchNotifications();
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 15000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handle = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div className="topbar">
      {/* Search */}
      <div className="topbar-search">
        <span className="topbar-search-icon">{Icons.Search}</span>
        <input placeholder="Search rooms, students, requests…" />
      </div>

      <div className="topbar-right">
        {/* Help */}
        <button className="topbar-icon-btn" title="Help">
          {Icons.Help}
        </button>

        <div className="topbar-divider" />

        {/* Notifications */}
        <div style={{ position: "relative" }} ref={menuRef}>
          <button className="topbar-icon-btn" onClick={() => setOpen((p) => !p)} title="Notifications">
            {Icons.Bell}
            {unreadCount > 0 && (
              <span className="notif-count">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          {open && (
            <div className="notif-menu">
              <div className="notif-menu-header">
                <div className="notif-menu-title">🔔 Notifications</div>
                <button className="notif-menu-action" onClick={markAllAsRead}>Mark all read</button>
              </div>
              {notifications.length === 0 ? (
                <div className="notif-empty">You're all caught up! 🎉</div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item._id}
                    className={`notif-item ${item.isRead ? "" : "unread"}`}
                    onClick={() => markAsRead(item._id, item.link)}
                  >
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

        <div className="topbar-divider" />

        {/* User chip */}
        <div className="topbar-user">
          <div className="topbar-user-avatar">{initials}</div>
          <div>
            <div className="topbar-user-name">{name}</div>
            <div className="topbar-user-sub">{role === "admin" ? "Administrator" : "Student"}</div>
          </div>
          <span className="topbar-user-chevron">{Icons.ChevronDown}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────
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