import g
import json
import os
import sys

from shared.lda_op import findMaxIndexAndValueForOneDoc

idTimeDict = {}
topicTimeValueDict = {}


def getRiverData():
    with open(g.dataPath + 'extractedData.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            time = line[2].split(' ')[0].replace('-', '/')
            id = line[0]
            idTimeDict[id] = time

    with open(g.ldaDir + 'idClassDict.json', 'r', encoding='utf-8') as f1:
        idClassDict = json.loads(f1.read())
        for id in idClassDict:
            maxIndex = idClassDict[id]
            time = idTimeDict[id]

            topicTimeTuple = (maxIndex, time)
            if topicTimeTuple in topicTimeValueDict:
                # topicTimeValueDict[topicTimeTuple] += maxValue
                topicTimeValueDict[topicTimeTuple] += 1
            else:
                # topicTimeValueDict[topicTimeTuple] = maxValue
                topicTimeValueDict[topicTimeTuple] = 1
    riverData = []
    for i in range(0, g.topicNumber):
        for k in topicTimeValueDict:
            topic = k[0]
            if topic != i:
                continue
            time = k[1]
            value = topicTimeValueDict[k]
            singleList = [time, value, str(topic)]
            riverData.append(singleList)
    return riverData


if __name__ == '__main__':
    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)

    riverData = getRiverData()

    with open(g.dataPath + 'riverData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(riverData))

    with open('../client/public/riverData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(riverData))
