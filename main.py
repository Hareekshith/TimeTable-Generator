import jsonify

#It is just a complex sudoku, we have to track every subject and a class simultaeneously so that nothing overlaps over another!

d = {"English":[], "Hindi":[], "Tamil":[],"Sanskrit":[],"Maths":[],"EVS","Science":[],"Social1":[],"Social2":[],"ValueED":[],"Comp":[],"AI":[],"PET":[],"Phy":[],"Chem":[],"Acc":[],"BS":[],}

def overlapchecker(s,p):
    if (d[s].count(p)==1):
        return 1
    else:
        return 0

#let's divide each day into 10 period, where Monday is p1....p10, Tuesday is p11....p20 and so on till Friday's p40....p50
