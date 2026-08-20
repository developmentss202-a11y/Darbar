import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsOpen(false);
    navigate("/login");
  };

  const menuItems = [
    { label: "Home", icon: "⌂", path: "/dashboard" },
    { label: "My Profile", icon: "◉", path: "/profile" },
    { label: "My Transactions", icon: "⇄", path: "/transactions" },
    { label: "My Play History", icon: "▣", path: "/play-history" },
    { label: "Admin Support", icon: "◌", path: "/admin-support" },
    { label: "Result History", icon: "▤", path: "/result-history" },
    { label: "How to Play / Notice", icon: "?", path: "/how-to-play" },
    { label: "Add Money", icon: "+", path: "/add-money" },
    { label: "Withdraw Money", icon: "↓", path: "/withdraw-money" },
    { label: "Settings", icon: "⚙", path: "/settings" },
    {
      label: "Share",
      icon: "↗",
      action: async () => {
        setIsOpen(false);

        if (navigator.share) {
          try {
            await navigator.share({
              title: "Darbar",
              text: "Check out Darbar",
            });
          } catch (error) {
            console.log("Share cancelled");
          }
        }
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
            <span>G</span>
          </div>
          <div className="guest-info">
            <span className="guest-label">Welcome</span>
            <span className="guest-name">Guest</span>
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
              onClick={() => handleNavigation(item.path)}
            >
              <span className="side-menu-icon">{item.icon}</span>
              <span className="side-menu-label">{item.label}</span>
            </button>
          ))}

          <div className="logout-divider"></div>

          <button
            type="button"
            className="side-menu-item logout-item"
            onClick={handleLogout}
          >
            <span className="side-menu-icon">⎋</span>
            <span className="side-menu-label">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
