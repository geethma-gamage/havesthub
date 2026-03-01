import React, { useState } from "react";
import axios from "axios";

const Payment = ({ amount, customer, orderId, onPaymentSuccess, onPaymentCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!customer || !amount) {
      setError("Payment details missing");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("http://localhost:8081/payments", {
        customer_name: customer.full_name,
        customer_email: customer.email,
        amount: amount,
        payment_method: paymentMethod,
        order_id: orderId || null   // VERY IMPORTANT
      });

      if (response.data.transaction_id) {
        onPaymentSuccess(response.data.transaction_id);
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handlePayment} style={styles.form}>
        <h3 style={styles.title}>💳 Secure Payment</h3>

        <div style={styles.row}>
          <label>Customer Name</label>
          <input
            type="text"
            value={customer?.full_name || ""}
            disabled
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <label>Email</label>
          <input
            type="email"
            value={customer?.email || ""}
            disabled
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <label>Amount (LKR)</label>
          <input
            type="text"
            value={`Rs. ${Number(amount).toLocaleString("en-IN")}`}
            disabled
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <label>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={styles.input}
            required
          >
            <option value="Card">Credit / Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.buttonRow}>
          <button
            type="button"
            onClick={onPaymentCancel}
            style={styles.cancelBtn}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            style={styles.payBtn}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;

/* ================= STYLES ================= */

const styles = {
  container: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#059669"
  },
  row: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px"
  },
  payBtn: {
    padding: "10px 20px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px"
  }
};
