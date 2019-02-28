if __name__ == '__main__':
    count=0
    with open ('../data/extractedData.txt','r',encoding='utf-8') as f:
        while(f.readline()):
            print(f.readline())
            count+=1
    print(count)