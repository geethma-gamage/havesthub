import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CustomerSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    address: '',
    contact_number: '',
    business_name: '',
    showroom_count: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8081/customer-signup', form);
      alert('Registration successful. Please login.');
      navigate('/customer-login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Customer Registration</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          type="text"
          name="contact_number"
          placeholder="Contact Number"
          value={form.contact_number}
          onChange={handleChange}
        />

        <input
          type="text"
          name="business_name"
          placeholder="Business Name"
          value={form.business_name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="showroom_count"
          placeholder="Number of Showrooms"
          value={form.showroom_count}
          onChange={handleChange}
          min="0"
        />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => navigate('/customer-login')}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default CustomerSignup;
