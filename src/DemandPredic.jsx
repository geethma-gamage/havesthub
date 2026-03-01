import React, { useState } from "react";
import axios from "axios";

const DemandPredic = () => {
  const [form, setForm] = useState({
    Product: "", // Changed to empty for free typing
    Category: "Fruit",
    Price_per_kg: 250,
    Stock_available_kg: 100,
    Day_of_week: "Monday",
    Weather: "Sunny",
    Promotion: 0,
    Holiday: 0
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ New error state

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form, 
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    });
    setError(""); // ✅ Clear error on input change
  };

  const handlePredict = async () => {
    // ✅ Validate Product field
    if (!form.Product.trim()) {
      setError("Please enter a product name");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post("http://localhost:5000/predict_demand", form);
      setPrediction(res.data.predicted_quantity_kg);
    } catch (err) {
      console.error("Prediction error:", err);
      
      // ✅ Better error handling
      if (err.response?.status === 400) {
        setError(err.response.data.error || "Invalid input data");
      } else if (!err.response) {
        setError("Backend not running. Start Flask server on port 5000");
      } else {
        setError("Prediction failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "600px", 
      margin: "0 auto",
      fontFamily: "Arial, sans-serif"
    }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "10px" }}>📊 Demand Prediction</h2>
      <p style={{ color: "#7f8c8d", marginBottom: "30px" }}>
        Predict how much fruit/veg will be sold based on market conditions
      </p>
      
      <div style={{ 
        display: "grid", 
        gap: "15px", 
        marginBottom: "25px",
        background: "#f8f9fa",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        {/* ✅ PRODUCT TEXT INPUT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontWeight: "bold", color: "#2c3e50" }}>Product: </label>
          <input 
            type="text" 
            name="Product" 
            value={form.Product} 
            onChange={handleChange}
            placeholder="Type any fruit/veg (Apple, Orange, Carrot...)"
            style={{
              padding: "10px",
              border: `2px solid ${error ? '#dc3545' : '#ddd'}`,
              borderRadius: "5px",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Rest of form unchanged */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontWeight: "bold", color: "#2c3e50" }}>Category: </label>
          <select name="Category" value={form.Category} onChange={handleChange} style={{padding: "10px", border: "2px solid #ddd", borderRadius: "5px", fontSize: "16px"}}>
            <option>Fruit</option>
            <option>Vegetable</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontWeight: "bold", color: "#2c3e50" }}>Price per kg (Rs): </label>
          <input type="number" name="Price_per_kg" value={form.Price_per_kg} onChange={handleChange} style={{padding: "10px", border: "2px solid #ddd", borderRadius: "5px", fontSize: "16px"}} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontWeight: "bold", color: "#2c3e50" }}>Stock available (kg): </label>
          <input type="number" name="Stock_available_kg" value={form.Stock_available_kg} onChange={handleChange} style={{padding: "10px", border: "2px solid #ddd", borderRadius: "5px", fontSize: "16px"}} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontWeight: "bold", color: "#2c3e50" }}>Day of week: </label>
          <select name="Day_of_week" value={form.Day_of_week} onChange={handleChange} style={{padding: "10px", border: "2px solid #ddd", borderRadius: "5px", fontSize: "16px"}}>
            <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontWeight: "bold", color: "#2c3e50" }}>Weather: </label>
          <select name="Weather" value={form.Weather} onChange={handleChange} style={{padding: "10px", border: "2px solid #ddd", borderRadius: "5px", fontSize: "16px"}}>
            <option>Sunny</option><option>Rainy</option><option>Cloudy</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "10px", background: "white", borderRadius: "5px" }}>
          <label style={{ fontWeight: "bold", color: "#2c3e50" }}>Promotion: </label>
          <input type="checkbox" name="Promotion" checked={form.Promotion === 1} onChange={handleChange} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "10px", background: "white", borderRadius: "5px" }}>
          <label style={{ fontWeight: "bold", color: "#2c3e50" }}>Holiday: </label>
          <input type="checkbox" name="Holiday" checked={form.Holiday === 1} onChange={handleChange} />
        </div>
      </div>
      
      {/* ✅ Better Error Display */}
      {error && (
        <div style={{ 
          marginBottom: "15px", 
          padding: "12px", 
          background: "#f8d7da", 
          border: "1px solid #f5c6cb",
          borderRadius: "5px",
          color: "#721c24"
        }}>
          ❌ {error}
        </div>
      )}
      
      <button 
        onClick={handlePredict} 
        disabled={loading || !form.Product.trim()}
        style={{ 
          padding: "15px 30px", 
          background: loading || !form.Product.trim() ? "#6c757d" : "#28a745", 
          color: "white", 
          border: "none", 
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: (loading || !form.Product.trim()) ? "not-allowed" : "pointer",
          width: "100%",
          transition: "all 0.3s ease"
        }}
      >
        {loading ? "🔄 Predicting..." : "🔮 Predict Demand"}
      </button>

      {prediction !== null && (
        <div style={{ 
          marginTop: "25px", 
          padding: "25px", 
          background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)", 
          borderRadius: "12px",
          borderLeft: "6px solid #28a745",
          boxShadow: "0 4px 15px rgba(40, 167, 69, 0.2)"
        }}>
          <h3 style={{ color: "#155724", margin: "0 0 10px 0" }}>
            🎯 Predicted Quantity Sold: <strong>{prediction.toFixed(1)} kg</strong>
          </h3>
          <p style={{ color: "#155724", margin: 0 }}>Based on current market conditions</p>
        </div>
      )}
    </div>
  );
};

export default DemandPredic;
