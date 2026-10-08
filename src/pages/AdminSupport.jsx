import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROFILE_API, getStoredUserName, saveUserId } from "../utils/betting";

const SUPPORT_API = import.meta.env.DEV
  ? "/api/support"
  : `${import.meta.env.VITE_API_ROUTE}/api/support`;

const emptyForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const emptyErrors = {
  email: "",
  subject: "",
  message: "",
  form: "",
};

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

const AdminSupport = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ...emptyForm,
    name: getStoredUserName(),
  });
  const [errors, setErrors] = useState(emptyErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("gvsc-token");
    if (!token) {
      return;
    }

    fetch(PROFILE_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => response.json().catch(() => ({})))
      .then((data) => {
        saveUserId(data);
        const name =
          data?.data?.name ||
          data?.data?.user_name ||
          getStoredUserName();
        if (name) {
          setFormData((prev) => ({ ...prev, name }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = { ...emptyErrors };
    let hasError = false;

    if (!formData.name.trim()) {
      nextErrors.form = "Unable to load your name. Please login again.";
      hasError = true;
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your email.";
      hasError = true;
    } else if (!isValidEmail(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
      hasError = true;
    }

    if (!formData.subject.trim()) {
      nextErrors.subject = "Please enter a subject.";
      hasError = true;
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Please enter your message.";
      hasError = true;
    }

    setErrors(nextErrors);
    if (hasError) {
      return;
    }

    const token = localStorage.getItem("gvsc-token");
    if (!token) {
      setErrors((prev) => ({ ...prev, form: "Please login again." }));
      return;
    }

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
        setErrors((prev) => ({
          ...prev,
          form: data.message || "Unable to submit request. Please try again.",
        }));
        return;
      }

      setFormData((prev) => ({
        ...emptyForm,
        name: prev.name,
      }));
      setShowSuccessPopup(true);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: "Unable to submit request. Please try again.",
      }));
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

      <form
        className="support-form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >
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
              value={formData.name}
              readOnly
              aria-readonly="true"
              tabIndex={-1}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="support-email">
            Email
          </label>
          <div
            className={`input-container ${
              errors.email ? "input-container--error" : ""
            }`}
          >
            <input
              id="support-email"
              type="text"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div
            className={`field-error ${
              errors.email ? "field-error--visible" : ""
            }`}
          >
            {errors.email || "\u00A0"}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="support-subject">
            Subject
          </label>
          <div
            className={`input-container ${
              errors.subject ? "input-container--error" : ""
            }`}
          >
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
          <div
            className={`field-error ${
              errors.subject ? "field-error--visible" : ""
            }`}
          >
            {errors.subject || "\u00A0"}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="support-message">
            Message
          </label>
          <textarea
            id="support-message"
            name="message"
            className={`support-textarea ${
              errors.message ? "input-container--error" : ""
            }`}
            placeholder="Describe your issue..."
            value={formData.message}
            onChange={handleChange}
            rows={5}
          />
          <div
            className={`field-error ${
              errors.message ? "field-error--visible" : ""
            }`}
          >
            {errors.message || "\u00A0"}
          </div>
        </div>

        {errors.form ? <p className="form-error">{errors.form}</p> : null}

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
