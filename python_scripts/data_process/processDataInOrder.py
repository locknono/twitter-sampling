import os
import time
import g


os.system('python ./split.py')
os.system('python ./clean.py')
os.system('python ./process.py')
os.system('python ./process_filterShortText.py')
os.system('python ./getIDTimeDict.py')
os.system('python ./getLocation.py')
os.system('python ./getFinalLocation.py')
os.system('python ./getFinalLocationJsonFormat.py')

os.chdir('../')
os.system('python ./runAlgoLDA.py')


"""
os.chdir('./data_process')
os.system('python ./getWordCloudDataForVec.py')
os.system('python ./getRiverDataForVec.py')
"""

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
