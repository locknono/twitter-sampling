import math


def getKDEIndicator(p1, p2):
    s = p1.kdeValue * math.log((p1.kdeValue / p2.kdeValue), math.e)
    return s
