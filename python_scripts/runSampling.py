import json
import g
from docAlgo.runDoc2vec import runDoc2vec
from docAlgo.runTsne import runTsne
from docAlgo.runKmeans import runKmeans
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud, readJsonFile, \
    getHexes
import os
from blueRapidEstimate import getRalationshipList, compareRelationshipList
from ldbr import ldbr
from shared.getLdbrData import getLdbrPoints, getOriginalEstimates, getSamplingIDs
import copy

if __name__ == '__main__':
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

        samplingMapPoints = getMapPoints(idLocationDict, idClassDict, samplingIDs)
        writeToJsonFile(samplingMapPoints, '../client/public/samplingMapPoints.json')

        samplingScatterPoints = getScatterPoints(idScatterData,idClassDict,samplingIDs)
        writeToJsonFile(samplingScatterPoints, '../client/public/samplingScatterPoints.json')
