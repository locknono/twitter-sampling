import g
import json
from blueRapid import blueRapid, Point
import logging

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.INFO)
idLdaDict = {}
with open(g.ldaDir + 'idLdaDict.json', 'r', encoding='utf-8') as f:
    idLdaDict = json.loads(f.read())

with open(g.dataPath + 'blueNoise/samplePoints-500-2485-0.12732489624429985.json', 'r', encoding='utf-8') as f:
    points = json.loads(f.read())
    disks = []
    for p in points:
        disk = []
        disk.append(Point(p['id'], idLdaDict[p['id']]))
        for p2 in p['pointsInDisk']:
            disk.append(Point(p2['id'], idLdaDict[p2['id']]))
        disks.append(disk)
    estimates = blueRapid(disks, g.topicNumber, 0.05)
