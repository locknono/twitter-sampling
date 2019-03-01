from typing import Dict
import random
import numpy as np


class Point():
    def __init__(self, id: str, values: float[]):
        self.id = id
        self.values = values


Disk = Point[]


def getEstimates(samples: Point[]):
    estimates = np.full(len(samples[0].values), 0).tolist()
    for p in samples:
        for i in range(len(p.values)):
            estimates[i] += p.values[i]
    return estimates


def drawPointsFromDisk(disk: Disk, m: int):
    for p in disk:


def blueRapid(disks: Disk[]):
    # step 1 :Initialize m ← 1;
    m: int = 1

    # step 2 :Draw m samples from each of S 1 ,...,S k to provide initial
    # estimates ν 1 ,...,ν k

    randomDisk = disks[random.randint(0, len(disks - 1))]
    randomPoint = randomDisk[random.randint(0, len(randomDisk - 1))]

    initialSamples = [randomPoint]

    initialEstimates = getEstimates(initialSamples)

    A = range(len(randomPoint.values))


"""
if __name__ == '__main__':
    pass
"""
