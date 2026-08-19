import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError("");

    // Later you can call your backend API here
    // to send the OTP to the email.

    navigate("/otp");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/src/assets/darbar-logo.png" alt="Darbar Logo" />
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Forgot Password?</h1>

          <p className="auth-subtitle">
            Enter your email address and we'll send you an OTP to reset your
            password.
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="forgot-email" className="form-label">
              Email Address
            </label>

            <div className={`input-container ${error ? "input-error" : ""}`}>
              <span className="input-icon">✉</span>

              <input
                id="forgot-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoComplete="email"
              />
            </div>

            {/* Error */}
            <div className="field-error">{error}</div>
          </div>

          {/* Send OTP */}
          <button type="submit" className="primary-button">
            Send OTP
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>Remember your password?</span>

          <button
            type="button"
            className="text-button"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
