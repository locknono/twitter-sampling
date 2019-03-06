import g
import json

if __name__ == '__main__':
    with open(g.ldaDir + 'idLdaDict.json', 'r', encoding='utf-8') as f:
        idLdaDict = json.loads(f.read())
        for id in idLdaDict:
            for i, v in enumerate(idLdaDict[id]):
                pass
