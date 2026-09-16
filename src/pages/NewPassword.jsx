import { useState } from "react";
import { useNavigate } from "react-router-dom";
import gvscLogo from "../assets/Logo3.png";
import "../index.css";

const CHANGE_PASSWORD_API = import.meta.env.DEV
  ? "/api/change-password"
  : `${import.meta.env.VITE_API_ROUTE}/api/change-password`;

function PasswordEye({ hidden }) {
  if (hidden) {
    return (
      <svg className="password-eye-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14.12 14.12a3 3 0 1 1-4.24-4.24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="1"
          y1="1"
          x2="23"
          y2="23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg className="password-eye-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function NewPassword() {
  const [formData, setFormData] = useState({
    old_password: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    old_password: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      old_password: "",
      password: "",
    };

    if (!formData.old_password) {
      newErrors.old_password = "Please enter your old password.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter a new password.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (newErrors.old_password || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem("gvsc-token");
    if (!token) {
      setErrors((prev) => ({
        ...prev,
        old_password: "Please login again.",
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(CHANGE_PASSWORD_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === 0) {
        const message = String(data.message || "").toLowerCase();
        const wrongOldPassword =
          message.includes("old") ||
          message.includes("current") ||
          message.includes("incorrect") ||
          message.includes("invalid") ||
          data.status === 0;

        setErrors((prev) => ({
          ...prev,
          old_password: wrongOldPassword
            ? "Current Password is Incorrect"
            : "Unable to change password. Please try again.",
          password: "",
        }));
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        password: "Unable to change password. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    navigate(-1);
  };

  return (
    <div className="auth-page">
      <div className="auth-card new-password-card">
        <div className="auth-logo">
          <img src={gvscLogo} alt="Darbar Logo" />
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Change Password</h1>
          <p className="auth-subtitle">Enter your old password and a new one.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="old-password" className="form-label">
              Old Password
            </label>
            <div
              className={`input-container ${
                errors.old_password ? "input-error" : ""
              }`}
            >
              <input
                id="old-password"
                type={showOldPassword ? "text" : "password"}
                name="old_password"
                className="form-input"
                placeholder="Enter old password"
                value={formData.old_password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowOldPassword((open) => !open)}
                aria-label={showOldPassword ? "Hide password" : "Show password"}
              >
                <PasswordEye hidden={!showOldPassword} />
              </button>
            </div>
            <div className="field-error">{errors.old_password || "\u00A0"}</div>
          </div>

          <div className="form-group">
            <label htmlFor="new-password" className="form-label">
              New Password
            </label>
            <div
              className={`input-container ${
                errors.password ? "input-error" : ""
              }`}
            >
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                name="password"
                className="form-input"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword((open) => !open)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                <PasswordEye hidden={!showNewPassword} />
              </button>
            </div>
            <div className="field-error">{errors.password || "\u00A0"}</div>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Please wait..." : "Confirm"}
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="game-popup-overlay">
          <div className="game-popup">
            <div className="game-popup-header">SUCCESS</div>
            <div className="game-popup-body">
              <p className="game-popup-text">Password Updated Successfully</p>
              <button
                type="button"
                className="primary-button"
                onClick={handleSuccessOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewPassword;
