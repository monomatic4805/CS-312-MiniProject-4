import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup({ onUserChange }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password || !name.trim()) {
      alert('Please fill in username, password, and name');
      return;
    }

    const newUser = {
      id: Date.now(),
      username: username.trim(),
      password, // store password as is (no trimming here)
      name: name.trim(),
      age: age.trim(),
      occupation: occupation.trim(),
      city: city.trim(),
    };

    // Save to localStorage
    localStorage.setItem('registeredUser', JSON.stringify(newUser));

    alert('Signup successful! Please sign in.');

    // Redirect to signin page
    navigate('/signin');
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <h2>Sign Up</h2>
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
        <div className="mb-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Age:</label>
          <input
            type="text"
            className="form-control"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Occupation:</label>
          <input
            type="text"
            className="form-control"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Current City:</label>
          <input
            type="text"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}