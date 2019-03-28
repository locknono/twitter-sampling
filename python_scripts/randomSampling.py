import json
import g
from docAlgo.runDoc2vec import runDoc2vec
from docAlgo.runTsne import runTsne
from docAlgo.runKmeans import runKmeans
from shared.generateRenderData import writeToJsonFile, getScatterPoints, getMapPoints, getWordCloud, readJsonFile, \
    getHexes, getRiverData
import os
from blueRapidEstimate import getRalationshipList, compareRelationshipList
from ldbr import ldbr
from shared.getLdbrData import getLdbrPoints, getOriginalEstimates, getSamplingIDs
from shared.constant import nyBound
import copy
from ldbr import getKDE, setRadius
from kdeIndicator import getKDEIndicator
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
