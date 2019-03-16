import g
import json
import csv
from itertools import islice
from ldbr9 import ldbr, Point
import math
import shortuuid
from typing import List
from ldbr9 import getGeoDistance
import random
from blueRapidEstimate import getRalationshipList, compareRelationshipList
import copy
from ldbrTest import getOriginalEstimates
from shared.lda_op import fetchIDLdaDict, findMaxIndexAndValueForOneDoc, showBarChart, saveBarChart
import g
import os
from sklearn.cluster import KMeans
import numpy as np


with open(g.ldaDir + 'scatterData.json', 'r', encoding='utf-8') as f:
    scatterData = json.loads(f.read())
    kmeansData = []
    idList = []
    for k in scatterData:
        idList.append(k)
        kmeansData.append(scatterData[k])
    kmeans = KMeans(n_clusters=9, random_state=0).fit(kmeansData)
    classList = kmeans.labels_
    idClassDict={}
    for index,id in enumerate(idList):
        point={"coord":scatterData[id],"topic":classList[index]}
        idClassDict[id]=point
    with open(g.ldaDir+'idKmeansClassDict.json','w', encoding='utf-8') as wf:
        wf.write(json.dumps(idClassDict))

        
idLocationDict = None
with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8') as f:
    idLocationDict = json.loads(f.read())

idLdaDict = fetchIDLdaDict(g.ldaDir + 'idLdaDict.json')

points = []
for k in idLdaDict:
    maxIndex, maxV = findMaxIndexAndValueForOneDoc(idLdaDict[k])
    p = Point(k, idLocationDict[k][0], idLocationDict[k][1], maxV, maxIndex)
    points.append(p)

ratioList = []
countList = []
outputPoints = []

for t in range(30):
    c = 0.05
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
    print(randomCount)
    samplingEstimates = getOriginalEstimates(samplingPoints, g.topicNumber)
    #print('samplingEstimates:' + str(samplingEstimates))
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
