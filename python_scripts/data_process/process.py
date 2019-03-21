# @author zhouxiaoyun,zhangxinlong
import csv
import codecs
from nltk.stem.porter import PorterStemmer
from nltk.stem.lancaster import LancasterStemmer
from nltk.stem import SnowballStemmer
from nltk.stem import WordNetLemmatizer
import g
import os


# 停用词获取
def stopwords_get():
    stopwords = []
    for line in open("../data/stopwords.txt", "r", encoding="utf-8"):
        line = line.rstrip("\n")
        line = line.lower()
        stopwords.append(line)
    return stopwords


# 去停用词
def filter_stopwords(centence):
    stopwords = stopwords_get()
    centence = centence.split(" ")
    out_centence = ""
    for j in range(len(centence)):
        if centence[j] not in stopwords:
            out_centence += centence[j] + " "
    out_centence.strip(" ")
    # 筛选后只剩下4个以下单词的剔除
    if len(out_centence.split(" ")) < 4:
        return "1"
    else:
        return out_centence


# 词形还原
def lemmatizer(strin):
    wordnet_lemmatizer = WordNetLemmatizer()
    return wordnet_lemmatizer.lemmatize(strin)


# 进行词形还原
def centence_change(centence):
    centence = centence.split(" ")
    out_centence = ""
    for word in centence:
        word = lemmatizer(word)
        out_centence += word + " "
    return out_centence.strip(" ")


# 读入数据
def centence_input(url):
    centence = {}
    for index, line in enumerate(open(url, "r", encoding="UTF-8")):
        line = line.strip("\t\n").split("\t")
        centence[line[0]] = line[1]
    return centence


# 读出数据
def centence_output(centence):
    target = codecs.open(g.dataPath + "processedData.txt", 'w+', encoding='utf-8')  # 文件对应
    for key in centence.keys():
        target.writelines(str(key) + "\t" + str(centence[key]) + "\t\n")
    return


def process():
    url = g.dataPath + "cleanedData.txt"
    centence = centence_input(url)
    print("step1 success")

    out_centence = {}
    sum = 0
    for key in centence.keys():
        sum += 1
        new_centence = filter_stopwords(centence[key])
        if new_centence == "1":
            sum -= 1
            continue
        else:
            out_centence[key] = centence_change(new_centence)
    print("step2 success")

    print(sum)
    centence_output(out_centence)
    print("step3 success")


if __name__ == '__main__':
    print('process text')
    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)

    process()
