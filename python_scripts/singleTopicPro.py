import json
import g
import numpy as np
import matplotlib.pyplot as plt
from iter import saveProbablityBarChart
import random
from blueRapidEstimate import getRalationshipList, compareRelationshipList
import copy
import logging

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.INFO)


def getTopicProSumList(idLdaDict, name):
    topicProList = np.full(g.topicNumber, 0).tolist()
    for k in idLdaDict:
        maxV = -1
        maxIndex = -1
        for i, v in enumerate(idLdaDict[k]):
            topicProList[i] += v
    return topicProList


def getTopicCount(idLdaDict):
    topicProList = np.full(g.topicNumber, 0).tolist()
    tmpList = np.full(g.topicNumber, 0).tolist()
    topicLdaDict = {}
    count = 0
    for k in idLdaDict:
        count += 1
        maxV = -1
        maxIndex = -1
        for i, v in enumerate(idLdaDict[k]):
            if v > maxV:
                maxV = v
                maxIndex = i

        if maxIndex in topicLdaDict:
            tmpList[maxIndex] += maxV
            topicLdaDict[maxIndex].append(idLdaDict[k])
        else:
            topicLdaDict[maxIndex] = []
        topicProList[maxIndex] += 1
    counts = [i for i in topicProList]

    plt.bar(range(len(tmpList)), topicProList)
    plt.savefig(g.ldaDir + 'tmp.png')
    plt.close()

    return [counts, topicLdaDict]


if __name__ == '__main__':
    rate = 0.05
    l1 = None
    l2 = None
    with open(g.ldaDir + 'idLdaDict.json', 'r', encoding='utf-8') as f:
        idLdaDict = json.loads(f.read())
        l1 = getTopicProSumList(idLdaDict, 'ori.png')
    print(l1)
    counts, topicLdaDict = getTopicCount(idLdaDict)
    print(counts)
    print(topicLdaDict)
    kList = []
    for k in idLdaDict:
        kList.append(k)

    ratioList = []

    for time in range(99):
        td = copy.deepcopy(topicLdaDict)
        l2 = np.full(g.topicNumber, 0).tolist()
        logging.info('counts：' + str(counts))
        for index, count in enumerate(counts):
            sCount = int(count * rate)
            for i in range(sCount):
                allLdalist = td[index]
                randomIndex = random.randint(0, len(allLdalist) - 1)
                for m, v in enumerate(allLdalist[randomIndex]):
                    l2[m] += v
                allLdalist.pop(randomIndex)

        r1 = getRalationshipList(l1)
        r2 = getRalationshipList(l2)
        ratio = compareRelationshipList(r1, r2)
        ratioList.append(round(ratio, 2))

        print(ratioList)
    """
    for m in range(100):
        kl = copy.deepcopy(kList)
        randomDict = {}
        for i in range(0, int(rate * (len(idLdaDict.keys())))):
            index = random.randint(0, len(kl) - 1)
            key = kl[index]
            randomDict[key] = idLdaDict[key]
            kl.pop(index)
        l2 = showDict(randomDict, 'random-{0}.png'.format(rate))

        r1 = getRalationshipList(l1)
        r2 = getRalationshipList(l2)
        ratio = compareRelationshipList(r1, r2)
        ratioList.append(round(ratio, 2))
    """
