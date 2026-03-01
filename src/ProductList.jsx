import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ProductList() {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  // ===== Fetch products =====
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8081/products');
      setProducts(res.data);
    } catch {
      setError('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

 const downloadProductPDF = () => {
  const doc = new jsPDF();

  doc.text("Product Items Report", 14, 15);

  const tableColumn = [
    "ID",
    "Name",
    "Quantity",
    "Price/Kg",
    "Location",
    "Created At"
  ];

  const tableRows = [];

  products.forEach(product => {
    tableRows.push([
      product.id,
      product.name,
      product.quantity,
      product.price_per_kg,
      product.location,
      product.created_at
    ]);
  });

  autoTable(doc, {     // ✅ IMPORTANT CHANGE
    head: [tableColumn],
    body: tableRows,
    startY: 20
  });

  doc.save("Product_Report.pdf");
};

  return (
    <>
      <h2>Product Items</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* ✅ Download Button */}
      <button className="download-btn" onClick={downloadProductPDF}>
        Download Products PDF
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price / Kg</th>
            <th>Location</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>{p.price_per_kg}</td>
              <td>{p.location}</td>
              <td>{p.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ProductList;