import os
import g
from os import path
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import json

topicTextDict = {}
with open('../data/LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f:
    with open('../data/finalText.txt', 'r', encoding='utf-8') as f2:
        for line, line2 in zip(f, f2):
            line = line.strip('\n')
            line = line.replace('(', '[').replace(')', ']')
            line = json.loads(line)

            maxPro = 0
            maxIndex = -1
            maxTopicIndex = -1
            for i in range(0, len(line)):
                if line[i][1] > maxPro:
                    maxIndex = i
                    maxPro = line[i][1]
            maxTopicIndex = line[maxIndex][0]
            text = line2.split('\t')[1]
            text = text.split(' ')
            for word in text:
                if word == 'im' or word == 'dont' or word == 'de' or word == 'en' or word == 'lol' or word == 'el' or word == 'la':
                    text.remove(word)
            text = ' '.join(text)
            if maxTopicIndex in topicTextDict:
                topicTextDict[maxTopicIndex].append(text)
            else:
                topicTextDict[maxTopicIndex] = []

for key in topicTextDict:
    with open('../data/wordCloud/{0}.txt'.format(key), 'w', encoding='utf-8') as wf:
        for text in topicTextDict[key]:
            wf.write(text + '\n')
