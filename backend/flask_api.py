from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

# Initialize the app
app = Flask(__name__)
CORS(app)  

with open('log_reg_model.pkl', 'rb') as file:
    log_reg_model = pickle.load(file)

def encode_gender(gender):
    return 1 if gender == 'Male' else 0  

def encode_country(country):
    country_map = {'USA': 0, 'Canada': 1, 'UK': 2, 'Other': 3}
    return country_map.get(country, 3)  # Default to 'Other' if country is unknown

def encode_loyalty(level):
    # Example encoding - replace with actual encoding used during training
    loyalty_map = {'Low': 0, 'Medium': 1, 'High': 2}
    return loyalty_map.get(level, 0)  # Default to 'Low' if loyalty level is unknown

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from React
        data = request.json
        
        # Print the incoming data for debugging
        print(f"Received data: {data}")
        
        features = [
            int(data['Age']),
            encode_gender(data['Gender']),
            encode_country(data['Country']),
            float(data['Income']),
            int(data['ProductQuality']),
            int(data['ServiceQuality']),
            int(data['PurchaseFrequency']),
            int(data['FeedbackScore']),
            encode_loyalty(data['LoyaltyLevel'])
        ]
        
        # Print the processed features for debugging
        print(f"Processed features: {features}")
        
        # Convert features to numpy array and reshape for prediction
        features_array = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = log_reg_model.predict(features_array)[0]
        
        print(f"Prediction result: {prediction}")
        
        # Return prediction as JSON
        return jsonify({'prediction': str(prediction)})
    
    except KeyError as e:
        return jsonify({'error': f'Missing data for {e}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
