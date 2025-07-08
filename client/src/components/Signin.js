import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signin({ onUserChange }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (
      savedUser &&
      savedUser.username === username.trim() &&
      savedUser.password === password
    ) {
      onUserChange(savedUser);
      navigate('/posts');
    } else {
      alert('Username or password is incorrect.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Sign In
        </button>
      </form>
      <p className="mt-3">
        Don't have an account? <Link to="/signup">Sign Up here</Link>.
      </p>
    </div>
  );
}