import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthRequired, { isUnauthorizedMessage } from "../components/AuthRequired";
import { saveUserId } from "../utils/betting";

const PROFILE_API = import.meta.env.DEV
  ? "/api/profile-detail"
  : `${import.meta.env.VITE_API_ROUTE}/api/profile-detail`;

const UPDATE_PROFILE_API = import.meta.env.DEV
  ? "/api/update-payment-detail"
  : `${import.meta.env.VITE_API_ROUTE}/api/update-payment-detail`;

const emptyForm = {
  name: "",
  bank_name: "",
  account_no: "",
  account_holder_name: "",
  ifsc: "",
  paytm_no: "",
  google_pay: "",
  phone_pay: "",
};

function getInitials(name) {
  if (!name) {
    return "--";
  }

  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts[1]?.[0] || "";
  return (first + last).toUpperCase();
}

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const loadProfile = () => {
    const token = localStorage.getItem("gvsc-token");

    if (!token) {
      setError("unauthorized");
      setLoading(false);
      return;
    }

    fetch(PROFILE_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json().catch(() => ({})))
      .then((data) => {
        if (data.status === 0 || !data.data) {
          setError(
            isUnauthorizedMessage(data.message) ? "unauthorized" : data.message || "Unable to load profile."
          );
          return;
        }

        setProfile(data.data);
        saveUserId(data);
        setError("");
      })
      .catch(() => {
        setError("Unable to load profile.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const openEdit = () => {
    const bank = profile?.user_detail || {};
    setForm({
      name: profile?.name || "",
      bank_name: bank.bank_name || "",
      account_no: bank.account_no || "",
      account_holder_name: bank.account_holder_name || "",
      ifsc: bank.ifsc || "",
      paytm_no: bank.paytm_no || "",
      google_pay: bank.google_pay || "",
      phone_pay: bank.phone_pay || "",
    });
    setFormError("");
    setIsEditing(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("gvsc-token");

    if (!token) {
      setFormError("Please login again.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const response = await fetch(UPDATE_PROFILE_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === 0) {
        setFormError("Unable to update profile. Please try again.");
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      setFormError("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    setIsEditing(false);
    setLoading(true);
    loadProfile();
  };

  const bank = profile?.user_detail || {};

  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">My Profile</h1>
        <p className="page-subheading">View your account and bank details</p>
        <hr className="page-divider" />
      </div>

      {loading && <p className="page-subheading">Loading profile...</p>}

      {!loading && error === "unauthorized" && <AuthRequired />}

      {!loading && error && error !== "unauthorized" && (
        <p className="form-error">{error}</p>
      )}

      {!loading && profile && !isEditing && (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-header-left">
              <div className="profile-avatar">{getInitials(profile.name)}</div>
              <div className="profile-info">
                <h2 className="profile-name">{profile.name || "-"}</h2>
                <div className="profile-phone">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{profile.mobile || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-bank-section">
            <h3 className="bank-section-title">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="22" width="18" height="2"></rect>
                <rect x="4" y="10" width="16" height="10"></rect>
                <path d="M2 10l10-8 10 8"></path>
                <path d="M8 22v-6"></path>
                <path d="M16 22v-6"></path>
              </svg>
              BANK DETAILS
            </h3>
            <div className="bank-details-card">
              <div className="bank-detail-row">
                <span className="bank-detail-label">Account Holder</span>
                <span className="bank-detail-value">
                  {bank.account_holder_name || "-"}
                </span>
              </div>
              <div className="bank-detail-row">
                <span className="bank-detail-label">Account Number</span>
                <span className="bank-detail-value">{bank.account_no || "-"}</span>
              </div>
              <div className="bank-detail-row">
                <span className="bank-detail-label">IFSC Code</span>
                <span className="bank-detail-value">{bank.ifsc || "-"}</span>
              </div>
              <div className="bank-detail-row">
                <span className="bank-detail-label">Bank Name</span>
                <span className="bank-detail-value">{bank.bank_name || "-"}</span>
              </div>
              <div className="bank-detail-row">
                <span className="bank-detail-label">Paytm No.</span>
                <span className="bank-detail-value">{bank.paytm_no || "-"}</span>
              </div>
              <div className="bank-detail-row">
                <span className="bank-detail-label">Google Pay No.</span>
                <span className="bank-detail-value">{bank.google_pay || "-"}</span>
              </div>
              <div className="bank-detail-row">
                <span className="bank-detail-label">Phone Pay No.</span>
                <span className="bank-detail-value">{bank.phone_pay || "-"}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              type="button"
              className="profile-action-btn primary"
              onClick={openEdit}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              Edit Profile
            </button>
            <button
              type="button"
              className="profile-action-btn secondary"
              onClick={() => navigate("/new-password")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Change Password
            </button>
          </div>
        </div>
      )}

      {!loading && profile && isEditing && (
        <form className="money-form profile-edit-form" onSubmit={handleUpdate}>
          {[
            ["name", "Name"],
            ["account_holder_name", "Account Holder Name"],
            ["account_no", "Account Number"],
            ["ifsc", "IFSC Code"],
            ["bank_name", "Bank Name"],
            ["paytm_no", "Paytm No."],
            ["google_pay", "Google Pay No."],
            ["phone_pay", "Phone Pay No."],
          ].map(([key, label]) => (
            <div className="form-group" key={key}>
              <label className="money-label" htmlFor={`profile-${key}`}>
                {label}
              </label>
              <input
                id={`profile-${key}`}
                className="money-input"
                name={key}
                value={form[key]}
                onChange={handleFormChange}
              />
            </div>
          ))}

          {formError ? <p className="form-error">{formError}</p> : null}

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
          <button
            type="button"
            className="profile-action-btn secondary"
            onClick={() => setIsEditing(false)}
            disabled={saving}
          >
            Cancel
          </button>
        </form>
      )}

      {showSuccess && (
        <div className="game-popup-overlay">
          <div className="game-popup">
            <div className="game-popup-header">SUCCESS</div>
            <div className="game-popup-body">
              <p className="game-popup-text">Profile Updated Successfully</p>
              <button
                type="button"
                className="primary-button"
                onClick={handleSuccessOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
