import requests

url = "http://localhost:5000/predict"
headers = {"Content-Type": "application/json"}

# Input features for prediction
input_features = {
    "gas_weight": 1,
    "density": 1.2,
    "amount": 10,
    "wind_speed": 18,
    "atmospheric_pressure": 1013,
    "impurities": 0.02,
}

# Make the request
response = requests.post(url, json=input_features, headers=headers)

# Print the response
print(response.json())