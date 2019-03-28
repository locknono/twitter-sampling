import codecs
import g
import os
import random
from shared.generateRenderData import readJsonFile
import json


def matchFinalAndOriginal():
    idTextDict = {}
    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            id = line[0]
            text = line[1]
            idTextDict[id] = text

    idTextDict2 = {}
    with open(g.dataPath + 'finalExtractedData.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            id = line[0]
            text = line[1]
            idTextDict2[id] = text

    with open(g.dataPath + 'originalTexts.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(idTextDict2))

    with open(g.dataPath + 'matchText.txt', 'w', encoding='utf-8') as f:
        for id in idTextDict:
            f.write(id + '\n' + idTextDict[id] + '\n' + idTextDict2[id] + '\n\n')


def filterShortText():
    textSet = set()
    textIDDict = {}
    with open(g.dataPath + 'processedData.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            if len(line) == 1:
                continue
            if len(line[1].split(' ')) <= 3:
                continue
            textSet.add(line[1])
            textIDDict[line[1]] = line[0]
    wf = codecs.open(g.dataPath + 'finalText.txt', 'w', encoding='utf-8')
    for text in textSet:
        wf.write(textIDDict[text] + '\t' + text + '\t\n')


if __name__ == '__main__':
    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)
    filterShortText()
    matchFinalAndOriginal()
