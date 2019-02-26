import g
import csv
from itertools import islice

with open(g.dataPath + 'finalIDLocation.csv', 'r', encoding='utf-8') as f:
    cf = csv.reader(f)
    cset = set()
    pcount = 0
    for line in islice(cf, 1, None):
        lat = float(line[1])
        lng = float(line[2])
        coor = (lat, lng)
        cset.add(coor)
        pcount += 1
    print(len(cset) / pcount)
