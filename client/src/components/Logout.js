import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any auth tokens or user data here
    localStorage.removeItem('authToken'); // example
    navigate('/signin');
  }, [navigate]);

  return <p>Logging out...</p>;
}
