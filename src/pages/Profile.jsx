import React from "react";

const Profile = () => {
  return (
    <div className="app-page">
      <div className="page-header">
        <h1 className="page-heading">My Profile</h1>
        <p className="page-subheading">View your account and bank details</p>
        <hr className="page-divider" />
      </div>

      <div className="profile-container">
      {/* Top Section */}
      <div className="profile-header">
        <div className="profile-header-left">
          <div className="profile-avatar">YS</div>
          <div className="profile-info">
            <h2 className="profile-name">Yogesh Sharma</h2>
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
              <span>6377525200</span>
            </div>
          </div>
        </div>
        {/* <button className="profile-verified-btn">
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Verified
        </button> */}
      </div>

      {/* Bank Details */}
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
            <span className="bank-detail-label">Account Number</span>
            <span className="bank-detail-value">9876543210978</span>
          </div>
          <div className="bank-detail-row">
            <span className="bank-detail-label">IFSC Code</span>
            <span className="bank-detail-value">SBI000123</span>
          </div>
          <div className="bank-detail-row">
            <span className="bank-detail-label">Bank Name</span>
            <span className="bank-detail-value">SBI</span>
          </div>
          <div className="bank-detail-row">
            <span className="bank-detail-label">Paytm No.</span>
            <span className="bank-detail-value">6377525200</span>
          </div>
          <div className="bank-detail-row">
            <span className="bank-detail-label">Google Pay No.</span>
            <span className="bank-detail-value">6377525200</span>
          </div>
          <div className="bank-detail-row">
            <span className="bank-detail-label">Phone Pay No.</span>
            <span className="bank-detail-value">6377525200</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button className="profile-action-btn primary">
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
        <button className="profile-action-btn secondary">
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
        <button className="profile-action-btn secondary">
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
          Change MPIN
        </button>
      </div>
      </div>
    </div>
  );
};

export default Profile;
