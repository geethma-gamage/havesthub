import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Fruits & Vegetables Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h2>🌱 Smart HarvestHub</h2>
        </div>
        <div className="nav-menu">
          <a href="#about" className="nav-link">About</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
      </nav>

      {/* Hero Section - Fresh Market */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Smart HarvestHub</h1>
          <p className="hero-subtitle">
            Fresh fruits & vegetables delivered straight from farm to your table
          </p>
          <div className="hero-buttons">
            <button 
              className="cta-btn primary"
              onClick={() => navigate('/farmer-login')}
            >
              👨‍🌾 Farmer Login
            </button>
            <button 
              className="cta-btn secondary"
              onClick={() => navigate('/customerlogin')}
            >
              🛒 Customer Login
            </button>
            <button 
              className="cta-btn secondary"
              onClick={() => navigate('/login')}
            >
              👨‍💼 Admin Login
            </button>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2 className="section-title">🍎 Fresh From Farm</h2>
          <p className="section-description">
            Smart HarvestHub connects local farmers directly with customers, delivering the freshest fruits and vegetables. 
            From juicy mangoes to crisp vegetables, enjoy farm-fresh quality at unbeatable prices with fast delivery.
          </p>
        </div>
      </section>

      {/* Features Section - Fruits & Veggies */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">🥬 Why Choose HarvestHub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🍓</div>
              <h3>100% Fresh</h3>
              <p>Picked today, delivered tomorrow</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Within 24 hours across Sri Lanka</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Direct from farmer, no middlemen</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="container">
          <h2 className="section-title">❓ Frequently Asked</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>🍅 What products do you offer?</h4>
              <p>Fresh fruits, vegetables, herbs, and organic produce from local farms.</p>
            </div>
            <div className="faq-item">
              <h4>🧑‍🌾 How do farmers benefit?</h4>
              <p>Get fair prices, wider reach, and instant payments without middlemen.</p>
            </div>
            <div className="faq-item">
              <h4>💳 Payment options?</h4>
              <p>Secure online payments, cash on delivery, and bank transfers.</p>
            </div>
            <div className="faq-item">
              <h4>🚚 Delivery time?</h4>
              <p>24-48 hours across Sri Lanka with temperature-controlled transport.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2 className="section-title">📞 Get In Touch</h2>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <p>HarvestHubcontact@gmail.com</p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <p>+94 123 456 789</p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <p>123 Main Street, Colombo, Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <p>&copy; 2026 Smart HarvestHub. Freshness Guaranteed 🌱</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
