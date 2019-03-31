import random

def getRandomPointsAndIDs(points, count):
    randomIDs = []
    randomPoints = []
    while (len(randomIDs) < count):
        randomIndex = random.randint(0, len(points) - 1)
        randomIDs.append(points[randomIndex].id)
        randomPoints.append(points[randomIndex])
        points.pop(randomIndex)
    return [randomPoints, randomIDs]
