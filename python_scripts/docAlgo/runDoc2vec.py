import g
from gensim.test.utils import common_texts
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from gensim.test.utils import get_tmpfile
import os
import json
import logging

# texts:string[][]
# ids:string[]
def runDoc2vec(texts, ids,vectorSize,epochs):
    print('run doc2vec')
    logging.basicConfig(format='%(asctime)s:%(levelname)s: %(message)s', level=logging.INFO)
    documents = [TaggedDocument(doc, [i]) for i, doc in enumerate(texts)]
    model = Doc2Vec(documents, vector_size=vectorSize, window=5, min_count=1, workers=4, epochs=epochs, negative=5, sample=1e-5)
    model.delete_temporary_training_data(keep_doctags_vectors=True, keep_inference=True)
    idVectorDict = {}
    try:
        for i, v in enumerate(model):
            id = ids[i]
            vector = v.tolist()
            idVectorDict[id] = vector
    except Exception as e:
        pass
    return idVectorDict


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

    idVectorDict = runDoc2vec(texts=common_texts, ids=ids)

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
