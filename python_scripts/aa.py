import json
import g
import numpy as np
import matplotlib.pyplot as plt
from iter import saveProbablityBarChart
import random
from blueRapidEstimate import getRalationshipList, compareRelationshipList
import copy
import logging
import math
from shared.lda_op import findMaxIndexAndValueForOneDoc, getTopicProSumList

proDict = {}
countDict = {}
diffDict = {}
with open(g.ldaDir + 'idLdaDict.json', 'r', encoding='utf-8') as f:
    idLdaDict = json.loads(f.read())

    for id in idLdaDict:
        maxIndex, maxValue = findMaxIndexAndValueForOneDoc(idLdaDict[id])
        try:
            proDict[maxIndex] += maxValue
            countDict[maxIndex] += 1
            diffDict[maxIndex].append(maxValue)
        except KeyError as e:
            proDict[maxIndex] = maxValue
            countDict[maxIndex] = 1
            diffDict[maxIndex] = []

    for k in proDict:
        proDict[k] = proDict[k] / countDict[k]

    for k in diffDict:
        max = -1
        min = 999
        for v in diffDict[k]:
            if v > max:
                max = v
            if v < min:
                min = v
        diffDict[k] = max - min

cs = []
for m in range(1, 10000):
    a = math.pow(math.log(m, 2), 2)
    c = a / m
    cs.append(c)

css = []
for m in range(2, 10000):
    c = math.sqrt((2 * math.log(math.log(m, 2), 2) + math.log((math.pow(math.pi, 2) * 1000 / (3 * 0.05)), 2)) / (2 * m))
    css.append(c)
plt.bar(range(len(css)),css)
plt.show()
