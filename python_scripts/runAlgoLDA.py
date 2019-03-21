import json
import g
from docAlgo.runDoc2vec import runDoc2vec
from docAlgo.runTsne import runTsne
from docAlgo.runKmeans import runKmeans
from docAlgo.runLDA import runLDA
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud, readJsonFile

if __name__ == '__main__':
    common_texts = []
    ids = []
    texts = []
    idTextDict = {}

    idLocationDict = readJsonFile(g.dataPath + 'finalIDLocation.json')

    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8')as f:
        for line in f:
            line = line.strip('\t\n').split('\t')

            id = line[0]
            ids.append(id)

            text = line[1]
            texts.append(text)

            idTextDict[id] = text

    idVectorDict = runLDA(texts, ids)

    idScatterData = runTsne(idVectorDict)
    writeToJsonFile(idScatterData, g.dataPath + 'idScatterData.json')

    idClassDict = runKmeans(idScatterData,g.topicNumber)
    writeToJsonFile(idClassDict, g.dataPath + 'idClassDict.json')

    scatterPoints = getScatterPoints(idScatterData, idClassDict)
    writeToJsonFile(scatterPoints, g.dataPath + 'scatterPoints.json')
    writeToJsonFile(scatterPoints, '../client/public/scatterPoints.json')

    mapPoints = getMapPoints(idLocationDict, idClassDict)
    writeToJsonFile(mapPoints, g.dataPath + 'mapPoints.json')
    writeToJsonFile(mapPoints, '../client/public/mapPoints.json')

    cloudData = getWordCloud(idTextDict, idClassDict, g.topicNumber)
    writeToJsonFile(cloudData, g.dataPath + 'allWordCloudData.json')
    writeToJsonFile(cloudData, '../client/public/allWordCloudData.json')