import g
import json
import csv
from itertools import islice
from ldbr6 import ldbr, Point
import math
import shortuuid
from typing import List
from ldbr6 import getGeoDistance
import random
from blueRapidEstimate import getRalationshipList, compareRelationshipList
import copy
from ldbrTest import getOriginalEstimates
from shared.lda_op import fetchIDLdaDict, findMaxIndexAndValueForOneDoc, showBarChart, saveBarChart

disks = []


class Dp:
    def __init__(self, lat, lng, r):
        self.lat = lat
        self.lng = lng
        self.r = r
        self.count = 0
        self.isDisk = False


with open(g.dataPath + 'blueNoise/samplePoints-500-2487-0.12742737100988882.json', 'r', encoding='utf-8') as f:
    blueResult = json.loads(f.read())
    for p in blueResult:
        disks.append(Dp(p['lat'], p['lng'], p['r']))

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

for t in range(30):
    c = 0.08 + t * 0.001

    estimates, sampleGroups, disks = ldbr(copy.deepcopy(points), len(classLocationDict.keys()), 0.05, c,
                                          disks)
    if estimates == None:
        ratioList.append(None)
        countList.append(None)

    samplingPoints = []
    count = 0
    for group in sampleGroups:
        for p in group:
            samplingPoints.append(p)
            count += 1

    samplingEstimates = getOriginalEstimates(samplingPoints, len(classLocationDict.keys()))
    r1 = getRalationshipList(samplingEstimates)
    # r1 = getRalationshipList(estimates)

    originalEstimates = getOriginalEstimates(copy.deepcopy(points), len(classLocationDict.keys()))
    r2 = getRalationshipList(originalEstimates)

    ratio = compareRelationshipList(r2, r1)
    print('采了{0}个'.format(str(count)))

    ratioList.append(ratio)
    countList.append(count)

    for group in sampleGroups:
        for p in group:
            outputP = {"id": p.id, "r": p.r, "lat": p.lat, "lng": p.lng, "isDisk": p.isDisk}
            outputPoints.append(outputP)

    with open(g.ldaDir + 'ldbrPoints.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputPoints))

    with open('../client/public/ldbrDisks.json', 'w', encoding='utf-8') as f:
        outputDisks = []
        for p in disks:
            outputDisks.append({"r": p.r, "lat": p.lat, "lng": p.lng, "isDisk": p.isDisk, "count": p.count})
        f.write(json.dumps(outputDisks))

    with open('../client/public/ldbrPoints.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputPoints))

    print(str(ratioList))
    print(str(countList))

    ccList = []
    for disk in disks:
        ccList.append(disk.count)
    ccList = sorted(ccList, reverse=True)
    print(ccList)
