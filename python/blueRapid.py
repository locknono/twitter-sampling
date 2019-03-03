from typing import List, Tuple
import logging
import random
import numpy as np
import math
import matplotlib.pyplot as plt
from blueRapidEstimate import getRalationshipList, compareRelationshipList


class Point():
    def __init__(self, id: str, values: List[float]):
        self.id = id
        self.values = values


Disk = List[Point]


def getEpsilon(m: int, S: float, dimension: int, delta: float, c: float):
    epsilon = c * S * math.sqrt(
        (1 - (m - 1) / S) * (2 * math.log(math.log(m, math.e), math.e) + math.log((math.pow(math.pi, 2) * dimension) / (
                3 * delta), math.e))) / (2 * m)
    return epsilon


def getEstimates(samples: List[Point], dimension: int) -> List[float]:
    estimates = np.full(dimension, 0).tolist()
    for p in samples:
        for i in range(len(p.values)):
            estimates[i] += p.values[i]
    return estimates


def drawPointsFromDisk(disk: Disk, m: int):
    for p in disk:
        pass


def getIntervals(estimates: List[float], epsilon: float) -> List[float]:
    if epsilon <= 0:
        logging.error('epsilon<0')
    intervals = []
    for i in range(len(estimates)):
        intervals.append([estimates[i] - epsilon, estimates[i] + epsilon])
    return intervals


def ifIntervalsIntersect(intervals: List[float]):
    for i in range(len(intervals)):
        for j in range(i, len(intervals)):
            if intervals[i][0] > intervals[j][0] and intervals[i][0] < intervals[j][1]:
                return True
            if intervals[i][1] > intervals[j][0] and intervals[i][1] < intervals[j][1]:
                return True
    return False


def getIndicesDonotIntersect(intervals: List[float]):
    l = []
    for i in range(len(intervals)):
        for j in range(i, len(intervals)):
            if intervals[i][0] > intervals[j][0] and intervals[i][0] < intervals[j][1]:
                break
            if intervals[i][1] > intervals[j][0] and intervals[i][1] < intervals[j][1]:
                break
        else:
            l.append(i)
    return l


def blueRapid(disks: List[Disk], dimension: int, delta: float, c: float):
    S = 0
    for disk in disks:
        S += len(disk)
    logging.info('S:' + str(S))

    # zoom
    for i in range(len(disks)):
        for j in range(len(disks[i])):
            for m in range(len(disks[i][j].values)):
                if disks[i][j].values[m] > 1:
                    continue
                disks[i][j].values[m] = S * disks[i][j].values[m]
    # step 1 :Initialize m ← 1;
    m: int = 1

    # step 2 :Draw m samples from each of S 1 ,...,S k to provide initial
    # estimates ν 1 ,...,ν k

    randomDisk = disks[random.randint(0, len(disks) - 1)]
    randomPoint = randomDisk[random.randint(0, len(randomDisk) - 1)]

    initialSamples = [randomPoint]

    estimates = getEstimates(initialSamples, dimension)

    A = [i for i in range(len(randomPoint.values))]

    failFlag = False
    while (len(A) > 0):
        random.shuffle(disks)
        for index, disk in enumerate(disks):
            p = disk[random.randint(0, len(disk) - 1)]
            m += 1
            epsilon = getEpsilon(m, S, dimension, delta, c)


            for i in range(len(A)):
                estimates[i] = (((m - 1) / m) * estimates[i] + (1 / m) * p.values[i])
            intervals = getIntervals(estimates, epsilon)

            indices = getIndicesDonotIntersect(intervals)

            
            for i in range(len(A) - 1, 0 - 1, -1):
                if i in indices:
                    A.pop(i)
            if (epsilon <= 0 and len(A) > 0):
                failFlag = True
                break
        if failFlag == True:
            logging.error('fail')
            logging.error('len(A):' + str(len(A)))
            logging.error('A:' + str(A))
            logging.error('intervals:' + str(intervals))
            logging.error('estimates:' + str(estimates))
            break
    else:
        logging.info('complete')
        logging.info('m:' + str(m))
        logging.info('A:' + str(A))
        logging.info('intervals:' + str(intervals))
        logging.info('estimates:' + str(estimates))
    if failFlag == True:
        return None
    return estimates


if __name__ == '__main__':
    pass
