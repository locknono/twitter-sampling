import csv
from itertools import islice

if __name__ == '__main__':
    with open('../data/finalIDLocation.csv', 'r', encoding='utf-8') as f:
        with open('../data/dataForblue_noise.txt', 'w', encoding='utf-8') as wf:
            csvF = csv.reader(f)
            for row in islice(csvF, 1, None):
                wf.write(row[0] + ' ' + row[1] + ' ' + row[2] + '\n')
