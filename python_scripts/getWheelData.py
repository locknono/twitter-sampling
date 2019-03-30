import g
from flask import Flask, Response, Request, request, jsonify
import json
from shared.generateRenderData import getWordCloud, readJsonFile, writeToJsonFile
import math
import time
import os


def getStartEndMinuteForOneDay(day):
    startTime = time.strptime('2016-11-{0} 00:00:00'.format(day + 1), '%Y-%m-%d %H:%M:%S')
    startMinute = int(math.floor(math.floor(time.mktime(startTime) / 60)))

    endTime = time.strptime('2016-11-{0} 23:59:59'.format(day + 1), '%Y-%m-%d %H:%M:%S')
    endMinute = int(math.floor(math.floor(time.mktime(endTime) / 60)))

    return [startMinute, endMinute]


def getTimeNumberDictForOneClassOneDay(classIDs, idTimeDict, minValue, timeInterval, day):
    startMinute, endMinute = getStartEndMinuteForOneDay(day)
    timeNumberDict = {}

    for t in range(startMinute, endMinute):
        timeNumberDict[t] = 0

    for id in classIDs:
        time = idTimeDict[id]
        if time in timeNumberDict:
            timeNumberDict[time] += 1
        else:
            continue
    timeSlices = []
    for i in range(0, int((endMinute - startMinute) / timeInterval) + 2):
        sm = startMinute + i * timeInterval
        em = startMinute + (i + 1) * timeInterval
        timeSlices.append([sm, em])

    for slice in timeSlices:
        sum = 0
        for t in range(slice[0], slice[1]):
            if t in timeNumberDict:
                sum += timeNumberDict[t]
        if sum < minValue:
            for t in range(slice[0], slice[1]):
                if t in timeNumberDict:
                    timeNumberDict[t] = 0
        else:
            avg = sum / (slice[1] - slice[0])
            for t in range(slice[0], slice[1]):
                timeNumberDict[t] = avg
    return timeNumberDict


def getWheelData(idClassDict, idTimeDict, minValue, minInterval, ids=None):
    if ids == None:
        ids = idClassDict.keys()
    allClassIDs = []
    try:
        os.mkdir('../client/public/wheelData/')
    except Exception as e:
        print(e)
    for i in range(g.topicNumber):
        allClassIDs.append([])
    for id in ids:
        allClassIDs[idClassDict[id]].append(id)

    metas = []
    wheelDatas = []
    for day in range(g.startDay, g.startDay + g.dataDays):
        minTime, maxTime = getStartEndMinuteForOneDay(day)
        wheelData = []
        for classIDs in allClassIDs:
            timeNumberDict = getTimeNumberDictForOneClassOneDay(classIDs, idTimeDict, minValue=minValue,
                                                                timeInterval=minInterval,
                                                                day=day)
            wheelData.append(timeNumberDict)
        maxValue = -1
        for timeNumberDict in wheelData:
            for t in timeNumberDict:
                if timeNumberDict[t] > maxValue:
                    maxValue = timeNumberDict[t]
        meta = {'minTime': minTime, 'maxTime': maxTime, 'maxValue': maxValue}

        metas.append(meta)
        wheelDatas.append(wheelData)
    return [metas, wheelDatas]


if __name__ == '__main__':
    idClassDict = readJsonFile(g.dataPath + 'idClassDict.json')
    idTimeDict = readJsonFile(g.dataPath + 'idTimeDict.json')
    metas, wheelDatas = getWheelData(idClassDict, idTimeDict)
    index = 0
    for i in range(len(wheelDatas)):
        writeToJsonFile(wheelDatas[i], '../client/public/wheelData/{0}.json'.format(g.startDay + i))
        writeToJsonFile(metas[i], '../client/public/wheelData/{0}-meta.json'.format(g.startDay + i))
