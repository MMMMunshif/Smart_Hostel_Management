import { useState, useEffect } from "react";
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
    cursor: pointer;
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
    color: #5a6070;
    white-space: nowrap;
    overflow: hidden;
  }
  .nav-item:hover { background: #f5f6f9; color: #1a1d23; }
  .nav-item.active { background: #e8faf9; color: #00b8b0; }
  .nav-item.active .nav-icon { color: #00d4c8; }

  .nav-icon { font-size: 1.05rem; width: 22px; text-align: center; flex-shrink: 0; }
  .nav-label { font-size: 0.84rem; font-weight: 600; transition: opacity .2s; flex: 1; }
  .sidebar.collapsed .nav-label { opacity: 0; pointer-events: none; }

  .nav-badge {
    background: #00d4c8; color: #fff;
    font-size: 0.6rem; font-weight: 700;
    padding: 2px 6px; border-radius: 99px;
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
  }
  .sidebar.collapsed .logout-btn { opacity: 0; pointer-events: none; }
  .logout-btn:hover { color: #e05555; }

  /* Skeleton shimmer */
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 4px;
    display: block;
  }
  .sk-name { width: 90px; height: 10px; margin-bottom: 5px; }
  .sk-role { width: 60px; height: 8px;  }

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
    flex-shrink: 0;
  }
  .topbar-user-name { font-size: 0.82rem; font-weight: 700; color: #1a1d23; }
  .topbar-user-sub  { font-size: 0.68rem; color: #9aa0ae; }

  .page-content { flex: 1; padding: 28px; }

  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.mobile-open { transform: translateX(0); }
    .layout-main { margin-left: 0 !important; }
  }
`;

/* ── Nav configs ─────────────────────────────────── */
const STUDENT_NAV = [
  { section: null, items: [{ icon: "⊞", label: "Dashboard", path: "/dashboard" }] },
  { section: "Profile", items: [{ icon: "○", label: "My Profile", path: "/profile" }] },
  {
    section: "Matching",
    items: [
      { icon: "✦", label: "Suggested", path: "/matching" },
      { icon: "☰", label: "Requests",  path: "/requests", badge: "3" },
    ],
  },
  {
    section: "Hostel",
    items: [
      { icon: "⊡", label: "Rooms",      path: "/rooms"      },
      { icon: "⚑", label: "Complaints", path: "/complaints" },
      { icon: "✈", label: "Leave",      path: "/leave"      },
      { icon: "👤", label: "Visitors",   path: "/visitors"   },
    ],
  },
];

const ADMIN_NAV = [
  { section: null, items: [{ icon: "⊞", label: "Dashboard", path: "/admin" }] },
  {
    section: "Management",
    items: [
      { icon: "⊡", label: "Rooms",    path: "/admin/rooms"    },
      { icon: "👥", label: "Students", path: "/admin/students" },
      { icon: "☰", label: "Requests", path: "/admin/requests", badge: "5" },
    ],
  },
  {
    section: "Hostel Ops",
    items: [
      { icon: "⚑", label: "Complaints",  path: "/admin/complaints"  },
      { icon: "✈", label: "Leave Req.",   path: "/admin/leave"       },
      { icon: "👤", label: "Visitors",    path: "/admin/visitors"    },
      { icon: "🔧", label: "Maintenance", path: "/admin/maintenance" },
    ],
  },
  {
    section: "Communication",
    items: [
      { icon: "💬", label: "Messages", path: "/admin/messages", badge: "2" },
      { icon: "📢", label: "Notices",  path: "/admin/notices"  },
    ],
  },
  {
    section: "System",
    items: [
      { icon: "📊", label: "Reports",  path: "/admin/reports"  },
      { icon: "⚙",  label: "Settings", path: "/admin/settings" },
    ],
  },
];

/* ── Helpers ─────────────────────────────────────── */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

function buildSubtitle(user, role) {
  if (!user) return role === "admin" ? "Administrator" : "Student";
  const parts = [user.department, user.year].filter(Boolean);
  return parts.length ? parts.join(" · ") : user.role ?? (role === "admin" ? "Administrator" : "Student");
}

/* ── useCurrentUser hook ─────────────────────────── */
function useCurrentUser() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    axios
      .get(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.warn("Layout user fetch:", err))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}

/* ── Sidebar ─────────────────────────────────────── */
function Sidebar({ role, collapsed, onToggle, user, loading }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const navConfig = role === "admin" ? ADMIN_NAV : STUDENT_NAV;

  const initials = loading ? "…" : (getInitials(user?.name) || (role === "admin" ? "AU" : "S"));
  const name     = user?.name ?? "";
  const subtitle = buildSubtitle(user, role);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo" onClick={() => navigate(role === "admin" ? "/admin" : "/dashboard")}>
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
        <div className="user-avatar">{initials}</div>
        <div className="user-info">
          {loading ? (
            <>
              <span className="skeleton sk-name" />
              <span className="skeleton sk-role" />
            </>
          ) : (
            <>
              <div className="user-name">{name}</div>
              <div className="user-role">{subtitle}</div>
            </>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">⇥</button>
      </div>
    </div>
  );
}

/* ── TopBar ──────────────────────────────────────── */
function TopBar({ role, user, loading }) {
  const initials = loading ? "…" : (getInitials(user?.name) || (role === "admin" ? "AU" : "S"));
  const name     = user?.name ?? "";
  const subtitle = buildSubtitle(user, role);

  return (
    <div className="topbar">
      <div className="topbar-search">
        <span style={{ color: "#b0b6c3" }}>🔍</span>
        <input placeholder="Search rooms, students, or requests..." />
      </div>
      <div className="topbar-right">
        <button className="topbar-icon-btn">
          🔔<span className="notif-dot" />
        </button>
        <button className="topbar-icon-btn">❓</button>
        <div className="topbar-user">
          <div className="topbar-user-avatar">{initials}</div>
          <div>
            {loading ? (
              <>
                <span className="skeleton sk-name" style={{ display: "block", marginBottom: 5 }} />
                <span className="skeleton sk-role" style={{ display: "block" }} />
              </>
            ) : (
              <>
                <div className="topbar-user-name">{name}</div>
                <div className="topbar-user-sub">{subtitle}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Layout ──────────────────────────────────────── */
function Layout({ children, role }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, loading } = useCurrentUser();

  return (
    <>
      <style>{css}</style>
      <div className="layout-root">
        <Sidebar
          role={role}
          collapsed={isCollapsed}
          onToggle={() => setIsCollapsed((c) => !c)}
          user={user}
          loading={loading}
        />
        <div className={`layout-main ${isCollapsed ? "collapsed" : ""}`}>
          <TopBar role={role} user={user} loading={loading} />
          <div className="page-content">{children}</div>
        </div>
      </div>
    </>
  );
}

export { Layout, Sidebar, TopBar };
export default Layout;