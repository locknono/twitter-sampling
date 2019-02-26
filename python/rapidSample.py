import json
import collections

dict = {}
orderedDict = collections.OrderedDict()
with open('../data/LDA_document_to_topic_largest_NY_20.txt', 'r') as f:
    for line in f:
        line = line.strip('[').strip(']\n')
        k = int(line.split(',')[0])
        v = float(line.split(',')[1])
        if k not in dict:
            dict[k] = v
        else:
            dict[k] += v

for k in sorted(dict):
    orderedDict[k] = dict[k]

with open('../data/topicProbabilityDict.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(orderedDict))
