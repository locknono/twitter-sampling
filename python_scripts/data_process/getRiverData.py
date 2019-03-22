import g
import json
import os
import sys

from shared.lda_op import findMaxIndexAndValueForOneDoc


def getRiverData(idTimeDict, idClassDict, ids=None):
    if ids == None:
        ids = idClassDict.keys()
    topicTimeValueDict = {}
    for id in ids:
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
    idTimeDict = {}
    topicTimeValueDict = {}
    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)

    with open(g.dataPath + 'extractedData.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            time = line[2].split(' ')[0].replace('-', '/')
            id = line[0]
            idTimeDict[id] = time
    with open(g.dataPath + 'idClassDict.json', 'r', encoding='utf-8') as f:
        idClassDict = json.loads(f.read())
        riverData = getRiverData(idTimeDict, idClassDict)

    with open(g.dataPath + 'riverData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(riverData))

    with open('../client/public/riverData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(riverData))
