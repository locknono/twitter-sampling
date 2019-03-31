import json
import g
from docAlgo.runDoc2vec import runDoc2vec
from docAlgo.runTsne import runTsne
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud, readJsonFile, \
    getHexes
import os

if __name__ == '__main__':

    common_texts = []
    ids = []
    idLocationDict = None
    idTextDict = {}
    idTimeDict = readJsonFile(g.dataPath + 'idTimeDict.json')
    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8')as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            id = line[0]
            text = line[1]
            words = text.split(' ')
            common_texts.append(words)
            ids.append(id)
            idTextDict[id] = text

    with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8')as f:
        idLocationDict = json.loads(f.read())

    # docResultDir = g.dataPath + 'v={0}_epochs={1}/'.format(vectorSize, epochs)
    docResultDir = g.dataPath

    try:
        os.mkdir(docResultDir)
    except Exception as e:
        pass

    idVectorDict = runDoc2vec(texts=common_texts, ids=ids, vectorSize=vectorSize, epochs=epochs)
    writeToJsonFile(idVectorDict, docResultDir + 'idVectorDict.json')

    idScatterData = runTsne(idVectorDict)
    writeToJsonFile(idScatterData, docResultDir + 'idScatterData.json')

    # idScatterData = readJsonFile(docResultDir + 'idScatterData.json')

    idClassDict = readJsonFile(docResultDir + 'idClassDict.json')
    # idClassDict = runKmeans(idScatterData, 3)
    writeToJsonFile(idClassDict, docResultDir + 'idClassDict.json')

    scatterPoints = getScatterPoints(idScatterData, idClassDict)
    writeToJsonFile(scatterPoints, docResultDir + 'scatterPoints.json')
    writeToJsonFile(scatterPoints, '../client/public/scatterPoints.json')

    mapPoints = getMapPoints(idLocationDict, idClassDict)
    writeToJsonFile(mapPoints, docResultDir + 'mapPoints.json')
    writeToJsonFile(mapPoints, '../client/public/mapPoints.json')

    cloudData = getWordCloud(idTextDict, idClassDict, g.topicNumber)
    writeToJsonFile(cloudData, docResultDir + 'allWordCloudData.json')
    writeToJsonFile(cloudData, '../client/public/allWordCloudData.json')

    oneDimensionHexes = getHexes([[40.9328129198744, -74.32278448250146], [40.49040846908216, -73.73446653597058]],
                                 idLocationDict)
    writeToJsonFile(oneDimensionHexes, g.dataPath + 'hex.json')
    writeToJsonFile(oneDimensionHexes, '../client/public/hex.json')
