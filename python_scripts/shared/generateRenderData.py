import json


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
        lat = idLocationDict[id][0]
        lng = idLocationDict[id][1]
        topic = idClassDict[id]
        point = {"id": id, "lat": lat, "lng": lng, "topic": topic}
        points.append(point)
    return points


def sortByWordFrequncy(wordDict):
    sortedKList = sorted(wordDict.items(), key=lambda item: item[1], reverse=True)
    return sortedKList


# texts:string[]
def getWordCloud(idTextDict, idClassDict, topicCount):
    wordCloudData = []
    allCloudData = {}
    for i in range(topicCount):
        wordCloudData.append({})

    for id in idTextDict:
        text = idTextDict[id]
        topic = idClassDict[id]

        for word in text.split(' '):
            if word in wordCloudData[topic]:
                wordCloudData[topic][word] += 1
            else:
                wordCloudData[topic][word] = 1

            if word in allCloudData:
                allCloudData[word] += 1
            else:
                allCloudData[word] = 1

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
