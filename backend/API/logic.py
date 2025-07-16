import random
import copy

d = {'teachers': [{'name': 'Monica', 'subject': 'Math, Bio, Jargan'}, {'name': 'Kanthi', 'subject': 'Java, OOPs, Python'}, {'name': 'Nirma', 'subject': 'DSD, MPMC, EEE'}, {'name': 'Vijay', 'subject': 'Calculus, DET, DMGT'}, {'name': 'Ethn', 'subject': 'Aptitude'}], 'classes': [{'name': 'Class-1', 'details': 'Math(Monica), Java(Kanthi), DSD(Nirma), Calculus(Vijay)'}, {'name': 'Class-3', 'details': 'Python(Kanthi), EEE(Nirma), DMGT(Vijay), Aptitude(Ethn)'}, {'name': 'Class-2', 'details': 'Bio(Monica), OOPs(Kanthi), MPMC(Nirma), DET(Vijay), Aptitude(Ethn)'}]}

def notoverlapcheck(d,s,p):
    if (s in d):
        if (p in d[s]):
            return 0
        elif (p not in d[s]):
            if (p-1 in d[s]):
                return 0
    return 1

def generate(dic, max_retries=50):
    sub = list(dic.keys())
    tp = 5 * 10
    bs = tp // len(sub) 
    es = tp % len(sub) 
    dt = [[_ for _ in range(10)] for i in range(5)]
    
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
    ttd = dict()
    for i in dic['teachers']:
        tch[i['name']] = []
        
    for i in dic['classes']:
        tchsub = dict()
        for j in [k.strip() for k in i['details'].split(",")]:
            tchsub[j[:j.index("(")]] = j[j.index("(")+1: j.index(")")]
        sub = {_: [] for _ in tchsub}
        tt = generate(sub)
        ttd[i['name']] = tt
    return {"classes":ttd, "teachers":tch}

if __name__ == "__main__":
    print(generate_js(d))
