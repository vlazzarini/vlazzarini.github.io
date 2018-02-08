
instr ping
 a1 = oscili(p4,p5)
 out(a1*expon(1,p3,0.001))
 ;schedule("ping", 0.2, 0.5, p4+birnd(0.1), p5+birnd(10))
endin

schedule("ping", 0,1,0.5,440) 