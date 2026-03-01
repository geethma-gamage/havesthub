import React, { useState } from "react";
import axios from "axios";

function Predict() {
  const [formData, setFormData] = useState({
    region_name: "",
    commodity_name: "",  // ✅ Now free text input
    "Temperature (°C)": "",
    "Rainfall (mm)": "",
    Month: "",
    Year: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ COMPLETE SRI LANKA DISTRICTS (25 Major Regions)
  const regions = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", 
    "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna",
    "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa",
    "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura",
    "Polonnaruwa", "Badulla", "Moneragala", "Ratnapura", "Kegalle"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validate required fields
    if (!formData.region_name || !formData.commodity_name.trim()) {
      setError("Please select region and type a fruit/vegetable name");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/predict", formData);
      setResult(response.data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.response?.data?.error || "Server error - Check backend on port 5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "750px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ 
        textAlign: "center", 
        color: "#2c3e50", 
        marginBottom: "30px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        borderRadius: "20px", 
        textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
      }}>
         Sri Lanka Vegetable & Fruit Price Predictor 2026
      </h1>
      
      <form onSubmit={handleSubmit} style={{ 
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", 
        padding: "35px", 
        borderRadius: "25px", 
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.3)"
      }}>
        {/* ✅ Region Dropdown (unchanged) */}
        <div style={{ marginBottom: "25px" }}>
          <label style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "16px", display: "block", marginBottom: "10px" }}>
             <strong>Select Region (District)</strong>
          </label>
          <select 
            name="region_name" 
            value={formData.region_name} 
            onChange={handleChange} 
            required 
            style={{ 
              width: "100%", 
              padding: "16px", 
              fontSize: "16px", 
              borderRadius: "15px", 
              border: `3px solid ${error && !formData.region_name ? '#dc3545' : '#3498db'}`, 
              background: "white",
              boxShadow: "0 6px 20px rgba(52,152,219,0.2)"
            }}
          >
            <option value="">Choose Sri Lankan District...</option>
            {regions.map((region, index) => (
              <option key={index} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* ✅ FREE TEXT INPUT for Fruits/Vegetables */}
        <div style={{ marginBottom: "25px" }}>
          <label style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "16px", display: "block", marginBottom: "10px" }}>
             <strong>Type Fruit OR Vegetable Name</strong>
          </label>
          <input 
            type="text"
            name="commodity_name"
            value={formData.commodity_name}
            onChange={handleChange}
            placeholder="Type any fruit/veg (Mango, Carrot, Potato, Orange...)"
            required
            style={{ 
              width: "100%", 
              padding: "16px", 
              fontSize: "16px", 
              borderRadius: "15px", 
              border: `3px solid ${error && !formData.commodity_name.trim() ? '#dc3545' : '#27ae60'}`, 
              background: "white",
              boxShadow: `0 6px 20px ${error && !formData.commodity_name.trim() ? 'rgba(220,53,69,0.3)' : 'rgba(39,174,96,0.2)'}`,
              textTransform: "capitalize"
            }}
          />
          <small style={{ color: "#7f8c8d", fontSize: "14px", marginTop: "5px", display: "block" }}>
            Examples: Mango, Carrot, Potato, Orange, Tomato, Pineapple
          </small>
        </div>

        {/* Weather & Time Inputs (unchanged) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
          <div>
            <label style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "15px", display: "block", marginBottom: "8px" }}>
               Temperature (°C)
            </label>
            <input 
              type="number" 
              step="0.1" 
              name="Temperature (°C)" 
              placeholder="28.5" 
              value={formData["Temperature (°C)"]} 
              onChange={handleChange} 
              required 
              style={{ 
                width: "100%", padding: "15px", fontSize: "16px", 
                borderRadius: "12px", border: "2px solid #f39c12", 
                background: "white", boxShadow: "0 4px 15px rgba(243,156,18,0.2)"
              }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "15px", display: "block", marginBottom: "8px" }}>
               Rainfall (mm)
            </label>
            <input 
              type="number" 
              step="0.1" 
              name="Rainfall (mm)" 
              placeholder="180" 
              value={formData["Rainfall (mm)"]} 
              onChange={handleChange} 
              required 
              style={{ 
                width: "100%", padding: "15px", fontSize: "16px", 
                borderRadius: "12px", border: "2px solid #e74c3c", 
                background: "white", boxShadow: "0 4px 15px rgba(231,76,60,0.2)"
              }} 
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          <div>
            <label style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "15px", display: "block", marginBottom: "8px" }}>
               Month (1-12)
            </label>
            <input 
              type="number" 
              min="1" max="12" 
              name="Month" 
              placeholder="6" 
              value={formData.Month} 
              onChange={handleChange} 
              required 
              style={{ 
                width: "100%", padding: "15px", fontSize: "16px", 
                borderRadius: "12px", border: "2px solid #9b59b6", 
                background: "white", boxShadow: "0 4px 15px rgba(155,89,182,0.2)"
              }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold", color: "#2c3e50", fontSize: "15px", display: "block", marginBottom: "8px" }}>
               Year
            </label>
            <input 
              type="number" 
              name="Year" 
              placeholder="2026" 
              value={formData.Year} 
              onChange={handleChange} 
              required 
              style={{ 
                width: "100%", padding: "15px", fontSize: "16px", 
                borderRadius: "12px", border: "2px solid #34495e", 
                background: "white", boxShadow: "0 4px 15px rgba(52,73,94,0.2)"
              }} 
            />
          </div>
        </div>

        {/* Predict Button */}
        <button 
          type="submit" 
          disabled={loading || !formData.region_name || !formData.commodity_name.trim()}
          style={{ 
            width: "100%", 
            padding: "20px", 
            background: (loading || !formData.region_name || !formData.commodity_name.trim()) ? "#95a5a6" : "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)", 
            color: "white", 
            border: "none", 
            borderRadius: "20px", 
            fontSize: "22px", 
            fontWeight: "bold", 
            cursor: (loading || !formData.region_name || !formData.commodity_name.trim()) ? "not-allowed" : "pointer",
            boxShadow: "0 10px 35px rgba(39,174,96,0.5)",
            transition: "all 0.4s ease"
          }}
        >
          {loading ? (
            <>
              <span style={{ marginRight: "10px" }}>🔄</span>
              Predicting Market Price...
            </>
          ) : (
            <>
              <span style={{ marginRight: "10px" }}>🚀</span>
              Predict Vegetable/Fruit Price (Rs/kg)
            </>
          )}
        </button>
      </form>

      {/* Error & Result Sections (unchanged) */}
      {error && (
        <div style={{ 
          marginTop: "25px", 
          padding: "30px", 
          background: "linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)", 
          color: "#721c24", 
          borderRadius: "20px", 
          borderLeft: "8px solid #dc3545",
          boxShadow: "0 6px 25px rgba(220,53,69,0.25)"
        }}>
          <strong style={{ fontSize: "18px" }}>❌ Prediction Error</strong><br/><br/>
          {error}
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: "25px", 
          padding: "40px", 
          background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)", 
          color: "#155724", 
          borderRadius: "25px", 
          textAlign: "center",
          boxShadow: "0 15px 50px rgba(40,167,69,0.4)"
        }}>
          <h2 style={{ 
            marginBottom: "25px", 
            color: "#27ae60", 
            fontSize: "28px"
          }}>
            Market Price Prediction Complete!
          </h2>
          <div style={{ 
            fontSize: "24px", 
            marginBottom: "25px"
          }}>
            <div><strong>Region:</strong> {result.region}</div>
            <div style={{ fontSize: "26px", color: "#27ae60", marginTop: "10px" }}>
              <strong>{result.commodity}</strong>
            </div>
          </div>
          <h1 style={{ 
            color: "#27ae60", 
            fontSize: "60px", 
            fontWeight: "900", 
            margin: "20px 0",
            textShadow: "3px 3px 6px rgba(0,0,0,0.2)"
          }}>
             Rs. {result.predicted_price.toLocaleString()}<span style={{ fontSize: "30px" }}>/kg</span>
          </h1>
          <div style={{ 
            fontSize: "18px", 
            opacity: "0.9"
          }}>
            * Based on 2026 Sri Lankan wholesale market conditions
          </div>
        </div>
      )}
    </div>
  );
}

export default Predict;
