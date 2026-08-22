import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import singleCoin from "../assets/singlegold-coin.png";
import bell from "../assets/bell.png";
import closeIcon from "../assets/remove.png";

import "../header.css";

import gvscLogo from "../assets/Logo3.png";

const demoNotifications = [
  {
    id: 1,
    title: "Withdrawal Successful",
    text: "Your withdrawal of ₹500 has been processed.",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Deposit Received",
    text: "₹1000 added to your wallet.",
    time: "15 min ago",
  },
  {
    id: 3,
    title: "DELHI STAR-DL Closed",
    text: "Market closed. Result at 12:30 PM.",
    time: "1 hour ago",
  },
  {
    id: 4,
    title: "Play Confirmed",
    text: "Your play on RAWASED is confirmed.",
    time: "3 hours ago",
  },
  {
    id: 5,
    title: "Result Declared",
    text: "FARIDABAD result is now available.",
    time: "Yesterday",
  },
  {
    id: 6,
    title: "Wallet Update",
    text: "Bonus of ₹50 credited to your wallet.",
    time: "Yesterday",
  },
  {
    id: 7,
    title: "Sunday Notice",
    text: "Do not send any type of message on Sunday.",
    time: "2 days ago",
  },
];

function Header({
  isMenuOpen,
  setIsMenuOpen,
  showNotifications,
  setShowNotifications,
}) {
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    setShowNotifications(false);
    navigate(path);
  };

  const toggleNotifications = () => {
    setShowNotifications((open) => !open);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!showNotifications) {
      return;
    }

    const handleClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showNotifications]);

  useEffect(() => {
    if (isMenuOpen) {
      setShowNotifications(false);
    }
  }, [isMenuOpen]);

  return (
    <header className="app-header">
      <div className="header-left">
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

      <div className="header-actions">
        <button
          type="button"
          className="header-action header-wallet"
          onClick={() => handleNavigation("/wallet")}
          aria-label="Wallet"
          title="Wallet"
        >
          <span className="header-action-icon header-gold-coin">
            <img src={singleCoin} alt="Gold Coin" />
          </span>
          <span className="wallet-info">
            <span className="wallet-label">Wallet</span>
            <span className="wallet-balance">₹ 0.00</span>
          </span>
        </button>

        <div className="notification-wrap" ref={notificationRef}>
          <button
            type="button"
            className={`header-action notification-button ${
              showNotifications ? "active" : ""
            }`}
            onClick={toggleNotifications}
            aria-label="Notifications"
            title="Notifications"
            aria-expanded={showNotifications}
          >
            <span className="header-action-icon header-bell">
              <img src={bell} alt="Notification Bell" />
            </span>
            <span className="notification-dot"></span>
          </button>

          {showNotifications && (
            <div className="notification-menu" role="menu">
              <div className="notification-menu-header">
                <p className="notification-menu-title">Notifications</p>
                <button
                  type="button"
                  className="notification-menu-close"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close notifications"
                >
                  <span className="notification-menu-close-icon">
                    <img src={closeIcon} alt="Close" />
                  </span>
                </button>
              </div>
              <div className="notification-menu-list">
                {demoNotifications.map((item) => (
                  <div
                    key={item.id}
                    className="notification-item"
                    role="menuitem"
                  >
                    <span className="notification-item-title">
                      {item.title}
                    </span>
                    <span className="notification-item-text">{item.text}</span>
                    <span className="notification-item-time">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
