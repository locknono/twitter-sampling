import json

import g

import matplotlib.pyplot as plt
from iter import saveProbablityBarChart


def getOrderedProbabilityList(topicProbabilityDict):
    orderedProbabilityList = []
    for key in sorted(topicProbabilityDict):
        orderedProbabilityList.append(topicProbabilityDict[key])
    return orderedProbabilityList


def showProbablityBarChart(topicProbabilityDict):
    orderedProbabilityList = getOrderedProbabilityList(topicProbabilityDict)
    plt.bar(range(len(orderedProbabilityList)), orderedProbabilityList)
    plt.show()


if __name__ == '__main__':
    with open(g.ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        topicProbabilityDict = {}
        for index, line in enumerate(f):
            maxValue = -1
            maxIndex = -1
            line = line.strip('\n')
            line = line.replace('(', '[').replace(')', ']')
            line = json.loads(line)
            for item in line:
                if item[1] > maxValue:
                    maxValue = item[1]
                    maxIndex = item[0]
            if maxIndex in topicProbabilityDict:
                topicProbabilityDict[maxIndex] += maxValue
            else:
                topicProbabilityDict[maxIndex] = maxValue
        saveProbablityBarChart(topicProbabilityDict, 'single.png')
