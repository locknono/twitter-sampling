import g
import json
import os
import sys

from shared.lda_op import findMaxIndexAndValueForOneDoc
from shared.generateRenderData import getRiverData, readJsonFile

if __name__ == '__main__':
    idTimeDict = {}
    topicTimeValueDict = {}
    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)

    try:
        with open(g.dataPath + 'finalExtractedData.txt', 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip('\t\n').split('\t')
                time = line[2].split(' ')[0].replace('-', '/')
                id = line[0]
                idTimeDict[id] = time
    except:
        idTimeDict = readJsonFile(g.dataPath + 'riverIDTimeDict.json')
        for id in idTimeDict:
            idTimeDict[id] = idTimeDict[id].replace('-', '/')

    with open(g.dataPath + 'idClassDict.json', 'r', encoding='utf-8') as f:
        idClassDict = json.loads(f.read())
        riverData = getRiverData(idTimeDict, idClassDict)

    with open(g.dataPath + 'riverData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(riverData))

    with open('../client/public/riverData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(riverData))
