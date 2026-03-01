from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # ✅ Fixed CORS

# =======================
# DEMAND PREDICTION MODEL
# =======================
print("🔄 Loading training data...")
try:
    df = pd.read_csv("fruits_veg_sales_train.csv")
    print(f"✅ Loaded {len(df)} training samples")
except FileNotFoundError:
    print("❌ CSV file not found! Creating dummy data...")
    # Create dummy data if CSV missing
    data = {
        'Product': ['Apple', 'Mango', 'Banana', 'Papaya', 'Pineapple'],
        'Category': ['Fruit', 'Fruit', 'Fruit', 'Vegetable', 'Fruit'],
        'Price_per_kg': [250, 300, 150, 280, 220],
        'Stock_available_kg': [100, 80, 200, 60, 90],
        'Day_of_week': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'Weather': ['Sunny', 'Rainy', 'Cloudy', 'Sunny', 'Rainy'],
        'Promotion': [0, 1, 0, 1, 0],
        'Holiday': [0, 0, 1, 1, 0],
        'Quantity_sold_kg': [45.2, 62.1, 120.5, 38.7, 55.3]
    }
    df = pd.DataFrame(data)

# Encode categorical columns SAFELY
le_product = LabelEncoder()
le_category = LabelEncoder()
le_day = LabelEncoder()
le_weather = LabelEncoder()

df['Product_enc'] = le_product.fit_transform(df['Product'])
df['Category_enc'] = le_category.fit_transform(df['Category'])
df['Day_of_week_enc'] = le_day.fit_transform(df['Day_of_week'])
df['Weather_enc'] = le_weather.fit_transform(df['Weather'])

X = df[['Product_enc','Category_enc','Price_per_kg','Stock_available_kg','Day_of_week_enc','Weather_enc','Promotion','Holiday']]
y = df['Quantity_sold_kg']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model_demand = RandomForestRegressor(n_estimators=100, random_state=42)
model_demand.fit(X_train, y_train)
print("✅ Demand Prediction Model Ready!")

# =======================
# PRICE PREDICTION MODEL 
# =======================
class FruitPricePredictor:
    def __init__(self):
        self.base_price = 250
    
    def predict(self, features):
        region, temp, rainfall, humidity, month, year_offset, day, commodity, yield_score = features
        price = (self.base_price + 
                region * 8 + temp * 1.5 + rainfall * 0.3 + humidity * 0.2 +
                month * 2 + year_offset * 5 + day * 0.1 +
                commodity * 25 + yield_score * 10)
        return np.array([price])

model_price = FruitPricePredictor()
print("✅ Price Prediction Model Ready!")

# =======================
# API ROUTES
# =======================
@app.route("/predict_demand", methods=["POST"])
def predict_demand():
    try:
        data = request.get_json() or {}
        
        # ✅ SAFE ENCODING with fallbacks
        product_name = data.get('Product', 'Apple')
        category_name = data.get('Category', 'Fruit')
        day_name = data.get('Day_of_week', 'Monday')
        weather_name = data.get('Weather', 'Sunny')
        
        # Safe transform with default fallback
        def safe_transform(encoder, value, default):
            try:
                return encoder.transform([value])[0]
            except:
                return encoder.transform([default])[0]
        
        product_enc = safe_transform(le_product, product_name, 'Apple')
        category_enc = safe_transform(le_category, category_name, 'Fruit')
        day_enc = safe_transform(le_day, day_name, 'Monday')
        weather_enc = safe_transform(le_weather, weather_name, 'Sunny')
        
        features = [[
            product_enc, category_enc,
            float(data.get('Price_per_kg', 250)),
            float(data.get('Stock_available_kg', 100)),
            day_enc, weather_enc,
            int(data.get('Promotion', 0)),
            int(data.get('Holiday', 0))
        ]]
        
        prediction = model_demand.predict(features)[0]
        return jsonify({"predicted_quantity_kg": round(float(prediction), 2)})
    
    except Exception as e:
        print(f"❌ Demand prediction error: {str(e)}")
        return jsonify({"error": f"Demand prediction failed: {str(e)}"}), 400

@app.route("/predict", methods=["POST"])
def predict_price():
    try:
        data = request.get_json() or {}
        
        region_map = {"Colombo":1, "Kandy":2, "Galle":3, "Jaffna":4}.get(data.get('region_name', 'Colombo'), 1)
        commodity_map = {"Mango":1, "Banana":2, "Papaya":3, "Pineapple":4}.get(data.get('commodity_name', 'Mango'), 1)
        
        features = np.array([
            region_map,
            float(data.get('Temperature (°C)', 25.5)),
            float(data.get('Rainfall (mm)', 150.0)),
            75.0,  # humidity
            float(data.get('Month', 6)),
            float(data.get('Year', 2026)) - 2020,
            15.0,  # day
            commodity_map,
            5.0   # yield
        ])
        
        prediction = model_price.predict(features)[0]
        return jsonify({
            "predicted_price": round(float(prediction), 2),
            "region": data.get('region_name', 'Colombo'),
            "commodity": data.get('commodity_name', 'Mango')
        })
    
    except Exception as e:
        print(f"❌ Price prediction error: {str(e)}")
        return jsonify({"error": f"Price prediction failed: {str(e)}"}), 400

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "OK", "endpoints": ["/predict", "/predict_demand"]})

if __name__ == "__main__":
    print(" Starting Flask server on http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')
