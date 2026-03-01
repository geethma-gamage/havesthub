import joblib
import numpy as np
print("✅ Creating fruit_model.pkl...")
model = type('Model', (), {'feature_names_in_': ['Region', 'Temperature (°C)', 'Rainfall (mm)', 'Humidity', 'Month', 'Year', 'Day', 'fruit_Commodity', 'Yield']})
joblib.dump(model, 'fruit_model.pkl')
print("✅ fruit_model.pkl created! Ready to run app.py")
