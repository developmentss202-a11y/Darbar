import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { shareText } from "../utils/share";
import {
  clearUserId,
  getStoredUserName,
  resolveUserName,
} from "../utils/betting";

function getInitial(name) {
  return (name || "G").trim().charAt(0).toUpperCase() || "G";
}

function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userName, setUserName] = useState(() => getStoredUserName());

  useEffect(() => {
    let cancelled = false;

    resolveUserName().then((name) => {
      if (!cancelled && name) {
        setUserName(name);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleNavigation = (path) => {
    setIsOpen(false);
    setShowLogoutConfirm(false);
    navigate(path);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("gvsc-token");
    clearUserId();
    setShowLogoutConfirm(false);
    setIsOpen(false);
    navigate("/");
  };

  const menuItems = [
    { label: "Home", icon: "⌂", path: "/dashboard" },
    { label: "Leak Jodi", icon: "◉◉", path: "/leak-jodi" },
    { label: "My Profile", icon: "◉", path: "/profile" },
    { label: "My Transactions", icon: "⇄", path: "/transactions" },
    { label: "My Play History", icon: "▣", path: "/play-history" },
    { label: "Admin Support", icon: "◌", path: "/admin-support" },
    { label: "Result History", icon: "▤", path: "/result-history" },
    { label: "How to Play / Notice", icon: "?", path: "/how-to-play" },
    { label: "Add Money", icon: "+", path: "/add-money" },
    { label: "Withdraw Money", icon: "↓", path: "/withdraw-money" },
    { label: "Refer & Earn", icon: "★", path: "/refer-and-earn" },
    { label: "Settings", icon: "⚙", path: "/settings" },
    {
      label: "Share",
      icon: "↗",
      action: () => {
        shareText({
          title: "GVSC",
          text: "Check out GVSC",
        }).finally(() => {
          setIsOpen(false);
        });
      },
    },
  ];

  return (
    <>
      {isOpen && (
        <div className="menu-overlay" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`side-menu ${isOpen ? "open" : ""}`}>
        <div className="side-menu-profile">
          <div className="guest-avatar">
            <span>{getInitial(userName)}</span>
          </div>
          <div className="guest-info">
            <span className="guest-label">Welcome</span>
            <span className="guest-name">{userName || "Guest"}</span>
          </div>
        </div>

        <div className="side-menu-divider"></div>

        <nav className="side-menu-nav">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`side-menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => {
                if (item.action) {
                  item.action();
                  return;
                }
                handleNavigation(item.path);
              }}
            >
              <span className="side-menu-icon">{item.icon}</span>
              <span className="side-menu-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="side-menu-logout">
          <div className="logout-divider"></div>
          <button
            type="button"
            className="side-menu-item logout-item"
            onClick={handleLogoutClick}
          >
            <span className="side-menu-icon">⎋</span>
            <span className="side-menu-label">Logout</span>
          </button>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="confirm-overlay" onClick={handleLogoutCancel}>
          <div
            className="confirm-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="logout-confirm-title"
            aria-modal="true"
          >
            <h2 id="logout-confirm-title" className="confirm-title">
              Logout
            </h2>
            <p className="confirm-text">Do you want to logout?</p>
            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-btn confirm-btn-cancel"
                onClick={handleLogoutCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-btn confirm-btn-logout"
                onClick={handleLogoutConfirm}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
