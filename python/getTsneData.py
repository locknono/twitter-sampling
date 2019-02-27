import g
import json
import numpy as np
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt

with open(g.ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f:
    tsneData = []
    for index, line in enumerate(f):
        line = line.strip('\n')
        line = line.replace('(', '[').replace(')', ']')
        line = json.loads(line)
        values = [0 for i in range(g.topicNumber)]
        for item in line:
            values[item[0]] = item[1]
        tsneData.append(values)
    X = np.array(tsneData)
    X_embedded = TSNE(n_components=2).fit_transform(X)
    scatterData = X_embedded.tolist()
    plt.scatter(X_embedded[:, 0], X_embedded[:, 1])
    plt.savefig('../client/public/scatter.png')
    plt.close()
with open('../client/public/scatterData.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(X_embedded.tolist()))
