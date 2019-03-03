import g
import json

if __name__ == '__main__':
    outputDict = {}
    with open(g.dataPath + 'finalText.txt', 'r', encoding='utf-8') as f1:
        with open(g.ldaDir + 'LDA_topic_document_pro_NY_{0}.txt'.format(g.topicNumber), 'r', encoding='utf-8') as f2:
            for l1, l2 in zip(f1, f2):
                l1 = l1.strip('\n').split('\t')
                textID = l1[0]
                l2 = l2.strip('\n')
                l2 = l2.replace('(', '[').replace(')', ']')
                l2 = json.loads(l2)
                outputDict[textID] = l2

    for k in outputDict:
        values = [0 for i in range(g.topicNumber)]
        for item in outputDict[k]:
            values[item[0]] = item[1]
        outputDict[k] = values

    with open(g.ldaDir + 'idLdaDict.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputDict))
    with open('../client/public/idLdaDict.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(outputDict))
