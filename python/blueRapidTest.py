import g
import json
from blueRapid import blueRapid, Point
import logging
import numpy as np
from blueRapidEstimate import getRalationshipList, compareRelationshipList

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.INFO)
idLdaDict = {}
estimates = []
disks = []
with open(g.ldaDir + 'idLdaDict.json', 'r', encoding='utf-8') as f:
    idLdaDict = json.loads(f.read())

with open(g.dataPath + 'blueNoise/samplePoints-500-2485-0.12732489624429985.json', 'r', encoding='utf-8') as f:
    points = json.loads(f.read())
    disks = []
    for p in points:
        disk = []
        disk.append(Point(p['id'], idLdaDict[p['id']]))
        for p2 in p['pointsInDisk']:
            disk.append(Point(p2['id'], idLdaDict[p2['id']]))
        disks.append(disk)

originalValues = np.full(g.topicNumber, 0).tolist()
for k in idLdaDict:
    for i in range(len(idLdaDict[k])):
        originalValues[i] = idLdaDict[k][i]

l1 = getRalationshipList(originalValues)

ratioList = []
for i in range(0, 1):
    estimates = blueRapid(disks, dimension=g.topicNumber, delta=0.05, c=1)
    if estimates != None:
        l2 = getRalationshipList(estimates)
        ratio = compareRelationshipList(l1, l2)
        ratioList.append(ratio)
    else:
        ratioList.append(None)

sum = 0
count = 0
for v in ratioList:
    if v != None:
        sum += v
        count += 1

try:
    print('equal ratio:' + sum / count)
except Exception as e:
    pass
