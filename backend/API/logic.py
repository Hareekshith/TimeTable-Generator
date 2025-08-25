import random
import math
import json

def can_assign(cnts, t, d, max_per_day):
    return cnts[t][d] < max_per_day

def can_place(tt, d, p, sub):
    row = tt[d]
    # Check left
    if p >= 2 and row[p-1] == sub and row[p-2] == sub:
        return False
    if p >= 1 and p < len(row)-1 and row[p-1] == sub and row[p+1] == sub:
        return False
    if p < len(row)-2 and row[p+1] == sub and row[p+2] == sub:
        return False
    return True

def gen_schedule(data, per_day=10):
    ts = [t['name'] for t in data['teachli']]
    t_tt = {t: [[" " for _ in range(per_day)] for _ in range(5)] for t in ts}
    t_cnt = {t: [0]*5 for t in ts}
    c_tt = {}
    max_p = math.floor(0.8 * per_day)

    for c in data['clali']:
        cname = c['name']
        det = c['details']
        sub_t = {}
        parts = [p.strip() for p in det.split(',')]
        for p in parts:
            i1, i2 = p.index('('), p.index(')')
            s = p[:i1].strip()
            t = p[i1+1:i2].strip()
            sub_t[s] = t

        subs = list(sub_t.keys())
        ttl = 5 * per_day
        sc = {}
        base = ttl // len(subs)
        ext = ttl % len(subs)
        for i, s in enumerate(subs):
            sc[s] = base + (1 if i < ext else 0)

        tt = [["" for _ in range(per_day)] for _ in range(5)]

        for d in range(5):
            periods = list(range(per_day))
            random.shuffle(periods)
            for p in periods:
                random.shuffle(subs)  # Try different order every time
                for s in subs:
                    t = sub_t[s]
                    if sc[s] > 0 and can_assign(t_cnt, t, d, max_p) and can_place(tt, d, p, s):
                        tt[d][p] = s
                        t_tt[t][d][p] = cname
                        t_cnt[t][d] += 1
                        sc[s] -= 1
                        break
        for d in range(5):
            for p in range(per_day):
                if tt[d][p] == "":
            # Try to assign anything leftover
                    for s in sorted(subs, key=lambda x: sc[x], reverse=True):
                        if sc[s] > 0:
                            t = sub_t[s]
                            tt[d][p] = s
                            t_tt[t][d][p] = cname
                            t_cnt[t][d] += 1
                            sc[s] -= 1
                            break

        c_tt[cname] = tt

    return {
        "classes": c_tt,
        "teachers": t_tt
    }
