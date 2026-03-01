import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './auth_styles.css';

/* ================= TOAST COMPONENT ================= */
function Toast({ message, type, onClose }) {
  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        {type === "success" ? "✅" : "❌"}
        <span>{message}</span>
      </div>
      <button onClick={onClose}>✕</button>
    </div>
  );
}

/* ================= LOGIN COMPONENT ================= */
function Login() {
  const navigate = useNavigate();
  const [value, setValue] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8081/login', value);

      showToast(res.data.message || "Login Successful!", "success");

      setTimeout(() => {
        navigate('/admin');
      }, 2000);

    } catch (err) {
      showToast(
        err.response?.data?.message || "Invalid email or password!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="auth-wrapper">
        <div className="auth-card">
          <h2 className="auth-title">Admin Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Email"
              value={value.email}
              onChange={(e) =>
                setValue({ ...value, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={value.password}
              onChange={(e) =>
                setValue({ ...value, password: e.target.value })
              }
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;