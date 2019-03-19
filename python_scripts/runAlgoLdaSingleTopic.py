import json
import g
import re
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
            try:
                line = line.strip('\t\n').split('\t')
                id = line[0]
                ids.append(id)
                text = line[1]
                words = text.split(' ')
                common_texts.append(words)
                idTextDict[id] = text
            except Exception as e:
                pass

    with open(g.dataPath + 'finalIDLocation.json', 'r', encoding='utf-8')as f:
        idLocationDict = json.loads(f.read())

    """
    idVectorDict = runDoc2vec(texts=common_texts, ids=ids)
    writeToJsonFile(idVectorDict, g.dataPath + 'idVectorDict.json')

    idScatterData = runTsne(idVectorDict)
    writeToJsonFile(idScatterData, g.dataPath + 'idScatterData.json')
    """
    idClassDict = {}
    with open(g.dataPath + 'LDALDA_document_to_topic_largest_NY_9(2).txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = re.sub(', ', ',', line).strip('\n')
            line = line.split('\t')
            topic = json.loads(line[0])[0]
            pro=json.loads(line[0])[1]
            if pro <0.5:
                continue
            id = line[1]
            idClassDict[id] = topic

    mapPoints = getMapPoints(idLocationDict, idClassDict)
    writeToJsonFile(mapPoints, g.dataPath + 'mapPoints.json')
    writeToJsonFile(mapPoints, '../client/public/mapPoints.json')

    cloudData = getWordCloud(idTextDict, idClassDict, g.topicNumber)
    writeToJsonFile(cloudData, g.dataPath + 'allWordCloudData.json')
    writeToJsonFile(cloudData, '../client/public/allWordCloudData.json')
