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

"""
’asymmetric’: Uses a fixed normalized asymmetric prior of 1.0 / topicno.
’auto’: Learns an asymmetric prior from the corpus (not available if distributed==True).
"""
try:
    os.mkdir(g.dataPath + 'LDA/')
except Exception as e:
    print(e)

ALPHA = 0.01

parameterText = 'alpha={0}'.format(ALPHA)
ldaDir = ''
imgFileName = ''
try:
    ldaDir = g.dataPath + 'LDA/' + parameterText + '/'
    imgFileName = parameterText + '.png'
    os.mkdir(ldaDir)
except FileExistsError:
    ldaDir = g.dataPath + 'LDA/' + str(time.time()) + '-' + parameterText + '/'
    imgFileName = str(time.time()) + '-' + parameterText + '.png'
    os.mkdir(ldaDir)

f = open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8')
extra_stopwords_file = open('../data/' + 'stopwords.txt', 'r', encoding='utf-8')
doc_set = []
while True:
    line = f.readline()
    c = line.strip().split('\t', 1)
    if not line:
        break
    else:
        doc_set.append(c[1])
doc_set = [x.replace('\t\n', ' ').strip() for x in doc_set]
print(len(doc_set))
tokenizer = RegexpTokenizer(r'\w+')

# create English stop words list
en_stop = stopwords.words('english')
en_stop_extra = ['cant', 'im', 'ya', 'yall', 'dont', 'shit', 'ass', 'fuck', 'us', 'maybe', 'today', 'much', 'lol',
                 'omg', 'thank', 'love', 'ye', 'oh', 'u', 'lmao', 'yell', 'your', 'little', 'better', 'good', 'those',
                 'f', 'wc', 'f', 'ive', 'yours', 'didnt', 'fucks', 'done', 'yourself', 'two', 'yep', 'gotta', 'mine',
                 'mind', 'yo', 'de', 'eu', 'pai', 'sendo', 'foi', 'de', 'lol', 'lo', 'la', 'si', 'el', 'da', 'pa',
                 'se', 'por']
for i in extra_stopwords_file:
    en_stop_extra.append(i)
en_stop_extra = [x.replace('\n', ' ').strip() for x in en_stop_extra]
en_stop_extra = [x.replace("'", ' ').strip() for x in en_stop_extra]
en_stop = en_stop + en_stop_extra
print(en_stop)

# Create p_stemmer of class PorterStemmer
p_stemmer = PorterStemmer()
print('stopwords is OK')
'''# create sample documents
doc_a = "Brocolli is good to eat. My brother likes to eat good brocolli, but not my mother."
doc_b = "My mother spends a lot of time driving my brother around to baseball practice."
doc_c = "Some health experts suggest that driving may cause increased tension and blood pressure."
doc_d = "I often feel pressure to perform well at school, but my mother never seems to drive my brother to do better."
doc_e = "Health professionals say that brocolli is good for your health."

# compile sample documents into a list
doc_set = [doc_a, doc_b, doc_c, doc_d, doc_e]'''

# list for tokenized documents in loop
texts = []

# loop through document list
for j in doc_set:
    # clean and tokenize document string
    raw = j.lower()
    tokens = tokenizer.tokenize(raw)

    # remove stop words from tokens
    if tokens != '':
        stopped_tokens = [i for i in tokens if i not in en_stop]
        # stem tokens
        stemmed_tokens = [p_stemmer.stem(i) for i in stopped_tokens]
        # add tokens to list
        texts.append(stemmed_tokens)

# turn our tokenized documents into a id <-> term dictionary
dictionary = corpora.Dictionary(texts)
print(len(texts))
# convert tokenized documents into a document-term matrix
corpus = [dictionary.doc2bow(text) for text in texts]
print(len(corpus))
# generate LDA model

ldamodel = gensim.models.ldamodel.LdaModel(corpus, num_topics=g.topicNumber, alpha=ALPHA, eval_every=5,
                                           id2word=dictionary,
                                           passes=g.topicNumber)

# 模型储存
temp_file = datapath("D:\model_NY")
ldamodel.save(temp_file)
print('save model is OK')

# 输出topic-word矩阵
c = ldamodel.show_topics(g.topicNumber, 10)
target = codecs.open(ldaDir + 'LDA_topic_NY_{0}.txt'.format(g.topicNumber), 'w',
                     encoding='utf-8')  # 文件对应
for line in c:
    target.writelines(str(line) + "\r\n")
print('OK')

# 输出一致性排名输出的topic-word列表
d = ldamodel.top_topics(corpus, topn=10)
target2 = codecs.open(ldaDir + 'LDA_top_topic_NY_{0}.txt'.format(g.topicNumber), 'w',
                      encoding='utf-8')
temp = []
nu = 0

for line in d:
    c = (line[1].astype(np.float32), str(nu))
    line[0].append(c)
    target2.writelines(str(line[0]) + "\r\n")
    nu += 1
print('一致性OK')

# 输出文档主题概率矩阵 topic-document
target3 = codecs.open(ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'w',
                      encoding='utf-8')
f = ldamodel.get_document_topics(corpus)
for i in f:
    target3.writelines(str(i) + "\r\n")
print('T-D矩阵ok')

# 文档最大主题分布
target5 = codecs.open(ldaDir + 'LDA_document_to_topic_largest_NY_{0}.txt'.format(g.topicNumber),
                      'w+', encoding='utf-8')
ttt = []
for i in f:
    qqq = [x[1] for x in i]
    temp = [qqq.index(max(qqq)), max(qqq)]
    ttt.append(temp)
for i in ttt:
    target5.writelines(str(i) + "\r\n")
print('最大主题分布OK')

# 输出特征向量topic-document
'''np.set_printoptions(threshold=1000000)
np.savetxt("LDA_document_to_topic_egi_20.txt", e, delimiter='', fmt='%s')'''

list1 = []
e = ldamodel.inference(corpus)
for i in range(len(e[0])):
    list1.append(e[0][i].tolist())
target4 = codecs.open(ldaDir + 'LDA_document_to_topic_egi_NY_{0}.txt'.format(g.topicNumber), 'w',
                      encoding='utf-8')
nu = 0
for i in list1:
    target4.writelines(str(i) + str(nu) + "\r\n")
    nu += 1
print('特征向量OK')


def generateTopicProbabilityDict(probabilityForOneRow, topicProbabilityDict):
    for item in probabilityForOneRow:
        if item[0] in topicProbabilityDict:
            topicProbabilityDict[item[0]] += item[1]
        else:
            topicProbabilityDict[item[0]] = item[1]
    return topicProbabilityDict


def getOrderedProbabilityList(topicProbabilityDict):
    orderedProbabilityList = []
    for key in sorted(topicProbabilityDict):
        orderedProbabilityList.append(topicProbabilityDict[key])
    return orderedProbabilityList


def showProbablityBarChart(topicProbabilityDict):
    orderedProbabilityList = getOrderedProbabilityList(topicProbabilityDict)
    plt.bar(range(len(orderedProbabilityList)), orderedProbabilityList)
    plt.show()


def saveProbablityBarChart(topicProbabilityDict):
    orderedProbabilityList = getOrderedProbabilityList(topicProbabilityDict)
    plt.bar(range(len(orderedProbabilityList)), orderedProbabilityList)
    plt.savefig(ldaDir + imgFileName)
    plt.savefig(g.dataPath + '/LDA/' + imgFileName)


with open(ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f:
    topicProbabilityDict = {}
    for line in f:
        line = line.strip('\n')
        line = line.replace('(', '[').replace(')', ']')
        line = json.loads(line)
        topicProbabilityDict = generateTopicProbabilityDict(line, topicProbabilityDict)
    saveProbablityBarChart(topicProbabilityDict)
