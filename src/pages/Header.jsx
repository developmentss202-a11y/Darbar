import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../header.css";
import telegramIcon from "../assets/telegram-icon.svg";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);

    // Add logout logic here later
    // localStorage.removeItem("token");

    navigate("/login");
  };

  const menuItems = [
    {
      label: "Home",
      icon: "⌂",
      action: () => handleNavigation("/"),
    },
    {
      label: "My Profile",
      icon: "◉",
      action: () => handleNavigation("/profile"),
    },
    {
      label: "My Transactions",
      icon: "⇄",
      action: () => handleNavigation("/transactions"),
    },
    {
      label: "My Play History",
      icon: "▣",
      action: () => handleNavigation("/play-history"),
    },
    {
      label: "Admin Support",
      icon: "◌",
      action: () => handleNavigation("/admin-support"),
    },
    {
      label: "Result History",
      icon: "▤",
      action: () => handleNavigation("/result-history"),
    },
    {
      label: "How to Play / Notice",
      icon: "?",
      action: () => handleNavigation("/how-to-play"),
    },
    {
      label: "Add Money",
      icon: "+",
      action: () => handleNavigation("/add-money"),
    },
    {
      label: "Withdraw Money",
      icon: "↓",
      action: () => handleNavigation("/withdraw-money"),
    },
    {
      label: "Settings",
      icon: "⚙",
      action: () => handleNavigation("/settings"),
    },
    {
      label: "Share",
      icon: "↗",
      action: () => {
        setIsMenuOpen(false);

        if (navigator.share) {
          navigator.share({
            title: "Darbar",
            text: "Check out Darbar",
          });
        }
      },
    },
  ];

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="app-header">
        <div className="header-left">
          {/* Logo */}
          <button
            className="header-logo"
            type="button"
            onClick={() => handleNavigation("/")}
            aria-label="Go to home"
          >
            <img src="/src/assets/darbar-logo.png" alt="Darbar Logo" />

            <span className="header-brand-name">Darbar</span>
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="header-actions">
          <button
            type="button"
            className="header-action telegram-action"
            aria-label="Telegram"
            title="Telegram"
          >
            <span className="telegram-content">
              <img src={telegramIcon} alt="Telegram Icon" />
              <span>Telegram</span>
            </span>
          </button>

          {/* Refresh */}
          <button
            type="button"
            className="header-action"
            onClick={() => window.location.reload()}
            aria-label="Refresh"
            title="Refresh"
          >
            <span className="header-action-icon">↻</span>
          </button>

          {/* Wallet */}
          <button
            type="button"
            className="header-action header-wallet"
            onClick={() => handleNavigation("/wallet")}
            aria-label="Wallet"
            title="Wallet"
          >
            <span className="header-action-icon">₹</span>

            <span className="wallet-info">
              <span className="wallet-label">Wallet</span>
              <span className="wallet-balance">₹ 0.00</span>
            </span>
          </button>

          {/* Notification */}
          <button
            type="button"
            className="header-action notification-button"
            onClick={() => handleNavigation("/notifications")}
            aria-label="Notifications"
            title="Notifications"
          >
            <span className="header-action-icon">♢</span>

            <span className="notification-dot"></span>
          </button>

          {/* Hamburger */}
          <button
            type="button"
            className={`menu-button ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* =====================================================
          OVERLAY
      ===================================================== */}

      {isMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* SIDE MENU */}

      <aside className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        {/* User Profile */}
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

        {/* Menu Items */}
        <nav className="side-menu-nav">
          {menuItems.map((item, index) => (
            <button
              key={index}
              type="button"
              className={`side-menu-item ${
                item.label === "Home" ? "active" : ""
              }`}
              onClick={item.action}
            >
              <span className="side-menu-icon">{item.icon}</span>

              <span className="side-menu-label">{item.label}</span>
            </button>
          ))}

          {/* Logout */}
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

export default Header;
