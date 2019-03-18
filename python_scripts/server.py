from flask import Flask, Response, Request, request, jsonify
import json
from data_process.getWordCloudDataForVec import getWordCloudData
app = Flask(__name__)
import g

@app.route("/")
def hello():
    return "Hello World!"


@app.route("/selectArea", methods=['GET', 'POST'])
def selectArea():
    ids = json.loads(request.data)
    renderData = getWordCloudData(ids)
    print(len(renderData))
    res = Response(json.dumps(renderData))
    res.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res


@app.route("/getCoorsByIDs", methods=['GET', 'POST'])
def getCoorsByIDs():
    ids = json.loads(request.data)
    latlngs = []
    with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8')as f:
        idLocationDict = json.loads(f.read())
        for id in ids:
            coord = idLocationDict[id]
            latlngs.append(coord)
        res = Response(json.dumps(latlngs))
        res.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
        return res


if __name__ == '__main__':
    app.run(port=8000)
