import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard");
  };

  return (
    <div className="app-page error-page">
      <h1>Page not exist</h1>
      <button type="button" className="primary-button" onClick={handleNavigate}>
        Head to Dashboard
      </button>
    </div>
  );
};

export default Error;
