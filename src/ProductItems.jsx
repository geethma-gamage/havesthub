import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './product_login_styles.css';

function ProductItems() {
  const farmer = JSON.parse(localStorage.getItem('farmer'));
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchName, setSearchName] = useState(''); // Search by name
  const [searchQty, setSearchQty] = useState('');   // Search by quantity
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    price_per_kg: '',
    location: '',
    farmer_name: farmer?.full_name || '',
    farmer_contact: farmer?.contact_number || '',
    farm_name: farmer?.farm_name || ''
  });

  // Fetch all products
  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:8081/products');
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:8081/add-product', form);
    setForm({
      name: '',
      quantity: '',
      price_per_kg: '',
      location: '',
      farmer_name: farmer.full_name,
      farmer_contact: farmer.contact_number,
      farm_name: farmer.farm_name
    });
    fetchProducts();
  };

  const handleEdit = p => {
    setEditingId(p.id);
    setForm({ ...p });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    await axios.put(`http://localhost:8081/products/update/${editingId}`, form);
    setEditingId(null);
    setForm({
      name: '',
      quantity: '',
      price_per_kg: '',
      location: '',
      farmer_name: farmer.full_name,
      farmer_contact: farmer.contact_number,
      farm_name: farmer.farm_name
    });
    fetchProducts();
  };

  const handleToggle = async (id, current) => {
    await axios.put(`http://localhost:8081/products/toggle/${id}`, { is_active: current ? 0 : 1 });
    fetchProducts();
  };

  // Filter products based on search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchName.toLowerCase()) &&
    (searchQty === '' || p.quantity.toString().includes(searchQty))
  );

  return (
    <div className="product-form">
      <h2>Manage Products</h2>

      <form onSubmit={editingId ? handleUpdate : handleSubmit}>
        <input value={form.farmer_name} readOnly />
        <input value={form.farmer_contact} readOnly />
        <input value={form.farm_name} readOnly />

        <input name="name" placeholder="🍎 Product Name" value={form.name} onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="⚖️ Quantity (kg)" value={form.quantity} onChange={handleChange} required />
        <input type="number" step="0.01" name="price_per_kg" placeholder="💰 Price per kg" value={form.price_per_kg} onChange={handleChange} required />
        <input name="location" placeholder="📍 Location" value={form.location} onChange={handleChange} required />

        <button type="submit">{editingId ? '💾 Save Update' : '➕ Add Product'}</button>
        {editingId && <button type="button" onClick={() => setEditingId(null)}>❌ Cancel</button>}
      </form>

      {/* Search Inputs */}
      <div className="search-bar" style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="number"
          placeholder="Search by quantity..."
          value={searchQty}
          onChange={e => setSearchQty(e.target.value)}
          style={{ padding: '5px' }}
        />
      </div>

      <h3>Product List</h3>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th><th>Qty</th><th>Price</th><th>Location</th><th>Farmer</th><th>Farm</th><th>Contact</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => (
            <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.5 }}>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>{p.price_per_kg}</td>
              <td>{p.location}</td>
              <td>{p.farmer_name}</td>
              <td>{p.farm_name}</td>
              <td>{p.farmer_contact}</td>
              <td>
                <button onClick={() => handleEdit(p)}>✏️ Update</button>
                <button onClick={() => handleToggle(p.id, p.is_active)}>
                  {p.is_active ? '❌ Disable' : '✅ Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductItems;