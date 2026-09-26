import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SUPPORT_API = import.meta.env.DEV
  ? "/api/support"
  : `${import.meta.env.VITE_API_ROUTE}/api/support`;

const emptyForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const AdminSupport = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const token = localStorage.getItem("gvsc-token");
    if (!token) {
      setError("Please login again.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(SUPPORT_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === 0) {
        setError(data.message || "Unable to submit request. Please try again.");
        return;
      }

      setFormData(emptyForm);
      setShowSuccessPopup(true);
    } catch (err) {
      setError("Unable to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopupOk = () => {
    setShowSuccessPopup(false);
    navigate("/dashboard");
  };

  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">Admin Support</h1>

        <p className="page-subheading">
          Have a question or facing an issue? Contact our support team.
        </p>

        <hr className="page-divider" />
      </div>

      <form className="support-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="support-name">
            Name
          </label>

          <div className="input-container">
            <input
              id="support-name"
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="support-email">
            Email
          </label>

          <div className="input-container">
            <input
              id="support-email"
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="support-subject">
            Subject
          </label>

          <div className="input-container">
            <input
              id="support-subject"
              type="text"
              name="subject"
              className="form-input"
              placeholder="Enter your issue"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="support-message">
            Message
          </label>

          <textarea
            id="support-message"
            name="message"
            className="support-textarea"
            placeholder="Describe your issue..."
            value={formData.message}
            onChange={handleChange}
            rows={5}
          />
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {showSuccessPopup && (
        <div className="game-popup-overlay">
          <div className="game-popup">
            <div className="game-popup-header">SUCCESS</div>
            <div className="game-popup-body">
              <p className="game-popup-text">Submitted Successfully</p>
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

export default AdminSupport;
