import { useNavigate } from "react-router-dom";

import "../header.css";

import telegramIcon from "../assets/telegram-icon.svg";
import gvscLogo from "../assets/Logo3.png";

function Header({ isMenuOpen, setIsMenuOpen }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Logo */}
        <button
          className="header-logo"
          type="button"
          onClick={() => handleNavigation("/dashboard")}
          aria-label="Go to dashboard"
        >
          <img src={gvscLogo} alt="GVSC Logo" />

          <span className="header-brand-name">GVSC</span>
        </button>
      </div>

      {/* Right Side Actions */}
      <div className="header-actions">
        {/* Telegram */}
        <button
          type="button"
          className="header-action telegram-action"
          aria-label="Telegram"
          title="Telegram"
        >
          <span className="telegram-content">
            <img
              src={telegramIcon}
              alt=""
              width="24"
              height="24"
            />

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
  );
}

export default Header;
