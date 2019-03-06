import json
import os
import g
import sys

cwd = os.getcwd()
wd = os.path.split(cwd)[0]
os.chdir(wd)
sys.path.append(wd + '/shared')
from lda_op import findMaxIndexAndValueForOneDoc


def sortByWordFrequncy(wordDict):
    sortedKList = sorted(wordDict.items(), key=lambda item: item[1], reverse=True)
    return sortedKList


if __name__ == '__main__':

    idLdaDict = None
    with open(g.ldaDir + 'idLdaDict.json', 'r', encoding='utf-8') as f1:
        idLdaDict = json.loads(f1.read())

    wordCloudData = []
    for k in idLdaDict:
        for i in range(len(idLdaDict[k])):
            wordCloudData.append({})
        break

    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8') as f2:
        for line in f2:
            line = line.strip('\t\n').split('\t')
            id = line[0]
            text = line[1]
            maxIndex, maxValue = findMaxIndexAndValueForOneDoc(idLdaDict[id])
            for word in text.split(' '):
                if word in wordCloudData[maxIndex]:
                    wordCloudData[maxIndex][word] += 1
                else:
                    wordCloudData[maxIndex][word] = 1
        allKList = []
        for i, d in enumerate(wordCloudData):
            sortedKList = sortByWordFrequncy(d)
            allKList.append(sortedKList)
            print(i)

        wordCount = 100

        renderData = []
        for i in range(len(allKList)):
            renderData.append([])
            for j in range(0, wordCount if len(allKList[i]) > wordCount else len(allKList[i])):
                word = allKList[i][j][0]
                fre = allKList[i][j][1]
                renderWord = {"text": word, "fre": fre}
                renderData[i].append(renderWord)

        with open('../client/public/allWordCloudData.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(renderData))
