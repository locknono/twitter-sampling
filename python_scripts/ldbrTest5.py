import g
import json
import csv
from itertools import islice
from ldbr5 import ldbr, Point
import math
import shortuuid
from typing import List
from ldbr import getGeoDistance
import random
from blueRapidEstimate import getRalationshipList, compareRelationshipList
import copy
from ldbrTest import getOriginalEstimates
from shared.lda_op import fetchIDLdaDict, findMaxIndexAndValueForOneDoc, showBarChart, saveBarChart

disks = []


class Dp:
    def __init__(self, lat, lng, r, pointsInDisk):
        self.lat = lat
        self.lng = lng
        self.r = r
        self.count = 0
        self.isDisk = False
        self.pointsInDisk = pointsInDisk


with open(g.dataPath + 'blueNoise/samplePoints-500-2487-0.12742737100988882.json', 'r', encoding='utf-8') as f:
    blueResult = json.loads(f.read())
    for p in blueResult:
        disks.append(Dp(p['lat'], p['lng'], p['r'], p['pointsInDisk']))

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

classMaxMinDict = {}
for p in points:
    if p.topic in classMaxMinDict:
        if p.value > classMaxMinDict[p.topic][0]:
            classMaxMinDict[p.topic][0] = p.value
        if p.value < classMaxMinDict[p.topic][1]:
            classMaxMinDict[p.topic][1] = p.value
    else:
        classMaxMinDict[p.topic] = [-999, 999]
print(classMaxMinDict)

ratioList = []
countList = []
outputPoints = []

for t in range(1000):
    c = 0.03
    originalDisks = copy.deepcopy(disks)

    estimates, sampleGroups, disks = ldbr(copy.deepcopy(points), 7000, len(classLocationDict.keys()), 0.05, c,
                                          disks)
    if estimates == None:
        ratioList.append(None)
        countList.append(None)
        continue
    count = 0
    for group in sampleGroups:
        for p in group:
            count += 1
    r1 = getRalationshipList(estimates)

    originalEstimates = getOriginalEstimates(copy.deepcopy(points), len(classLocationDict.keys()))
    r2 = getRalationshipList(originalEstimates)

    ratio = compareRelationshipList(r2, r1)
    print('采了{0}个'.format(str(count)))

    ratioList.append(ratio)
    countList.append(count)
    # print(countList)
    # random
    copyPoints = copy.deepcopy(points)
    randomPoints = []
    while len(randomPoints) < count:
        randomIndex = random.randint(0, len(copyPoints) - 1)
        randomPoint = copyPoints[randomIndex]
        copyPoints.remove(randomPoint)
        randomPoints.append(randomPoint)
    try:
        randomEstimates = getOriginalEstimates(randomPoints, len(classLocationDict.keys()))
        r3 = getRalationshipList(randomEstimates)
        ratio3 = compareRelationshipList(r2, r3)
    except Exception as e:
        continue

    pInDisks = []
    cccopyPoints = copy.deepcopy(points)
    while (len(pInDisks) < count):
        randomP = cccopyPoints[random.randint(0, len(cccopyPoints) - 1)]
        randomDisk = originalDisks[random.randint(0, len(originalDisks) - 1)]
        if randomDisk.count >= 1:
            continue
        if getGeoDistance(randomP, randomDisk) < randomDisk.r:
            randomDisk.count += 1
            pInDisks.append(randomP)
            cccopyPoints.remove(randomP)
            continue
    try:
        e4 = getOriginalEstimates(pInDisks, 10)
        r4 = getRalationshipList(e4)
        ratio4 = compareRelationshipList(r2, r4)
        print('我们的', '全随机', '蓝噪声随机')
        print(ratio, ratio3, ratio4)
        print('----------------------')
    except Exception as e:
        continue
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

        # print(str(ratioList))
        # print(str(countList))
