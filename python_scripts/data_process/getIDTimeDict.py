import json
import g
import os



if __name__ == '__main__':
    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)

    idTimeDict = {}
    with open(g.dataPath + 'finalExtractedData.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            id = line[0]
            minute = int(line[5])
            idTimeDict[id] = minute

    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8') as f:
        outputIDTimeDict = {}
        for line in f:
            line = line.strip('\t\n').split('\t')
            id = line[0]
            outputIDTimeDict[id] = idTimeDict[id]
        with open(g.dataPath + 'idTimeDict.json', 'w', encoding='utf-8') as f:
            f.write(json.dumps(outputIDTimeDict))
