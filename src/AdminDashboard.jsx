import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import PaymentList from './PaymentList';
import OrderList from './OrderList';
import Predict from './Predict';
import DemandPredic from './DemandPredic';
import SupportList from './SupportList';
import ReviewList from './ReviewList';
import { useNavigate } from 'react-router-dom';
import './admin.css';

function AdminDashboard() {

  const [view, setView] = useState('products');
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    axios.get('http://localhost:5000/notifications')
      .then(res => setNotifications(res.data))
      .catch(err => console.log(err));
  };

  const navButtons = [
    { key: 'products',  label: 'Product Items',     icon: '🌱' },
    { key: 'payments',  label: 'Payments',           icon: '💳' },
    { key: 'orders',    label: 'View Orders',        icon: '🛒' },
    { key: 'predict',   label: 'Predict Price',      icon: '📈' },
    { key: 'demand',    label: 'Demand Prediction',  icon: '📊' },
    { key: 'support',   label: 'Support Messages',   icon: '💬' },
    { key: 'reviews',   label: 'Farmer Reviews',     icon: '⭐' },
  ];

  return (
    <div className="admin-container">

      <div className="sidebar">
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand-icon">🌿</div>
          <h3>Admin Dashboard</h3>
        </div>

        {/* 🔔 Notification Section */}
        <div className="notification-box">
          <h4>🔔 Notifications</h4>
          {notifications.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>No new notifications</p>
          ) : (
            notifications.slice(0, 3).map((note) => (
              <div key={note.id} className="notification-item">
                {note.message}
              </div>
            ))
          )}
        </div>

        {/* Nav Buttons */}
        <nav className="sidebar-nav">
          {navButtons.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`nav-btn ${view === key ? 'active' : ''}`}
              onClick={() => setView(key)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* ✅ FIXED LOGOUT BUTTON — pinned at bottom */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => navigate('/')}>
            <div className="logout-icon-wrap">🚪</div>
            <div className="logout-label">
              <span>Logout</span>
              <small>End your session</small>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        {view === 'products' && <ProductList />}
        {view === 'payments' && <PaymentList />}
        {view === 'orders'   && <OrderList />}
        {view === 'predict'  && <Predict />}
        {view === 'demand'   && <DemandPredic />}
        {view === 'support'  && <SupportList />}
        {view === 'reviews' && <ReviewList />}
      </div>

    </div>
  );
}

export default AdminDashboard;