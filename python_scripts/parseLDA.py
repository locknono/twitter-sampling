import json
import g

if __name__ == '__main__':
    with open(g.ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f:
        topicProbabilityDict = {}
        invalidCount1 = 0
        invalidCount2 = 0
        for index, line in enumerate(f):
            line = line.strip('\n')
            line = line.replace('(', '[').replace(')', ']')
            line = json.loads(line)

            indexList = []
            count = 0
            for item in line:
                indexList.append(item[0])
                count += item[1]
            if len(indexList) != 10:
                invalidCount1 += 1
                print(line)
            if round(count, 2) != 1:
                invalidCount2 += 1
                print(count)
        print(invalidCount1, invalidCount2)
