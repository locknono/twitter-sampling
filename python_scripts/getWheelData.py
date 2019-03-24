import g
from flask import Flask, Response, Request, request, jsonify
import json
from shared.generateRenderData import getWordCloud, readJsonFile, writeToJsonFile


def getTimeNumberDictForOneClass(classIDs, idTimeDict):
    timeNumberDict = {}
    for id in classIDs:
        time = idTimeDict[id]
        if time in timeNumberDict:
            timeNumberDict[time] += 1
        else:
            timeNumberDict[time] = 1
    return timeNumberDict


if __name__ == '__main__':
    idClassDict = readJsonFile(g.dataPath + 'idClassDict.json')
    idTimeDict = readJsonFile(g.dataPath + 'idTimeDict.json')
    sortedValue = sorted(idTimeDict.values())
    minTime = sortedValue[0]
    maxTime = sortedValue[-1]
    timeInterval = maxTime - minTime

    allClassIDs = []
    for i in range(g.topicNumber):
        allClassIDs.append([])
    for id in idClassDict:
        allClassIDs[idClassDict[id]].append(id)

    wheelData = []
    for classIDs in allClassIDs:
        timeNumberDict = getTimeNumberDictForOneClass(classIDs, idTimeDict)
        for time in range(minTime, maxTime):
            if time in timeNumberDict:
                continue
            else:
                timeNumberDict[time] = 0
        wheelData.append(timeNumberDict)

    meta = {'minTime': minTime, 'maxTime': maxTime}
    writeToJsonFile(wheelData, '../client/public/wheelData.json')
    writeToJsonFile(meta, '../client/public/wheelDataMeta.json')
