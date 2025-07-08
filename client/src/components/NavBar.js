import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/signin');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container-fluid">
        <span className="navbar-brand">Welcome, {currentUser.username}!</span>
        <div className="d-flex">
          <Link to="/posts" className="btn btn-outline-primary me-2">
            Community
          </Link>
          <Link to="/posts/new" className="btn btn-outline-success me-2">
            Create Post
          </Link>
          <Link to="/profile" className="btn btn-primary me-2">
            My Profile
          </Link>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}