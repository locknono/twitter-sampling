import g
import json
import matplotlib.pyplot as plt

topicCountDict = {}

with open(g.ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber)) as f:
    for line in f:
        line = line.strip('\n')
        line = line.replace('(', '[').replace(')', ']')
        line = json.loads(line)
        maxPro = -1
        maxIndex = -1
        for item in line:
            if item[1] > maxPro:
                maxPro = item[1]
                maxIndex = item[0]
        if maxIndex in topicCountDict:
            topicCountDict[maxIndex] += 1
        else:
            topicCountDict[maxIndex] = 0

print(g.ldaDir)
print(topicCountDict)
orderedProbabilityList = []
for key in sorted(topicCountDict):
    orderedProbabilityList.append(topicCountDict[key])
print(orderedProbabilityList)
plt.bar(range(len(orderedProbabilityList)), orderedProbabilityList)
plt.savefig(g.ldaDir + '0.01-count.png')
