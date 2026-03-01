import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './auth_styles.css';

function CustomerLogin() {
  const navigate = useNavigate();
  const [value, setValue] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      try {
        JSON.parse(storedCustomer); // ensure valid JSON
        navigate('/customer-dashboard');
      } catch {
        localStorage.removeItem('customer'); // remove invalid data
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8081/customers/login', value);

      // Use correct key: customer, not user
      if (!res.data.customer) throw new Error('Invalid login response');

      localStorage.setItem('customer', JSON.stringify(res.data.customer));
      alert(res.data.message);
      navigate('/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>HarvestHub Customer Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={value.email}
            onChange={(e) => setValue({ ...value, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={value.password}
            onChange={(e) => setValue({ ...value, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div>
          Don’t have an account? <Link to="/customer-register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
