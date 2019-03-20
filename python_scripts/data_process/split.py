import g
import time
import codecs
import shortuuid
from multiprocessing import Pool
import random
import os
import json

def ifInNYC(lat, lng):
    if lng < -74.21813964843751 or lng > -73.73446653597058:
        return False
    if lat < 40.49040846908216 or lat > 40.891715295571046:
        return False
    return True


def extractFromSingleFile(filePath):
    truePoints = []
    with open(filePath, 'r', encoding='utf-8') as f:
        writeF = codecs.open(g.dataPath + "extractedData.txt", 'a', encoding='utf-8')
        for index, line in enumerate(f):
            try:
                line = line.split('\t')
                textID = shortuuid.ShortUUID().random(length=8)
                if line[6] !='true':
                    continue
                lat = float(line[5])
                lng = float(line[4])
                if (ifInNYC(lat, lng) == False):
                    continue
                trueFlag = True
                truePoints.append([lat, lng])
                text = line[1]
                timeStamp = int(line[2][:10])
                localTime = time.localtime(timeStamp)
                formatedTime = time.strftime("%Y-%m-%d %H:%M:%S", localTime)
                writeF.write(
                    textID + '\t' + text + '\t' + formatedTime + '\t' + str(lat) + '\t' + str(lng) + '\t' +
                    str(trueFlag) + '\t\n')
            except IndexError as indexErr:
                pass
            except ValueError as valueErr:
                pass


if __name__ == '__main__':
    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)
    try:
        os.mkdir(g.dataPath)
    except Exception as e:
        print(e)

    for i in range(12, 12 + g.dataDays):
        extractFromSingleFile('../data/2016-06-{0}.txt'.format(i))

    rowCount = 0
    with open(g.dataPath + 'extractedData.txt', 'r', encoding='utf-8') as f:
        for line in f:
            rowCount += 1
    print('extractedData:' + str(rowCount))
