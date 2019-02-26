import json
import matplotlib.pyplot as plt
from itertools import islice
from itertools import combinations
import copy
import csv
import g
import time


def generateTopicProbabilityDict(probabilityForOneRow, topicProbabilityDict):
    for item in probabilityForOneRow:
        if item[0] in topicProbabilityDict:
            topicProbabilityDict[item[0]] += item[1]
        else:
            topicProbabilityDict[item[0]] = item[1]
    return topicProbabilityDict


def getOrderedProbabilityList(topicProbabilityDict):
    orderedProbabilityList = []
    for key in sorted(topicProbabilityDict):
        orderedProbabilityList.append(topicProbabilityDict[key])
    return orderedProbabilityList


def showProbablityBarChart(topicProbabilityDict):
    orderedProbabilityList = getOrderedProbabilityList(topicProbabilityDict)
    plt.bar(range(len(orderedProbabilityList)), orderedProbabilityList)
    plt.show()


def saveProbablityBarChart(topicProbabilityDict):
    orderedProbabilityList = getOrderedProbabilityList(topicProbabilityDict)
    plt.bar(range(len(orderedProbabilityList)), orderedProbabilityList)
    plt.savefig('../data/LDABarchart/{0}.png'.format(int(time.time())))


if __name__ == '__main__':
    with open('../data/LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        topicProbabilityDict = {}
        for line in f:
            line = line.strip('\n')
            line = line.replace('(', '[').replace(')', ']')
            line = json.loads(line)
            topicProbabilityDict = generateTopicProbabilityDict(line, topicProbabilityDict)
        saveProbablityBarChart(topicProbabilityDict, dir)
