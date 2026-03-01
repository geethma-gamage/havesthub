import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import './orderlist.css';

function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  // ✅ Download PDF for Admin
  const downloadOrderPDF = () => {
    const doc = new jsPDF();
    doc.text("Orders Report", 14, 15);

    const tableColumn = ["ID","Product","Qty","Price","Total","Customer","Farmer","Loc"];
    const tableRows = [];

    orders.forEach(order => {
      const row = [
        order.id,
        order.product_name,
        order.quantity,
        order.price_per_kg,
        order.total_price,
        order.customer_name,
        order.farmer_name,
        order.location || "-"
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 }
    });

    doc.save("Orders_Report.pdf");
  };

  return (
    <div className="order-list">
      <h2>Orders (Admin View)</h2>

      <button className="download-btn" onClick={downloadOrderPDF}>
        Download PDF
      </button>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Tot</th>
              <th>Custo</th>
              <th>Far</th>
              <th>Loc</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="order-row">
                  <td data-label="ID">{order.id}</td>
                  <td data-label="Product">{order.product_name}</td>
                  <td data-label="Qty">{order.quantity}</td>
                  <td data-label="Price">{order.price_per_kg}</td>
                  <td data-label="Tot">{order.total_price}</td>
                  <td data-label="Custo">{order.customer_name}</td>
                  <td data-label="Far">{order.farmer_name}</td>
                  <td data-label="Loc">{order.location || '-'}</td>
                  <td data-label="Order Date">{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;