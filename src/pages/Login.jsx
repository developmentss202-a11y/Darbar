import { useState } from "react";
import { useNavigate } from "react-router-dom";
import gvscLogo from "../assets/Logo3.png";
import { saveUserId } from "../utils/betting";
import "../index.css";

const LOGIN_API = import.meta.env.DEV
  ? "/api/login"
  : `${import.meta.env.VITE_API_ROUTE}/api/login`;

const SignIn = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError({
      field: "",
      message: "",
    });

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

    if (!password) {
      setError({
        field: "password",
        message: "Please enter your password.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          mobile: Number(mobile),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === 0) {
        setError({
          field: "form",
          message: "Invalid Phone Number or Password",
        });
        return;
      }

      const token = data.token || data.data?.token;
      if (token) {
        localStorage.setItem("gvsc-token", token);
      }
      saveUserId(data);

      navigate("/dashboard");
    } catch (err) {
      setError({
        field: "form",
        message: "Login failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onForgotPassword = () => {
    navigate("/new-password");
  };

  const onSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="auth-page">
      <div className="auth-card signin-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src={gvscLogo} alt="Darbar Logo" />
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
                {showPassword ? (
                  <svg className="password-eye-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : (
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
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
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
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

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
