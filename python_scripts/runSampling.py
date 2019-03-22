import json
import g
from docAlgo.runDoc2vec import runDoc2vec
from docAlgo.runTsne import runTsne
from docAlgo.runKmeans import runKmeans
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud, readJsonFile, \
    getHexes
import os
from ldbr import ldbr
from shared.getLdbrData import getLdbrPoints, saveLdbrData
import copy

if __name__ == '__main__':
    idLocationDict = readJsonFile(g.dataPath + 'finalIDLocation.json')
    idScatterData = readJsonFile(g.dataPath + 'idScatterData.json')
    idTimeDict = readJsonFile(g.dataPath + 'idTimeDict.json')
    idClassDict = readJsonFile(g.dataPath + 'idClassDict.json')

    ldbrPoints = getLdbrPoints(idLocationDict, idScatterData, idTimeDict, idClassDict)
    c = 0.05
    estimates, sampleGroups = ldbr(copy.deepcopy(ldbrPoints), g.topicNumber, 1000, 0.05, c, 0.0005)
