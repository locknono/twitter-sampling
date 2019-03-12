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


if __name__ == '__main__':
    tempTopicDict = {}
    idLocationDict = None
    latlngs = []
    points = []
    topicCount = 5
    topicCountDict = {}
    topicDict = {}
    with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8') as f:
        idLocationDict = json.loads(f.read())
        for k in idLocationDict:
            latlngs.append(idLocationDict[k])
    with open(g.dataPath + 'coordinate_dbs_dm_1_s_200_i_400_0.9_0.5.csv', 'r', encoding='utf-8') as f:
        csvReader = csv.reader(f)
        for line in islice(csvReader, 1, None):
            x = float(line[0])
            y = float(line[1])
            topic = int(line[2])
            if topic in tempTopicDict:
                tempTopicDict[topic].append([x, y])
            else:
                tempTopicDict[topic] = [[x, y]]

            if topic in topicCountDict:
                topicCountDict[topic] += 1
            else:
                topicCountDict[topic] = 1
        sortedEntries = sorted(topicCountDict.items(), key=lambda x: x[1], reverse=True)
        for i in range(topicCount):
            topicDict[i] = tempTopicDict[sortedEntries[i][0]]

    for k in topicDict:
        centerX = 0
        centerY = 0
        for p in topicDict[k]:
            centerX += p[0]
            centerY += p[1]
        centerX /= len(topicDict[k])
        centerY /= len(topicDict[k])
        for p in topicDict[k]:
            dis = math.sqrt(math.pow(centerX - p[0], 2) + math.pow(centerX - p[1], 2))
            if len(latlngs) > 0:
                point = Point(shortuuid.uuid(), latlngs[0][0], latlngs[0][1], dis, k)
                points.append(point)
                latlngs.pop(0)
            else:
                continue
    min = 99999
    max = -1
    for p in points:
        if p.value > max:
            max = p.value
        if p.value < min:
            min = p.value
    for p in points:
        ratio = (p.value - min) / (max - min)
        p.value = ratio * 1
    ratioList = []
    countList = []
    for c in [0.2]:
        estimates, sampleGroups = ldbr(copy.deepcopy(points), 100, topicCount, 0.05, c)
        if (estimates == None):
            print('fail')
            continue
        originalEstimates = getOriginalEstimates(copy.deepcopy(points), topicCount)
        r1 = getRalationshipList(estimates)
        r2 = getRalationshipList(originalEstimates)
        ratio = compareRelationshipList(r1, r2)
        count = 0
        for g in sampleGroups:
            for p in g:
                count += 1
        print(count)
        ratioList.append(ratio)
        countList.append(count)
        print(str(ratioList))
        print(str(countList))
