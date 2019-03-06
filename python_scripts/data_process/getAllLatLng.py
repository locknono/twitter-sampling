import csv
import time
import os

def getAllLatLng():

    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)

    with open('../data/extractedDataInAllArea.txt', 'r', encoding='utf-8', errors='ignore') as f:
        with open('../data/allLatLng.csv', 'a', encoding='utf-8') as wf:
            for line in f:
                try:
                    line = line.strip('\t\n').split('\t')
                    lat = float(line[3])
                    lng = float(line[4])
                except Exception as e:
                    pass
                else:
                    wf.write(str(lat) + ',' + str(lng) + '\n')


def getBound():
    bounds = []
    initialBound = -74.026675
    for i in range(15):
        bounds.append(initialBound - 0.000001)
        initialBound = initialBound - 0.000001
    print(bounds)
    for i in range(len(bounds)):
        lngBound = bounds[i]
        print(i)
        print(lngBound)
        inBoundCount = 0
        with open('../data/allLatLng.csv', 'r', encoding='utf-8') as f:
            for row in f:
                row = row.split(',')
                lat = float(row[0])
                lng = float(row[1])
                if lng < lngBound or lng > -73.902417:
                    continue
                if lat < 40.677844 or lat > 40.898274:
                    continue
                inBoundCount += 1
        print(inBoundCount)


if __name__ == '__main__':
    getBound()
