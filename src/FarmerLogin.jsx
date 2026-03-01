import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FarmerLogin.css';

function FarmerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8081/farmers/login', {
        email,
        password
      });

      localStorage.setItem('farmer', JSON.stringify(res.data.farmer));
      navigate('/farmer-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="farmer-login">
      <h2>Farmer Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      {/* 👇 REGISTER LINK */}
      <p style={{ marginTop: '15px' }}>
        Don’t have an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => navigate('/farmer-register')}
        >
          Register here
        </span>
      </p>
    </div>
  );
}

export default FarmerLogin;
