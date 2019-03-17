import g
import json
import csv
from itertools import islice
from ldbr import ldbr, Point
import math
import shortuuid
from typing import List
from ldbr import getGeoDistance
import random
from blueRapidEstimate import getRalationshipList, compareRelationshipList
import copy
from shared.lda_op import fetchIDLdaDict, findMaxIndexAndValueForOneDoc, showBarChart, saveBarChart
import g
import os
from sklearn.cluster import KMeans
import numpy as np


def getOriginalEstimates(points: List[Point], topicCount: int):
    estimates = []
    counts = []
    for i in range(topicCount):
        estimates.append(0)
        counts.append(0)
    for p in points:
        estimates[p.topic] += p.value
        counts[p.topic] += 1
    for i in range(len(estimates)):
        estimates[i] = estimates[i] / counts[i]
    return estimates


idKmeansClassDict = None
with open(g.ldaDir + 'idKmeansClassDict.json', 'r', encoding='utf-8') as f:
    idKmeansClassDict = json.loads(f.read())
idLocationDict = None
with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8') as f:
    idLocationDict = json.loads(f.read())
idLdaDict = fetchIDLdaDict(g.ldaDir + 'idLdaDict.json')
centersX = []
centersY = []
centersCounts = []
for i in range(g.topicNumber):
    centersX.append(0)
    centersY.append(0)
    centersCounts.append(0)
for id in idKmeansClassDict:
    x = idKmeansClassDict[id]['coord'][0]
    y = idKmeansClassDict[id]['coord'][1]
    topic = idKmeansClassDict[id]['topic']
    centersX[topic] += x
    centersY[topic] += y
    centersCounts[topic] += 1
for i in range(len(centersX)):
    centersX[i] = centersX[i] / centersCounts[i]
    centersY[i] = centersY[i] / centersCounts[i]

minDis = 999999
maxDis = -1
for k in idKmeansClassDict:
    x = idKmeansClassDict[k]['coord'][0]
    y = idKmeansClassDict[k]['coord'][1]
    topic = idKmeansClassDict[k]['topic']
    dis = math.sqrt(math.pow(x - centersX[topic], 2) + math.pow(y - centersY[topic], 2))
    if dis > maxDis:
        maxDis = dis
    if dis < minDis:
        minDis = dis

points = []
for k in idLdaDict:
    x = idKmeansClassDict[k]['coord'][0]
    y = idKmeansClassDict[k]['coord'][1]
    topic = idKmeansClassDict[k]['topic']
    dis = math.sqrt(math.pow(x - centersX[topic], 2) + math.pow(y - centersY[topic], 2))
    normDis = (dis - minDis) / (maxDis - minDis)
    p = Point(k, idLocationDict[k][0], idLocationDict[k][1], normDis, topic)
    points.append(p)

ratioList = []
countList = []

centers = [[x, y] for x, y in zip(centersX, centersY)]
with open('../client/public/scatterCenters.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(centers))

print('all points ready')
for t in range(30):
    c = 0.07
    originalEstimates = getOriginalEstimates(copy.deepcopy(points), g.topicNumber)
    saveBarChart(originalEstimates, g.ldaDir + 'original.png')

    estimates, sampleGroups = ldbr(copy.deepcopy(points), g.topicNumber, 1000, 0.05, c)
    if estimates == None:
        ratioList.append(None)
        countList.append(None)
        continue
    samplingPoints = []
    count = 0
    randomCount = 0
    for group in sampleGroups:
        for p in group:
            samplingPoints.append(p)
            count += 1
            if p.isDisk == False:
                randomCount += 1
    samplingEstimates = getOriginalEstimates(samplingPoints, g.topicNumber)
    # print('samplingEstimates:' + str(samplingEstimates))
    r1 = getRalationshipList(samplingEstimates)
    # r1 = getRalationshipList(estimates)

    r2 = getRalationshipList(originalEstimates)
    print('originalEstimates:' + str(originalEstimates))

    ratio = compareRelationshipList(r2, r1)
    print('采了{0}个'.format(str(count)))

    ratioList.append(ratio)
    countList.append(count)

    copyPoints = copy.deepcopy(points)
    randomPoints = []
    while len(randomPoints) < count:
        randomPoint = copyPoints[random.randint(0, len(copyPoints) - 1)]
        copyPoints.remove(randomPoint)
        randomPoints.append(randomPoint)
    randomEstimates = getOriginalEstimates(copy.deepcopy(randomPoints), g.topicNumber)
    r3 = getRalationshipList(randomEstimates)
    randomRatio = compareRelationshipList(r2, r3)
    print('random:' + str(randomRatio))

    outputPoints = []
    for group in sampleGroups:
        for p in group:
            outputP = {"id": p.id, "r": p.r, "lat": p.lat, "lng": p.lng, "isDisk": p.isDisk}
            outputPoints.append(outputP)

    try:
        os.mkdir(g.ldaDir + 'ldbrResult/')
    except Exception as e:
        pass

    with open(g.ldaDir + 'ldbrResult/ldbrPoints-{0}-{1}.json'.format(count, ratio), 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputPoints))
    with open('../client/public/ldbrPoints.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputPoints))

    barData = {"original": originalEstimates, "sampling": samplingEstimates}

    with open(g.ldaDir + 'ldbrResult/barData-{0}-{1}.json'.format(count, ratio), 'w', encoding='utf-8') as f:
        f.write(json.dumps(barData))
    with open('../client/public/barData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(barData))

    print(str(ratioList))
    print(str(countList))
