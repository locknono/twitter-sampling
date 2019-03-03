from typing import List


def getRalationshipList(estimates: List[float]):
    ls = []
    for i in range(len(estimates)):
        for j in range(i, len(estimates)):
            if estimates[i] > estimates[j]:
                ls.append(0)
            else:
                ls.append(1)
    return ls


def compareRelationshipList(l1, l2):
    equalCount = 0
    for i in range(len(l1)):
        if l1[i] == l2[i]:
            equalCount += 1
    return equalCount / len(l1)


def getTopicRelationsByIndex(estimates: List[float]):
    outputDict = {}
    for i in range(len(estimates)):
        outputDict[i] = []
        for j in range(0, len(estimates)):
            if estimates[i] > estimates[j]:
                outputDict[i].append(0)
            else:
                outputDict[i].append(1)
    return outputDict
