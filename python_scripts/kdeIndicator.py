import math


def getKDEIndicator(p1, p2):
    print(p1.kdeValue,p2.kdeValue)
    s = p1.kdeValue * math.log((p1.kdeValue / p2.kdeValue), math.e)
    print(s)
    return s
