import codecs
import g
import os
import random
if __name__ == '__main__':
    textCount = random.randint(80000, 90000)
    textSet = set()
    textIDDict = {}
    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)
    with open(g.dataPath + 'processedData.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            if len(line[1].split(' ')) <= 3:
                continue
            textSet.add(line[1])
            textIDDict[line[1]] = line[0]
    wf = codecs.open(g.dataPath + 'finalText.txt', 'w', encoding='utf-8')
    lineCount=0
    for text in textSet:
        lineCount+=1
        if lineCount>textCount:
            break
        wf.write(textIDDict[text] + '\t' + text + '\t\n')
