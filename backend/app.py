# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from API.logic import gen_schedule

app = Flask(__name__)
cors = CORS(app,origins=["https://stm-two.vercel.app/"])  # Enable CORS for all routes
r = None
def verify(d, s):
    if "(" not in s or ")" not in s:
        return 0
    rd = d['teachers']
    rs = s.split("(")
    subject = rs[0].strip()
    teacher = rs[1].rstrip(")").strip()
    for i in rd:
        if i['name'] == teacher:
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
    global r
    r = tt
    print(tt)
    return jsonify(tt), 200

@app.route('/api/timetable', methods=['GET'])
def get_timetable():
    # Serve the most recently generated timetable
    if not r:
        return jsonify({"error": "No timetable generated yet."}), 404
    return jsonify(r)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
