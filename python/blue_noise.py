
# coding: utf-8

# In[1]:


import random
import math

import numpy as np  
from scipy import stats  
import copy
import json
import os
fuck_data=[]
full_data=[]
station_data=[]

def readData():
    fo1 = open("../data/dataForblue_noise.txt",'r',encoding="utf-8")
    for line in fo1.readlines():
        term = line.strip().split(' ')
        fuck_data.append([float(term[1]),float(term[2]),term[0]])
    v1 = [x[0] for x in fuck_data];v2 = [x[1] for x in fuck_data]
    max1 = max(v1);min1 = min(v1);max2 = max(v2);min2 = min(v2)
    nor1 = max1 - min1;nor2 = max2 - min2
    for item in range(len(fuck_data)):
        x = fuck_data[item][0]
        y = fuck_data[item][1]
        _x=(x-min1)/nor1
        _y=(y-min2)/nor2
        station_data.append([x,y,_x,_y,_x*1000,_y*800,fuck_data[item][2]])
        full_data.append([_x*1000,_y*800,fuck_data[item][2]])
def distance(p1, p2):
    p_diff = (p2[0] - p1[0], p2[1] - p1[1])
    return math.sqrt(math.pow(p_diff[0], 2) + math.pow(p_diff[1], 2))
def saveData():
    full_points=[]
    for i in range(len(full_data)):
        points={}
        points["X"]=full_data[i][0]
        points["Y"]=full_data[i][1]
        points["Name"]=full_data[i][2]
        full_points.append(points)
    with open('full_points.json', 'w') as f:
        json.dump(full_points, f,indent=1)
        f.close()

    samples_points_all=[]
    for i in range(len(samples_all)):
        samples_points = {}
        for j in range(len(samples_all[i])):
            points={}
            points["X"]=samples_all[i][j][0]
            points["Y"]=samples_all[i][j][1]
            points["R"] = samples_all[i][j][2]
            points["Name"]=samples_all[i][j][3]
            points["Points"]=samples_all[i][j][4]
            samples_points[str(j)]=points
        samples_points_all.append(samples_points)
    with open('samples_points.json', 'w') as f:
        json.dump(samples_points_all, f,indent=1)
        f.close()

    # leave_points_all=[]
    # for i in range(len(leave_all)):
    #     leave_points={}
    #     for j in range(len(leave_all[i])):
    #         points={}
    #         points["X"]=leave_all[i][j][4]
    #         points["Y"]=leave_all[i][j][5]
    #         points["Name"]=leave_all[i][j][6]
    #         leave_points[str(j)]=points
    #     leave_points_all.append(leave_points)
    # with open('leave_points.json', 'w') as f:
    #     json.dump(leave_points_all, f,indent=1)
    #     f.close()
def generate_random_point(random_p, r,dataset):
    r_2r_list=[]
    for i in range(len(dataset)):
        point=[dataset[i][4],dataset[i][5]]
        if distance(random_p,point)>r and distance(random_p,point)<2*r:
            r_2r_list.append(dataset[i])       
    return r_2r_list
def generate_points(kde_function,dataset,radius):
    del samples[:]
    len_s = len(dataset)
    # Choose a point randomly in the domain.
    i  = int(random.random()*len_s)
    initial_point = dataset[i]
    first_radius=1/(float(kde_function(np.array([initial_point[2],initial_point[3]])))) * radius
    index = 0
    while (index < len(dataset)):
        ix = dataset[index][4]
        iy = dataset[index][5]
        if (distance((initial_point[4],initial_point[5]), (ix, iy)) < first_radius):
            del (dataset[index])
            continue
        index += 1
    samples.append([initial_point[4],initial_point[5],first_radius,initial_point[6]])
    active_list.append(initial_point)

    while len(active_list) > 0:
    #for i in range(0,2):
        # Choose a random point from the active list.
        p_index = random.randint(0, len(active_list) - 1)
        random_p = active_list[p_index]
        #print(len(active_list))
        found = False
        # Generate up to k points chosen uniformly at random from dataset
        minimum_dist =1/(float(kde_function(np.array([random_p[2],random_p[3]])))) * radius
        #获得数组r到2r
        pn_list = generate_random_point([random_p[4],random_p[5]], minimum_dist,dataset)
        """
        if len(pn_list)==0:
            active_list.remove(random_p)
            continue
        """
        k = 30
        p=0
        for it in range(k):
            if p>=len(pn_list):
                break
            pn=(pn_list[p][4],pn_list[p][5])
            fits = True
            # TODO: Optimize.  Maintain a grid of existing samples, and only check viable nearest neighbors.
            for point in range(len(samples)):
                r_pn=1/(float(kde_function(np.array([pn_list[p][2],pn_list[p][3]])))) * radius
                if distance((samples[point][0],samples[point][1]), pn) < max(samples[point][2],r_pn):
                    fits = False
                    p+=1
                    break
            if fits:
                minimum_dist_samples=1/(float(kde_function(np.array([pn_list[p][2],pn_list[p][3]])))) * radius
                index = 0
                while (index < len(dataset)):
                    ix = dataset[index][4]
                    iy = dataset[index][5]
                    if (distance(pn, (ix, iy)) < minimum_dist_samples):
                        del (dataset[index])
                        continue
                    index += 1
                samples.append([pn_list[p][4], pn_list[p][5], minimum_dist_samples,pn_list[p][6]])
                active_list.append(pn_list[p])

                found = True
                break
        if not found:
            active_list.remove(random_p)

def Getpoints(samples,gene_data):
    for i in range(len(samples)):
        Pointslist=[]
        for j in range(len(gene_data)):
            if(distance((samples[i][0],samples[i][1]),(gene_data[j][4],gene_data[j][5]))<samples[i][2]):
                Pointslist.append([gene_data[j][6],gene_data[j][2],gene_data[j][3]])
        samples[i].append(Pointslist)



readData()
data1=[]
for item in station_data:
    data1.append([item[2],item[3]])
data1=np.array(data1)
values=data1.T
kde=stats.gaussian_kde(values)
samples_all = []
#leave_all = []

r_list=[10,20,30,40,50,60,70,80,90,100]
for i in range(0,10):
    gene_data = copy.deepcopy(station_data)
    samples = []
    active_list = []
    #leave_points = []
    generate_points(kde,gene_data,r_list[i])
    Getpoints(samples,station_data)
    samples_all.append(samples)
    #leave_all.append(leave_points)
#print(samples)
saveData()

#print(samples)
#print(station_data)




