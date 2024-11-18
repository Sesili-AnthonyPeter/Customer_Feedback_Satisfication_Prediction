import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const initialFormData = {
        Age: '',
        Gender: '',
        Country: '',
        Income: '',
        ProductQuality: '',
        ServiceQuality: '',
        PurchaseFrequency: '',
        FeedbackScore: '',
        LoyaltyLevel: ''
    };
    
    const [formData, setFormData] = useState(initialFormData);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Validate input data (limits)
    const validateInput = () => {
        // Example validation limits
        if (formData.Age < 18 || formData.Age > 100) {
            return "Age must be between 18 and 100.";
        }
        if (formData.Income < 10000 || formData.Income > 200000) {
            return "Income must be between 10,000 and 200,000.";
        }
        if (formData.ProductQuality < 1 || formData.ProductQuality > 10) {
            return "Product Quality must be between 1 and 10.";
        }
        if (formData.ServiceQuality < 1 || formData.ServiceQuality > 10) {
            return "Service Quality must be between 1 and 10.";
        }
        if (formData.PurchaseFrequency < 1 || formData.PurchaseFrequency > 50) {
            return "Purchase Frequency must be between 1 and 50.";
        }
        return null;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form inputs
        const validationError = validateInput();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);

        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', formData);
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Error fetching prediction:', error);
        }
    };

    // Handle new calculation by resetting the form and prediction
    const handleNewCalculation = () => {
        setFormData(initialFormData);  // Reset form data
        setPrediction(null);  // Clear the previous prediction
        setError(null);  // Clear any error message
    };

    return (
        <div className="App">
            <h1>Customer Satisfaction Prediction</h1>
            <form onSubmit={handleSubmit}>
                <input type="number" name="Age" placeholder="Age" onChange={handleChange} value={formData.Age} required />
                <input type="number" name="Gender" placeholder="Gender (1 for Male, 0 for Female)" onChange={handleChange} value={formData.Gender} required />
                <input type="text" name="Country" placeholder="Country" onChange={handleChange} value={formData.Country} required />
                <input type="number" name="Income" placeholder="Income" onChange={handleChange} value={formData.Income} required />
                <input type="number" name="ProductQuality" placeholder="Product Quality" onChange={handleChange} value={formData.ProductQuality} required />
                <input type="number" name="ServiceQuality" placeholder="Service Quality" onChange={handleChange} value={formData.ServiceQuality} required />
                <input type="number" name="PurchaseFrequency" placeholder="Purchase Frequency" onChange={handleChange} value={formData.PurchaseFrequency} required />
                <input type="number" name="FeedbackScore" placeholder="Feedback Score" onChange={handleChange} value={formData.FeedbackScore} required />
                <input type="text" name="LoyaltyLevel" placeholder="Loyalty Level" onChange={handleChange} value={formData.LoyaltyLevel} required />
                <button type="submit">Get Prediction</button>
            </form>

            {error && (
                <div style={{ color: 'red' }}>
                    <p>{error}</p>
                </div>
            )}

            {prediction && (
                <div>
                    <h2>Prediction Result: {prediction}</h2>
                    <button onClick={handleNewCalculation}>Reset</button>
                </div>
            )}
        </div>
    );
}

export default App;
