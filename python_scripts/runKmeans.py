import json
import g
from sklearn.cluster import KMeans


def runKmeans():
    print('run kmeans')
    idLocationDict = None
    with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8') as f:
        idLocationDict = json.loads(f.read())
    with open(g.docDir + 'scatterData.json', 'r', encoding='utf-8') as f:
        scatterData = json.loads(f.read())
        kmeansData = []
        mapPoints = []
        scatterPoints = []

        for i in range(g.topicNumber):
            scatterPoints.append([])
            mapPoints.append([])
        idList = []
        for k in scatterData:
            idList.append(k)
            kmeansData.append(scatterData[k])

        kmeans = KMeans(n_clusters=g.topicNumber, random_state=0).fit(kmeansData)
        classList = kmeans.labels_
        idClassPointDict = {}
        finalScatterPoints = []
        finalMapPoints = []
        idClassDict = {}
        for index, id in enumerate(idList):
            x = round(scatterData[id][0], 2)
            y = round(scatterData[id][1], 2)
            lat = idLocationDict[id][0]
            lng = idLocationDict[id][1]
            topic = int(classList[index])
            point = {"id": id, "x": x, "y": y, "topic": topic}

            finalScatterPoint = {"id": id, "x": x, "y": y, "topic": topic}
            finalScatterPoints.append(finalScatterPoint)

            finalMapPoint = {"id": id, "lat": lat, "lng": lng, "topic": topic}
            finalMapPoints.append(finalMapPoint)

            scatterPoints[classList[index]].append([(scatterData[id][0]), (scatterData[id][1])])
            mapPoints[classList[index]].append([idLocationDict[id][0], idLocationDict[id][1]])
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


if __name__ == '__main__':
    runKmeans()
