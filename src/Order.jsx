import React, { useState } from 'react';
import axios from 'axios';

function Order() {
  const [order, setOrder] = useState({
    customer_name: '',
    phone: '',
    address: '',
    product_name: '',
    category: 'Vegetable',
    quantity_kg: '',
    price_per_kg: ''
  });

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8081/place-order', order);
      alert('Order placed successfully');
      setOrder({
        customer_name: '',
        phone: '',
        address: '',
        product_name: '',
        category: 'Vegetable',
        quantity_kg: '',
        price_per_kg: ''
      });
    } catch (err) {
      alert('Order failed');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Place Order</h2>

      <form onSubmit={handleSubmit}>
        <input name="customer_name" placeholder="Customer Name" onChange={handleChange} value={order.customer_name} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} value={order.phone} required />
        <textarea name="address" placeholder="Delivery Address" onChange={handleChange} value={order.address} required />

        <input name="product_name" placeholder="Product Name" onChange={handleChange} value={order.product_name} required />

        <select name="category" onChange={handleChange} value={order.category}>
          <option value="Vegetable">Vegetable</option>
          <option value="Fruit">Fruit</option>
        </select>

        <input type="number" name="quantity_kg" placeholder="Quantity (kg)" onChange={handleChange} value={order.quantity_kg} required />
        <input type="number" name="price_per_kg" placeholder="Price per kg" onChange={handleChange} value={order.price_per_kg} required />

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default Order;
