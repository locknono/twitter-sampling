import json
import matplotlib.pyplot as plt
from itertools import islice
from itertools import combinations
import copy
import csv
import g
import time
import math
import random
import numpy as np

maxRatio = 99999


def generateTopicProbabilityDict(probabilityForOneRow, topicProbabilityDict):
    for item in probabilityForOneRow:
        # speed up by `try-catch`,do not have to judge if the key exists every time
        try:
            topicProbabilityDict[item[0]] += item[1]
        except KeyError:
            topicProbabilityDict[item[0]] = item[1]
    return topicProbabilityDict


def avgTopicProbabilityDict(topicProbabilityDict, count):
    for k in topicProbabilityDict:
        topicProbabilityDict[k] = topicProbabilityDict[k] / count


def getOrderedProbabilityList(topicProbabilityDict):
    orderedProbabilityList = []
    for key in sorted(topicProbabilityDict):
        orderedProbabilityList.append(round(topicProbabilityDict[key], 4))
    return orderedProbabilityList


def showProbablityBarChart(topicProbabilityDict):
    orderedProbabilityList = getOrderedProbabilityList(topicProbabilityDict)
    plt.bar(range(len(orderedProbabilityList)), orderedProbabilityList)
    plt.show()


def saveProbablityBarChart(topicProbabilityDict, fileName):
    def autolabel(rects, xpos='center'):
        """
        Attach a text label above each bar in *rects*, displaying its height.

        *xpos* indicates which side to place the text w.r.t. the center of
        the bar. It can be one of the following {'center', 'right', 'left'}.
        """

        xpos = xpos.lower()  # normalize the case of the parameter
        ha = {'center': 'center', 'right': 'left', 'left': 'right'}
        offset = {'center': 0.5, 'right': 0.57, 'left': 0.43}  # x_txt = x + w*off

        for rect in rects:
            height = rect.get_height()
            ax.text(rect.get_x() + rect.get_width() * offset[xpos], 1.01 * height,
                    '{}'.format(round(height / 100, 3)), ha=ha[xpos], va='bottom')

    orderedProbabilityList = getOrderedProbabilityList(topicProbabilityDict)
    print(orderedProbabilityList)
    for i in range(len(orderedProbabilityList)):
        orderedProbabilityList[i] = round(orderedProbabilityList[i] * 100, 2)
    ind = [i for i in range(len(orderedProbabilityList))]
    width = 0.5
    fig, ax = plt.subplots()
    rects = ax.bar(ind, orderedProbabilityList, width,
                   color='SkyBlue')
    autolabel(rects, "center")
    # plt.bar(range(len(orderedProbabilityList)), orderedProbabilityList)
    # plt.axis()
    if fileName == 'None':
        plt.savefig('../data/LDABarchart/{0}.png'.format(int(time.time())))
    else:
        plt.savefig('../data/LDABarchart/{0}.png'.format(fileName))
    plt.close()


def getSizeRelationship(topicProbabilityDict):
    relationshipList = []
    orderedProbabilityList = getOrderedProbabilityList(topicProbabilityDict)
    for i in range(0, len(orderedProbabilityList)):
        for j in range(i + 1, len(orderedProbabilityList)):
            if (orderedProbabilityList[i] >= orderedProbabilityList[j]):
                relationshipList.append(1)
            else:
                relationshipList.append(0)
    return relationshipList


def getRatioRelationship(topicProbabilityDict):
    relationshipList = []
    orderedProbabilityList = getOrderedProbabilityList(topicProbabilityDict)
    for i in range(0, len(orderedProbabilityList)):
        for j in range(i + 1, len(orderedProbabilityList)):
            relationshipList.append(orderedProbabilityList[i] / orderedProbabilityList[j])
    return relationshipList


def compareRelationshipList(l1, l2):
    comparingList = []
    equalCount = 0
    for i in range(len(l1)):
        if (l1[i] == l2[i]):
            equalCount += 1
            comparingList.append(1)
        else:
            comparingList.append(0)
    return (equalCount / len(comparingList))


def compareRatioRelationshipList(l1, l2):
    diffSum = 0
    comparingList = []
    for i in range(len(l1)):
        comparingList.append(math.fabs(l1[i] - l2[i]))
    for diff in comparingList:
        diffSum += diff
    return diffSum


def saveNewLDAFig(idList, diffSum):
    indexList = []
    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8') as f:
        for index, line in enumerate(f):
            line = line.strip('\n').split('\t')
            if line[0] in idList:
                indexList.append(index)
    with open(g.ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        topicProbabilityDict = {}
        for index, line in enumerate(f):
            if index in indexList:
                line = line.strip('\n')
                line = line.replace('(', '[').replace(')', ']')
                line = json.loads(line)
                topicProbabilityDict = generateTopicProbabilityDict(line, topicProbabilityDict)
        avgTopicProbabilityDict(topicProbabilityDict, len(indexList))
        saveProbablityBarChart(topicProbabilityDict, diffSum)


def iterateForBestResult(points):
    global maxRatio
    activeIDList = []
    # replaceGroups will be a 2d array,the ids in each list could be replaced by each other
    replaceGroups = []

    figSaveDict = {}
    for i in range(100, 0, -1):
        figSaveDict[i] = False

    for index, p in enumerate(points):
        activeIDList.append(p['id'])
        replaceGroups.append([p['id']])
        for p2 in p['pointsInDisk']:
            replaceGroups[index].append(p2['id'])

    while (maxRatio > 0):
        cannotBetterList = []
        for index, id1 in enumerate(activeIDList):
            curDiskIDs = replaceGroups[index]
            copyActiveIDList = copy.deepcopy(activeIDList)
            for id2 in curDiskIDs:
                copyActiveIDList[index] = id2
                topicProbabilityDict = {}
                for textID in copyActiveIDList:
                    topicProbabilityDict = generateTopicProbabilityDict(idProbabilityDict[textID],
                                                                        topicProbabilityDict)
                avgTopicProbabilityDict(topicProbabilityDict, len(activeIDList))
                r2 = getRatioRelationship(topicProbabilityDict)
                ratio = compareRatioRelationshipList(r1, r2)
                if (ratio < maxRatio):
                    activeIDList = copyActiveIDList
                    maxRatio = ratio
                    print(maxRatio)
                    if figSaveDict[round(maxRatio)] == False:
                        figSaveDict[round(maxRatio)] = True
                        saveNewLDAFig(copyActiveIDList, maxRatio)
                        with open('../data/iter/bestIterResult-{0}.json'.format(ratio), 'w', encoding='utf-8') as f:
                            f.write(json.dumps(copyActiveIDList))
                    break
            else:
                cannotBetterList.append(index)
        print('len' + str(len(cannotBetterList)))
        """
        for index, p1 in enumerate(activePointList):
            print(index)
            for p2 in p1['pointsInDisk']:
                copyActiveIDList = copy.deepcopy(activeIDList)
                for i in range(len(copyActiveIDList)):
                    if copyActiveIDList[i] == p1['id']:
                        copyActiveIDList[i] = p2['id']
                        break
                topicProbabilityDict = {}
                for textID in copyActiveIDList:
                    topicProbabilityDict = generateTopicProbabilityDict(idProbabilityDict[textID], topicProbabilityDict)
                r2 = getRatioRelationship(topicProbabilityDict)
                ratio = compareRatioRelationshipList(r1, r2)
                if (ratio < maxRatio):
                    activeIDList = copyActiveIDList
                    maxRatio = ratio
                    print(maxRatio)
                    if maxRatio < 30:
                        saveNewLDAFig(copyActiveIDList, maxRatio)
                        with open('../data/iter/bestIterResult-{0}.json'.format(ratio), 'w', encoding='utf-8') as f:
                            f.write(json.dumps(copyActiveIDList))
                    break
                else:
                    continue
        """


if __name__ == '__main__':
    idProbabilityDict = {}
    r1 = None  # original relationship
    r2 = None  # relationship after sampling

    with open(g.ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r',
              encoding='utf-8') as f:
        topicProbabilityDict = {}
        count = 0
        for line in f:
            count += 1
            line = line.strip('\n')
            line = line.replace('(', '[').replace(')', ']')
            line = json.loads(line)
            topicProbabilityDict = generateTopicProbabilityDict(line, topicProbabilityDict)
        avgTopicProbabilityDict(topicProbabilityDict, count)
        saveProbablityBarChart(topicProbabilityDict, 'original')
        r1 = getRatioRelationship(topicProbabilityDict)

    with open(g.ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        randomIndexSet = set()
        while len(randomIndexSet) < 3003:
            randomIndexSet.add(random.randint(0, 12861))
        randomIndexList = list(randomIndexSet)
        topicProbabilityDict = {}
        for index, line in enumerate(f):
            if index in randomIndexList:
                line = line.strip('\n')
                line = line.replace('(', '[').replace(')', ']')
                line = json.loads(line)
                topicProbabilityDict = generateTopicProbabilityDict(line, topicProbabilityDict)
        avgTopicProbabilityDict(topicProbabilityDict, len(randomIndexList))
        saveProbablityBarChart(topicProbabilityDict, 'random')

    with open(g.ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        with open(g.dataPath + 'finalIDLocation.csv', 'r', encoding='utf-8') as idFile:
            csvIDFile = csv.reader(idFile)
            for t in zip(islice(csvIDFile, 1, None), f):
                l1, l2 = t[0], t[1]
                textID = l1[0]
                l2 = l2.strip('\n')
                l2 = l2.replace('(', '[').replace(')', ']')
                l2 = json.loads(l2)
                idProbabilityDict[textID] = l2

    with open(g.dataPath + 'blueNoise/samplePoints-500-2486-0.12737613362709432.json'
            , 'r', encoding='utf-8') as f:
        points = json.load(f)
        idList = []
        probabilityList = []
        for p in points:
            idList.append(p['id'])
        topicProbabilityDict = {}
        for textID in idList:
            topicProbabilityDict = generateTopicProbabilityDict(idProbabilityDict[textID], topicProbabilityDict)
        avgTopicProbabilityDict(topicProbabilityDict, len(idList))
        saveProbablityBarChart(topicProbabilityDict, 'afterSampling')
        r2 = getRatioRelationship(topicProbabilityDict)
        ratio = compareRatioRelationshipList(r1, r2)
        iterateForBestResult(points)
