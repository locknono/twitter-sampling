import json
import g
from docAlgo.runDoc2vec import runDoc2vec
from docAlgo.runTsne import runTsne
from docAlgo.runKmeans import runKmeans
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud

if __name__ == '__main__':
    common_texts = []
    ids = []
    idLocationDict = None
    idTextDict = {}
    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8')as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            if len(line)<2:
                continue
            id = line[0]
            text = line[1]
            words = text.split(' ')
            common_texts.append(words)
            ids.append(id)
            idTextDict[id] = text

    with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8')as f:
        idLocationDict = json.loads(f.read())

    idVectorDict = runDoc2vec(texts=common_texts, ids=ids)
    writeToJsonFile(idVectorDict, g.dataPath + 'idVectorDict.json')

    idScatterData = runTsne(idVectorDict)
    writeToJsonFile(idScatterData, g.dataPath + 'idScatterData.json')

    idClassDict = runKmeans(idScatterData)
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
