import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function MPIN() {
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow numbers only
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newMpin = [...mpin];
    newMpin[index] = value.slice(-1);

    setMpin(newMpin);
    setError("");

    // Move to next box
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move back on backspace
    if (e.key === "Backspace" && !mpin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredMPIN = mpin.join("");

    if (enteredMPIN.length !== 4) {
      setError("Please enter the complete 4-digit MPIN.");
      return;
    }

    setError("");

    // Save MPIN through backend later
    console.log("MPIN:", enteredMPIN);

    navigate("/home");
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="mpin-page">
      <div className="mpin-card">
        {/* Logo */}
        <div className="mpin-logo">
          <img src="/src/assets/darbar-logo.png" alt="Darbar Logo" />
        </div>

        {/* Header */}
        <div className="mpin-header">
          <h1 className="mpin-title">Set MPIN</h1>

          <p className="mpin-subtitle">
            Create a 4-digit MPIN for quick and secure access.
          </p>
        </div>

        {/* Form */}
        <form className="mpin-form" onSubmit={handleSubmit}>
          <div className="mpin-group">
            <label className="mpin-label">Enter MPIN</label>

            <div className="mpin-input-container">
              {mpin.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`mpin-input ${error ? "mpin-input-error" : ""}`}
                  aria-label={`MPIN digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Error */}
            <div className="mpin-field-error">{error}</div>
          </div>

          {/* Set MPIN */}
          <button type="submit" className="mpin-primary-button">
            Set MPIN
          </button>
        </form>

        {/* Skip */}
        <button type="button" className="mpin-skip-button" onClick={handleSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

export default MPIN;
