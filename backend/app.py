# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from API.logic import generate

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/generate', methods=['POST'])
def generate_timetable():
    data = request.get_json()
    dic = data.get('dic')
    if not dic:
        return jsonify({"error": "Missing 'dic' in request"}), 400

    # Prepare initial timetable grid
    dt = [[None for _ in range(10)] for _ in range(5)]
    timetable = generate(dic)
    return jsonify({"timetable": timetable})

if __name__ == '__main__':
    app.run(debug=True)
