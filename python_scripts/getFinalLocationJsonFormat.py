import csv
from itertools import islice
import json
import g

if __name__ == '__main__':
    with open(g.dataPath + 'finalIDLocation.csv', 'r', encoding='utf-8') as f:
        idLocationDict = {}
        points = []
        for line in islice(csv.reader(f), 1, None):
            id = line[0]
            lat = float(line[1])
            lng = float(line[2])
            idLocationDict[id] = [lat, lng]
            points.append([lat, lng])
        with open(g.dataPath + 'finalIDLocation.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(idLocationDict))
        with open('../client/public/finalIDLocation.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(idLocationDict))
        with open('../client/public/allPoints.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(points))

    pointCount = len(list(idLocationDict.keys()))

    print(pointCount)

    locationSet = set()
    for k in idLocationDict:
        locationSet.add(str(idLocationDict[k][0]) + str(idLocationDict[k][1]))
    print(len(locationSet))
