import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderForm() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [customer, setCustomer] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load customer from localStorage (assumes customer is logged in)
  useEffect(() => {
    const storedCustomer = JSON.parse(localStorage.getItem('customer'));
    setCustomer(storedCustomer);
  }, []);

  // Fetch products
  useEffect(() => {
    axios.get('http://localhost:8081/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // When product ID changes, find the full product object
  useEffect(() => {
    const prod = products.find(p => p.id === parseInt(selectedProductId));
    setSelectedProduct(prod || null);
  }, [selectedProductId, products]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantity || !customer) {
      alert('All fields required!');
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
      // Reset form
      setSelectedProductId('');
      setQuantity('');
      setTimeout(() => setSuccessMessage(''), 3000);
    })
    .catch(err => {
      alert(err.response?.data?.message || 'Order failed');
    });
  };

  return (
    <div>
      <h2>Place Order</h2>

      {successMessage && (
        <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px' }}>
          ✅ {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Customer Info (auto-filled from login) */}
        <label>Customer Name:</label>
        <input type="text" value={customer?.full_name || ''} disabled />

        <label>Customer Email:</label>
        <input type="email" value={customer?.email || ''} disabled />

        {/* Product selection */}
        <label>Product:</label>
        <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} required>
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} - Rs.{p.price_per_kg}/kg - {p.quantity}kg available
            </option>
          ))}
        </select>

        {/* Display Farmer Details */}
        {selectedProduct && (
          <div style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
            <strong>Farmer Details:</strong>
            <p>Name: {selectedProduct.farmer_name}</p>
            <p>Farm Name: {selectedProduct.farm_name}</p>
            <p>Contact: {selectedProduct.farmer_contact}</p>
            <p>Location: {selectedProduct.location}</p>
            <p>Price per kg: Rs.{selectedProduct.price_per_kg}</p>
            <p>Available Quantity: {selectedProduct.quantity}kg</p>
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

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default OrderForm;
