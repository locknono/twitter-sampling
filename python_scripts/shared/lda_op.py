import matplotlib.pyplot as plt
import numpy as np
import json

def showBarChart(list):
    plt.bar(range(len(list)), list)
    plt.show()
    plt.close()


def saveBarChart(list, path):
    plt.bar(range(len(list)), list)
    plt.savefig(path)
    plt.close()


def findMaxIndexAndValueForOneDoc(list):
    maxV = -1
    maxIndex = -1
    for i, v in enumerate(list):
        if v > maxV:
            maxV = v
            maxIndex = i
    return [maxIndex, maxV]


def getTopicProSumList(idLdaDict):
    dimension = None
    for k in idLdaDict:
        dimension = len(idLdaDict[k])
        break
    topicProSumList = np.full(dimension, 0.0)
    for k in idLdaDict:
        curDocList = np.array(idLdaDict[k])
        topicProSumList += curDocList
    return topicProSumList.tolist()


def fetchIDLdaDict(url):
    idLdaDict = None
    with open(url, 'r', encoding='utf-8') as f:
        idLdaDict = json.loads(f.read())
    return idLdaDict
