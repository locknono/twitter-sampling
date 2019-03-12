import g
import json
import csv
from itertools import islice
from ldbr4 import ldbr, Point
import math
import shortuuid
from typing import List
from blueRapidEstimate import getRalationshipList, compareRelationshipList
import copy
from ldbrTest import getOriginalEstimates
from shared.lda_op import fetchIDLdaDict, findMaxIndexAndValueForOneDoc

idLocationDict = None
scatterData = None
idClassDict = {}
classLocationDict = {}
with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8') as f:
    idLocationDict = json.loads(f.read())
with open('../client/public/scatterData.json', 'r', encoding='utf-8') as f:
    scatterData = json.loads(f.read())

idLdaDict = fetchIDLdaDict(g.ldaDir + 'idLdaDict.json')

for k in idLdaDict:
    maxIndex, maxV = findMaxIndexAndValueForOneDoc(idLdaDict[k])
    idClassDict[k] = maxIndex

for k in scatterData:
    x = scatterData[k][0]
    y = scatterData[k][1]
    if idClassDict[k] in classLocationDict:
        classLocationDict[idClassDict[k]].append([x, y])
    else:
        classLocationDict[idClassDict[k]] = []

classCenterDict = {}
for topic in classLocationDict:
    xSum = 0
    ySum = 0
    count = 0
    for x, y in classLocationDict[topic]:
        xSum += x
        ySum += y
        count += 1
    cx = xSum / count
    cy = ySum / count
    classCenterDict[topic] = [cx, cy]

points = []
for k in idLdaDict:
    maxIndex, maxV = findMaxIndexAndValueForOneDoc(idLdaDict[k])
    value = math.sqrt(math.pow(scatterData[k][0] - classCenterDict[maxIndex][0], 2) + math.pow(
        scatterData[k][1] - classCenterDict[maxIndex][1], 2))
    p = Point(k, idLocationDict[k][0], idLocationDict[k][1], value, maxIndex)
    points.append(p)

maxV = -1
minV = 99999
for p in points:
    if p.value < minV:
        minV = p.value
    if p.value > maxV:
        maxV = p.value

for p in points:
    p.value = (p.value - minV) / (maxV - minV)
ratioList = []
countList = []
outputPoints = []
for c in [0.05]:
    estimates, sampleGroups = ldbr(copy.deepcopy(points), 10000, len(classLocationDict.keys()), 0.01, c)
    if estimates == None:
        ratioList.append(None)
        countList.append(None)
        continue
    originalEstimates = getOriginalEstimates(copy.deepcopy(points), len(classLocationDict.keys()))
    r1 = getRalationshipList(estimates)
    r2 = getRalationshipList(originalEstimates)
    ratio = compareRelationshipList(r1, r2)
    count = 0
    for group in sampleGroups:
        for p in group:
            count += 1
    for group in sampleGroups:
        for p in group:
            outputP = {"id": p.id, "r": p.r, "lat": p.lat, "lng": p.lng}
            outputPoints.append(outputP)
    ratioList.append(ratio)
    countList.append(count)

    with open(g.ldaDir + 'ldbrPoints.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputPoints))

print(str(ratioList))
print(str(countList))
