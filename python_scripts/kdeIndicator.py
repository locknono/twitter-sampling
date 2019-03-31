import math
from ldbr import getKDE, setRadius


def getKDEIndicator(p1, p2):
    s = p1.kdeValue * math.log((p1.kdeValue / p2.kdeValue), math.e)
    return s


def getKL(samplingPoints, points):
    samplingKDE = getKDE(samplingPoints)
    for p in samplingPoints:
        setRadius(p, 300, samplingKDE)
    sum = 0
    values = []
    for p1 in samplingPoints:
        for p2 in points:
            if p1.id == p2.id:
                value = getKDEIndicator(p1, p2)
                values.append([p1.kdeValue, p2.kdeValue])
                sum += value
                continue
    return sum
