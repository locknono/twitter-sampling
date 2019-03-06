import csv
from itertools import islice
import json
import g
import os

if __name__ == '__main__':

    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)

    with open(g.dataPath + 'finalIDLocation.csv', 'r', encoding='utf-8') as f:
        csvF = csv.reader(f)
        data = []
        for row in islice(csvF, 1, None):
            lat = float(row[1])
            lng = float(row[2])
            data.append([lat, lng, 1])
        with open('../client/public/allHeatmap.json', 'w', encoding='utf-8') as wf:
            wf.write(json.dumps(data))
