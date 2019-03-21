import math
import g
from shared.generateRenderData import readJsonFile, writeToJsonFile

import operator
from functools import reduce


# bound:[[top,left],[bottom,right]]
# points:{[id:string]:[number,number]}
def getHexes(bound, idLocationDict, sideLength=None):
    top, left = bound[0]
    bottom, right = bound[1]
    if not sideLength:
        sideLength = (right - left) / 80

    ratio = math.cos((math.pi / 180) * 30)
    rowWidth = 2 * sideLength * ratio
    rowCount = int(math.floor(math.fabs(right - left) / rowWidth))
    colCount = int(math.floor(
        ((math.fabs(top - bottom) - 0.5 * sideLength) / (3 * sideLength)) * 2
    ))
    hexes = []
    for i in range(0, rowCount + 1):
        hexes.append([])
        for j in range(0, colCount + 1):
            hexes[i].append(0)
            if j % 2 == 0:
                lng = left + i * rowWidth
            else:
                lng = left + i * rowWidth + sideLength * ratio
            lat = top - 1.5 * j * sideLength
            p1 = [lat - sideLength / 2, lng - sideLength * ratio]
            p2 = [lat + sideLength / 2, lng - sideLength * ratio]
            p3 = [lat + sideLength, lng]
            p4 = [lat + sideLength / 2, lng + sideLength * ratio]
            p5 = [lat - sideLength / 2, lng + sideLength * ratio]
            p6 = [lat - sideLength, lng]
            path = [p1, p2, p3, p4, p5, p6, p1]
            hex = {"path": path, "value": 0}
            hexes[i][j] = hex
    for k in idLocationDict:
        lat = idLocationDict[k][0]
        lng = idLocationDict[k][1]
        j = round((top - lat) / (1.5 * sideLength))
        if j % 2 == 0:
            i = round((lng - left) / rowWidth)
        else:
            i = round((lng - left - sideLength * ratio) / rowWidth)
        hexes[i][j]['value'] += 1
        oneDimensionHexes = reduce(operator.add, hexes)
    return oneDimensionHexes


if __name__ == '__main__':
    idLocationDict = readJsonFile(g.dataPath + 'finalIDLocation.json')
    oneDimensionHexes = getHexes([[40.9328129198744, -74.32278448250146], [40.49040846908216, -73.73446653597058]],
                                 idLocationDict)
    writeToJsonFile(oneDimensionHexes, g.dataPath + 'hex.json')
    writeToJsonFile(oneDimensionHexes, '../client/public/hex.json')
