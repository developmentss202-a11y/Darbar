import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const SignIn = ({ onSignIn }) => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState({
    field: "",
    message: "",
  });

  const navigate = useNavigate();

  const clearError = () => {
    setError({
      field: "",
      message: "",
    });
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    setMobile(value);
    clearError();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError({
      field: "",
      message: "",
    });

    // Mobile validation
    if (!mobile) {
      setError({
        field: "mobile",
        message: "Please enter your mobile number.",
      });
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setError({
        field: "mobile",
        message: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    // Password validation
    if (!password) {
      setError({
        field: "password",
        message: "Please enter your password.",
      });
      return;
    }

    // Hardcoded Phase 1 credentials
    if (mobile !== "9876543210" || password !== "123456") {
      setError({
        field: "form",
        message: "Invalid Email or Password.",
      });
      return;
    }

    // Login successful
    console.log("Sign In data:", {
      mobile,
      password,
    });
    navigate("/");

    if (onSignIn) {
      onSignIn({
        mobile,
        password,
      });
    }
  };

  const onForgotPassword = () => {
    navigate("/forgot-password");
  };

  const onSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="auth-page">
      <div className="auth-card signin-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/src/assets/darbar-logo.png" alt="Darbar Logo" />
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>

          <p className="auth-subtitle">Proceed with your login</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Mobile Number */}
          <div className="form-group">
            <label htmlFor="signin-mobile" className="form-label">
              Mobile Number
            </label>

            <div
              className={`input-container ${
                error.field === "mobile" ? "input-container--error" : ""
              }`}
            >
              <input
                id="signin-mobile"
                type="tel"
                name="mobile"
                className="form-input"
                placeholder="Enter mobile number"
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel"
                value={mobile}
                onChange={handleMobileChange}
              />
            </div>

            {/* Mobile Error */}
            <div
              className={`field-error ${
                error.field === "mobile" ? "field-error--visible" : ""
              }`}
            >
              {error.field === "mobile" ? error.message : "\u00A0"}
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="signin-password" className="form-label">
                Password
              </label>

              <button
                type="button"
                className="forgot-password-button"
                onClick={onForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            <div
              className={`input-container ${
                error.field === "password" ? "input-container--error" : ""
              }`}
            >
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input"
                placeholder="Enter password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "◉" : "○"}
              </button>
            </div>

            {/* Password Error */}
            <div
              className={`field-error ${
                error.field === "password" ? "field-error--visible" : ""
              }`}
            >
              {error.field === "password" ? error.message : "\u00A0"}
            </div>
          </div>

          {/* Generic Login Error */}
          {error.field === "form" && (
            <div className="form-error">{error.message}</div>
          )}

          {/* Sign In */}
          <button type="submit" className="primary-button">
            Sign In
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="demo-box">
          <strong>Demo Credentials</strong>

          <span>Mobile: 9876543210</span>

          <span>Password: 123456</span>
        </div>

        {/* Sign Up */}
        <div className="auth-footer">
          <span>Don't have an account?</span>

          <button type="button" className="text-button" onClick={onSignUp}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
