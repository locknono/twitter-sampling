import os
import time
import g

t1 = time.time()

os.system('python ./split.py')
os.system('python ./clean.py')
os.system('python ./process.py')
os.system('python ./process_filterShortText.py')

os.system('python ./getLocation.py')
os.system('python ./getFinalLocation.py')
os.system('python ./getFinalLocationJsonFormat.py')

os.system('python ./getGrids.py')

os.system('python ./blueNoise.py')

os.system('python ./LDAbyZhangxinlong.py')

os.system('python ./getHeatmapData.py')
os.system('python ./getHeatmapDataForOriginalPoints.py')

print((time.time() - t1) / 60)
