# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from API.logic import generate

app = Flask(__name__)
cors = CORS(app,origins="*")  # Enable CORS for all routes

@app.route('/api/generate', methods=['POST'])
def generate_timetable():
    data = request.get_json(force=True)
    print(f"Received data: {data}")
    return jsonify({"status": "received", "data": data}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
