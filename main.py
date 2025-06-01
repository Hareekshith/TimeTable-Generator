import random

#It is just a complex sudoku, we have to track every subject and a class simultaeneously so that nothing overlaps over another!

d = [["English"], ["Hindi"], ["Tamil"],["Sanskrit"],["Maths"],["Science"],["Social1"],["Social2"],["ValueED"],["Comp"],["AI"],["PET"],["Phy"],["Chem"],["Acc"],["BS"]]

def overlapchecker(d,s,p):
    a = any(s in sl for sl in d)
    if d[s].count(p)==1 and (any(d[s].count(p+1)) or any(d[s].count(p-1))):
        return 1
    return 0

def getRanDl(d,l):
    a = random.randint(0,l)
    ij = 0
    for i in d.keys():
        if ij==a:
            return i
        else:
            ij+=1
#let's divide each day into 10 periods, where Monday is p1....p10, Tuesday is p11....p20 and so on till Friday's p40....p50

d1=[[],[],[],[],[]]
d2=[[],[],[],[],[]]
d3=[[],[],[],[],[]]
d4=[[],[],[],[],[]]
d5=[[],[],[],[],[]]



for i in range(5):
    for j in range(10):
        a = d[random.randint(0,len(d))][0]
        if overlapchecker(d1,a,i*10+j)==0:
            d1[i][j] = a
            d[a].append(i*10+j)
print(d1)
