import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gvscLogo from "../assets/Logo3.png";
import "../index.css";

const SignupOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [error, setError] = useState("");

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      return;
    }

    const digit = value.slice(-1);

    const newOtp = [...otp];

    newOtp[index] = digit;

    setOtp(newOtp);
    setError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    /*
      Phase 1 hardcoded OTP.

      Later this will be verified by backend.
    */

    if (enteredOTP !== "123456") {
      setError("Invalid OTP. Please try again.");
      return;
    }

    setError("");

    /*
      Signup OTP successful.

      Next:
      OTP → Set MPIN
    */

    navigate("/set-mpin");
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);

    setError("");

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        {/* Logo */}
        <div className="otp-logo">
          <img src={gvscLogo} alt="GVSC Logo" />
        </div>

        {/* Header */}
        <div className="otp-header">
          <h1 className="otp-title">Verify Mobile</h1>

          <p className="otp-subtitle">
            Enter the 6-digit OTP sent to your mobile number.
          </p>
        </div>

        {/* Form */}
        <form className="otp-form" onSubmit={handleSubmit}>
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

            {/* Error stays under OTP boxes */}
            <div className={`otp-error ${error ? "otp-error-visible" : ""}`}>
              {error || "\u00A0"}
            </div>
          </div>

          <button type="submit" className="otp-verify-button">
            Verify OTP
          </button>
        </form>

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

export default SignupOTP;
