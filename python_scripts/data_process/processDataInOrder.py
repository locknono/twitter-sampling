import os
import time
import g

"""
with open('./g.py', 'w', encoding='utf-8') as f:
    f.write('''
import os
import time
dataDays = 7  # 15 + 1
topicNumber = 9
dataPath = '../data/vec/'
ldaDir = dataPath + 'LDA/' + 'alpha=auto/'
''')

os.system('python ./split.py')
os.system('python ./clean.py')
os.system('python ./process.py')
os.system('python ./process_filterShortText.py')
"""
os.system('python ./getLocation.py')
os.system('python ./getFinalLocation.py')
os.system('python ./getFinalLocationJsonFormat.py')

os.chdir('../')
for vertor_size in range(200, 300 + 100, 100):
    for epochs in range(100, 1000,100):
        t1 = time.time()
        fileSuffix = 'iter={0}_vertor={1}'.format(epochs, vertor_size)
        with open('./g.py', 'w', encoding='utf-8') as f:
            f.write('''
import os
import time
dataDays = 7  # 15 + 1
topicNumber = 9
dataPath = '../data/vec/'
ldaDir = dataPath + 'LDA/' + 'alpha=auto/'

docDir= dataPath + 'doc_{0}/'
vector_size={1}
epochs={2}
        '''.format(fileSuffix, vertor_size, epochs))
        os.system('python ./runDoc2vec.py')
        os.system('python ./runTsneForVec.py')
        os.system('python ./runKmeans.py')

        """
        os.chdir('./data_process')
        os.system('python ./getWordCloudDataForVec.py')
        os.system('python ./getRiverDataForVec.py')
        """
        print((time.time() - t1) / 60)

"""
os.chdir('../')
os.system('python ./LDAbyZhangxinlong.py')
"""

"""
os.system('python ./getIDLdaProDict.py')

os.system('python ./getTsneData.py')
"""

"""
os.system('python ../blueNoise.py')
"""

"""
os.system('python ./getHeatmapDataForAllTopics.py')
os.system('python ./getHeatmapDataForOriginalPoints.py')

"""
