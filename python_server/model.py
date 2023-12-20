# Import necessary libraries
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib

# Load your dataset
data = pd.read_csv('augmented_dataset.csv')

# Define features (X) and target variable (y)
X = data[['gas_weight', 'density', 'amount', 'wind_speed', 'atmospheric_pressure', 'impurities']]
y = data['spread']

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize the model (Random Forest Regressor)
model = RandomForestRegressor(n_estimators=100, random_state=42)

# Train the model
model.fit(X_train, y_train)

# Make predictions on the test set
predictions = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, predictions)
print(f'Mean Squared Error: {mse}')

# Save the model to a file
joblib.dump(model, 'gas_spread_model.joblib')
