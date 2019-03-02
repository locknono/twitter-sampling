import os
from os import path
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import g
from wordcloud import STOPWORDS

if __name__ == '__main__':
    try:
        os.mkdir(g.dataPath + 'wordCloud/')
    except Exception as e:
        print(e)
    try:
        os.mkdir('../client/public/wordCloud/')
    except Exception as e:
        print(e)

    stopwords = set(STOPWORDS)
    stopwords.add("said")
    stopwords.add("im")
    for i in range(0, g.topicNumber):
        text = open(g.dataPath + 'wordCloud/{0}.txt'.format(i), encoding='utf-8').read()
        wordcloud = WordCloud(background_color="white", max_words=50,
                              stopwords=stopwords, contour_width=3, contour_color='steelblue').generate(text)

        wordcloud.to_file(g.dataPath + 'wordCloud/{0}.png'.format(i))

        wordcloud.to_file('../client/public/wordCloud/{0}.png'.format(i))
        print(i)
