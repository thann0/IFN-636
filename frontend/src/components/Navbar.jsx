import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import planforgeLogo from '../assets/planforge-logo.png';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* LEFT: LOGO */}
      <Link to="/" className="navbar-brand">
        <img
          src={planforgeLogo}
          alt="PlanForge"
          className="navbar-logo"
        />
        <span>PlanForge</span>
      </Link>

      {/* CENTER: MAIN LINKS */}
      <div className="navbar-center">
        <Link to="/catalogue">Browse Templates</Link>

        <a href="#features">
          Features
        </a>

        {user?.role === 'seller' ? (
          <Link to="/dashboard">For creators</Link>
        ) : (
          <Link to="/register">For creators</Link>
        )}
      </div>

      {/* RIGHT: AUTH */}
      <div className="navbar-actions">
        {!user ? (
          <Link
            to="/login"
            className="navbar-login-button"
          >
            Login
          </Link>
        ) : (
          <>
            {user?.role === 'customer' && (
              <Link
                to="/purchases"
                className="navbar-secondary-link"
              >
                Purchase History
              </Link>
            )}

            <span className="navbar-user-name">
              {user.name}
            </span>

            <button
              type="button"
              className="navbar-login-button navbar-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}