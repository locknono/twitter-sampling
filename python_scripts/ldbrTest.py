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
from shared.generateRenderData import readJsonFile, writeToJsonFile
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


idLocationDict = None
scatterData = None
scatterPoints = None
with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8') as f:
    idLocationDict = json.loads(f.read())
with open(g.dataPath + 'scatterPoints.json', 'r', encoding='utf-8') as f:
    scatterPoints = json.loads(f.read())

centers = [[0, 0] for i in range(g.topicNumber)]
topicCounts = [0 for i in range(g.topicNumber)]
for index, p in enumerate(scatterPoints):
    topic = p['topic']
    centers[topic][0] += p['x']
    centers[topic][1] += p['y']
    topicCounts[topic] += 1
for i in range(g.topicNumber):
    centers[i][0] = centers[i][0] / topicCounts[i]
    centers[i][1] = centers[i][1] / topicCounts[i]

idClassDict = readJsonFile(g.dataPath + 'idClassDict.json')
idTimeDict = readJsonFile(g.dataPath + 'idTimeDict.json')

minDis = 999999
maxDis = -1
for p in scatterPoints:
    topic = p['topic']
    x = p['x']
    y = p['y']
    dis = math.sqrt(math.pow(x - centers[topic][0], 2) + math.pow(y - centers[topic][1], 2))
    if dis < minDis:
        minDis = dis
    if dis > maxDis:
        maxDis = dis

points = []
for p in scatterPoints:
    id = p['id']
    time = idTimeDict[id]
    topic = p['topic']
    x = p['x']
    y = p['y']
    dis = math.sqrt(math.pow(x - centers[topic][0], 2) + math.pow(y - centers[topic][1], 2))
    dis = (dis - minDis) / (maxDis - minDis)
    p = Point(p['id'], idLocationDict[p['id']][0], idLocationDict[p['id']][1], dis, topic, time)
    points.append(p)
print('all points ready')

ratioList = []
countList = []
outputPoints = []

for t in range(30):
    c = 0.05
    originalEstimates = getOriginalEstimates(copy.deepcopy(points), g.topicNumber)
    saveBarChart(originalEstimates, g.dataPath + 'original.png')

    estimates, sampleGroups = ldbr(copy.deepcopy(points), g.topicNumber, 1000, 0.05, c,5)
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
    print(randomCount)
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

    for group in sampleGroups:
        for p in group:
            outputP = {"id": p.id, "r": p.r, "lat": p.lat, "lng": p.lng, "isDisk": p.isDisk}
            outputPoints.append(outputP)

    try:
        os.mkdir(g.dataPath + 'ldbrResult/')
    except Exception as e:
        pass

    with open(g.dataPath + 'ldbrResult/ldbrPoints-{0}-{1}.json'.format(count, ratio), 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputPoints))
    with open('../client/public/ldbrPoints.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputPoints))

    barData = {"original": originalEstimates, "sampling": samplingEstimates}

    with open(g.dataPath + 'ldbrResult/barData-{0}-{1}.json'.format(count, ratio), 'w', encoding='utf-8') as f:
        f.write(json.dumps(barData))
    with open('../client/public/barData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(barData))

    print(str(ratioList))
    print(str(countList))
