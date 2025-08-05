from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth, firestore
from API.logic import gen_schedule
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.secret_key = os.environ.get('SECRET_KEY', 'your-very-secret-key')

if not firebase_admin._apps:
    cred = credentials.Certificate("stmg1207.json")
    firebase_admin.initialize_app(cred)
db = firestore.client()

def get_firebase_uid(request):
    auth_header = request.headers.get('Authorization', None)
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    id_token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        return decoded_token['uid']
    except Exception:
        return None

def verify(d, s):
    if "(" not in s and ")" not in s:
        return 0
    rd = d['teachers']
    rs = s.split("(")
    subject = rs[0].strip()
    teacher = rs[1].rstrip(")").strip()
    for i in rd:
        if i['name'].strip().lower() == teacher.lower():
            subjects = [subj.strip() for subj in i['subject'].split(",")]
            if subject in subjects:
                return 1
    return 0

@app.route('/api/generate', methods=['POST'])
def generate_timetable():
    uid = get_firebase_uid(request)
    if not uid:
        return jsonify({"error": "Unauthorized"}), 401

    user_ref = db.collection('users').document(uid)
    user_doc = user_ref.get()
    if not user_doc.exists:
        return jsonify({"error": "No user data found."}), 400
    dic = user_doc.to_dict()

    for i in dic.get('classes', []):
        l = [k.strip() for k in i['details'].split(',')]
        for j in l:
            if not verify(dic, j):
                return jsonify({"error": "Kindly check with your data entered!"}), 400

    tt = gen_schedule(dic, dic.get('noper'))
    user_ref.update({'timetable': tt})
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
    app.run(debug=True, host="0.0.0.0")
