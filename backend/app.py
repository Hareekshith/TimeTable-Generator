
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from bson.objectid import ObjectId
from dotenv import load_dotenv
from API.logic import gen_schedule
import os

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'your-very-secret-key'  # Change for production!
jwt = JWTManager(app)

# Setup MongoDB
client = MongoClient(os.getenv('mu'))
db = client['userinfo']
users_col = db['ttstorage']

### AUTH SECTION ###
@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    if users_col.find_one({'username': username}):
        return jsonify({'msg': 'User already exists!'}), 400
    hashed_pw = generate_password_hash(password)
    new_user = {
        'username': username,
        'password': hashed_pw,
        'noper': 0,
        'teachli': [],
        'clali': [],
        'submitted': False,
        'timetable': None
    }
    users_col.insert_one(new_user)
    return jsonify({'msg': 'User registered!'}), 200

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = users_col.find_one({'username': username})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'msg': 'Incorrect username or password!'}), 401
    access_token = create_access_token(identity=str(user['_id']))
    return jsonify(access_token=access_token, username=user['username']), 200

### DATA SECTION ###
@app.route('/api/userdata', methods=['GET'])
@jwt_required()
def get_userdata():
    uid = get_jwt_identity()
    user = users_col.find_one({'_id': ObjectId(uid)}, {'password': 0})
    if not user:
        return jsonify({}), 404
    # Convert ObjectId to string for frontend
    user['_id'] = str(user['_id'])
    return jsonify(user), 200

@app.route('/api/userdata/save', methods=['POST'])
@jwt_required()
def save_userdata():
    uid = get_jwt_identity()
    data = request.json
    users_col.update_one(
        {'_id': ObjectId(uid)},
        {'$set': {
            'noper': data.get('noper', 0),
            'teachli': data.get('teachli', []),
            'clali': data.get('clali', []),
            'submitted': data.get('submitted', False)
        }},
        upsert=True
    )
    return jsonify({'success': True})

@app.route('/api/userdata/reset', methods=['POST'])
@jwt_required()
def reset_userdata():
    uid = get_jwt_identity()
    users_col.update_one(
        {'_id': ObjectId(uid)},
        {'$set': {
            "noper": 0,
            "teachli": [],
            "clali": [],
            "submitted": False,
            "timetable": None
        }}
    )
    return jsonify({'success': True})

@app.route('/api/generate', methods=['POST'])
@jwt_required()
def generate_timetable():
    uid = get_jwt_identity()
    user = users_col.find_one({'_id': ObjectId(uid)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    dic = data.get('dic')
    if not dic:
        return jsonify({'error': 'Missing input data'}), 400

    noper = dic.get('noslot', user.get('noper', 0))
    teachli = dic.get('teachers', user.get('teachli', []))
    clali = dic.get('classes', user.get('clali', []))

    timetable = gen_schedule({'teachli': teachli, 'clali': clali}, per_day=noper)

    users_col.update_one(
        {'_id': ObjectId(uid)},
        {'$set': {'timetable': timetable}}
    )
    return jsonify(timetable), 200

@app.route('/api/timetable', methods=['GET'])
@jwt_required()
def get_timetable():
    uid = get_jwt_identity()
    user = users_col.find_one({'_id': ObjectId(uid)})
    if not user or 'timetable' not in user or not user['timetable']:
        return jsonify({'error': 'No timetable generated yet.'}), 404
    return jsonify(user['timetable']), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)

