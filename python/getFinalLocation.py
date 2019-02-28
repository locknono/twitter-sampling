import csv
from itertools import islice
import g

if __name__ == '__main__':
    idLocationDict = {}

    with open(g.dataPath + 'idLocation.csv', 'r', encoding='utf-8') as f:
        csvF = csv.reader(f)
        for line in islice(csvF, 1, None):
            idLocationDict[line[0]] = {'lat': line[1], 'lng': line[2]}

    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8') as f:
        with open(g.dataPath + 'finalIDLocation.csv', 'w', encoding='utf-8') as wf:
            wf.write('id,lat,lng\n')
            for line in f:
                line = line.strip('\t\n').split('\t')
                textID = line[0]
                wf.write(textID + ',' + idLocationDict[textID]['lat'] + ',' + idLocationDict[textID]['lng'] + '\n')
