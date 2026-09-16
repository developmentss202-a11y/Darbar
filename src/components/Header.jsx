import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import singleCoin from "../assets/singlegold-coin.png";
import bell from "../assets/bell.png";
import closeIcon from "../assets/remove.png";

import "../header.css";

import gvscLogo from "../assets/Logo3.png";
import { SETTINGS_API } from "../data/wallet";

const ADD_MONEY_LIST_API = import.meta.env.DEV
  ? "/api/add-money-list"
  : `${import.meta.env.VITE_API_ROUTE}/api/add-money-list`;

const WITHDRAW_LIST_API = import.meta.env.DEV
  ? "/api/withdraw-list"
  : `${import.meta.env.VITE_API_ROUTE}/api/withdraw-list`;

function getApiList(data) {
  const list = data?.data ?? data?.list ?? [];
  if (Array.isArray(list)) {
    return list;
  }
  if (list && typeof list === "object") {
    const nested = list.list || list.data || list.records;
    if (Array.isArray(nested)) {
      return nested;
    }
  }
  return [];
}

function formatTime(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    return "";
  }

  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) {
    return "Just now";
  }
  if (mins < 60) {
    return `${mins} min ago`;
  }

  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) {
    return "Yesterday";
  }
  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString();
}

function toNotification(row, type) {
  const stamp = new Date(row.created_at || row.date || row.updated_at || 0).getTime();
  const status = row.status || "Pending";
  const amount = row.amount ?? "";
  const isAdd = type === "add";

  return {
    id: `${type}-${row.id || stamp}`,
    title: isAdd ? `Add Money · ${status}` : `Withdrawal · ${status}`,
    text:
      row.pending_message ||
      row.message ||
      (isAdd
        ? `Add money request of ₹${amount} is ${status}.`
        : `Withdrawal request of ₹${amount} is ${status}.`),
    time: formatTime(row.created_at || row.date || row.updated_at),
    stamp: Number.isNaN(stamp) ? 0 : stamp,
  };
}

function fromAlerts(list, title) {
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .map((item, index) => {
      if (!item) {
        return null;
      }
      if (typeof item === "string") {
        return {
          id: `${title}-${index}`,
          title,
          text: item,
          time: "",
          stamp: 0,
        };
      }
      return toNotification(
        item,
        title.toLowerCase().includes("withdraw") ? "withdraw" : "add"
      );
    })
    .filter(Boolean);
}

async function fetchList(url, token) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json().catch(() => ({}));
}

const SEEN_KEY = "gvsc-notif-seen";

function readSeen() {
  try {
    const value = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
    return Array.isArray(value) ? value.map(String) : [];
  } catch (error) {
    return [];
  }
}

function writeSeen(ids) {
  const unique = [...new Set(ids.map(String))];
  localStorage.setItem(SEEN_KEY, JSON.stringify(unique));
  return unique;
}

function Header({
  isMenuOpen,
  setIsMenuOpen,
  showNotifications,
  setShowNotifications,
}) {
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const panelOpenRef = useRef(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [seenIds, setSeenIds] = useState(() => readSeen());

  panelOpenRef.current = showNotifications;

  const unreadCount = notifications.filter(
    (item) => !seenIds.includes(String(item.id))
  ).length;
  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    setShowNotifications(false);
    navigate(path);
  };

  const toggleNotifications = () => {
    setShowNotifications((open) => {
      const next = !open;
      if (next) {
        setSeenIds((current) =>
          writeSeen([...current, ...notifications.map((item) => String(item.id))])
        );
      }
      return next;
    });
    setIsMenuOpen(false);
  };

  const loadNotifications = (showLoader = false) => {
    const token = localStorage.getItem("gvsc-token");
    if (!token) {
      setNotifications([]);
      return;
    }

    if (showLoader) {
      setNotificationsLoading(true);
    }

    Promise.all([
      fetchList(ADD_MONEY_LIST_API, token),
      fetchList(WITHDRAW_LIST_API, token),
      fetchList(SETTINGS_API, token),
    ])
      .then(([addData, withdrawData, settingsData]) => {
        const settings = settingsData.data || settingsData || {};
        const items = [
          ...getApiList(addData).map((row) => toNotification(row, "add")),
          ...getApiList(withdrawData).map((row) =>
            toNotification(row, "withdraw")
          ),
          ...fromAlerts(settings.add_money_alerts, "Add Money"),
          ...fromAlerts(settings.withdraw_alerts, "Withdrawal"),
        ];

        if (settings.add_money_alert_message) {
          items.push({
            id: "add-alert",
            title: "Add Money",
            text: settings.add_money_alert_message,
            time: "",
            stamp: 0,
          });
        }
        if (settings.withdraw_alert_message) {
          items.push({
            id: "withdraw-alert",
            title: "Withdrawal",
            text: settings.withdraw_alert_message,
            time: "",
            stamp: 0,
          });
        }

        items.sort((a, b) => b.stamp - a.stamp || String(b.id).localeCompare(String(a.id)));
        setNotifications(items);

        if (panelOpenRef.current) {
          setSeenIds(writeSeen(items.map((item) => String(item.id))));
        }
      })
      .catch(() => {
        setNotifications([]);
      })
      .finally(() => {
        setNotificationsLoading(false);
      });
  };

  useEffect(() => {
    loadNotifications(true);

    const timer = window.setInterval(() => {
      loadNotifications(false);
    }, 20000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showNotifications) {
      loadNotifications(true);
    }
  }, [showNotifications]);

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
            {unreadCount > 0 ? (
              <span className="notification-badge">{badgeLabel}</span>
            ) : null}
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
                {notificationsLoading && notifications.length === 0 && (
                  <p className="notification-empty">Loading...</p>
                )}

                {!notificationsLoading && notifications.length === 0 && (
                  <p className="notification-empty">No notifications</p>
                )}

                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="notification-item"
                    role="menuitem"
                  >
                    <span className="notification-item-title">
                      {item.title}
                    </span>
                    <span className="notification-item-text">{item.text}</span>
                    {item.time ? (
                      <span className="notification-item-time">{item.time}</span>
                    ) : null}
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
