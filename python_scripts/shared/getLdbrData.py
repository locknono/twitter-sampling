import json
import g
from docAlgo.runDoc2vec import runDoc2vec
from docAlgo.runTsne import runTsne
from docAlgo.runKmeans import runKmeans
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud, readJsonFile, \
    getHexes
import os
from ldbr import Point
import math
from typing import List


def getLdbrPoints(idLocationDict, idScatterData, idTimeDict, idClassDict, ids=None):
    if ids == None:
        ids = idLocationDict.keys()
    centers = getCenters(idScatterData, idClassDict, ids)
    minDis, maxDis = getMinMaxDis(idScatterData, centers, idClassDict, ids)
    points = []
    for id in ids:
        p = idScatterData[id]
        topic = idClassDict[id]
        x = p[0]
        y = p[1]
        dis = math.sqrt(math.pow(x - centers[topic][0], 2) + math.pow(y - centers[topic][1], 2))
        dis = (dis - minDis) / (maxDis - minDis)
        time = idTimeDict[id]
        p = Point(id, idLocationDict[id][0], idLocationDict[id][1], dis, topic, time)
        points.append(p)
    return points


def getMinMaxDis(idScatterData, centers, idClassDict, ids=None):
    if ids == None:
        ids = idScatterData.keys()
    minDis = 999999
    maxDis = -1
    for id in ids:
        p = idScatterData[id]
        topic = idClassDict[id]
        x = p[0]
        y = p[1]
        dis = math.sqrt(math.pow(x - centers[topic][0], 2) + math.pow(y - centers[topic][1], 2))
        if dis < minDis:
            minDis = dis
        if dis > maxDis:
            maxDis = dis
    return [minDis, maxDis]


def getCenters(idScatterData, idClassDict, ids=None):
    if ids == None:
        ids = idScatterData.keys()
    centers = [[0, 0] for i in range(g.topicNumber)]
    topicCounts = [0 for i in range(g.topicNumber)]
    for id in ids:
        p = idScatterData[id]
        topic = idClassDict[id]
        centers[topic][0] += p[0]
        centers[topic][1] += p[1]
        topicCounts[topic] += 1
    for i in range(g.topicNumber):
        centers[i][0] = centers[i][0] / topicCounts[i]
        centers[i][1] = centers[i][1] / topicCounts[i]
    return centers


def getSamplingIDs(sampleGroups):
    samplingIDs = []
    for group in sampleGroups:
        for p in group:
            samplingIDs.append(p.id)
    return samplingIDs


def getOriginalEstimates(points: List[Point], topicCount=g.topicNumber):
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
