# @author zhouxiaoyun,zhangxinlong
import csv
import codecs
from nltk.stem.porter import PorterStemmer
from nltk.stem.lancaster import LancasterStemmer
from nltk.stem import SnowballStemmer
from nltk.stem import WordNetLemmatizer
import g


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


# 大写转小写
def uptolow(centence):
    return centence.lower()


# 快速次干提取
def porter(strin):
    porter_stemmer = PorterStemmer()
    print(porter_stemmer.stem(strin))


# 精准次干提取
def lancaster(strin):
    lancaster_stemmer = LancasterStemmer()
    print(lancaster_stemmer.stem(strin))


# 效率次干提取
def snowball(strin):
    snowball_stemmer = SnowballStemmer("english")
    print(snowball_stemmer.stem(strin))


# 词形还原
def lemmatizer(strin):
    wordnet_lemmatizer = WordNetLemmatizer()
    # print(wordnet_lemmatizer.lemmatize(strin))
    return wordnet_lemmatizer.lemmatize(strin)


# 进行词形还原
def centence_change(centence):
    centence = centence.split(" ")
    out_centence = ""
    for item in centence:
        item = lemmatizer(item)
        out_centence += item + " "
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


if __name__ == '__main__':
    url = g.dataPath + "cleanedData.txt"
    centence = centence_input(url)
    print("step1 success")

    out_centence = {}
    sum = 0
    for key in centence.keys():
        sum += 1
        centence[key] = uptolow(centence[key])
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
