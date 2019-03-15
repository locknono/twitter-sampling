import csv
from itertools import islice
import json
import g
import os

if __name__ == '__main__':

    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)

    with open(g.dataPath + 'finalIDLocation.csv', 'r', encoding='utf-8') as f:
        idLocationDict = {}
        points = []
        pointsSet = set()
        for line in islice(csv.reader(f), 1, None):
            id = line[0]
            lat = float(line[1])
            lng = float(line[2])
            idLocationDict[id] = [lat, lng]
            points.append([lat, lng])
            pointsSet.add((lat, lng))
        with open(g.dataPath + 'finalIDLocation.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(idLocationDict))
        with open('../client/public/finalIDLocation.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(idLocationDict))


    pointCount = len(list(idLocationDict.keys()))

    print('点数:')
    print(pointCount)

    locationSet = set()
    for k in idLocationDict:
        locationSet.add(str(idLocationDict[k][0]) + str(idLocationDict[k][1]))
    print('不重叠点数:')
    print(len(locationSet))

    with open('../client/public/allPoints.json', 'w', encoding='utf-8') as wf:
        wf.write(json.dumps(list(pointsSet)))
