import g
import json
import numpy as np
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import os
from shared.lda_op import findMaxIndexAndValueForOneDoc

if __name__ == '__main__':
    #with open(g.ldaDir + 'idLdaDict.json'.format(g.topicNumber), 'r', encoding='utf-8') as f:
    with open('../data/yelp/idLdaDict.json'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        outputData = []
        idScatterData = {}
        for i in range(g.topicNumber):
            outputData.append([])
        tsneData = []
        idList = []
        classList = []
        idLdaDict = json.loads(f.read())
        for k in idLdaDict:
            maxIndex, maxV = findMaxIndexAndValueForOneDoc(idLdaDict[k])
            classList.append(maxIndex)
            tsneData.append(idLdaDict[k])
            idList.append(k)
        X = np.array(tsneData)
        X_embedded = TSNE(n_components=2).fit_transform(X)
        scatterData = X_embedded.tolist()

        for i, v in enumerate(X_embedded):
            outputData[classList[i]].append(v.tolist())
            idScatterData[idList[i]] = v.tolist()

        plt.scatter(X_embedded[:, 0], X_embedded[:, 1])
        plt.savefig(g.ldaDir + 'scatter.png')
        plt.savefig('../client/public/scatter.png')
        plt.close()

    with open(g.ldaDir + 'scatterData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(idScatterData))
    with open('../client/public/scatterData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(idScatterData))

    with open(g.ldaDir + 'scatterPoints.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputData))
    with open('../client/public/scatterPoints.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputData))
