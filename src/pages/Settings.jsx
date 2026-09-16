import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute("data-theme") || "dark";
  });

  const handleThemeChange = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("gvsc-theme", nextTheme);
  };

  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">Settings</h1>
        <p className="page-subheading">
          Manage password, notifications and theme
        </p>
        <hr className="page-divider" />
      </div>

      <div className="settings-list">
        <div className="settings-row">
          <span>Change Password</span>
          <button
            type="button"
            className="settings-action"
            onClick={() => navigate("/new-password")}
          >
            Change
          </button>
        </div>

        <div className="settings-row">
          <span>Notification</span>
          <button
            type="button"
            className={`settings-toggle ${notificationsOn ? "on" : ""}`}
            onClick={() => setNotificationsOn((prev) => !prev)}
            aria-pressed={notificationsOn}
          >
            {notificationsOn ? "On" : "Off"}
          </button>
        </div>

        <div className="settings-row">
          <span>Change Theme</span>
          <button
            type="button"
            className={`settings-toggle ${theme === "light" ? "on" : ""}`}
            onClick={handleThemeChange}
            aria-pressed={theme === "light"}
          >
            {theme === "light" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
