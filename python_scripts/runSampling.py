import json
import g
from docAlgo.runDoc2vec import runDoc2vec
from docAlgo.runTsne import runTsne
from docAlgo.runKmeans import runKmeans
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud, readJsonFile, \
    getHexes, getRiverData, saveAllSamplingData, getHeatData
import os
from blueRapidEstimate import getRalationshipList, compareRelationshipList
from ldbr import ldbr
from shared.getLdbrData import getLdbrPoints, getOriginalEstimates, getSamplingIDs
from shared.constant import nyBound
import copy
from ldbr import getKDE, setRadius, getTimeKDE, setTimeRadius
from kdeIndicator import getKDEIndicator, getKL
from randomSampling import getRandomPointsAndIDs
from ldbrOnlySpace import ldbrOnlySpace
from blueNoise import blueNoise
import csv
from itertools import islice
import random
from scipy import stats
import numpy as np
import math
import json
import time
import g
import os
import logging


def getSamplingPoints(sampleGroups):
    ps = []
    for g in sampleGroups:
        for p in g:
            ps.append(p)
    return ps


if __name__ == '__main__':
    kl1 = None
    kl2 = None
    kl3 = None
    idTextDict = {}
    riverIDTimeDict = {}
    try:
        with open(g.dataPath + 'finalExtractedData.txt', 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip('\t\n').split('\t')
                time = line[2].split(' ')[0].replace('-', '/')
                id = line[0]
                riverIDTimeDict[id] = time
    except:
        riverIDTimeDict = readJsonFile(g.dataPath + 'riverIDTimeDict.json')
        for id in riverIDTimeDict:
            riverIDTimeDict[id] = riverIDTimeDict[id].replace('-', '/')
    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8')as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            id = line[0]
            text = line[1]
            idTextDict[id] = text
    idLocationDict = readJsonFile(g.dataPath + 'finalIDLocation.json')
    idScatterData = readJsonFile(g.dataPath + 'idScatterData.json')
    idTimeDict = readJsonFile(g.dataPath + 'idTimeDict.json')
    idClassDict = readJsonFile(g.dataPath + 'idClassDict.json')

    heatData = getHeatData(idLocationDict, idClassDict)
    writeToJsonFile(heatData, g.dataPath + 'heatData.json')
    writeToJsonFile(heatData, '../client/public/heatData.json')

    timeR = 0.00003
    spaceR = 300

    points = getLdbrPoints(idLocationDict, idScatterData, idTimeDict, idClassDict)

    kde = getKDE(points)
    timeKDE = getTimeKDE(points)
    for index, p in enumerate(points):
        setTimeRadius(p, timeR, timeKDE)
        setRadius(p, spaceR, kde)

    # print('set all radius')
    maxRatio = 0.7
    originalEstimates = getOriginalEstimates(points, g.topicNumber)
    r2 = getRalationshipList(originalEstimates)

    # blue noise
    maxBlueRatio = 1
    blueRatio = 1
    spaceR = spaceR * 250
    blueNoisePoints = None
    print('blue ready')
    while (blueRatio > maxRatio - 0.1 or spaceR > 500):
        try:
            print('start blue noise')
            spaceR = spaceR / 4
            blueNoisePoints = []
            for id in idClassDict:
                blueNoisePoints.append({"lat": idLocationDict[id][0], "lng": idLocationDict[id][1], "id": id})
            sampledBlueNoisePoints = blueNoise(blueNoisePoints, spaceR)

            bluePoints = []
            idSet = set()
            for p1 in sampledBlueNoisePoints:
                idSet.add(p1['id'])
            for p2 in copy.deepcopy(points):
                if p2.id not in idSet:
                    continue
                bluePoints.append(p2)
            blueIDs = [p.id for p in bluePoints]

            blueEstimates = getOriginalEstimates(bluePoints)
            blueRelation = getRalationshipList(blueEstimates)
            blueRatio = compareRelationshipList(r2, blueRelation)
            # print(len(bluePoints))
            # print('blue ratio:' + str(blueRatio))
            if blueRatio >= maxBlueRatio:
                continue
            maxBlueRatio = blueRatio
            path1 = '../client/public/blue/'
            path2 = g.dataPath + 'blue/'
            saveAllSamplingData(originalEstimates, blueEstimates, idLocationDict, idClassDict, idScatterData,
                                idTextDict,
                                riverIDTimeDict, blueIDs, path1, path2)
            print(len(blueIDs), blueRatio)
        except Exception as e:
            print(e)
    print(len(blueIDs), blueRatio)



    samplingIDs = None
    base = 0.03
    for t in range(30):
        c = base + 0.002 * t
        # print(c)
        copyPoints = copy.deepcopy(points)
        estimates, sampleGroups = ldbr(copyPoints, g.topicNumber, spaceR, 0.05, c, timeR)

        if estimates == None or sampleGroups == None:
            print('sampling fail')
            base -= 0.003
            continue

        r1 = getRalationshipList(estimates)
        ratio = compareRelationshipList(r2, r1)
        if ratio < maxRatio:
            continue

        maxRatio = ratio
        samplingIDs = getSamplingIDs(sampleGroups)
        samplingPoints = getSamplingPoints(sampleGroups)

        # kl = getKL(samplingPoints, copyPoints)

        path1 = '../client/public/'
        path2 = g.dataPath
        saveAllSamplingData(originalEstimates, estimates, idLocationDict, idClassDict, idScatterData,
                            idTextDict,
                            riverIDTimeDict, samplingIDs, path1, path2)
        if ratio > 0.9:
            # print(ratio)
            print(len(samplingIDs), ratio)
            kl1 = getKL(samplingPoints, copy.deepcopy(points))
            break

    # random
    minRandomRatio = 1
    randomTime = 0
    randomIDs = None
    while minRandomRatio > maxRatio - 0.1:
        randomTime += 1
        if randomTime > 50:
            break
        randomPoints, randomIDs = getRandomPointsAndIDs(copy.deepcopy(points), len(samplingIDs))
        randomEstimates = getOriginalEstimates(randomPoints, g.topicNumber)
        r3 = getRalationshipList(randomEstimates)
        randomRatio = compareRelationshipList(r2, r3)
        # print('randomRatio:' + str(randomRatio))
        if randomRatio < minRandomRatio:
            minRandomRatio = randomRatio
        else:
            continue
        randomPath1 = '../client/public/random/'
        randomPath2 = g.dataPath + 'random/'
        saveAllSamplingData(originalEstimates, randomEstimates, idLocationDict, idClassDict, idScatterData,
                            idTextDict,
                            riverIDTimeDict, randomIDs, randomPath1, randomPath2)
        if minRandomRatio < maxRatio - 0.1:
            kl2 = getKL(randomPoints, copy.deepcopy(points))
            # print(kl1, kl2)

    print(len(randomIDs), minRandomRatio)

    maxRatio = 0.7
    # only space
    # print('only  space')
    samplingPoints = None
    for t in range(30):
        c = base + 0.002 * t
        # print(c)
        copyPoints = copy.deepcopy(points)
        spaceEstimates, spaceSampleGroups = ldbrOnlySpace(copy.deepcopy(points), g.topicNumber, spaceR,
                                                          0.05, c)

        if spaceEstimates == None or spaceSampleGroups == None:
            # print('sampling fail')
            t -= 1
            continue

        r4 = getRalationshipList(spaceEstimates)
        ratio = compareRelationshipList(r2, r4)
        if ratio < maxRatio:
            # print(ratio)
            base -= 0.003
            continue

        maxRatio = ratio
        samplingIDs = getSamplingIDs(spaceSampleGroups)
        samplingPoints = getSamplingPoints(spaceSampleGroups)

        # kl = getKL(samplingPoints, copyPoints)

        path1 = '../client/public/space/'
        path2 = g.dataPath + 'space/'
        saveAllSamplingData(originalEstimates, spaceEstimates, idLocationDict, idClassDict, idScatterData,
                            idTextDict,
                            riverIDTimeDict, samplingIDs, path1, path2)
        if ratio > 0.9:
            # print('final space ratio:' + str(ratio))
            kl3 = getKL(samplingPoints, copy.deepcopy(points))
            with open(g.dataPath + 'kl.json', 'w', encoding='utf-8') as f:
                f.write(json.dumps({"spaceAndTime": kl1, "random": kl2, "onlySpace": kl3}))
            break
    print(len(samplingPoints), ratio)

    # blue noise
    maxBlueRatio = 1
    blueRatio = 1
    spaceR = spaceR * 250
    blueNoisePoints = None
    while (blueRatio > maxRatio - 0.1 or spaceR > 500):
        try:
            print('start blue noise')
            spaceR = spaceR / 4
            blueNoisePoints = []
            for id in idLocationDict:
                if id not in idClassDict:
                    continue
                blueNoisePoints.append({"lat": idLocationDict[id][0], "lng": idLocationDict[id][1], "id": id})
            sampledBlueNoisePoints = blueNoise(blueNoisePoints, spaceR)

            bluePoints = []
            idSet = set()
            for p1 in sampledBlueNoisePoints:
                idSet.add(p1['id'])
            for p2 in copy.deepcopy(points):
                if p2.id not in idSet:
                    continue
                bluePoints.append(p2)
            blueIDs = [p.id for p in bluePoints]

            blueEstimates = getOriginalEstimates(bluePoints)
            blueRelation = getRalationshipList(blueEstimates)
            blueRatio = compareRelationshipList(r2, blueRelation)
            # print(len(bluePoints))
            # print('blue ratio:' + str(blueRatio))
            if blueRatio >= maxBlueRatio:
                continue
            maxBlueRatio = blueRatio
            path1 = '../client/public/blue/'
            path2 = g.dataPath + 'blue/'
            saveAllSamplingData(originalEstimates, blueEstimates, idLocationDict, idClassDict, idScatterData,
                                idTextDict,
                                riverIDTimeDict, blueIDs, path1, path2)
            print(len(blueIDs), blueRatio)
        except Exception as e:
            print(e)
    print(len(blueIDs), blueRatio)
    # print(e)
