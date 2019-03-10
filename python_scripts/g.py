# this is a module for global variable named `g` for convenience
import os
import time

dataDays = 10  # 15 + 1

topicNumber = 10

dataPath = '../data/newData/'

"""
’asymmetric’: Uses a fixed normalized asymmetric prior of 1.0 / topicno.
’auto’: Learns an asymmetric prior from the corpus (not available if distributed==True).
"""

ldaDir = dataPath + 'LDA/' + 'alpha=0.3/'
