import random
import time
import codecs
import json
import g
from split import ifInbiggerThanNYCBound, ifInNYC

def extractFromSingleFile(filePath, bounds):
    t1 = time.time()
    with open(filePath, 'r', encoding='utf-8') as f:
        for index, line in enumerate(f):
            try:
                line = line.split('\t')
                lat1 = float(line[14])
                lng1 = float(line[13])
                if (ifInNYC(lat1, lng1) == False):
                    continue
                lat3 = float(line[18])
                lng3 = float(line[17])
                bound = [[lat1, lng1], [lat3, lng3]]
            except IndexError as indexErr:
                pass
                # print('invalid data:' + str(indexErr))
            except ValueError as valueErr:
                pass
                # print('invalid data:' + str(valueErr))
            else:
                for b in bounds:
                    if bound[0][0] == b[0][0] and bound[0][1] == b[0][1] and bound[1][0] == b[1][0] and bound[1][1] == \
                            b[1][1]:
                        break
                else:
                    print(len(bounds))
                    bounds.append(bound)

    print((time.time() - t1) / 60)


if __name__ == '__main__':
    bounds = []
    for i in range(14, 14 + g.dataDays):
        print('../data/2018-10-{0}.txt'.format(i))
        extractFromSingleFile('../data/2018-10-{0}.txt'.format(i), bounds)
    with open('../client/public/bounds.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(bounds))
