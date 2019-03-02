from typing import List, Tuple
import logging
import random
import numpy as np
import math
import matplotlib.pyplot as plt


class Point():
    def __init__(self, id: str, values: List[float]):
        self.id = id
        self.values = values


Disk = List[Point]


def getEstimates(samples: List[Point], dimension: int, S: int) -> List[float]:
    estimates = np.full(dimension, 0).tolist()
    for p in samples:
        for i in range(len(p.values)):
            estimates[i] += p.values[i] * S
    logging.info('estimates:' + str(estimates))
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


def ifIntervalsDonotIntersect(intervals: List[float]):
    intersectFlag = False
    for i in range(len(intervals)):
        for j in range(i, len(intervals)):
            if intervals[i][0] > intervals[j][0] and intervals[i][0] < intervals[j][1]:
                intersectFlag = True
            if intervals[i][1] > intervals[j][0] and intervals[i][1] < intervals[j][1]:
                intersectFlag = True
    return intersectFlag


def blueRapid(disks: List[Disk], dimension: int, delta: float):
    S = 0
    for disk in disks:
        S += len(disk)
    logging.info('S:' + str(S))

    es = []
    BASE = 10
    for m in range(2, 100):
        epsilon = S * math.sqrt(
            (2 * math.log(math.log(m, BASE)) + math.log((math.pow(math.pi, 2) * dimension) / (3 * delta),
                                                        BASE)) / 2 * m)
        es.append(epsilon)
    plt.bar(np.arange(len(es)), es)
    plt.show()

    # step 1 :Initialize m ← 1;
    m: int = 1

    # step 2 :Draw m samples from each of S 1 ,...,S k to provide initial
    # estimates ν 1 ,...,ν k

    randomDisk = disks[random.randint(0, len(disks) - 1)]
    randomPoint = randomDisk[random.randint(0, len(randomDisk) - 1)]

    initialSamples = [randomPoint]

    estimates = getEstimates(initialSamples, dimension, S)

    A = range(len(randomPoint.values))

    for index, disk in enumerate(disks):
        p = disk[random.randint(0, len(disk) - 1)]

        m += 1


        BASE=10
        epsilon = S * math.sqrt(
            (2 * math.log(math.log(m, BASE)) + math.log((math.pow(math.pi, 2) * dimension) / (3 * delta),
                                                        BASE)) / 2 * m)

        for i in range(len(A)):
            estimates[i] = S * (((m - 1) / m) * estimates[i] + (1 / m) * p.values[i])

        print('epsilon' + str(epsilon))
        intervals = getIntervals(estimates, epsilon)

        if (ifIntervalsDonotIntersect(intervals) == True):
            continue
        else:
            # plt.bar(np.arange(len(estimates)), estimates)
            logging.info('complete')
            logging.info('intervals:' + str(intervals))
            logging.info('estimates:' + str(estimates))
            return estimates


if __name__ == '__main__':
    pass
