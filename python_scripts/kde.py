from sklearn.neighbors.kde import KernelDensity
import numpy as np
from shared.generateRenderData import readJsonFile
import g
from scipy import stats

idTimeDict = readJsonFile(g.dataPath + 'idTimeDict.json')
timeCountDict = {}
for id in idTimeDict:
    minute = idTimeDict[id]
    if minute in timeCountDict:
        timeCountDict[minute] += 1
    else:
        timeCountDict[minute] = 1
kdeData = []
for minute in timeCountDict:
    kdeData.append([minute, timeCountDict[minute]])
allLat = []
allLng = []
for p in [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [-2, 1], [-3, -2], [1, 1], [2, 1], [2, 1], [2, 1], [2, 1],
          [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [2, 1], [3, 2]]:
    allLat.append(p[0])
    allLng.append(p[1])
dataForKDE = np.vstack([allLat, allLng])
kde = stats.gaussian_kde(dataForKDE)
