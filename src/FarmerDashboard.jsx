import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductItems from './ProductItems';
import OrderList from './OrderList';
import Predict from './Predict';
import DemandPredic from './DemandPredic';
import './FarmerDashboard.css';

function FarmerDashboard() {
  const navigate = useNavigate();
  const farmerData = JSON.parse(localStorage.getItem('farmer'));

  const [farmer] = useState(farmerData);
  const [activePage, setActivePage] = useState('dashboard');
  
  // Reviews state with full farmer details
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (!farmerData) navigate('/farmer-login');
  }, [farmerData, navigate]);

  // ✅ UPDATED: Fetch farmer's reviews WITH FULL FARM DETAILS
  const fetchReviews = async () => {
    if (!farmer?.full_name) return;
    
    setLoadingReviews(true);
    try {
      const response = await axios.get(`http://localhost:8081/reviews/farmer/${encodeURIComponent(farmer.full_name)}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (!farmer) return null;

  const logout = () => {
    localStorage.removeItem('farmer');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>🌾 Farmer Panel</h2>

        <button 
          className={activePage === 'dashboard' ? 'active' : ''} 
          onClick={() => setActivePage('dashboard')}
        >
          🏠 Dashboard
        </button>
        <button 
          className={activePage === 'products' ? 'active' : ''} 
          onClick={() => setActivePage('products')}
        >
          ➕ Add Products
        </button>
        <button 
          className={activePage === 'orders' ? 'active' : ''} 
          onClick={() => setActivePage('orders')}
        >
          📦 Orders
        </button>
        <button 
          className={activePage === 'reviews' ? 'active' : ''} 
          onClick={() => {
            setActivePage('reviews');
            fetchReviews();
          }}
        >
          ⭐ View Reviews
        </button>
        <button 
          className={activePage === 'predict' ? 'active' : ''} 
          onClick={() => setActivePage('predict')}
        >
          📈 Predict
        </button>
        <button 
          className={activePage === 'demand-predict' ? 'active' : ''} 
          onClick={() => setActivePage('demand-predict')}
        >
          📊 Demand Predict
        </button>
        <button 
          className={activePage === 'help' ? 'active' : ''} 
          onClick={() => setActivePage('help')}
        >
          🆘 Help & Support
        </button>

        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">

        {activePage === 'dashboard' && (
          <>
            <h1>🌾 Farmer Dashboard</h1>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>{farmer.full_name}</h3>
                <p>Farm Owner</p>
              </div>
              <div className="stat-card">
                <h3>{farmer.farm_name}</h3>
                <p>Farm Name</p>
              </div>
              <div className="stat-card">
                <h3>{farmer.contact_number}</h3>
                <p>Contact</p>
              </div>
              <div className="stat-card">
                <h3>{farmer.location}</h3>
                <p>Location</p>
              </div>
            </div>
          </>
        )}

        {activePage === 'products' && <ProductItems />}
        {activePage === 'orders' && <OrderList />}
        
        {/* ✅ ENHANCED REVIEWS SECTION WITH FARM DETAILS */}
        {activePage === 'reviews' && (
          <div className="reviews-section">
            <h1>⭐ My Farm Reviews</h1>
            
            {loadingReviews ? (
              <div className="loading">🔄 Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="no-reviews">
                <h3>📭 No reviews yet!</h3>
                <p>Your customers haven't left any reviews yet. 
                   Keep delivering great products! 🌟</p>
              </div>
            ) : (
              <>
                <div className="reviews-stats">
                  <h3>📊 Farm Review Summary</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <strong>Total Reviews:</strong> {reviews.length}
                    </div>
                    <div className="stat-item">
                      <strong>Average Rating:</strong> 
                      {reviews.length > 0 
                        ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                        : 0
                      }/5 ⭐
                    </div>
                    <div className="stat-item">
                      <strong>Farm:</strong> {reviews[0]?.farm_name || farmer.farm_name}
                    </div>
                    <div className="stat-item">
                      <strong>Location:</strong> {reviews[0]?.farm_location || farmer.location}
                    </div>
                  </div>
                </div>

                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="customer-name">{review.customer_name}</div>
                        <div className="rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'star filled' : 'star'}>
                              ⭐
                            </span>
                          ))}
                          <span className="rating-number">({review.rating}/5)</span>
                        </div>
                      </div>
                      
                      <div className="review-comment">
                        "{review.comment}"
                      </div>
                      
                      <div className="review-meta">
                        <span className="review-date">
                          {new Date(review.created_at).toLocaleDateString('en-GB')}
                        </span>
                        {review.farm_name && (
                          <span className="farm-info">
                            🏡 {review.farm_name} - {review.farm_location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activePage === 'predict' && <Predict />}

        {activePage === 'demand-predict' && <DemandPredic />}

        {activePage === 'help' && (
          <div className="help-section">
            <h1>🆘 Help & Support</h1>

            <h3>📌 How to Add Products?</h3>
            <p>
              Go to "Add Products" section. Fill product name, price, quantity,
              and location. Click save to add your product.
            </p>

            <h3>📦 How to Manage Orders?</h3>
            <p>
              In the "Orders" section, you can view customer orders,
              update order status, and track deliveries.
            </p>

            <h3>⭐ How to View Reviews?</h3>
            <p>
              Click "View Reviews" to see all customer feedback and ratings for your farm.
              Use this to improve your service!
            </p>

            <h3>📈 How Prediction Works?</h3>
            <p>
              The prediction tool helps estimate crop yield or demand based
              on historical data and market trends.
            </p>

            <h3>📊 How Demand Predict Works?</h3>
            <p>
              Enter product details, market conditions (price, weather, day), 
              and get predicted sales quantity. Plan your inventory better!
            </p>

            <h3>📞 Contact Support</h3>
            <p><strong>Email:</strong> support@agromarket.com</p>
            <p><strong>Phone:</strong> +94 77 123 4567</p>
            <p><strong>Working Hours:</strong> Mon - Fri (8:00 AM - 5:00 PM)</p>

            <h3>❓ FAQ</h3>
            <div className="faq-item">
              <p><b>Q:</b> I forgot my password?</p>
              <p><b>A:</b> Contact admin to reset your password.</p>
            </div>
            <div className="faq-item">
              <p><b>Q:</b> How to update farm details?</p>
              <p><b>A:</b> Currently only admin can update farm information.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default FarmerDashboard;
