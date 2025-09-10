from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Sample crop data
CROPS = {
    "wheat": {"cycle": 120, "temperature": "15-25°C", "water": "moderate"},
    "rice": {"cycle": 150, "temperature": "25-35°C", "water": "high"},
    "corn": {"cycle": 100, "temperature": "20-30°C", "water": "moderate"}
}

@app.route('/api/crops', methods=['GET'])
def get_crops():
    return jsonify(CROPS)

@app.route('/api/weather', methods=['GET'])
def get_weather():
    # Sample weather response
    weather = {
        "temperature": "28°C",
        "humidity": "65%",
        "recommendation": "Good for planting rice"
    }
    return jsonify(weather)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
