import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

function Reports() {

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [support, setSupport] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersRes = await axios.get('http://localhost:5000/api/orders');
      const productsRes = await axios.get('http://localhost:5000/api/products');
      const paymentsRes = await axios.get('http://localhost:5000/api/payments');
      const supportRes = await axios.get('http://localhost:5000/api/support');

      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setPayments(paymentsRes.data);
      setSupport(supportRes.data);

    } catch (error) {
      console.error("Error fetching report data", error);
    }
  };

  const downloadCSV = (data, filename) => {

    if (!data.length) {
      alert("No data available");
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj =>
      Object.values(obj).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    saveAs(blob, filename);
  };

  return (
    <div>
      <h2>Admin Reports & Analytics</h2>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => downloadCSV(orders, "orders_report.csv")}>
          Download Orders Report
        </button>

        <button onClick={() => downloadCSV(products, "products_report.csv")}>
          Download Products Report
        </button>

        <button onClick={() => downloadCSV(payments, "payments_report.csv")}>
          Download Payments Report
        </button>

        <button onClick={() => downloadCSV(support, "support_report.csv")}>
          Download Support Messages Report
        </button>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h3>Analytics Overview</h3>

      <p>Total Orders: {orders.length}</p>
      <p>Total Products: {products.length}</p>
      <p>Total Payments: {payments.length}</p>
      <p>Total Support Messages: {support.length}</p>

    </div>
  );
}

export default Reports;
