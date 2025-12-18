import os
from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
# Import the direct Firestore Client from Google Cloud
from google.cloud import firestore

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# --- Firebase Setup ---
if os.path.exists("serviceAccountKey.json"):
    # Keep this for Auth later
    cred = credentials.Certificate("serviceAccountKey.json")
    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_admin.initialize_app(cred)

    # Connect directly using the Google Cloud Client
    # This allows us to specify the 'database' parameter
    db = firestore.Client.from_service_account_json(
        "serviceAccountKey.json", 
        database="edsis-2-database"
    )
    
    print("Firebase connected successfully to 'edsis-2-database'!")
else:
    print("Warning: serviceAccountKey.json not found. Database will not work.")
    db = None

# --- Routes ---

@app.route('/')
def home():
    return "Python Backend is Running with Firebase!"

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Python backend is connected!"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)