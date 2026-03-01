import joblib

# Load model columns
model_columns = joblib.load("model_columns.pkl")

# Print all columns
print("Columns your model expects:")
for col in model_columns:
    print(col)
