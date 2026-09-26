import { Link, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

function AuthRequiredModal({ onClose }) {
  const location = useLocation();

  const redirectPath =
    location.pathname + location.search;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-box">
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2>Login Required</h2>

        <p>
          Please login or create an account to add
          products to your cart.
        </p>

        <div className="auth-modal-actions">
          <Link
            to="/login"
            state={{ from: redirectPath }}
            className="auth-login-btn"
          >
            Login
          </Link>

          <Link
            to="/register"
            state={{ from: redirectPath }}
            className="auth-register-btn"
          >
            Create Account
          </Link>
        </div>

        <button
          type="button"
          className="auth-continue-btn"
          onClick={onClose}
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
}

export default AuthRequiredModal;