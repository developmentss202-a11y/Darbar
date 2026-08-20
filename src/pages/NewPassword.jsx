import { useState } from "react";
import { useNavigate } from "react-router-dom";
import gvscLogo from "../assets/Logo3.png";
import "../index.css";

function NewPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // ============================================================
  // HANDLE INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccess("");
  };

  // ============================================================
  // HANDLE SUBMIT
  // ============================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      password: "",
      confirmPassword: "",
    };

    // New password empty
    if (!formData.password) {
      newErrors.password = "Please enter a new password.";
    }

    // Password length
    else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    // Confirm password empty
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    }

    // Password mismatch
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Show errors
    if (newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      setSuccess("");
      return;
    }

    // ============================================================
    // PHASE 1 - SAVE PASSWORD LOCALLY
    // ============================================================

    localStorage.setItem("darbarPassword", formData.password);

    setErrors({
      password: "",
      confirmPassword: "",
    });

    setSuccess("Password changed successfully.");

    // Go to login after a short delay
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // ============================================================
  // GO TO LOGIN
  // ============================================================

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card new-password-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src={gvscLogo} alt="Darbar Logo" />
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">New Password</h1>

          <p className="auth-subtitle">
            Create a new password for your account.
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* New Password */}
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
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {/* Error stays under input */}
            <div className="field-error">{errors.password || "\u00A0"}</div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Confirm Password
            </label>

            <div
              className={`input-container ${
                errors.confirmPassword ? "input-error" : ""
              }`}
            >
              <input
                id="confirm-password"
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {/* Error stays under input */}
            <div className="field-error">
              {errors.confirmPassword || "\u00A0"}
            </div>
          </div>

          {/* Success Message */}
          <div
            className={`new-password-success ${
              success ? "new-password-success-visible" : ""
            }`}
          >
            {success || "\u00A0"}
          </div>

          {/* Submit */}
          <button type="submit" className="primary-button">
            Set New Password
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>Remember your password?</span>

          <button type="button" className="text-button" onClick={handleSignIn}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
