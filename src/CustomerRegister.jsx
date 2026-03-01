import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './auth_styles.css';

function CustomerRegister() {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    full_name: '',
    email: '',
    password: '',
    address: '',
    contact_number: '',
    business_name: '',
    showroom_count: 0,
  });

  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  const handleInput = (e) => setValue(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.full_name || !value.email || !value.password) {
      showPopup('Please fill all required fields!', 'error');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8081/customers/register', value);
      showPopup(res.data.message || 'Registration successful ✅', 'success');
      setTimeout(() => navigate('/customerlogin'), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed ❌';
      showPopup(msg, 'error');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>HarvestHub Customer Registration</h2>

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
          <input type="text" name="full_name" value={value.full_name} onChange={handleInput} placeholder="Full Name*" required />
          <input type="email" name="email" value={value.email} onChange={handleInput} placeholder="Email*" required />
          <input type="password" name="password" value={value.password} onChange={handleInput} placeholder="Password*" required />
          <input type="text" name="address" value={value.address} onChange={handleInput} placeholder="Address" />
          <input type="text" name="contact_number" value={value.contact_number} onChange={handleInput} placeholder="Contact Number" />
          <input type="text" name="business_name" value={value.business_name} onChange={handleInput} placeholder="Business Name" />
          <input type="number" name="showroom_count" value={value.showroom_count} onChange={handleInput} min="0" placeholder="Showroom Count" />

          <button type="submit">Register</button>
          <div>Already have an account? <Link to="/customerlogin">Login</Link></div>
        </form>
      </div>
    </div>
  );
}

export default CustomerRegister;
