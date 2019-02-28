# the data format we want:
# [lat,lng,intensity][]
# see https://github.com/Leaflet/Leaflet.heat

import g
import json
from itertools import islice
import csv
import os
import shutil
import g

if __name__ == '__main__':
    with open(g.ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        with open(g.dataPath + 'finalIDLocation.csv', 'r', encoding='utf-8') as f2:
            csvF = csv.reader(f2)
            topicHeatmapData = {}
            for line, locationLine in zip(f, islice(csvF, 1, None)):
                line = line.strip('\n')
                line = line.replace('(', '[').replace(')', ']')
                line = json.loads(line)
                lat = float(locationLine[1])
                lng = float(locationLine[2])
                for item in line:
                    if item[0] not in topicHeatmapData:
                        topicHeatmapData[item[0]] = []
                    else:
                        topicHeatmapData[item[0]].append([lat, lng, item[1]])
            """
            with open('../data/heatmapData.json', 'w', encoding='utf-8') as wf:
                wf.write(json.dumps(topicHeatmapData))
            """

            shutil.rmtree(g.ldaDir + 'heatmapData/')
            shutil.rmtree('../client/public/heatmapData/')

            try:
                os.mkdir(g.ldaDir + 'heatmapData/')
                os.mkdir('../client/public/heatmapData/')
            except Exception as e:
                print(e)
            for key in topicHeatmapData:
                with open(g.ldaDir + 'heatmapData/' + 'heat-{0}.json'.format(key), 'w', encoding='utf-8') as wf:
                    wf.write(json.dumps(topicHeatmapData[key]))
                with open('../client/public/heatmapData/heat-{0}.json'.format(key), 'w', encoding='utf-8') as wf:
                    wf.write(json.dumps(topicHeatmapData[key]))
