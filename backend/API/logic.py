import random
import copy
import re


def notoverlapcheck(d,s,p):
    if (s in d):
        if (p in d[s]):
            return 0
        elif (p not in d[s]):
            if (p-1 in d[s]):
                return 0
    return 1

def generate(dic, dt, max_retries=50):
    sub = list(dic.keys())
    tp = 5 * 10
    bs = tp // len(sub) 
    es = tp % len(sub) 
    
    sc = {s: bs for s in sub}
    for s in random.sample(sub, es):
        sc[s] += 1

    for day in range(5):
        for period in range(10):
            gp = day * 10 + period
            attempts = 0
            success = False
            while attempts < max_retries and not success:
                candidates = [s for s in sub if sc[s] > 0]
                if not candidates:
                    break  
                subject = random.choice(candidates)
                if notoverlapcheck(dic, subject, gp):
                    dt[day][period] = subject
                    dic[subject].append(gp)
                    sc[subject] -= 1
                    success = True
                attempts += 1
            if not success:
                for s in sub:
                    if sc[s] > 0:
                        dt[day][period] = s
                        dic[s].append(gp)
                        sc[s] -= 1
                        break
    return dt

def generate_js(dic):
    tch = dict()
    for i in dic['teachers']:
        tch[i['name']] = []
        
    for i in dic['classes']:
        tchsub = dict()
        for j in [k.strip() for k in i['details'].split(",")]:
            tchsub[j[:j.index("[")]] = j[j.index("[")+1: j.index("]")]

