import json
import g
from sklearn.cluster import KMeans

if __name__ == '__main__':
    with open(g.ldaDir + 'scatterData.json', 'r', encoding='utf-8') as f:
        scatterData = json.loads(f.read())
        kmeansData = []
        scatterPoints = []
        for i in range(g.topicNumber):
            scatterPoints.append([])
        idList = []
        for k in scatterData:
            idList.append(k)
            kmeansData.append(scatterData[k])
        kmeans = KMeans(n_clusters=g.topicNumber, random_state=0).fit(kmeansData)
        classList = kmeans.labels_
        idClassDict = {}
        for index, id in enumerate(idList):
            point = {"coord": [(scatterData[id][0]), (scatterData[id][1])], "topic": int(classList[index])}
            scatterPoints[int(classList[index])].append([(scatterData[id][0]), (scatterData[id][1])])
            idClassDict[id] = point
        with open(g.ldaDir + 'idKmeansClassDict.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(idClassDict))
        with open(g.ldaDir + 'scatterPoints.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(scatterPoints))
        with open('../client/public/scatterPoints.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(scatterPoints))
