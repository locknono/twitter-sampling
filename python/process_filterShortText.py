import codecs
import g

with open(g.dataPath + 'processedData.txt', 'r', encoding='utf-8') as f:
    wf = codecs.open(g.dataPath + 'finalText.txt', 'w+', encoding='utf-8')
    for line in f:
        line = line.strip('\t\n').split('\t')
        if len(line[1].split(' ')) <= 3:
            continue
        wf.write(line[0] + '\t' + line[1] + '\t\n')
