import flask,render-template

app = Flask(__name__)

@app.route("/")
def home():
    return render-template("index.html")
