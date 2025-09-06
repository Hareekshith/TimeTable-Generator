
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key'  # Change this!

jwt = JWTManager(app)
client = MongoClient(os.getenv('mu'))
db = client['userinfo']
users = db['ttstorage']

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    if users.find_one({'username': username}):
        return jsonify({"msg": "User already exists"}), 400
    hashed_pw = generate_password_hash(password)
    users.insert_one({'username': username, 'password': hashed_pw})
    return jsonify({"msg": "User registered successfully"}), 200

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = users.find_one({'username': username})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=str(user['_id']))
    return jsonify(access_token=access_token), 200

@app.route('/api/userdata', methods=['GET'])
@jwt_required()
def get_userdata():
    user_id = get_jwt_identity()
    user_doc = users.find_one({'_id': user_id}, {'password': 0})
    if not user_doc:
        return jsonify({})
    return jsonify(user_doc)

# Similarly add save/reset and timetable routes protected by @jwt_required()

if __name__ == '__main__':
    app.run(debug=True)

