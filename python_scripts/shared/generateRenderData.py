import json
import math

def readJsonFile(path):
    with open(path, 'r', encoding='utf-8') as f:
        data=json.loads(f.read())
        return data

def writeToJsonFile(jsonData, path):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(json.dumps(jsonData))


def getScatterPoints(idScatterData, idClassDict):
    points = []
    for id in idScatterData:
        x = idScatterData[id][0]
        y = idScatterData[id][1]
        topic = idClassDict[id]
        point = {"id": id, "x": x, "y": y, "topic": topic}
        points.append(point)
    return points


def getMapPoints(idLocationDict, idClassDict):
    points = []
    for id in idLocationDict:
        try:
            lat = idLocationDict[id][0]
            lng = idLocationDict[id][1]
            topic = idClassDict[id]
            point = {"id": id, "lat": lat, "lng": lng, "topic": topic}
            points.append(point)
        except Exception as e:
            pass
    return points


def sortByWordFrequncy(wordDict):
    sortedKList = sorted(wordDict.items(), key=lambda item: item[1], reverse=True)
    return sortedKList


# texts:string[]
def getWordCloud(idTextDict, idClassDict, topicCount, ids=None):
    areaFlag = True
    if ids == None:
        areaFlag = False
    wordCloudData = []
    allCloudData = {}
    for i in range(topicCount):
        wordCloudData.append({})
    for tid in idTextDict:
        if areaFlag == True:
            if tid not in ids:
                continue
        text = idTextDict[tid]
        try:
            topic = idClassDict[tid]

            for word in text.split(' '):
                if word in wordCloudData[topic]:
                    wordCloudData[topic][word] += 1
                else:
                    wordCloudData[topic][word] = 1

                if word in allCloudData:
                    allCloudData[word] += 1
                else:
                    allCloudData[word] = 1
        except:
            pass
    allKList = []
    for i, d in enumerate(wordCloudData):
        sortedKList = sortByWordFrequncy(d)
        allKList.append(sortedKList)

    wordCount = 100

    renderData = []
    for i in range(len(allKList)):
        renderData.append([])
        for j in range(0, wordCount if len(allKList[i]) > wordCount else len(allKList[i])):
            word = allKList[i][j][0]
            fre = allKList[i][j][1]
            renderWord = {"text": word, "fre": fre}
            renderData[i].append(renderWord)

    allRenderData = []
    allKs = sortByWordFrequncy(allCloudData)
    for i in range(len(allKs)):
        renderWord = {"text": allKs[i][0], "fre": allKs[i][1]}
        allRenderData.append(renderWord)
        if i > wordCount:
            break
    renderData.append(allRenderData)

    return renderData


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

def getRiver():
    pass
