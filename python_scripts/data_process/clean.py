# @author zhouxiaoyun,guozhiyong
import codecs
import re
import g
import os


def clean():
    tweets = []
    with open(g.dataPath + 'extractedData.txt', 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            try:
                tweet = line.strip("\t\n").split("\t")
                tweets.append(tweet)
            except:
                pass
    writeF = codecs.open(g.dataPath + 'cleanedData.txt', 'w', encoding='utf-8')  # 文件对应
    for i in range(len(tweets) - 1, 0, -1):
        #repeat hashtag
        """
        tagPattern = r'#.+\s'
        matches = re.findall(tagPattern, tweets[i][1])
        if len(matches) > 0:
            texts = matches[0]
            words = texts.split(' ')
            for word in words:
                if word.startswith('#'):
                    tweets[i][1] += ' '
                    for i in range(3):
                        appendWord = word + ' '
                        tweets[i][1] += appendWord
        """

        tweets[i][1] = tweets[i][1].lower()

        tweets[i][1] = re.sub('http.+', '', tweets[i][1])

        tweets[i][1] = re.sub('new ', '', tweets[i][1])
        tweets[i][1] = re.sub('nyc? ', '', tweets[i][1])
        tweets[i][1] = re.sub('york ', '', tweets[i][1])
        tweets[i][1] = re.sub('nj ', '', tweets[i][1])
        tweets[i][1] = re.sub('de ', '', tweets[i][1])
        tweets[i][1] = re.sub('eb ', '', tweets[i][1])
        tweets[i][1] = re.sub('la ', '', tweets[i][1])

        tweets[i][1] = re.sub(u'[\U0001F100-\U0001F1FF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0001F300-\U0001F5FF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0001F600-\U0001F64F]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0001F900-\U0001F9FF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00002000-\U0000206F]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00002600-\U000026FF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00002700-\U000027BF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00002B00-\U00002BFF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0000D83D-\U0000DE29]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0000FE00-\U0000FE0F]', '', tweets[i][1])
        # 文本去其他语言
        tweets[i][1] = re.sub(u'[\U00000980-\U000009FF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00000180-\U0000024F]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00001E00-\U00001EFF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00000590-\U000005FF]', '', tweets[i][1])
        ##  过滤其他语言
        #  日文
        tweets[i][1] = re.sub(u'[\U00003040-\U0000309F]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U000030A0-\U000030FF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U000031F0-\U000031FF]', '', tweets[i][1])
        #  韩文
        tweets[i][1] = re.sub(u'[\U0000AC00-\U0000D7AF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00001100-\U000011FF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00003130-\U0000318F]', '', tweets[i][1])
        # 阿拉伯语
        tweets[i][1] = re.sub(u'[\U00000600-\U000006FF]', '', tweets[i][1])
        # 西语
        tweets[i][1] = re.sub(u'[\U00000080-\U000000FF]', '', tweets[i][1])
        # 过滤标点符号
        tweets[i][1] = re.sub("[\sa-zA-Z0-9’!$%&\(〜)*+,./／:;；十：（<=>?@，。?★、…【】）《＜＞》？“”‘’！[\\]^_`{|}~～＂「—]@", " ",
                              tweets[i][1])
        # 去标点
        tweets[i][1] = re.sub(u'[\U00000000-\U00000026]', ' ', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00000028-\U00000030]', ' ', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0000003A-\U0000003F]', ' ', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00000031-\U00000039]', ' ', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0000007B-\U0000007F]', ' ', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0000005B-\U00000060]', ' ', tweets[i][1])
        # 其他语言
        tweets[i][1] = re.sub(u'[\U00000400-\U000004FF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00000100-\U0000017F]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0000FF01-\U0000FF1F]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0000FF3B-\U0000FF40]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0000FF5B-\U0000FF65]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U0001F680-\U0001F6FF]', '', tweets[i][1])
        tweets[i][1] = re.sub(u'[\U00004E00-\U00009FFF]', '', tweets[i][1])
        # 繁体中文
        tweets[i][1] = re.sub(u'[\U00000370-\U000003FF]', '', tweets[i][1])
        # 梵文
        tweets[i][1] = re.sub(u'[\U00000900-\U0000097F]', '', tweets[i][1])
        # @没去掉重新去一哈
        tweets[i][1] = re.sub(u'[\U00000040]', '', tweets[i][1])
        # -换单空格
        tweets[i][1] = re.sub(u'[\U0000002D]', ' ', tweets[i][1])
        # '换空格
        tweets[i][1] = re.sub(u'[\U00000027]', '', tweets[i][1])
        # 多空格换单空格
        tweets[i][1] = re.sub(" +", " ", tweets[i][1])

        tweets[i][1] = re.sub('im\s', '', tweets[i][1])

        writeF.write(
            tweets[i][0] + '\t' + tweets[i][1] + '\t' + tweets[i][2] + '\t' + tweets[i][3] + '\t' + tweets[i][4] +
            '\t\n')
if __name__ == '__main__':

    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)

    clean()
