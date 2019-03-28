from typing import List
from scipy import stats
import numpy as np
import random
import math
import json
import copy


# one sample for one disk ,starts from the fewest count

class Point:
    def __init__(self, id, lat, lng, value, topic, time):
        self.id = id
        self.lat = lat
        self.lng = lng
        self.value = value
        self.topic = topic
        self.time = time
        self.kdeValue = None
        self.covered = False
        self.r = None
        self.timeR = None
        self.isDisk = False
        self.isTimeDisk = False
        self.count = 0
        self.sampled = False
        self.diskIndices = []
        self.pointsIndices = []


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


def getTimeKDE(points: List[Point]):
    allTime = []
    for p in points:
        allTime.append(p.time)
    kde = stats.gaussian_kde(allTime)
    return kde


def setRadius(point: Point, r: float, kde):
    point.kdeValue = kde([point.lat, point.lng])[0]
    radius = r / point.kdeValue
    point.r = radius


def setTimeRadius(point: Point, r: float, kde):
    radius = r / kde(point.time)
    # print(radius)
    point.timeR = radius


def drawOneSampleForOneGroup(points: List[Point], topic: int):
    samplePoint = None

    allFitsPoints = []
    for p in points:
        if p.topic == topic and p.sampled == False:
            allFitsPoints.append(p)
    if (len(allFitsPoints) == 0):
        return None

    randomTime = 0
    while (samplePoint == None):
        randomTime += 1
        randomPoint = allFitsPoints[random.randint(0, len(allFitsPoints) - 1)]
        for p in points:
            if p == randomPoint or p.isDisk == False or p.isTimeDisk == False:
                continue
            dis = getGeoDistance(p, randomPoint)
            if dis <= p.r or dis <= randomPoint.r:
                break

            timeDis = math.fabs(p.time - randomPoint.time)
            if timeDis < p.timeR or timeDis <= randomPoint.timeR:
                break
        else:
            randomPoint.sampled = True
            randomPoint.isDisk = True
            randomPoint.isTimeDisk = True
            samplePoint = randomPoint
            return samplePoint
        if randomTime >= 3:
            randomPoint = allFitsPoints[random.randint(0, len(allFitsPoints) - 1)]
            randomPoint.sampled = True
            samplePoint = randomPoint
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
    # print(epsilon)
    return epsilon


def ifActive(estimates: List[float], topic: int, epsilon: float, A: List[int]):
    for i in range(len(estimates)):
        if topic == i:
            continue
        if i not in A:
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


def ldbr(points: List[Point], k: int, r: float, delta: float, c: float, timeR: float):
    timeKDE = getTimeKDE(points)
    kde = getKDE(points)
    print('start setting radius')
    for index, p in enumerate(points):
        if index % int(len(points) / 10) == 0:
            print(index)
        setTimeRadius(p, timeR, timeKDE)
        setRadius(p, r, kde)
    A = []
    print('set all radius')
    sampleGroups: List[List[Point]] = []
    for i in range(k):
        A.append(i)
        sampleGroups.append([])
    m = 1

    samples = []
    for topic in A:
        samplePoint = drawOneSampleForOneGroup(points, topic)
        samples.append(samplePoint)

    for i in range(len(A)):
        sampleGroups[A[i]].append(samples[i])

    estimates = []

    for group in sampleGroups:
        estimates.append(getEstimateForOneGroup(group))

    while (len(A) > 0):
        N = getMaxNInActiveGroups(A, points)
        m = m + 1
        try:
            epsilon = getEpsilon(m, N, k, delta, c)
        except ValueError as e:
            return [estimates, sampleGroups]

        # print(epsilon)
        samples = []
        for topic in A:
            samplePoint = drawOneSampleForOneGroup(points, topic)
            if samplePoint == None:
                return [None, None]
            samples.append(samplePoint)

        for i in range(len(A)):
            sampleGroups[A[i]].append(samples[i])
            estimates[A[i]] = ((m - 1) / m) * estimates[A[i]] + (1 / m) * samples[i].value
            # print(str(estimates))
        estimatesInA = [estimates[index] for index in A]
        # print(estimatesInA)
        for i in range(len(A) - 1, 0 - 1, -1):
            if ifActive(estimates, A[i], epsilon, A) == False:
                A.pop(i)
        # print(str(A))
    return [estimates, copy.deepcopy(sampleGroups)]


if __name__ == '__main__':
    pass
