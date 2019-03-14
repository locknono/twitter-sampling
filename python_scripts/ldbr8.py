from typing import List
from scipy import stats
import numpy as np
import random
import math
import json


# one sample for one disk ,starts from the fewest count

class Point:
    def __init__(self, id, lat, lng, value, topic):
        self.id = id
        self.lat = lat
        self.lng = lng
        self.value = value
        self.topic = topic
        self.kdeValue = None
        self.covered = False
        self.r = None
        self.isDisk = False
        self.diskIndices = []


def getGeoDistance(p1, p2):
    # result matches `leaflet` coordinate system
    # can not memorize the distance maxtrix because it's too large,too space-consuming
    lon1 = p1.lng
    lon2 = p2.lng
    lat1 = p1.lat
    lat2 = p2.lat
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])
    a = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * \
        math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371
    dis = c * r * 1000
    return dis


def getKDE(points: List[Point]):
    allLat = []
    allLng = []
    for p in points:
        allLat.append(p.lat)
        allLng.append(p.lng)
    dataForKDE = np.vstack([allLat, allLng])
    kde = stats.gaussian_kde(dataForKDE)
    return kde


def setRadius(point: Point, r: float, kde):
    radius = r / kde([point.lat, point.lng])[0]
    point.r = radius


def drawOneSampleForOneGroup(points: List[Point], topic: int, disks):
    samplePoint = None

    allFitsPoints = []
    for p in points:
        if p.topic == topic:
            allFitsPoints.append(p)
    print(allFitsPoints)
    allFitsDiskIndices = []
    for p in allFitsPoints:
        for index in p.diskIndices:
            allFitsDiskIndices.append(index)
    sortedFitsDiskIndices = sorted(allFitsDiskIndices, key=lambda k: disks[k].count)
    minValue = disks[sortedFitsDiskIndices[0]].count

    fitsRandomDomain = []
    for index in sortedFitsDiskIndices:
        if disks[index].count == minValue:
            fitsRandomDomain.append(index)
    if len(fitsRandomDomain) > 1:
        randomIndex = fitsRandomDomain[random.randint(0, len(fitsRandomDomain) - 1)]
        randomDisk = disks[randomIndex]
    else:
        randomDisk = disks[fitsRandomDomain[0]]
    for p in allFitsPoints:
        if getGeoDistance(p, randomDisk) < randomDisk.r:
            randomDisk.count += 1
            randomDisk.isDisk = True
            samplePoint = p
            points.remove(p)
            return samplePoint


def getEstimateForOneGroup(sampleGroup: List[Point]):
    sum = 0
    for p in sampleGroup:
        sum += p.value
    return sum / len(sampleGroup)


def getMaxNInActiveGroups(A: List[int], points: List[Point]):
    maxN = -1
    countDict = {}
    for p in points:
        if p.topic not in A:
            continue
        if p.topic in countDict:
            countDict[p.topic] += 1
        else:
            countDict[p.topic] = 1
    sortedEntries = sorted(countDict.items(), key=lambda x: x[1])
    for k, v in sortedEntries:
        if v > maxN:
            maxN = v
    return maxN


def getEpsilon(m, N, k, delta, c):
    part1 = 1 - (m - 1) / N
    part2 = 2 * math.log2(math.log2(m))
    part3 = math.log2((math.pow(math.pi, 2) * k) / (3 * delta))
    epsilon = c * math.sqrt((part1 * (part2 + part3)) / (2 * m))
    return epsilon


def ifActive(estimates: List[float], topic: int, epsilon: float):
    for i in range(len(estimates)):
        if topic == i:
            continue
        if estimates[topic] + epsilon > estimates[i] - epsilon and estimates[topic] + epsilon < estimates[
            i] + epsilon:
            return True
        if estimates[topic] - epsilon > estimates[i] - epsilon and estimates[topic] - epsilon < estimates[
            i] + epsilon:
            return True
    return False

    """
    @:param  r:the parameter positively correlated to poisson disk radius
    """


def ldbr(points: List[Point], k: int, delta: float, c: float, disks):
    """
    for p in points:
        for index, disk in enumerate(disks):
            if getGeoDistance(p, disk) < disk.r:
                p.diskIndices.append(index)
    idIndicesDict = {}
    for p in points:
        idIndicesDict[p.id] = p.diskIndices
    print('pre finished')
    with open('./save.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(idIndicesDict))
    """
    with open('./save.json', 'r', encoding='utf-8') as f:
        idIndicesDict = json.loads(f.read())
        for p in points:
            for id in idIndicesDict:
                if p.id == id:
                    p.diskIndices = idIndicesDict[id]
                    break
    # kde = getKDE(points)
    # for p in points:
    #    setRadius(p, r, kde)
    # print('set all radius')
    A = []
    sampleGroups: List[List[Point]] = []
    for i in range(k):
        A.append(i)
        sampleGroups.append([])
    m = 1

    samples = []
    for topic in A:
        samplePoint = drawOneSampleForOneGroup(points, topic, disks)
        samples.append(samplePoint)

    for i in range(len(A)):
        # print(str(A[i]))
        sampleGroups[A[i]].append(samples[i])

    estimates = []

    for group in sampleGroups:
        estimates.append(getEstimateForOneGroup(group))

    while (len(A) > 0):
        print(A)
        N = getMaxNInActiveGroups(A, points)
        m = m + 1
        try:
            epsilon = getEpsilon(m, N, k, delta, c)
        except ValueError as e:
            print('epsilon === 0')
            return [estimates, sampleGroups, disks]

        # print(epsilon)
        samples = []
        for topic in A:
            samplePoint = drawOneSampleForOneGroup(points, topic, disks)
            if samplePoint == None:
                return [None, None]
            samples.append(samplePoint)

        for i in range(len(A)):
            sampleGroups[A[i]].append(samples[i])
            estimates[A[i]] = ((m - 1) / m) * estimates[A[i]] + (1 / m) * samples[i].value
            # print(str(estimates))
        for i in range(len(A) - 1, 0 - 1, -1):
            if ifActive(estimates, A[i], epsilon) == False:
                A.pop(i)
        # print(str(A))
    return [estimates, sampleGroups, disks]


def ldbrRemain(points: List[Point], k: int, delta: float, c: float, disks, initalM: int, sampleGroups):
    with open('./save.json', 'r', encoding='utf-8') as f:
        idIndicesDict = json.loads(f.read())
        for p in points:
            for id in idIndicesDict:
                if p.id == id:
                    p.diskIndices = idIndicesDict[id]
                    break
    # kde = getKDE(points)
    # for p in points:
    #    setRadius(p, r, kde)
    # print('set all radius')
    A = []
    for i in range(k):
        A.append(i)
    m = initalM

    samples = []
    for topic in A:
        samplePoint = drawOneSampleForOneGroup(points, topic, disks)
        samples.append(samplePoint)

    for i in range(len(A)):
        # print(str(A[i]))
        sampleGroups[A[i]].append(samples[i])

    estimates = []

    for group in sampleGroups:
        estimates.append(getEstimateForOneGroup(group))

    while (len(A) > 0):
        print(A)
        N = getMaxNInActiveGroups(A, points)
        m = m + 1
        try:
            epsilon = getEpsilon(m, N, k, delta, c)
        except ValueError as e:
            print('epsilon === 0')
            return [estimates, sampleGroups, disks]

        # print(epsilon)
        samples = []
        for topic in A:
            samplePoint = drawOneSampleForOneGroup(points, topic, disks)
            if samplePoint == None:
                return [None, None]
            samples.append(samplePoint)

        for i in range(len(A)):
            sampleGroups[A[i]].append(samples[i])
            estimates[A[i]] = ((m - 1) / m) * estimates[A[i]] + (1 / m) * samples[i].value
            # print(str(estimates))
        for i in range(len(A) - 1, 0 - 1, -1):
            if ifActive(estimates, A[i], epsilon) == False:
                A.pop(i)
        # print(str(A))
    return [estimates, sampleGroups, disks]


if __name__ == '__main__':
    pass
