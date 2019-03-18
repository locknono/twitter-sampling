from flask import Flask,Response,Request
import json

app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/selectArea", methods=['GET', 'POST'])
def selectArea():
    res = Response('hiahia')
    res.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res


if __name__ == '__main__':
    app.run(port=8000)
