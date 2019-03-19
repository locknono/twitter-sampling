import g
import json
import os

if __name__ == '__main__':

    with open('../../data/yelp/clean_PA_step_data.json', 'r', encoding='utf-8') as f:
        with open('../../data/yelp/LDALDA_document_to_topic_largest_NY_9.txt', 'r', encoding='utf-8') as f2:
            with open('../../data/yelp/LDALDA_topic_document_pro_NY_9.txt', 'r', encoding='utf-8') as f3:
                with open('../../data/yelp/finalText.txt', 'w', encoding='utf-8') as wf:
                    mapClassPoints = []
                    idLdaDict = {}
                    idLocation = {}
                    for i in range(g.topicNumber):
                        mapClassPoints.append([])
                    for line, line2, line3 in zip(f, f2, f3):

                        line = json.loads(line)
                        id = line['user_id']
                        text = line['text']
                        lat = line['latitude']
                        lng = line['longitude']
                        idLocation[id] = [lat, lng]

                        line2 = json.loads(line2)

                        lda = json.loads(line3.replace('(', '[').replace(')', ']'))

                        ldaList = []
                        for i in range(g.topicNumber):
                            ldaList.append(0)
                        for item in lda:
                            index = item[0]
                            value = item[1]
                            ldaList[index] = value

                        topic = line2[0]
                        mapClassPoints[topic].append([lat, lng])
                        idLdaDict[id] = ldaList

                        wf.write(id + '\t' + text + '\t\n')
                    with open('../../data/yelp/mapClassPoints.json', 'w', encoding='utf-8') as wf2:
                        wf2.write(json.dumps(mapClassPoints))
                    with open('../../data/yelp/idLdaDict.json', 'w', encoding='utf-8') as wf3:
                        wf3.write(json.dumps(idLdaDict))
                    with open('../../data/yelp/finalIDLocation.json', 'w', encoding='utf-8') as wf3:
                        wf3.write(json.dumps(idLocation))
