import g
import json
import numpy as np
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt

if __name__ == '__main__':
    with open(g.ldaDir + 'idLdaDict.json'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        outputData = {}
        tsneData = []
        idList = []
        idLdaDict = json.loads(f.read())
        for k in idLdaDict:
            tsneData.append(idLdaDict[k])
            idList.append(k)
        X = np.array(tsneData)
        X_embedded = TSNE(n_components=2).fit_transform(X)
        scatterData = X_embedded.tolist()

        for i, v in enumerate(X_embedded):
            outputData[idList[i]] = v.tolist()

        plt.scatter(X_embedded[:, 0], X_embedded[:, 1])
        plt.savefig(g.ldaDir + 'scatter.png')
        plt.savefig('../client/public/scatter.png')
        plt.close()

    with open(g.dataPath + 'scatterData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputData))
    with open('../client/public/scatterData.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputData))
