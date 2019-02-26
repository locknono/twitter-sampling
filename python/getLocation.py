import codecs
import g

with open(g.dataPath + 'cleanedData.txt', 'r', encoding='utf-8') as f:
    wf = codecs.open(g.dataPath + "idLocation.csv", 'w+', encoding='utf-8')
    wf.write('id,lat,lng\n')
    for line in f:
        line = line.strip('\t\n').split('\t')
        textID = line[0]
        lat = line[3]
        lng = line[4]
        wf.write(textID + ',' + lat + ',' + lng + '\n')
    wf.close()
