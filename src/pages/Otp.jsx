import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gvscLogo from "../assets/Logo3.png";
import "../index.css";

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // ============================================================
  // HANDLE OTP CHANGE
  // ============================================================

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;

    setOtp(newOtp);
    setError("");

    // Move to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ============================================================
  // HANDLE KEYBOARD
  // ============================================================

  const handleKeyDown = (e, index) => {
    // Backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Right arrow
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ============================================================
  // HANDLE OTP SUBMIT
  // ============================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredOTP = otp.join("");

    // Empty / incomplete OTP
    if (enteredOTP.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    // Hardcoded Phase 1 OTP
    if (enteredOTP !== "123456") {
      setError("Invalid OTP. Please try again.");
      return;
    }

    // Clear error
    setError("");

    // Navigate after successful verification
    navigate("/new-password");
  };

  // ============================================================
  // RESEND OTP
  // ============================================================

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
  };

  // ============================================================
  // HANDLE PASTE
  // ============================================================

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const newOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    const nextIndex = pastedValue.length < 6 ? pastedValue.length : 5;

    setTimeout(() => {
      inputRefs.current[nextIndex]?.focus();
    }, 0);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="otp-page">
      <div className="otp-card">
        {/* Logo */}
        <div className="otp-logo">
          <img src={gvscLogo} alt="GVSC Logo" />
        </div>

        {/* Header */}
        <div className="otp-header">
          <h1 className="otp-title">Enter OTP</h1>

          <p className="otp-subtitle">
            Enter the 6-digit OTP sent to your email address.
          </p>
        </div>

        {/* Form */}
        <form className="otp-form" onSubmit={handleSubmit}>
          {/* OTP */}
          <div className="otp-form-group">
            <label className="otp-label">Verification Code</label>

            <div className="otp-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`otp-digit ${error ? "otp-digit-error" : ""}`}
                  aria-label={`OTP digit ${index + 1}`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Error under OTP boxes */}
            <div className={`otp-error ${error ? "otp-error-visible" : ""}`}>
              {error || "\u00A0"}
            </div>
          </div>

          {/* Verify Button */}
          <button type="submit" className="otp-verify-button">
            Verify OTP
          </button>
        </form>

        <div className="demo-box">
          <strong>Demo OTP</strong>
          <span>OTP: 123456</span>
        </div>

        {/* Footer */}
        <div className="otp-footer">
          <span>Didn't receive the OTP?</span>

          <button
            type="button"
            className="otp-resend-button"
            onClick={handleResend}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTP;
