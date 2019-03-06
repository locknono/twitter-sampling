# this is a module for global variable named `g` for convenience
import os
import time

dataDays = 12

sampleFilePath = '../data/20kRows.txt'

topicNumber = 10

dataPath = '../data/random/'

"""
’asymmetric’: Uses a fixed normalized asymmetric prior of 1.0 / topicno.
’auto’: Learns an asymmetric prior from the corpus (not available if distributed==True).
"""

ldaDir = dataPath + 'LDA/' + 'alpha=1/'