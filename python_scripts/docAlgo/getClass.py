import json
import g
from shared.lda_op import findMaxIndexAndValueForOneDoc

def getIDClassDict(idVectorDict):
    idClassDict={}
    for k in idVectorDict:
        maxIndex,maxV=findMaxIndexAndValueForOneDoc(idVectorDict[k])
        idClassDict[k]=maxIndex
    print(idClassDict)
    return idClassDict


if __name__ == '__main__':
    idLocationDict = None
    mapPoints = []
    scatterPoints = []
    idList = []

    for i in range(g.topicNumber):
        scatterPoints.append([])
        mapPoints.append([])

    with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8') as f:
        idLocationDict = json.loads(f.read())

    with open(g.docDir + 'idScatterData.json', 'r', encoding='utf-8') as f:
        idScatterData = json.loads(f.read())
        idClassDict = runKmeans(idScatterData)

        for k in idScatterData:
            idList.append(k)

        idClassPointDict = {}
        finalScatterPoints = []
        finalMapPoints = []
        idClassDict = {}
        for index, id in enumerate(idList):
            x = round(idScatterData[id][0], 2)
            y = round(idScatterData[id][1], 2)
            lat = idLocationDict[id][0]
            lng = idLocationDict[id][1]
            topic = int(idClassDict[id])
            point = {"id": id, "x": x, "y": y, "topic": topic}

            finalScatterPoint = {"id": id, "x": x, "y": y, "topic": topic}
            finalScatterPoints.append(finalScatterPoint)

            finalMapPoint = {"id": id, "lat": lat, "lng": lng, "topic": topic}
            finalMapPoints.append(finalMapPoint)

            scatterPoints[topic].append([(idScatterData[id][0]), (idScatterData[id][1])])
            mapPoints[topic].append([idLocationDict[id][0], idLocationDict[id][1]])
            idClassPointDict[id] = point
            idClassDict[id] = topic

        with open(g.docDir + 'idClassDict.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(idClassDict))
        with open(g.docDir + 'idKmeansClassDict.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(idClassPointDict))

        with open(g.docDir + 'mapClassPoints.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(mapPoints))

        with open(g.docDir + 'finalScatterPoints.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(finalScatterPoints))
        with open(g.docDir + 'finalMapPoints.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(finalMapPoints))

        with open('../client/public/finalScatterPoints.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(finalScatterPoints))
        with open('../client/public/finalMapPoints.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(finalMapPoints))

        with open('../client/public/mapClassPoints.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(mapPoints))
