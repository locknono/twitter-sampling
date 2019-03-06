import g

if __name__ == '__main__':
    with open('../data/2018-10-14.txt', 'r', encoding='utf-8') as f:
        with open(g.sampleFilePath, 'a', encoding='utf-8') as f2:
            for i in range(0, 20000):
                line = f.readline()
                f2.write(line)
