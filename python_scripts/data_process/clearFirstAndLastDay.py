# @author zhouxiaoyun,guozhiyong
import codecs
import re
import g
import os
import json


def clean():
    tweets = []
    with open(g.dataPath + 'extractedData.txt', 'r', encoding='utf-8', errors='ignore') as f:
        with open(g.dataPath + 'finalExtractedData.txt', 'w', encoding='utf-8', errors='ignore') as wf:
            for line in f:
                try:
                    tweet = line.strip("\t\n").split("\t")
                    time = tweet[2]
                    day = int(time.split(' ')[0].split('-')[2])
                    if day == g.startDay or day == g.startDay + g.dataDays + 1:
                        continue
                    else:
                        wf.write(line)

                except Exception as e:
                    print(e)


if __name__ == '__main__':
    print('clear first and last day')
    cwd = os.getcwd()
    wd = os.path.split(cwd)[0]
    os.chdir(wd)

    clean()
