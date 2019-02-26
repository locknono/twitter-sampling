import numpy as np
import matplotlib.pyplot as plt
import json


def showS():
    with open('../data/samplePoints.json', 'r', encoding='utf-8') as f:
        data = json.loads(f.read())
        N = len(data)
        x = []
        y = []
        r = [0, 100]
        for p in data:
            x.append(p['lng'])
            y.append(p['lat'])
            r.append(p['r'])
        fig = plt.figure()
        ax = plt.subplot()
        ax.scatter(x, y, r, alpha=0.5)  # 绘制散点图，面积随机
        plt.show()


def showRing():
    with open('../data/pr2r.json', 'r', encoding='utf-8') as f:
        data = json.loads(f.read())
        N = len(data)
        x = []
        y = []
        for p in data:
            x.append(p['lng'])
            y.append(p['lat'])
        fig = plt.figure()
        ax = plt.subplot()
        ax.scatter(x, y, alpha=0.5)  # 绘制散点图，面积随机
        plt.show()


showS()
