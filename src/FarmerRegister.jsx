import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FarmerRegister.css';

function FarmerRegister() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    farm_name: '',
    location: '',
    contact_number: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8081/farmers/register', form);
      alert('Farmer registered successfully');
      navigate('/farmer-login'); // ✅ LOGIN PAGE
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="farmer-register">
      <h2>Farmer Register</h2>

      <form onSubmit={handleSubmit}>
        <input name="full_name" placeholder="Full Name" required onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
        <input name="farm_name" placeholder="Farm Name" onChange={handleChange} />
        <input name="location" placeholder="Location" onChange={handleChange} />
        <input name="contact_number" placeholder="Contact Number" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default FarmerRegister;
