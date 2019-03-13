import g
import json
import csv
from itertools import islice
from ldbr2 import ldbr, Point
import math
import shortuuid
from typing import List
from blueRapidEstimate import getRalationshipList, compareRelationshipList
import copy
from ldbrTest import getOriginalEstimates
import random

if __name__ == '__main__':
    points = []
    with open(g.ldaDir + 'dataForLdbr.csv', 'r', encoding='utf-8') as f:
        for line in islice(csv.reader(f), 1, None):
            id = line[0]
            lat = float(line[1])
            lng = float(line[2])
            value = float(line[3])
            topic = int(line[4])
            p = Point(id, lat, lng, value, topic)
            points.append(p)

    ratioList = []
    countList = []
    for t in range(10):
        for c in [0.1]:
            estimates, sampleGroups = ldbr(copy.deepcopy(points), 5, 0.05, c)
            if estimates == None:
                print('fail')
                continue
            originalEstimates = getOriginalEstimates(copy.deepcopy(points), 5)
            r1 = getRalationshipList(estimates)
            r2 = getRalationshipList(originalEstimates)
            ratio = compareRelationshipList(r1, r2)
            count = 0
            for g in sampleGroups:
                for p in g:
                    count += 1
            ratioList.append(ratio)
            countList.append(count)

            randomPoints = []
            copyPoints = copy.deepcopy(points)
            while len(randomPoints) < 30:
                randomPoint = copyPoints[random.randint(0, len(copyPoints) - 1)]
                copyPoints.remove(randomPoint)
                randomPoints.append(randomPoint)
            randomEstimates = getOriginalEstimates(randomPoints, 5)
            r3 = getRalationshipList(randomEstimates)
            ratio3 = compareRelationshipList(r1, r3)
            print(ratio3)

            print(ratioList)
            print(countList)
