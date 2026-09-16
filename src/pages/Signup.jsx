import { useState } from "react";
import { useNavigate } from "react-router-dom";
import gvscLogo from "../assets/Logo3.png";
import "../index.css";

const REGISTER_API = import.meta.env.DEV
  ? "/api/register"
  : `${import.meta.env.VITE_API_ROUTE}/api/register`;

function getRegisterError(data) {
  const message = String(data?.message || "");

  if (message.toLowerCase().includes("already")) {
    return {
      field: "mobile",
      text: "This user already exists. Please sign in.",
    };
  }

  return {
    field: "password",
    text: message || "Registration failed. Please try again.",
  };
}


const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    setFormData((prev) => ({
      ...prev,
      mobile: value,
    }));

    setErrors((prev) => ({
      ...prev,
      mobile: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      mobile: "",
      password: "",
    };

    let hasError = false;

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
      hasError = true;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(REGISTER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          mobile: Number(formData.mobile),
          password: formData.password,
        }),
      });


      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === 0) {
        const apiError = getRegisterError(data);
        setErrors((prev) => ({
          ...prev,
          [apiError.field]: apiError.text,
        }));
        return;
      }

      setShowSuccessPopup(true);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        password: "Registration failed. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopupOk = () => {
    setShowSuccessPopup(false);
    navigate("/");
  };

  const onSignIn = () => {
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src={gvscLogo} alt="Darbar Logo" />
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>

          <p className="auth-subtitle">Proceed to create your account</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="signup-name" className="form-label">
              Your Name
            </label>

            <div
              className={`input-container ${errors.name ? "input-error" : ""}`}
            >
              <input
                id="signup-name"
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="field-error">{errors.name || "\u00A0"}</div>
          </div>

          {/* Mobile */}
          <div className="form-group">
            <label htmlFor="signup-mobile" className="form-label">
              Mobile Number
            </label>

            <div
              className={`input-container ${
                errors.mobile ? "input-error" : ""
              }`}
            >
              <span className="input-country-code">+91</span>

              <input
                id="signup-mobile"
                type="tel"
                name="mobile"
                className="form-input"
                placeholder="Enter Mobile Number"
                maxLength={10}
                inputMode="numeric"
                value={formData.mobile}
                onChange={handleMobileChange}
                autoComplete="tel"
              />
            </div>

            <div className="field-error">{errors.mobile || "\u00A0"}</div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="signup-password" className="form-label">
              Password
            </label>

            <div
              className={`input-container ${
                errors.password ? "input-error" : ""
              }`}
            >
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((open) => !open)}
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

            <div className="field-error">{errors.password || "\u00A0"}</div>
          </div>

          {/* Confirm Password */}
          {/* <div className="form-group">
            <label htmlFor="signup-confirmpassword" className="form-label">
              Confirm Password
            </label>

            <div
              className={`input-container ${
                errors.confirmpassword ? "input-error" : ""
              }`}
            >
              <input
                id="signup-confirmpassword"
                type="password"
                name="confirmpassword"
                className="form-input"
                placeholder="Confirm password"
                value={formData.confirmpassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="field-error">
              {errors.confirmpassword || "\u00A0"}
            </div>
          </div> */}

          {/* Continue */}
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Please wait..." : "Continue"}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>Already have an account?</span>

          <button type="button" className="text-button" onClick={onSignIn}>
            Sign In
          </button>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="game-popup-overlay">
          <div className="game-popup">
            <div className="game-popup-header">SUCCESS</div>
            <div className="game-popup-body">
              <p className="game-popup-text">Registration Successful</p>
              <button
                type="button"
                className="primary-button"
                onClick={handlePopupOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
