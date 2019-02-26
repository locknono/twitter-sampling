import json
import g
import csv
from itertools import islice

idTrueDict = {}
with open(g.dataPath + 'extractedDataInAllAreaSingleThread.txt', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip('\t\n').split('\t')
        id = line[0]
        trueFlag = line[5]
        idTrueDict[id] = trueFlag

with open(g.dataPath + 'finalIDLocation.csv', 'r', encoding='utf-8') as f:
    csvF = csv.reader(f)
    trueCount = 0
    lineCount = 0
    for line in islice(csvF, 1, None):
        id = line[0]
        trueFlag = idTrueDict[id]
        if trueFlag == 'True':
            trueCount += 1
