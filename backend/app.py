# backend/app.py
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from API.logic import gen_schedule
from datetime import timedelta
import os

app = Flask(__name__)
app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True
)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.secret_key = os.environ.get('SECRET_KEY', 'your-very-secret-key')
app.permanent_session_lifetime=timedelta(minutes=3)

@app.before_request
def make_session_permanent():
    session.permanent = True

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
    data = request.get_json()
    dic = data.get('dic')
    if not dic:
        return jsonify({"error": "Missing 'dic' in request"}), 400
    for i in dic['classes']:
        l = [k.strip() for k in i['details'].split(',')]
        for j in l:
            if not verify(dic,j):
                return jsonify({"error": "Kindly check with your data entered!"}), 400
    tt = gen_schedule(dic, dic['noslot'])
    session['timetable'] = tt
    # print(tt)
    return jsonify(tt), 200

@app.route('/api/timetable', methods=['GET'])
def get_timetable():
    # Serve the most recently generated timetable
    tt = session.get('timetable')
    if not tt:
        return jsonify({"error": "No timetable generated yet."}), 404
    return jsonify(tt)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
