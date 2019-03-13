from typing import List
from scipy import stats
import numpy as np
import random
import math


# n un-fixed topics,n points one disk
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


def drawSamplesForA(points: List[Point], A: List[int]):
    samplePoints = []
    print('draw')
    for topic in A:
        samplePoints.append(None)
    randomTime = 0
    while (None in samplePoints):
        randomTime += 1
        if randomTime > 200000:
            return None

        # randomDisk
        randomPoint = points[random.randint(0, len(points) - 1)]
        if randomPoint.covered == True:
            continue
        if randomPoint.topic not in A:
            continue

        pointsInDisk = [randomPoint]
        if randomPoint.topic in A:
            for p in points:
                if p.covered == True:
                    continue
                dis = getGeoDistance(p, randomPoint)
                if dis < randomPoint.r:
                    pointsInDisk.append(p)
        topics = [p.topic for p in pointsInDisk]

        haveFlag = True
        for t in A:
            if t not in topics:
                haveFlag = False
        if haveFlag == False:
            continue

        for p in pointsInDisk:
            if p.topic not in A:
                continue
            index = A.index(p.topic)
            if samplePoints[index] == None:
                for op in points:
                    if op.covered == True:
                        continue
                    dis = getGeoDistance(p, op)
                    if dis < p.r or dis < op.r:
                        op.covered = True
                p.covered = True
                samplePoints[index] = p
                points.remove(p)
        randomPoint.isDisk = True
    return samplePoints


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


def ldbr(points: List[Point], r: float, k: int, delta: float, c: float):
    kde = getKDE(points)
    for p in points:
        setRadius(p, r, kde)
    print('set all radius')
    A = []
    sampleGroups: List[List[Point]] = []
    for i in range(k):
        A.append(i)
        sampleGroups.append([])
    m = 1

    samples = drawSamplesForA(points, A)
    for i in range(len(A)):
        # print(str(A[i]))
        sampleGroups[A[i]].append(samples[i])

    estimates = []

    for group in sampleGroups:
        estimates.append(getEstimateForOneGroup(group))

    while (len(A) > 0):
        N = getMaxNInActiveGroups(A, points)
        m = m + 1

        epsilon = getEpsilon(m, N, k, delta, c)

        # print(epsilon)

        samples = drawSamplesForA(points, A)
        if samples == None:
            return [None, None]
        for i in range(len(A)):
            sampleGroups[A[i]].append(samples[i])
            estimates[A[i]] = ((m - 1) / m) * estimates[A[i]] + (1 / m) * samples[i].value;
            # print(str(estimates))
        for i in range(len(A) - 1, 0 - 1, -1):
            if ifActive(estimates, A[i], epsilon) == False:
                A.pop(i)
        # print(str(A))
    return [estimates, sampleGroups]


if __name__ == '__main__':
    pass
