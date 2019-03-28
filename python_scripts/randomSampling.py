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

def getRandomIDs(points,count):
    randomIDs=[]
    while(len(randomIDs)<count):
        randomIndex=random.randint(0,len(points))
        randomIDs.append(randomIndex)
        points.pop(randomIndex)
    return randomIDs

