from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model
model = joblib.load('gas_spread_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from the request
        data = request.get_json(force=True)
        input_features = [data['gas_weight'], data['density'], data['amount'],
                          data['wind_speed'], data['atmospheric_pressure'], data['impurities']]

        # Convert input data to numpy array
        input_array = np.array([input_features])

        # Make predictions using the loaded model
        prediction = model.predict(input_array)

        # Return the prediction as JSON
        return jsonify({'prediction': float(prediction[0])})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)