import random

#It is just a complex sudoku, we have to track every subject and a class simultaeneously so that nothing overlaps over another!

d = {"English":[], "Hindi":[], "Tamil":[],"Sanskrit":[],"Maths":[],"Science":[],"Social1":[],"Social2":[],"ValueED":[],"Comp":[],"AI":[],"PET":[],"Phy":[],"Chem":[],"Acc":[],"BS":[]}

def notoverlapcheck(d,s,p):
    if (s in d):
        if (p in d[s]):
            return 0
        elif (p not in d[s]):
            if (p+1 in d[s]) or (p-1 in d[s]):
                return 0
    return 1

def getRanDl(d,l):
    a = random.randint(0,l)
    ij = 0
    for i in d:
        if ij==a:
            return i
        else:
            ij+=1
#let's divide each day into 10 periods, where Monday is p1....p10, Tuesday is p11....p20 and so on till Friday's p40....p50

d1=[[None for _ in range(10)] for _ in range(5)]
d2=[[None for _ in range(10)] for _ in range(5)]
d3=[[None for _ in range(10)] for _ in range(5)]
d4=[[None for _ in range(10)] for _ in range(5)]
d5=[[None for _ in range(10)] for _ in range(5)]

def generate(dic,dt):
    for i in range(5):
        for j in range(10):
            a = random.choice(list(d.keys()))
            if notoverlapcheck(d1,a,i*10+j):
                d1[i][j] = a
                d[a].append(i*10+j)

for i in range (5):
    for j in range(10):
        print(d1[i][j],end=" ")
    print("\n")

print(d)
