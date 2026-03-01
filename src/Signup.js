import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import validation from './SignupValidation';
import './auth_styles.css';

function Signup() {
  const navigate = useNavigate();
  const [value, setValue] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  const handleInput = (e) => {
    setValue(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });

    // Auto hide after 3 seconds
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validation(value);
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(v => v && v.length > 0);
    if (!hasErrors) {
      axios.post('http://localhost:8081/signup', value)
        .then(res => {
          showPopup(res.data?.message || 'Signup successful ✅', 'success');
          setTimeout(() => navigate('/'), 1000);
        })
        .catch(err => {
          const msg = err.response?.data?.message || 'Signup failed ❌';
          showPopup(msg, 'error');
        });
    } else {
      showPopup('Please fix validation errors ⚠️', 'error');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>

        {/* ✅ Popup box */}
        {popup.show && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: popup.type === 'success' ? '#28a745' : '#dc3545',
            color: '#fff',
            padding: '15px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            fontWeight: 'bold'
          }}>
            {popup.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={value.name}
              onChange={handleInput}
              className="form-control"
              placeholder="Enter your name"
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={value.email}
              onChange={handleInput}
              className="form-control"
              placeholder="Enter your email"
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={value.password}
              onChange={handleInput}
              className="form-control"
              placeholder="Enter password (min 6 chars)"
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <button type="submit" className="btn btn-success w-100 mb-2">
            Register
          </button>

          <Link to="/" className="btn btn-outline-primary w-100">
            Already have an account? Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
