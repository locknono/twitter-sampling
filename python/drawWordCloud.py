import os
from os import path
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import g
from wordcloud import STOPWORDS

stopwords = set(STOPWORDS)
stopwords.add("said")
stopwords.add("im")
for i in range(0, g.topicNumber):
    text = open('../data/wordCloud/{0}.txt'.format(i), encoding='utf-8').read()
    wordcloud = WordCloud(background_color="white", max_words=100,
                          stopwords=stopwords, contour_width=3, contour_color='steelblue').generate(text)

    wordcloud.to_file('../data/wordCloud/{0}.png'.format(i))
    print(i)
