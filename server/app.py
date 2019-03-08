from flask import Flask
from flask import render_template
from flask import url_for
app = Flask(__name__)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/campo')
def campo():
    return render_template('campo.html')

@app.route('/energia')
def energia():
    return render_template('energia.html')

@app.route('/potencia')
def potencia():
    return render_template('potencia.html')