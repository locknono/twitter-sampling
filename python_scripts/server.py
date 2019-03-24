from flask import Flask, Response, Request, request, jsonify
import json
from shared.generateRenderData import getWordCloud, readJsonFile

app = Flask(__name__)
import g

idTextDict = {}
with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8')as f:
    for line in f:
        line = line.strip('\t\n').split('\t')
        id = line[0]
        text = line[1]
        idTextDict[id] = text
idClassDict = readJsonFile(g.dataPath + 'idClassDict.json')

originalIDTextDict = readJsonFile(g.dataPath + 'originalTexts.json')


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/selectArea", methods=['GET'])
def selectArea():
    ids = json.loads(request.data)
    renderData = getWordCloud(idTextDict, idClassDict, g.topicNumber, ids)
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


@app.route("/getTextByID", methods=['GET', 'POST'])
def getTextByID():
    id = json.loads(request.data)
    text = idTextDict[id]
    res = Response(json.dumps(text))
    res.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res


@app.route("/getTextsByIDs", methods=['GET', 'POST'])
def getTextsByID():
    ids = json.loads(request.data)
    texts = []
    for id in ids:
        text = originalIDTextDict[id]
        texts.append(text)
    res = Response(json.dumps(texts))
    res.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res


@app.route("/getInitialTexts", methods=['GET'])
def getInitialTexts():
    texts = []
    number = 0
    for id in originalIDTextDict:
        number += 1
        if number > 100:
            break
        text = originalIDTextDict[id]
        texts.append(text)
    res = Response(json.dumps(texts))
    res.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res



if __name__ == '__main__':
    app.run(port=8000)
