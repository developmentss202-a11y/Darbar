import { useState } from "react";
import { useNavigate } from "react-router-dom";
import gvscLogo from "../assets/Logo3.png";
import "../index.css";

const SignUp = ({ onContinue }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmpassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmpassword: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      mobile: "",
      password: "",
      confirmpassword: "",
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

    if (!formData.confirmpassword) {
      newErrors.confirmpassword = "Please confirm your password.";
      hasError = true;
    } else if (formData.password !== formData.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    /*
      Phase 1:
      Store signup information temporarily.

      Later this will be sent to your backend.
    */

    sessionStorage.setItem("signupData", JSON.stringify(formData));

    /*
      Go to OTP.

      IMPORTANT:
      We are NOT going to new-password here.

      Signup flow:
      SignUp → OTP → SetMPIN → Home
    */

    if (onContinue) {
      onContinue(formData);
    } else {
      navigate("/set-mpin");
    }
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
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="field-error">{errors.password || "\u00A0"}</div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
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
          </div>

          {/* Continue */}
          <button type="submit" className="primary-button">
            Continue
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
    </div>
  );
};

export default SignUp;
