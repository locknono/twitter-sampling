from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import gensim
from gensim import corpora
from gensim.test.utils import datapath
import codecs
import numpy as np
import g
import os
import time
import json
import matplotlib.pyplot as plt

print(stopwords)


# texts:string[]
# stopWords:string[]
def runLDA(texts, ids):
    stopwords = stopwords.words('english')
    extraStopWords = ['cant', 'im', 'ya', 'yall', 'dont', 'shit', 'ass', 'fuck', 'us', 'maybe', 'today', 'much', 'lol',
                      'omg', 'thank', 'love', 'ye', 'oh', 'u', 'lmao', 'yell', 'your', 'little', 'better', 'good',
                      'those',
                      'f', 'wc', 'f', 'ive', 'yours', 'didnt', 'fucks', 'done', 'yourself', 'two', 'yep', 'gotta',
                      'mine',
                      'mind', 'yo', 'de', 'eu', 'pai', 'sendo', 'foi', 'de', 'lol', 'lo', 'la', 'si', 'el', 'da', 'pa',
                      'se', 'por']
    for word in extraStopWords:
        stopwords.append(word)
    print(stopwords)

    texts = [x.replace('\t\n', ' ').strip() for x in texts]
    tokenizer = RegexpTokenizer(r'\w+')
    p_stemmer = PorterStemmer()

    processedTexts = []
    # loop through document list
    for j in texts:
        # clean and tokenize document string
        raw = j.lower()
        tokens = tokenizer.tokenize(raw)

        # remove stop words from tokens
        if tokens != '':
            stopped_tokens = [i for i in tokens if i not in stopwords]
            # stem tokens
            stemmed_tokens = [p_stemmer.stem(i) for i in stopped_tokens]
            # add tokens to list
            processedTexts.append(stemmed_tokens)

    dictionary = corpora.Dictionary(processedTexts)
    corpus = [dictionary.doc2bow(text) for text in processedTexts]

    ldamodel = gensim.models.ldamodel.LdaModel(corpus, num_topics=g.topicNumber, alpha=0.25, eval_every=5,
                                               id2word=dictionary,
                                               passes=20)

    # 模型储存
    temp_file = datapath("D:\model_NY")
    ldamodel.save(temp_file)
    print('save model is OK')

    f = ldamodel.get_document_topics(corpus)
    idVectorDict = {}
    for index, item in enumerate(f):
        id = ids[index]
        ldaList = json.loads(str(item).replace('(', '[').replace(')', ']'))
        idVectorDict[id] = ldaList
    return idVectorDict
