import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081/payments') // ✅ CORRECT PORT
      .then(res => {
        console.log("Payments:", res.data);
        setPayments(res.data);
      })
      .catch(err => {
        console.error("Payment Fetch Error:", err);
        setError('Failed to load payments');
      });
  }, []);

  return (
    <>
      <h2>Customer Payments</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {payments.length === 0 ? (
        <p>No payments found</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Amount (Rs)</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.order_id}</td>
                <td>{p.customer_name}</td>
                <td>{p.customer_email}</td>
                <td>{p.amount}</td>
                <td>{p.payment_method}</td>
                <td>{p.transaction_id}</td>
                <td
                  style={{
                    color:
                      p.status === 'success'
                        ? 'green'
                        : p.status === 'failed'
                        ? 'red'
                        : 'orange'
                  }}
                >
                  {p.status}
                </td>
                <td>{new Date(p.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default PaymentList;