import g
import time
import codecs
import shortuuid

from multiprocessing import Pool
import random
import os
import json

#  -74.0252898997513 39000
# -74.0262898997513 39000
# -74.0265898997513 39049
# -74.0266598997513 86801 28000
# -74.0266598997513 86801
# -74.026667 80000
# -74.026668 86000
# -74.026673 8w+
# -74.026675 165881 120000
# -74.026689 170000
# -74.026889 170536
# -74.027289 170615
# -74.030289 170347


""" 
#bound for manhattan
def ifInNYC(lat, lng):
    if lng < -74.01970254104043 or lng > -73.92371137387572:
        return False
    if lat < 40.6995110571616 or lat > 40.878836862291685:
        return False
    return True


def ifInbiggerThanNYCBound(lat, lng):
    if lng < -75 or lng > -72:
        return False
    if lat < 40 or lat > 41:
        return False
    return True
"""

"""
# bound for washington
def ifInNYC(lat, lng):
    if lng < -77.34038162783258 or lng > -76.7141571025364:
        return False
    if lat < 38.59931257017292 or lat > 39.144591108356686:
        return False
    return True


def ifInbiggerThanNYCBound(lat, lng):
    if lng < -78 or lng > -76:
        return False
    if lat < 38 or lat > 39:
        return False
    return True
"""


def ifInNYC(lat, lng):
    if lng < -74.21813964843751 or lng > -73.73446653597058:
        return False
    if lat < 40.49040846908216 or lat > 40.891715295571046:
        return False
    return True


def ifInbiggerThanNYCBound(lat, lng):
    if lng < -76 or lng > -73:
        return False
    if lat < 39 or lat > 41:
        return False
    return True


def extractFromSingleFile(filePath, latlngSet):
    truePoints = []
    t1 = time.time()
    with open(filePath, 'r', encoding='utf-8') as f:
        writeF = codecs.open(g.dataPath + "extractedDataInAllAreaSingleThread.txt", 'a', encoding='utf-8')
        for index, line in enumerate(f):
            try:
                line = line.split('\t')
                textID = shortuuid.ShortUUID().random(length=8)
                if line[6] == 'true':
                    # line[6] == 'true'   =>  coordinate is a `Point`
                    # line[4] for lng
                    # line[5] for lat
                    lat = float(line[5])
                    lng = float(line[4])
                    if (ifInbiggerThanNYCBound(lat, lng) == False):
                        continue
                    else:
                        trueFlag = True
                        truePoints.append([lat, lng])
                else:
                    continue
                    trueFlag = False
                    # all polygons are square,from left-bottom clockwise.
                    # lat2 always > lat1
                    # lng4 always > lng1
                    lat1 = float(line[14])
                    lng1 = float(line[13])
                    if (ifInbiggerThanNYCBound(lat1, lng1) == False):
                        continue
                    lat2 = float(line[16])
                    lng4 = float(line[19])
                    lngDiff = lng4 - lng1
                    latDiff = lat2 - lat1
                    lng = round(lng1 + random.random() * lngDiff, 6)
                    lat = round(lat1 + random.random() * latDiff, 6)
                """
                iterTime = 0
                fitFlag = True
                while (lat, lng) in latlngSet:
                    iterTime += 1
                    if (iterTime > 99999):
                        fitFlag = False
                        break
                    lng = round(lng1 + random.random() * lngDiff, 6)
                    lat = round(lat1 + random.random() * latDiff, 6)
                if fitFlag == False:
                    continue
                latlngSet.add((lat, lng))
                """
                text = line[1]
                timeStamp = int(line[2][:10])
                localTime = time.localtime(timeStamp)
                formatedTime = time.strftime("%Y-%m-%d %H:%M:%S", localTime)
            except IndexError as indexErr:
                pass
                # print('invalid data:' + str(indexErr))
            except ValueError as valueErr:
                pass
                # print('invalid data:' + str(valueErr))
            else:
                writeF.write(textID + '\t' + text + '\t' + formatedTime + '\t' + str(lat) + '\t' + str(lng) + '\t' +
                             str(trueFlag) + '\t\n')
    with open('../client/public/truePoints.json', 'w', encoding='utf-8') as truePointsFile:
        truePointsFile.write(json.dumps(truePoints))
    print((time.time() - t1) / 60)

def extractDataInNyc():
    with open(g.dataPath + 'extractedDataInAllAreaSingleThread.txt', 'r', encoding='utf-8', errors='ignore') as f:
        with open(g.dataPath + 'extractedData.txt', 'a', encoding='utf-8') as wf:
            for line in f:
                try:
                    line = line.strip('\t\n').split('\t')
                    textID = line[0]
                    text = line[1]
                    formatedTime = line[2]
                    lat = float(line[3])
                    lng = float(line[4])
                    if (ifInNYC(lat, lng) == False):
                        continue
                    else:
                        wf.write(
                            textID + '\t' + text + '\t' + formatedTime + '\t' + str(lat) + '\t' + str(lng) + '\t\n')
                except Exception as e:
                    pass


if __name__ == '__main__':
    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)
try:
    os.mkdir(g.dataPath)
except Exception as e:
    print(e)
latlngSet = set()
for i in range(12, 12 + g.dataDays):
    extractFromSingleFile('../data/2016-06-{0}.txt'.format(i), latlngSet)
extractDataInNyc()
rowCount = 0
with open(g.dataPath + 'extractedDataInAllAreaSingleThread.txt', 'r', encoding='utf-8') as f:
    for line in f:
        rowCount += 1
print('extractedData:' + str(rowCount))
