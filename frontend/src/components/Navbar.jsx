import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">PlanForge</Link>
      <div className="nav-links">
        <Link to="/catalogue">Browse Templates</Link>
        {user?.role === 'seller' && <Link to="/dashboard">Dashboard</Link>}
        {user?.role === 'customer' && <Link to="/purchases">Purchase History</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <>
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
