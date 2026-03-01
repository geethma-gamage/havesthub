import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerDashboard.css';
import DemandPredic from './DemandPredic';
import Predict from './Predict';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [customer, setCustomer] = useState(null);

  // Products
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Order states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // NEW: Order List states
  const [customerOrders, setCustomerOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showOrderPayment, setShowOrderPayment] = useState(false);

  // Payment states
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [paymentSuccess, setPaymentSuccess] = useState('');

  // Support states
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSuccess, setSupportSuccess] = useState('');
  const [supportList, setSupportList] = useState([]);

  // Review states
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewList, setReviewList] = useState([]);

  // Load logged customer
  useEffect(() => {
    const storedCustomer = JSON.parse(localStorage.getItem('customer'));
    setCustomer(storedCustomer);
  }, []);

  // Fetch products
  const fetchProducts = () => {
    axios.get('http://localhost:8081/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  // NEW: Fetch customer orders
  const fetchCustomerOrders = () => {
    if (!customer?.email) return;
    axios.get(`http://localhost:8081/orders/customer/${customer.email}`)
      .then(res => setCustomerOrders(res.data))
      .catch(err => console.error('Error fetching orders:', err));
  };

  // Fetch support messages
  const fetchSupport = () => {
    if (!customer) return;
    axios.get('http://localhost:8081/support')
      .then(res => {
        const filtered = res.data.filter(msg => msg.customer_email === customer.email);
        setSupportList(filtered);
      })
      .catch(err => console.error(err));
  };

  // Fetch Reviews
  const fetchReviews = () => {
    if (!customer) return;
    axios.get('http://localhost:8081/reviews')
      .then(res => {
        const customerReviews = res.data.filter(r => r.customer_name === customer.full_name);
        setReviewList(customerReviews);
      })
      .catch(err => console.error(err));
  };

  // Update selected product when dropdown changes
  useEffect(() => {
    const product = products.find(p => p.id === parseInt(selectedProductId));
    setSelectedProduct(product || null);
    setShowOrderPayment(false);
    setPaymentAmount('');
  }, [selectedProductId, products]);

  // Place order
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity || !customer) {
      alert('All fields are required!');
      return;
    }

    axios.post('http://localhost:8081/orders', {
      product_id: selectedProduct.id,
      quantity,
      customer_name: customer.full_name,
      customer_email: customer.email
    })
      .then(res => {
        setSuccessMessage(res.data.message);
        setShowOrderPayment(true);
        setPaymentAmount(selectedProduct.price_per_kg * quantity);
        setSelectedProductId('');
        setQuantity('');
        setSelectedProduct(null);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchProducts();
      })
      .catch(err => alert(err.response?.data?.message || 'Order failed'));
  };

  // NEW: Handle payment for specific order
  const handleOrderPayment = (e) => {
    e.preventDefault();
    if (!paymentAmount || !paymentMethod || !selectedOrderId) {
      alert("Please fill all payment details.");
      return;
    }

    axios.post('http://localhost:8081/payments', {
      order_id: selectedOrderId,
      customer_name: customer.full_name,
      customer_email: customer.email,
      amount: paymentAmount,
      payment_method: paymentMethod
    })
      .then(res => {
        setPaymentSuccess(res.data.message);
        setShowOrderPayment(false);
        setPaymentAmount('');
        setPaymentMethod('Credit Card');
        setSelectedOrderId(null);
        setTimeout(() => setPaymentSuccess(''), 4000);
        fetchCustomerOrders(); // Refresh orders
      })
      .catch(err => alert(err.response?.data?.message || 'Payment failed'));
  };

  // Handle payment (for new orders)
  const handlePayment = (e) => {
    e.preventDefault();
    if (!paymentAmount || !paymentMethod) {
      alert("Please fill all payment details.");
      return;
    }

    axios.post('http://localhost:8081/payments', {
      customer_name: customer.full_name,
      customer_email: customer.email,
      amount: paymentAmount,
      payment_method: paymentMethod
    })
      .then(res => {
        setPaymentSuccess(res.data.message);
        setShowOrderPayment(false);
        setPaymentAmount('');
        setPaymentMethod('Credit Card');
        setTimeout(() => setPaymentSuccess(''), 4000);
      })
      .catch(err => alert(err.response?.data?.message || 'Payment failed'));
  };

  // Send support message
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage) {
      alert("Please enter your message.");
      return;
    }

    axios.post('http://localhost:8081/support', {
      customer_name: customer.full_name,
      customer_email: customer.email,
      message: supportMessage
    })
      .then(res => {
        setSupportSuccess(res.data.message);
        setSupportMessage('');
        fetchSupport();
        setTimeout(() => setSupportSuccess(''), 4000);
      })
      .catch(err => alert(err.response?.data?.message || 'Failed to send message'));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!selectedProduct || !reviewMessage) {
      alert('Please select product and enter review.');
      return;
    }

    axios.post('http://localhost:8081/reviews', {
      farmer_name: selectedProduct.farmer_name,
      customer_name: customer.full_name,
      rating: reviewRating,
      comment: reviewMessage
    })
    .then(res => {
      setReviewSuccess(res.data.message);
      setReviewMessage('');
      setReviewRating(5);
      fetchReviews();
      setTimeout(() => setReviewSuccess(''), 4000);
    })
    .catch(err => {
      alert(err.response?.data?.message || 'Failed to submit review');
    });
  };

  // Filter products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchName.toLowerCase()) &&
    p.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>HarvestHub</h2>
          <div className="user-info">
            <div className="user-avatar">{customer?.full_name?.charAt(0).toUpperCase()}</div>
            <p className="user-name">{customer?.full_name}</p>
          </div>
        </div>

        <div className="sidebar-nav">  
          <button 
            className={`nav-button ${activeTab === 'home' ? 'active' : ''}`} 
            onClick={() => setActiveTab('home')}
          >
            🏠 Home
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'order' ? 'active' : ''}`} 
            onClick={() => { 
              setActiveTab('order'); 
              fetchProducts(); 
            }}
          >
            🛒 Place Order
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'view' ? 'active' : ''}`} 
            onClick={() => { 
              setActiveTab('view'); 
              fetchProducts(); 
              setShowProducts(true); 
            }}
          >
            👀 View Products
          </button>

          {/* NEW: Orders Tab */}
          <button 
            className={`nav-button ${activeTab === 'orders' ? 'active' : ''}`} 
            onClick={() => { 
              setActiveTab('orders'); 
              fetchCustomerOrders(); 
            }}
          >
            📋 My Orders
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'predict' ? 'active' : ''}`} 
            onClick={() => setActiveTab('predict')}
          >
            📈 Demand Prediction
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'pricePredict' ? 'active' : ''}`} 
            onClick={() => setActiveTab('pricePredict')}
          >
            💰 Price Prediction
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'support' ? 'active' : ''}`} 
            onClick={() => { 
              setActiveTab('support'); 
              fetchSupport(); 
            }}
          >
            🆘 Help & Support
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'review' ? 'active' : ''}`} 
            onClick={() => { 
              setActiveTab('review'); 
              fetchProducts();
              fetchReviews();
            }}
          >
            ⭐ Your Reviews
          </button>
          
          <button 
            className="nav-button logout-button" 
            onClick={() => { 
              localStorage.removeItem('customer'); 
              window.location.href = '/customerlogin'; 
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="main-content">
        {/* HOME */}
        {activeTab === 'home' && (
          <div className="home-section">
            <h1>Customer Dashboard</h1>
            <p>Welcome back, {customer?.full_name} 👋</p>
          </div>
        )}

        {/* ORDER */}
        {activeTab === 'order' && (
          <div className="order-section">
            <h1>Place Order</h1>
            {successMessage && (
              <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '8px' }}>
                ✅ {successMessage}
              </div>
            )}
            <form onSubmit={handlePlaceOrder}>
              <label>Customer Name:</label>
              <input type="text" value={customer?.full_name || ''} disabled />
              <label>Customer Email:</label>
              <input type="email" value={customer?.email || ''} disabled />
              <label>Product:</label>
              <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} required>
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - Rs.{p.price_per_kg}/kg - {p.quantity}kg available
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <div style={{ margin: '10px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  <strong>🌾 Farmer Details:</strong>
                  <p><strong>Name:</strong> {selectedProduct.farmer_name}</p>
                  <p><strong>Farm:</strong> {selectedProduct.farm_name}</p>
                  <p><strong>📞 Contact:</strong> {selectedProduct.farmer_contact}</p>
                  <p><strong>📍 Location:</strong> {selectedProduct.location}</p>
                  <p><strong>💰 Price:</strong> Rs.{selectedProduct.price_per_kg}/kg</p>
                  <p><strong>📦 Stock:</strong> {selectedProduct.quantity}kg available</p>
                </div>
              )}
              <label>Quantity (kg):</label>
              <input 
                type="number" 
                value={quantity} 
                onChange={e => setQuantity(e.target.value)} 
                min="1" 
                max={selectedProduct?.quantity || 1000} 
                required 
              />
              <button type="submit">🌾 Place Order</button>
            </form>

            {/* PAYMENT */}
            {showOrderPayment && !selectedOrderId && (
              <div className="payment-section" style={{ marginTop: '30px' }}>
                <h2>💳 Payment</h2>
                {paymentSuccess && (
                  <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '8px' }}>
                    ✅ {paymentSuccess}
                  </div>
                )}
                <form onSubmit={handlePayment}>
                  <label>Amount (Rs.):</label>
                  <input type="number" value={paymentAmount} disabled />
                  <label>Payment Method:</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} required>
                    <option value="Credit Card">💳 Credit Card</option>
                    <option value="Debit Card">💳 Debit Card</option>
                    <option value="PayPal">💰 PayPal</option>
                    <option value="Bank Transfer">🏦 Bank Transfer</option>
                  </select>
                  <button type="submit">💳 Pay Now</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* NEW: MY ORDERS SECTION */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h1>📋 My Orders</h1>
            
            {/* Order List Table */}
            <div className="order-list">
              {customerOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>📭 No orders yet.</p>
                  <p>Place your first order from the "Place Order" tab!</p>
                </div>
              ) : (
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th>Farmer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.product_name || order.product_name}</td>
                        <td>{order.quantity}kg</td>
                        <td>Rs. {order.total_price}</td>
                        <td>{order.farmer_name}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                          <span style={{ 
                            color: order.payment_status === 'Paid' ? '#22c55e' : '#ef4444',
                            fontWeight: 'bold'
                          }}>
                            {order.payment_status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          {order.payment_status !== 'Paid' && (
                            <button
                              onClick={() => {
                                setSelectedOrderId(order.id);
                                setPaymentAmount(order.total_price);
                                setShowOrderPayment(true);
                              }}
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              💳 Pay Now
                            </button>
                          )}
                          {order.payment_status === 'Paid' && (
                            <span style={{ color: '#22c55e', fontSize: '14px' }}>✅ Paid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Order Payment Modal */}
            {showOrderPayment && selectedOrderId && (
              <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                zIndex: 1000,
                maxWidth: '500px',
                width: '90%'
              }}>
                <h2 style={{ marginTop: 0 }}>💳 Pay for Order #{selectedOrderId}</h2>
                {paymentSuccess && (
                  <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '8px' }}>
                    ✅ {paymentSuccess}
                  </div>
                )}
                <form onSubmit={handleOrderPayment}>
                  <label>Order Amount (Rs.):</label>
                  <input type="number" value={paymentAmount} disabled style={{ marginBottom: '15px' }} />
                  <label>Payment Method:</label>
                  <select 
                    value={paymentMethod} 
                    onChange={e => setPaymentMethod(e.target.value)} 
                    required
                    style={{ marginBottom: '15px', width: '100%', padding: '10px' }}
                  >
                    <option value="Credit Card">💳 Credit Card</option>
                    <option value="Debit Card">💳 Debit Card</option>
                    <option value="PayPal">💰 PayPal</option>
                    <option value="Bank Transfer">🏦 Bank Transfer</option>
                  </select>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="submit"
                      style={{
                        flex: 1,
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      💳 Complete Payment
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowOrderPayment(false);
                        setSelectedOrderId(null);
                        setPaymentAmount('');
                      }}
                      style={{
                        flex: 1,
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* VIEW PRODUCTS */}
        {activeTab === 'view' && showProducts && (
          <div className="view-section">
            <h1>🌾 All Fresh Products</h1>
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="🔍 Search by Product Name" 
                value={searchName} 
                onChange={e => setSearchName(e.target.value)} 
                style={{ marginRight: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} 
              />
              <input 
                type="text" 
                placeholder="📍 Search by Location" 
                value={searchLocation} 
                onChange={e => setSearchLocation(e.target.value)} 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} 
              />
            </div>
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Qty (kg)</th>
                  <th>Price/kg</th>
                  <th>Location</th>
                  <th>Farmer</th>
                  <th>Farm</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No products found.</td></tr>
                ) : (
                  filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.quantity}</td>
                      <td>Rs.{p.price_per_kg}</td>
                      <td>{p.location}</td>
                      <td>{p.farmer_name}</td>
                      <td>{p.farm_name}</td>
                      <td>{p.farmer_contact}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* DEMAND PREDICTION */}
        {activeTab === 'predict' && (
          <div className="predict-section">
            <DemandPredic />
          </div>
        )}

        {/* PRICE PREDICTION */}
        {activeTab === 'pricePredict' && (
          <div className="price-predict-section">
            <Predict />
          </div>
        )}

        {/* SUPPORT */}
        {activeTab === 'support' && (
          <div className="support-section">
            <h1>🆘 Help & Support</h1>
            {supportSuccess && (
              <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '8px' }}>
                ✅ {supportSuccess}
              </div>
            )}
            <form onSubmit={handleSupportSubmit}>
              <label>Your Message:</label>
              <textarea 
                rows="4" 
                value={supportMessage} 
                onChange={e => setSupportMessage(e.target.value)} 
                placeholder="Tell us how we can help you..." 
                required 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
              <button type="submit">📤 Send Message</button>
            </form>
            <h2>Your Messages</h2>
            {supportList.length === 0 && <p>No messages yet. Send one above!</p>}
            <ul>
              {supportList.map(msg => (
                <li key={msg.id} style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                  <strong>📝 Message:</strong> {msg.message} <br />
                  <strong>Status:</strong> 
                  <span style={{ color: msg.status === 'Replied' ? 'green' : 'orange' }}>
                    {msg.status}
                  </span> <br />
                  {msg.status === 'Replied' && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#e8f5e8', borderRadius: '5px' }}>
                      <strong>✅ Admin Reply:</strong> {msg.reply}
                    </div>
                  )}
                  <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                    {new Date(msg.created_at).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === 'review' && (
          <div className="review-section">
            <h1>⭐ Your Reviews</h1>
            {reviewSuccess && (
              <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '8px' }}>
                ✅ {reviewSuccess}
              </div>
            )}
            <form onSubmit={handleReviewSubmit}>
              <label>🌾 Select Product to Review:</label>
              <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} required>
                <option value="">Choose a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - Farmer: {p.farmer_name}
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <div style={{ marginTop: '10px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                  <p><strong>👨‍🌾 Farmer:</strong> {selectedProduct.farmer_name}</p>
                  <p><strong>🏡 Farm:</strong> {selectedProduct.farm_name}</p>
                </div>
              )}
              <label>⭐ Rating (1-5):</label>
              <select value={reviewRating} onChange={e => setReviewRating(e.target.value)}>
                {[5,4,3,2,1].map(n => (
                  <option key={n} value={n}>{n} Stars</option>
                ))}
              </select>
              <label>💬 Your Review:</label>
              <textarea
                rows="3"
                value={reviewMessage}
                onChange={e => setReviewMessage(e.target.value)}
                placeholder="Share your experience with this farmer..."
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
              <button type="submit">⭐ Submit Review</button>
            </form>

            <h2>📋 Your Review History</h2>
            {reviewList.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                No reviews yet. Be the first to review your farmers! 🌟
              </p>
            ) : (
              <ul>
                {reviewList.map(r => (
                  <li key={r.id} style={{ 
                    marginBottom: '15px', 
                    border: '1px solid #ddd', 
                    padding: '20px', 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f9f9f9 0%, #f0f8f0 100%)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong style={{ color: '#22c55e' }}>✅ You reviewed</strong>
                      <span style={{ 
                        color: '#22c55e', 
                        fontWeight: 'bold', 
                        fontSize: '1.2rem' 
                      }}>
                        {r.rating}/5 ⭐
                      </span>
                    </div>
                    <div style={{ color: '#666', marginBottom: '8px' }}>
                      <strong>👨‍🌾 Farmer:</strong> {r.farmer_name}
                    </div>
                    <p style={{ margin: '10px 0', fontStyle: 'italic', lineHeight: '1.5' }}>
                      "{r.comment}"
                    </p>
                    <small style={{ color: '#999', background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
