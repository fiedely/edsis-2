from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS to allow the frontend to talk to this backend
CORS(app)

@app.route('/')
def home():
    return "Python Backend is Running!"

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Python backend is connected!"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)