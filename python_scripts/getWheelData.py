import g
from flask import Flask, Response, Request, request, jsonify
import json
from shared.generateRenderData import getWordCloud, readJsonFile, writeToJsonFile
import math


def getTimeNumberDictForOneClass(classIDs, idTimeDict, minTime, maxTime, minValue):
    print('----------------------------------')
    timeNumberDict = {}
    for time in range(minTime, maxTime + 1):
        timeNumberDict[time] = 0
    for id in classIDs:
        time = idTimeDict[id]
        timeNumberDict[time] += 1
    for time in range(minTime, maxTime + 1):
        if timeNumberDict[time] <= minValue:
            timeNumberDict[time] = 0

    stack = []
    zeroStack = []
    maxTimeInterval = 30
    minStackSize = 60
    for time in range(minTime, maxTime + 1):
        if timeNumberDict[time] != 0:
            stack.append({"time": time, "value": timeNumberDict[time]})
            zeroStack = []
        else:
            zeroStack.append(0)

        if len(zeroStack) > maxTimeInterval:
            if len(stack) < minStackSize:
                timeNumberDict = flushStack(stack, timeNumberDict, 0)
                stack = []
                continue
            sum = 0
            for s in stack:
                sum += s['value']
            avg = sum / len(stack)

            timeNumberDict = flushStack(stack, timeNumberDict, avg)
            stack = []
    if len(stack) < minStackSize:
        timeNumberDict = flushStack(stack, timeNumberDict, 0)
        stack = []
    else:
        sum = 0
        for s in stack:
            sum += s['value']
        avg = sum / len(stack)
        timeNumberDict = flushStack(stack, timeNumberDict, avg)

    return timeNumberDict


def getMinMaxTimeInStack(stack):
    minTime = 999999999999
    maxTime = -1
    for s in stack:
        if s['time'] < minTime:
            minTime = s['time']
        if s['time'] > maxTime:
            maxTime = s['time']
    return [minTime, maxTime]


def flushStack(stack, timeNumberDict, value):
    if len(stack) == 0:
        return timeNumberDict
    minTime, maxTime = getMinMaxTimeInStack(stack)
    for t in range(minTime, maxTime+1):
        timeNumberDict[t] = value
    return timeNumberDict


if __name__ == '__main__':
    idClassDict = readJsonFile(g.dataPath + 'idClassDict.json')
    idTimeDict = readJsonFile(g.dataPath + 'idTimeDict.json')
    sortedValue = sorted(idTimeDict.values())

    pad = 1

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
        timeNumberDict = getTimeNumberDictForOneClass(classIDs, idTimeDict, minTime, maxTime, 2)
        for time in range(minTime, maxTime):
            if time in timeNumberDict:
                continue
            else:
                timeNumberDict[time] = 0
        wheelData.append(timeNumberDict)

    maxValue = -1
    for timeNumberDict in wheelData:
        for time in timeNumberDict:
            if timeNumberDict[time] > maxValue:
                maxValue = timeNumberDict[time]

    meta = {'minTime': minTime, 'maxTime': maxTime, 'maxValue': maxValue, 'pad': pad}

    writeToJsonFile(wheelData, '../client/public/wheelData.json')
    writeToJsonFile(meta, '../client/public/wheelDataMeta.json')
