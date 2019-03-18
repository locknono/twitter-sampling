import g
import json
import numpy as np
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import os
from shared.lda_op import findMaxIndexAndValueForOneDoc


def runTsne():
    print('run tsne')
    with open(g.docDir + 'idLdaDict.json'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        idScatterData = {}
        tsneData = []
        idList = []
        idLdaDict = json.loads(f.read())
        for i, k in enumerate(idLdaDict):
            tsneData.append(idLdaDict[k])
            idList.append(k)
        X = np.array(tsneData)
        X_embedded = TSNE(n_components=2).fit_transform(X)
        scatterData = X_embedded.tolist()

        for i, v in enumerate(X_embedded):
            idScatterData[idList[i]] = v.tolist()
        plt.scatter(X_embedded[:, 0], X_embedded[:, 1])
        plt.savefig(g.docDir + 'scatter.png')
        plt.savefig('../client/public/scatter.png')
        plt.close()

    with open(g.docDir + 'scatterData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(idScatterData))
    with open('../client/public/scatterData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(idScatterData))

if __name__ == '__main__':
    runTsne()
