import React, { useState } from "react";

const AdminSupport = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Support Request:", formData);

    // API call will go here later
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

        <button type="submit" className="primary-button">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default AdminSupport;
