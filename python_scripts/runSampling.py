import json
import g
from docAlgo.runDoc2vec import runDoc2vec
from docAlgo.runTsne import runTsne
from docAlgo.runKmeans import runKmeans
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud, readJsonFile, \
    getHexes, getRiverData, saveAllSamplingData
import os
from blueRapidEstimate import getRalationshipList, compareRelationshipList
from ldbr import ldbr
from shared.getLdbrData import getLdbrPoints, getOriginalEstimates, getSamplingIDs
from shared.constant import nyBound
import copy
from ldbr import getKDE, setRadius
from kdeIndicator import getKDEIndicator
from randomSampling import getRandomIDs

if __name__ == '__main__':
    idTextDict = {}
    riverIDTimeDict = {}
    with open(g.dataPath + 'finalExtractedData.txt', 'r', encoding='utf-8') as f:
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
    maxRatio = -1
    for t in range(100):
        c = 0.03 + 0.005 * t
        copyPoints = copy.deepcopy(points)
        estimates, sampleGroups = ldbr(copyPoints, g.topicNumber, 1000, 0.08, c, 0.0005)

        """
        samplingPoints = []
        for sg in sampleGroups:
            for p in sg:
                samplingPoints.append(p)
        samplingKDE = getKDE(samplingPoints)
        for p in samplingPoints:
            setRadius(p, 1000, samplingKDE)
        sum = 0
        values = []
        for p1 in samplingPoints:
            for p2 in copyPoints:
                if p1.id == p2.id:
                    value = getKDEIndicator(p1, p2)
                    values.append([p1.kdeValue, p2.kdeValue])
                    sum += value
                    continue
        with open(g.dataPath + 'kdeValue.json', 'w', encoding='utf-8') as f:
            f.write(json.dumps({"sum": sum, "values": values}))
        """
        if estimates != None or sampleGroups != None:
            originalEstimates = getOriginalEstimates(points, g.topicNumber)

            r1 = getRalationshipList(estimates)
            r2 = getRalationshipList(originalEstimates)
            ratio = compareRelationshipList(r2, r1)
            samplingIDs = getSamplingIDs(sampleGroups)
            randomIDs = getRandomIDs(copy.deepcopy(points), len(samplingIDs))
            if ratio > maxRatio:
                path1 = '../client/public/'
                path2 = g.dataPath
                saveAllSamplingData(originalEstimates, estimates, idLocationDict, idClassDict, idScatterData,
                                    idTextDict,
                                    riverIDTimeDict, samplingIDs, path1, path2)

                randomPath1 = '../client/public/random'
                randomPath2 = g.dataPath + 'random/'
                saveAllSamplingData(originalEstimates, estimates, idLocationDict, idClassDict, idScatterData,
                                    idTextDict,
                                    riverIDTimeDict, randomIDs, randomPath1, randomPath2)

        else:
            print('sampling fail')
