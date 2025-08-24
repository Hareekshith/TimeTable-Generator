from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth, firestore
from API.logic import gen_schedule
import os

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["*"]
)

def to_firestore_safe(data):
    if isinstance(data, dict):
        return {k: to_firestore_safe(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [to_firestore_safe(i) for i in data]
    elif hasattr(data, 'isoformat'):  # Likely datetime/date
        return data.isoformat()
    elif isinstance(data, (str, int, float, bool)) or data is None:
        return data
    else:
        # Convert sets/tuples to list, custom objects to string (or handle as needed)
        if isinstance(data, (set, tuple)):
            return list(data)
        return str(data)

if not firebase_admin._apps:
    cred = credentials.Certificate("stmg1207.json")
    firebase_admin.initialize_app(cred)
db = firestore.client()

def get_firebase_uid(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        print("No or bad Authorization header")
        return None
    id_token = auth_header.split('Bearer ')[1]
    try:
        decoded = firebase_auth.verify_id_token(id_token)
        return decoded['uid']
    except Exception as e:
        print("Token verification failed:", e)  # Log the error!
        return None

def verify(d, s):
    if "(" not in s and ")" not in s:
        return 0
    rd = d['teachli']
    rs = s.split("(")
    subject = rs[0].strip()
    teacher = rs[1].rstrip(")").strip()
    for i in rd:
        if i['name'].strip().lower() == teacher.lower():
            subjects = [subj.strip() for subj in i['subject'].split(",")]
            if subject in subjects:
                return 1
    return 0

@app.route('/api/generate', methods=['POST','OPTIONS'])
def generate_timetable():
    if request.method=='OPTIONS':
        return '',200
    uid = get_firebase_uid(request)
    if not uid:
        return jsonify({"error": "Unauthorized"}), 401
    user_ref = db.collection('users').document(uid)
    user_doc = user_ref.get()
    if not user_doc.exists:
        return jsonify({"error": "No user data found."}), 400
    dic = user_doc.to_dict()
    print(dic)
    for i in dic.get('clali', []):
        l = [k.strip() for k in i['details'].split(',')]
        for j in l:
            if not verify(dic, j):
                return jsonify({"error": "Kindly check with your data entered!"}), 400
    tt = gen_schedule(dic, dic.get('noper'))
    tt_clean = to_firestore_safe(tt)
    user_ref.update({'timetable': tt_clean})
    return jsonify(tt), 200

@app.route('/api/timetable', methods=['GET'])
def get_timetable():
    uid = get_firebase_uid(request)
    if not uid:
        return jsonify({"error": "Unauthorized"}), 401

    user_ref = db.collection('users').document(uid)
    user_doc = user_ref.get()
    if not user_doc.exists or 'timetable' not in user_doc.to_dict():
        return jsonify({"error": "No timetable generated yet."}), 404

    tt = user_doc.to_dict().get('timetable')
    return jsonify(tt)

if __name__ == '__main__':
    app.run(debug=True, port=5000, host="localhost")
