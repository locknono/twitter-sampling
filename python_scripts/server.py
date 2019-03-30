from flask import Flask, Response, Request, request, jsonify
import json
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud, readJsonFile, \
    getHexes, getRiverData
from getWheelData import getWheelData

app = Flask(__name__)
import g

clientURL = 'http://localhost:3000'
idTextDict = {}
with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8')as f:
    for line in f:
        line = line.strip('\t\n').split('\t')
        id = line[0]
        text = line[1]
        idTextDict[id] = text
idClassDict = readJsonFile(g.dataPath + 'idClassDict.json')
idLocationDict = readJsonFile(g.dataPath + 'finalIDLocation.json')
originalIDTextDict = readJsonFile(g.dataPath + 'originalTexts.json')

idTimeDict = readJsonFile(g.dataPath + 'idTimeDict.json')
riverIDTimeDict = {}
originalIDTimeDict = {}
with open(g.dataPath + 'extractedData.txt', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip('\t\n').split('\t')
        time = line[2].split(' ')[0].replace('-', '/')
        id = line[0]
        originalIDTimeDict[id] = line[2]
        riverIDTimeDict[id] = time


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/selectArea", methods=['GET', 'POST'])
def selectArea():
    ids = json.loads(request.data)
    renderData = getWordCloud(idTextDict, idClassDict, g.topicNumber, ids)
    res = Response(json.dumps(renderData))
    res.headers['Access-Control-Allow-Origin'] = clientURL
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
        res.headers['Access-Control-Allow-Origin'] = clientURL
        res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
        return res


@app.route("/getTextByID", methods=['GET', 'POST'])
def getTextByID():
    id = json.loads(request.data)
    text = idTextDict[id]
    res = Response(json.dumps(text))
    res.headers['Access-Control-Allow-Origin'] = clientURL
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res


@app.route("/getTextsByIDs", methods=['GET', 'POST'])
def getTextsByID():
    ids = json.loads(request.data)
    texts = []
    for id in ids:
        text = {"text": originalIDTextDict[id], "id": id, "time": originalIDTimeDict[id]}
        texts.append(text)
    res = Response(json.dumps(texts))
    res.headers['Access-Control-Allow-Origin'] = clientURL
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res


@app.route("/getInitialTexts", methods=['GET'])
def getInitialTexts():
    texts = []
    number = 0
    for id in originalIDTextDict:
        number += 1
        if number > 200:
            break
        text = {"text": originalIDTextDict[id], "id": id, "time": originalIDTimeDict[id]}
        texts.append(text)
    res = Response(json.dumps(texts))
    res.headers['Access-Control-Allow-Origin'] = clientURL
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res


"""
@app.route("/runSamplingOnIDs", methods=['GET', 'POST'])
def runSamplingOnIDs():
    returnData = {}
    ids = json.loads(request.data)
    print(len(ids))
    texts = []
    for id in ids:
        texts.append(idTextDict[id])

    idVectorDict = runLDA(texts, ids)
    idScatterData = runTsne(idVectorDict)
    idClassDict = getIDClassDict(idVectorDict)
    scatterPoints = getScatterPoints(idScatterData, idClassDict, ids)
    mapPoints = getMapPoints(idLocationDict, idClassDict, ids)
    cloudData = getWordCloud(idTextDict, idClassDict, g.topicNumber, ids)
    riverData = getRiverData(riverIDTimeDict, idClassDict, ids)

    points = getLdbrPoints(idLocationDict, idScatterData, idTimeDict, idClassDict, ids)

    c = 0.05
    samplingSuccess = False
    estimates = None
    sampleGroups = None
    originalEstimates = getOriginalEstimates(points, g.topicNumber)
    while samplingSuccess == False:
        estimates, sampleGroups = ldbr(copy.deepcopy(points), g.topicNumber, 1000, 0.08, c, 0.0005)
        if estimates != None:
            samplingSuccess = True
        else:
            c -= 0.005
    r1 = getRalationshipList(estimates)
    r2 = getRalationshipList(originalEstimates)
    ratio = compareRelationshipList(r2, r1)
    samplingIDs = getSamplingIDs(sampleGroups)

    barData = {"original": originalEstimates, "sampling": estimates}
    samplingMapPoints = getMapPoints(idLocationDict, idClassDict, samplingIDs)
    samplingScatterPoints = getScatterPoints(idScatterData, idClassDict, samplingIDs)
    samplingCloudData = getWordCloud(idTextDict, idClassDict, g.topicNumber, samplingIDs)
    samplingRiverData = getRiverData(riverIDTimeDict, idClassDict, samplingIDs)

    returnData = {"scatterPoints": scatterPoints, 'mapPoints': mapPoints, 'cloudData': cloudData,
                  "riverData": riverData, "barData": barData, "samplingMapPoints": samplingMapPoints,
                  "samplingScatterPoints": samplingScatterPoints, "samplingCloudData": samplingCloudData,
                  "samplingRiverData": samplingRiverData}

    res = Response(json.dumps(returnData))

    res.headers['Access-Control-Allow-Origin'] = clientURL
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res
"""


@app.route("/selectIDsOnMap", methods=['GET', 'POST'])
def selectIDsOnMap():
    returnData = {}
    ids = json.loads(request.data)
    res = Response(json.dumps(ids))
    res.headers['Access-Control-Allow-Origin'] = clientURL
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res


@app.route("/getWheelDataByIDs", methods=['GET', 'POST'])
def getWheelDataByIDs():
    postData = json.loads(request.data)
    metas, wheelDatas = getWheelData(idClassDict, idTimeDict, postData['minValue'], postData['minInter'],
                                     postData['selectedIDs'])
    returnData = {'metas': metas, 'wheelDatas': wheelDatas, 'startDay': g.startDay + 1}
    res = Response(json.dumps(returnData))
    res.headers['Access-Control-Allow-Origin'] = clientURL
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return res


if __name__ == '__main__':
    app.run(port=8000)
