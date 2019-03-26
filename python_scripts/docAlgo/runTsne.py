import g
import json
import numpy as np
from sklearn.manifold import TSNE
import os
from shared.lda_op import findMaxIndexAndValueForOneDoc


def runTsne(idVectorDict):
    print('run tsne')
    idScatterData = {}
    tsneData = []
    ids = []
    for i, k in enumerate(idVectorDict):
        tsneData.append(idVectorDict[k])
        ids.append(k)
    X = np.array(tsneData)
    X_embedded = TSNE(n_components=2).fit_transform(X)
    for i, v in enumerate(X_embedded):
        idScatterData[ids[i]] = v.tolist()

    """
    plt.figure(figsize=(15, 15))
    plt.scatter(X_embedded[:, 0], X_embedded[:, 1])
    plt.savefig(g.dataPath + 'scatter.png')
    #plt.savefig('../client/public/scatter.png')
    plt.close()
    """
    return idScatterData


if __name__ == '__main__':

    with open(g.docDir + 'idLdaDict.json'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        idLdaDict = json.loads(f.read())
        idScatterData = runTsne(idLdaDict)
        """
        plt.scatter(X_embedded[:, 0], X_embedded[:, 1])
        plt.savefig(g.docDir + 'scatter.png')
        plt.savefig('../client/public/scatter.png')
        plt.close()
        """

        with open(g.docDir + 'scatterData.json', 'w', encoding='utf-8') as f:
            f.write(json.dumps(idScatterData))
        with open('../client/public/scatterData.json', 'w', encoding='utf-8') as f:
            f.write(json.dumps(idScatterData))
