import g
from gensim.test.utils import common_texts
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from gensim.test.utils import get_tmpfile
import os
import json

if __name__ == '__main__':
    common_texts = []
    ids = []
    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8')as f:
        for line in f:
            line = line.strip('\t\n').split('\t')
            id = line[0]
            text = line[1]
            words = text.split(' ')
            common_texts.append(words)
            ids.append(id)

    documents = [TaggedDocument(doc, [i]) for i, doc in enumerate(common_texts)]
    model = Doc2Vec(documents, vector_size=200, window=5, min_count=1, workers=4, epochs=400, negative=5, sample=1e-5)
    model.delete_temporary_training_data(keep_doctags_vectors=True, keep_inference=True)
    print('doc2vec finish')
    try:
        idVectorDict = {}
        for i, v in enumerate(model):
            id = ids[i]
            vector = v.tolist()
            idVectorDict[id] = vector
    except Exception as e:
        pass

    try:
        os.mkdir(g.dataPath + 'LDA/')
    except Exception as e:
        print(e)

    try:
        os.mkdir(g.ldaDir)
    except Exception as e:
        print(e)

    try:
        os.mkdir(g.docDir)
    except Exception as e:
        print(e)

    with open(g.docDir + 'idLdaDict.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(idVectorDict))
