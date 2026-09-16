import { useNavigate } from "react-router-dom";

export function isUnauthorizedMessage(message) {
  const text = String(message || "").toLowerCase();

  if (text.includes("not authorized")) {
    return true;
  }

  if (text.includes("bearer token")) {
    return true;
  }

  if (text.includes("please login")) {
    return true;
  }

  return false;
}

function AuthRequired() {
  const navigate = useNavigate();

  return (
    <div className="auth-required">
      <p className="auth-required-text">
        You are not authorized please Sign In first
      </p>
      <button
        type="button"
        className="primary-button"
        onClick={() => navigate("/")}
      >
        Sign In
      </button>
    </div>
  );
}

export default AuthRequired;
