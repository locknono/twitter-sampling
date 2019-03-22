import json
import g
from docAlgo.runDoc2vec import runDoc2vec
from docAlgo.runTsne import runTsne
from docAlgo.runKmeans import runKmeans
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud, readJsonFile, \
    getHexes, getRiverData
import os
from blueRapidEstimate import getRalationshipList, compareRelationshipList
from ldbr import ldbr
from shared.getLdbrData import getLdbrPoints, getOriginalEstimates, getSamplingIDs
from shared.constant import nyBound
import copy

if __name__ == '__main__':
    idTextDict = {}
    riverIDTimeDict = {}
    with open(g.dataPath + 'extractedData.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            time = line[2].split(' ')[0].replace('-', '/')
            id = line[0]
            riverIDTimeDict[id] = time
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

    points = getLdbrPoints(idLocationDict, idScatterData, idTimeDict, idClassDict)
    c = 0.05
    estimates, sampleGroups = ldbr(copy.deepcopy(points), g.topicNumber, 1000, 0.05, c, 0.0005)

    if estimates != None or sampleGroups != None:
        originalEstimates = getOriginalEstimates(points, g.topicNumber)

        r1 = getRalationshipList(estimates)
        r2 = getRalationshipList(originalEstimates)
        ratio = compareRelationshipList(r2, r1)
        samplingIDs = getSamplingIDs(sampleGroups)
        print(ratio)
        print(len(samplingIDs))

        barData = {"original": originalEstimates, "sampling": estimates}
        writeToJsonFile(barData, '../client/public/barData.json')
        writeToJsonFile(barData, g.dataPath + 'barData.json')

        samplingMapPoints = getMapPoints(idLocationDict, idClassDict, samplingIDs)
        writeToJsonFile(samplingMapPoints, '../client/public/samplingMapPoints.json')
        writeToJsonFile(samplingMapPoints, g.dataPath + 'samplingMapPoints.json')

        samplingScatterPoints = getScatterPoints(idScatterData, idClassDict, samplingIDs)
        writeToJsonFile(samplingScatterPoints, '../client/public/samplingScatterPoints.json')
        writeToJsonFile(samplingScatterPoints, g.dataPath + 'samplingScatterPoints.json')

        samplingCloudData = getWordCloud(idTextDict, idClassDict, g.topicNumber, samplingIDs)
        writeToJsonFile(samplingCloudData, '../client/public/samplingCloudData.json')
        writeToJsonFile(samplingCloudData, g.dataPath + 'samplingCloudData.json')

        samplingRiverData = getRiverData(riverIDTimeDict, idClassDict, samplingIDs)
        writeToJsonFile(samplingRiverData, '../client/public/samplingRiverData.json')
        writeToJsonFile(samplingRiverData, g.dataPath + 'samplingRiverData.json')

        samplingHex = getHexes(nyBound, idClassDict, samplingIDs)
        writeToJsonFile(samplingRiverData, '../client/public/samplingRiverData.json')
        writeToJsonFile(samplingRiverData, g.dataPath + 'samplingRiverData.json')
