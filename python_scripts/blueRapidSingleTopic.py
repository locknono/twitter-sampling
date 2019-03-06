import g
import json

if __name__='__main__':
    ps = {}
    disks = []
    with open(g.ldaDir + 'idLdaDict.json', 'r', encoding='utf-8') as f:
        idLdaDict = json.loads(f.read())
        for k in idLdaDict:
            maxIndex = -1
            maxV = -1
            for i, v in enumerate(idLdaDict[k]):
                if v > maxV:
                    maxV = v
                    maxIndex = i
            ps[k] = {"t": maxIndex, "v": maxV}

    with open(g.dataPath + 'blueNoise/samplePoints-500-2485-0.12732489624429985.json', 'r', encoding='utf-8') as f:
        points = json.loads(f.read())
        for p in points:
            disk = []
            disk.append(ps[p['id']])
            for p2 in p['pointsInDisk']:
                disk.append(ps[p2['id']])
            disks.append(disk)
