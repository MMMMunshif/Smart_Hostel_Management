import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .layout-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    min-height: 100vh;
    background: #f8f9fb;
    color: #1a1d23;
  }

  .sidebar {
    width: 230px;
    min-height: 100vh;
    background: #fff;
    border-right: 1px solid #eef0f4;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0; top: 0; bottom: 0;
    z-index: 100;
    transition: width .25s ease;
    overflow: hidden;
  }
  .sidebar.collapsed { width: 68px; }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 24px 18px 20px;
    border-bottom: 1px solid #f0f2f6;
    flex-shrink: 0;
    overflow: hidden;
    text-decoration: none;
  }
  .logo-icon {
    width: 36px; height: 36px;
    background: #00d4c8;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }
  .logo-name {
    font-size: 1.1rem; font-weight: 800;
    color: #1a1d23; letter-spacing: -0.02em;
    white-space: nowrap;
    transition: opacity .2s;
  }
  .sidebar.collapsed .logo-name { opacity: 0; pointer-events: none; }

  .sidebar-nav {
    flex: 1;
    padding: 14px 10px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }
  .sidebar-nav::-webkit-scrollbar { display: none; }

  .nav-section-label {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #b0b6c3;
    padding: 10px 10px 6px;
    white-space: nowrap;
    overflow: hidden;
    transition: opacity .2s;
  }
  .sidebar.collapsed .nav-section-label { opacity: 0; }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: background .15s, color .15s;
    margin-bottom: 2px;
    text-decoration: none;
    color: #5a6070;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
  }
  .nav-item:hover { background: #f5f6f9; color: #1a1d23; }
  .nav-item.active {
    background: #e8faf9;
    color: #00b8b0;
  }
  .nav-item.active .nav-icon { color: #00d4c8; }

  .nav-icon {
    font-size: 1.05rem;
    width: 22px;
    text-align: center;
    flex-shrink: 0;
  }
  .nav-label {
    font-size: 0.84rem;
    font-weight: 600;
    transition: opacity .2s;
    flex: 1;
  }
  .sidebar.collapsed .nav-label { opacity: 0; pointer-events: none; }

  .nav-badge {
    background: #00d4c8;
    color: #fff;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 99px;
    transition: opacity .2s;
  }
  .sidebar.collapsed .nav-badge { opacity: 0; }

  .sidebar-collapse-btn {
    margin: 0 10px 14px;
    padding: 8px 10px;
    border-radius: 10px;
    border: 1.5px solid #eef0f4;
    background: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #7a8090;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    transition: border-color .15s, color .15s;
    white-space: nowrap;
    overflow: hidden;
    flex-shrink: 0;
  }
  .sidebar-collapse-btn:hover { border-color: #00d4c8; color: #00b8b0; }
  .collapse-icon { font-size: 1rem; flex-shrink: 0; transition: transform .25s; }
  .sidebar.collapsed .collapse-icon { transform: rotate(180deg); }
  .collapse-label { transition: opacity .2s; }
  .sidebar.collapsed .collapse-label { opacity: 0; }

  .sidebar-user {
    padding: 14px 12px;
    border-top: 1px solid #f0f2f6;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .user-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d4c8, #0099a8);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }
  .user-info { flex: 1; min-width: 0; transition: opacity .2s; }
  .sidebar.collapsed .user-info { opacity: 0; }
  .user-name { font-size: 0.8rem; font-weight: 700; color: #1a1d23; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 0.68rem; color: #9aa0ae; }
  .logout-btn {
    background: none; border: none; cursor: pointer;
    color: #c0c5d0; font-size: 0.95rem;
    transition: color .15s; flex-shrink: 0;
    transition: opacity .2s;
  }
  .sidebar.collapsed .logout-btn { opacity: 0; pointer-events: none; }
  .logout-btn:hover { color: #e05555; }

  .layout-main {
    flex: 1;
    margin-left: 230px;
    transition: margin-left .25s ease;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .layout-main.collapsed { margin-left: 68px; }

  .topbar {
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #eef0f4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    position: sticky;
    top: 0;
    z-index: 50;
    flex-shrink: 0;
  }
  .topbar-search {
    display: flex; align-items: center; gap: 8px;
    background: #f5f6f9; border-radius: 10px;
    padding: 8px 14px; min-width: 280px;
    border: 1.5px solid transparent;
    transition: border-color .15s;
  }
  .topbar-search:focus-within { border-color: #00d4c8; background: #fff; }
  .topbar-search input {
    border: none; outline: none; background: transparent;
    font-family: inherit; font-size: 0.82rem; color: #1a1d23; width: 100%;
  }
  .topbar-search input::placeholder { color: #b0b6c3; }
  .topbar-right { display: flex; align-items: center; gap: 16px; }
  .topbar-icon-wrap { position: relative; }
  .topbar-icon-btn {
    width: 36px; height: 36px; border-radius: 50%;
    border: none; background: #f5f6f9; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; position: relative; transition: background .15s;
  }
  .topbar-icon-btn:hover { background: #e8faf9; }
  .notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px; border-radius: 50%;
    background: #00d4c8; border: 1.5px solid #fff;
  }
  .notif-count {
    position: absolute;
    top: -3px;
    right: -2px;
    min-width: 16px;
    height: 16px;
    border-radius: 99px;
    background: #ff5b6b;
    color: #fff;
    font-size: 0.58rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid #fff;
  }

  .notif-menu {
    position: absolute;
    top: 44px;
    right: 0;
    width: 360px;
    max-height: 430px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #e9edf5;
    border-radius: 16px;
    box-shadow: 0 18px 48px rgba(0,0,0,.12);
    z-index: 200;
    padding: 10px 0;
  }
  .notif-menu-header {
    padding: 8px 14px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f3f7;
    margin-bottom: 4px;
  }
  .notif-menu-title {
    font-size: 0.92rem;
    font-weight: 800;
    color: #1a1d23;
  }
  .notif-menu-action {
    border: none;
    background: none;
    color: #00b8b0;
    font-size: 0.74rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
  }
  .notif-empty {
    padding: 20px 14px;
    text-align: center;
    font-size: 0.82rem;
    color: #97a0b0;
  }
  .notif-item {
    padding: 11px 14px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    cursor: pointer;
    transition: background .15s;
    border-left: 3px solid transparent;
  }
  .notif-item:hover { background: #f8fbfd; }
  .notif-item.unread {
    background: #f5fffe;
    border-left-color: #00d4c8;
  }
  .notif-icon {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: #eef6f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    flex-shrink: 0;
  }
  .notif-body { min-width: 0; flex: 1; }
  .notif-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: #1a1d23;
    margin-bottom: 3px;
  }
  .notif-message {
    font-size: 0.73rem;
    color: #697386;
    line-height: 1.45;
    margin-bottom: 4px;
  }
  .notif-time {
    font-size: 0.66rem;
    color: #a1a8b5;
  }

  .topbar-user {
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; padding: 4px 8px; border-radius: 10px;
    transition: background .15s;
  }
  .topbar-user:hover { background: #f5f6f9; }
  .topbar-user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #00d4c8, #0099a8);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 800; color: #fff;
  }
  .topbar-user-name { font-size: 0.82rem; font-weight: 700; color: #1a1d23; }
  .topbar-user-sub  { font-size: 0.68rem; color: #9aa0ae; }

  .page-content { flex: 1; padding: 28px; }

  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.mobile-open { transform: translateX(0); }
    .layout-main { margin-left: 0 !important; }
    .notif-menu { width: min(340px, calc(100vw - 24px)); right: -40px; }
  }
`;

const STUDENT_NAV = [
  {
    section: null,
    items: [{ icon: "⊞", label: "Dashboard", path: "/dashboard" }],
  },
  {
    section: "Profile",
    items: [{ icon: "○", label: "My Profile", path: "/profile" }],
  },
  {
    section: "Matching",
    items: [
      { icon: "✦", label: "Suggested", path: "/matching" },
      { icon: "☰", label: "Roommate Requests", path: "/roommate-requests" },
    ],
  },
  {
    section: "Hostel",
    items: [
      { icon: "⊡", label: "Rooms", path: "/rooms" },
      { icon: "⚑", label: "Complaints", path: "/complaints" },
      { icon: "✈", label: "Leave", path: "/leave" },
      { icon: "👤", label: "Visitors", path: "/visitors" },
      { icon: "📢", label: "Notices", path: "/notices" },
    ],
  },
];

const ADMIN_NAV = [
  {
    section: null,
    items: [{ icon: "⊞", label: "Dashboard", path: "/admin/dashboard" }],
  },
  {
    section: "Management",
    items: [
      { icon: "⊡", label: "Rooms", path: "/admin/rooms" },
      { icon: "👥", label: "Students", path: "/admin/students" },
      { icon: "☰", label: "Requests", path: "/admin/requests" },
    ],
  },
  {
    section: "Hostel Ops",
    items: [
      { icon: "⚑", label: "Complaints", path: "/admin/complaints" },
      { icon: "✈", label: "Leave Req.", path: "/admin/leaves" },
      { icon: "👤", label: "Visitors", path: "/admin/visitors" },
      { icon: "➕", label: "Add Room", path: "/admin/add-room" },
      { icon: "📢", label: "Notices", path: "/admin/notices" },
    ],
  },
];

function timeAgo(dateStr) {
  if (!dateStr) return "Now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getNotifIcon(type = "general") {
  switch (type) {
    case "request": return "☰";
    case "complaint": return "⚑";
    case "leave": return "✈";
    case "visitor": return "👤";
    case "notice": return "📢";
    default: return "🔔";
  }
}

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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div
        className="sidebar-logo"
        onClick={() => navigate(role === "admin" ? "/admin/dashboard" : "/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <div className="logo-icon">N</div>
        <span className="logo-name">NestMate</span>
      </div>

      <nav className="sidebar-nav">
        {navConfig.map((group, gi) => (
          <div key={gi}>
            {group.section && <div className="nav-section-label">{group.section}</div>}
            {group.items.map((item) => (
              <div
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <button className="sidebar-collapse-btn" onClick={onToggle}>
        <span className="collapse-icon">«</span>
        <span className="collapse-label">Collapse</span>
      </button>

      <div className="sidebar-user">
        <div className="user-avatar">{user.initials}</div>
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.sub}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">⇥</button>
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
        axios.get(`${API}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
      setUnreadCount(countRes.data?.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id, link) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchNotifications();
      if (link) navigate(link);
    } catch (err) {
      console.error(err);
      if (link) navigate(link);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="topbar">
      <div className="topbar-search">
        <span style={{ color: "#b0b6c3" }}>🔍</span>
        <input placeholder="Search rooms, students, or requests..." />
      </div>

      <div className="topbar-right">
        <div className="topbar-icon-wrap" ref={menuRef}>
          <button
            className="topbar-icon-btn"
            onClick={() => setOpen((prev) => !prev)}
            title="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="notif-count">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          {open && (
            <div className="notif-menu">
              <div className="notif-menu-header">
                <div className="notif-menu-title">Notifications</div>
                <button className="notif-menu-action" onClick={markAllAsRead}>
                  Mark all read
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="notif-empty">No notifications yet.</div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item._id}
                    className={`notif-item ${item.isRead ? "" : "unread"}`}
                    onClick={() => markAsRead(item._id, item.link)}
                  >
                    <div className="notif-icon">{getNotifIcon(item.type)}</div>
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

        <button className="topbar-icon-btn">❓</button>

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
        <Sidebar
          role={role}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
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