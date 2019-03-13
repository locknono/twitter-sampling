import random
import matplotlib.pyplot as plt
from blueRapidEstimate import getRalationshipList, compareRelationshipList
import copy


def getOriginalEstimates(points, topicCount):
    estimates = []
    counts = []
    for i in range(topicCount):
        estimates.append(0)
        counts.append(0)
    for p in points:
        estimates[p['class']] += p['value']
        counts[p['class']] += 1
    for i in range(len(estimates)):
        estimates[i] = estimates[i] / counts[i]
    return estimates


points = []
for i in range(20000):
    point = {"class": random.randint(0, 10), "value": random.random()}
    points.append(point)

for t in range(1000):
    try:
        copyPoints = copy.deepcopy(points)
        randomPoints = []
        while len(randomPoints) < 1000:
            randomPoint = copyPoints[random.randint(0, len(copyPoints) - 1)]
            copyPoints.remove(randomPoint)
            randomPoints.append(randomPoint)

        e1 = getOriginalEstimates(points, 11)
        e2 = getOriginalEstimates(randomPoints, 11)

        l1 = getRalationshipList(e1)
        l2 = getRalationshipList(e2)

        ratio = compareRelationshipList(l1, l2)

        print(ratio)
    except Exception as e:
        continue
