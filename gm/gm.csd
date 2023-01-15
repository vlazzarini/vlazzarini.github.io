<CsoundSynthesizer>
<CsOptions>
-odac -d 
</CsOptions>
<CsInstruments>
nchnls = 2
ksmps = 64
0dbfs = 1            

ichn = 1
lp1: massign   ichn, 0
loop_le   ichn, 1, 16, lp1
pgmassign 0, 0
gisf sfload "gm.sf2"
sfpassign  0, gisf

/* this instrument parses MIDI input
   to trigger the GM soundfont synthesis
   instrument (instr 10
*/
instr 1
idkit = 317 /* drum-kit preset was 317*/
tableiw idkit, 9, 1
irel = 0.5 /* release envelope */

ipg = 1
ivol = 2
ipan = 3

nxt:
  kst, kch, kd1, kd2 midiin

  if (kst != 0) then
    kch = kch - 1
    if (kst == 144 && kd2 != 0) then ; note on
        kpg table kch, ipg 
        /* instrument identifier is 10.[chn][note] */
        kinst = 10 + kd1/1000000 + kch/1000  
        if kch == 9 then
         /* exclusive identifiers */
         if kpg == idkit+7 then
           krel = 2    /* add extra release time for orch perc*/
         else
           krel = 0.5
         endif
         if (kd1 == 29 || kd1 == 30) then ; EXC7
          kinst = 10.97
         elseif (kd1 == 42 || kd1 == 44 || kd1 == 46 || kd1 == 49) then ; EXC1
           kinst = 10.91
         elseif (kd1 == 71 || kd1 == 72) then ; EXC2         
           kinst = 10.92
         elseif (kd1 == 73 || kd1 == 74) then ; EXC3         
           kinst = 10.93
         elseif (kd1 == 78 || kd1 == 79) then ; EXC4         
           kinst = 10.94
         elseif (kd1 == 80 || kd1 == 81) then ; EXC5         
           kinst = 10.95
         elseif (kd1 == 86 || kd1 == 87) then ; EXC6         
           kinst = 10.96
         endif
        else
         krel = 0.5
        endif
        event "i", kinst, 0, -1, kd1, kd2, kpg, kch,krel
        tablew 1,kd1,7
     
    elseif (kst == 128 || (kst == 144 && kd2 == 0)) then ; note off
        kpg table kch, ipg
        kinst = 10 +  kd1/1000000 + kch/1000
        if kch == 9 then
         if (kd1 == 29 || kd1 == 30) then ; EXC7
          kinst = 10.97
         elseif (kd1 == 42 || kd1 == 44 || kd1 == 46 || kd1 == 49) then ; EXC1
           kinst = 10.91
         elseif (kd1 == 71 || kd1 == 72) then ; EXC2         
           kinst = 10.92
         elseif (kd1 == 73 || kd1 == 74) then ; EXC3         
           kinst = 10.93
         elseif (kd1 == 78 || kd1 == 79) then ; EXC4         
           kinst = 10.94
         elseif (kd1 == 80 || kd1 == 81) then ; EXC5         
           kinst = 10.95
         elseif (kd1 == 86 || kd1 == 87) then ; EXC6         
           kinst = 10.96
         endif
        else
         kpg = 0
        endif
        event "i", -kinst, 0, 1
        tablew 0,kd1,7
     
    elseif (kst == 192) then /* program change msgs */
       if kch == 9 then
         kpg = idkit
         if kd1 == 8 then
         kpg = idkit+1
         elseif kd1 == 16 then
         kpg = idkit+2
         elseif kd1 == 24 then
         kpg = idkit+3
         elseif kd1 == 25 then
         kpg = idkit+4
         elseif kd1 == 32 then
         kpg = idkit+5
         elseif kd1 == 40 then
         kpg = idkit+6
         elseif kd1 == 48 then
         kpg = idkit+7
         endif
       else
       kpg = kd1 
       endif
       tablew  kpg, kch, ipg
    elseif (kst == 176 && kd1 == 11) then /* volume msgs */
       tablew kd2, kch, ivol
    elseif (kst == 176 && kd1 == 7) then /* pan msgs    */
       tablew kd2, kch, ipan
    endif
     kgoto nxt
  endif

endin

/* this is the GM soundfont synthesizer instrument */
instr 10
iamp table p5, 5
aenv linenr iamp,0,p8,0.01
imicro = 2^(frac(p4)/12)
kbend table p7,14
a1, a2 sfplay p5, int(p4), aenv*0.0001, imicro*kbend, p6, 0, 0, 2
kv table p7, 2
kvol tablei kv, 5 
kpan  table p7, 3
kpan = (kpan - 64)/128
a1 *= kvol*(0.5-kpan/2)
a2 *= kvol*(0.5+kpan/2)
krev table p7,8
garev1 += a1*krev
garev2 += a2*krev
       outs a1, a2 
endin

// sample playback
instr 11
ifo table p7,10
ifn table p6,9
iamp table p5,5
iln = ftlen(ifn)/(ftsr(ifn)*ftchnls(ifn))
imicro = 2^(frac(p4)/12)
ipitch = imicro*cpsmidinn(p4)/cpsmidinn(ifo)
kstart table p7,11
kend table p7,12
kstart = kstart > 0 ? kstart : 0;
klend = kend > 0 ? kend : iln;
kfade table p7, 13
kpitch table p7, 14
kpan  table p7, 3
kpan = (kpan - 64)/128

aenv linenr iamp,0,p8,0.01 
if ftchnls(ifn) == 1 then
a1 flooper2 iamp,ipitch*kpitch,kstart,klend,kfade,ifn
a1 = a1*aenv
a2 = a1*aenv
else 
a1,a2 flooper2 iamp,ipitch*kpitch,kstart,klend,kfade,ifn 
a1 = a1*aenv
a2 = a2*aenv
endif

a1 *= (0.5-kpan/2)
a2 *= (0.5+kpan/2)
krev table p7,8
garev1 += a1*krev
garev2 += a2*krev
       outs a1, a2
if kend == 0 then
 kend = (iln - p8*2.1)/(ipitch*kpitch)  
 if timeinsts() >= kend then
  turnoff 
 endif
endif              
endin


// sample playback (spectral)
instr 12
ifo table p7,10
ifn table p6,9
iamp table p5,5
iln = ftlen(ifn)/(ftsr(ifn)*ftchnls(ifn))
imicro = 2^(frac(p4)/12)
ipitch = imicro*cpsmidinn(p4)/cpsmidinn(ifo)
kstart table p7,11
kend table p7,12
kstart = kstart > 0 ? kstart : 0;
klend = kend > 0 ? kend : iln;
kpitch table p7, 14
kpan  table p7, 3
kpan = (kpan - 64)/128
ksp  table p7, 15

aph phasor ksp/(klend - kstart)
atimpt = kstart + aph*(klend - kstart)
aenv linenr iamp,0,p8,0.01 
if ftchnls(ifn) == 1 then
a1 mincer atimpt,iamp,ipitch*kpitch,ifn,1
a1 = a1*aenv
a2 = a1*aenv
else 
a1,a2 mincer atimpt,iamp,ipitch*kpitch,ifn,1 
a1 = a1*aenv
a2 = a2*aenv
endif

a1 *= (0.5-kpan/2)
a2 *= (0.5+kpan/2)
krev table p7,8
garev1 += a1*krev
garev2 += a2*krev
       outs a1, a2
if kend == 0 then
 kend = (iln - p8*2.1)/(ipitch*ksp)  
 if timeinsts() >= kend then
  turnoff 
 endif
endif              
endin



// loading tables
// i2 0 0 "sample" f0 pgm chn
instr 2
S1 = p4
ign ftgen 0,0,0,1,S1,0,0,0
tablew ign,p6,9
tablew p5,p7,10
endin

instr 100
a1, a2 freeverb garev1, garev2, 0.7, 0.35
outs a1, a2
garev1 = 0
garev2 = 0
endin

//ifn ftgen 8,0,1024,7,0,1024,0
//tableiw 1,100,8
//schedule(10,0,5,60,10,0,100,0.5)
//schedule(10,1,5,60.5,100,0,0,0.5)

//schedule(2,0,0,"/Users/victor/audio/paisley.ogg",48,0,500)
//schedule(12,1,-1,48,100,0,500,0.1)

</CsInstruments>
<CsScore>
/* program preset (memory) table */
f1 0 16 -2 0 0 0 0 0 0 0 0 226 0 0 0 0 0 0 0
/* velocity (memory) table */ 
f2 0 1024 -7 127 1024 127
/* pan (memory) table */
f3 0 1024 -7 64 1024 127
f5 0 128 5 0.1 128 1   /* velocity mapping: less nuanced */
f6 0 128 5 0.01  128 1 /* velocity mapping: more nuanced */
f7 0 128 7 0 128 0  /* note on table */
f8 0 1024 7 0 1024 0  /* reverb amount table */
f9 0 1024 7 0 1024 0  /* sample table */
f10 0 1024 -7 60 1024 60  /* sample base table */
f11 0 1024 -7 0 1024 0  /* sample loop start table */
f12 0 1024 -7 0 1024 0  /* sample loop end table */
f13 0 1024 -7 0.025 1024 0.025  /* sample loop fade table */
f14 0 1024 -7 1 1024 1  /* sample pitch table */
f15 0 1024 -7 1 1024 1  /* sample speed table */
i 1 0 z
i 100 0 z
e
</CsScore>
</CsoundSynthesizer> 
<bsbPanel>
 <label>Widgets</label>
 <objectName/>
 <x>100</x>
 <y>100</y>
 <width>320</width>
 <height>240</height>
 <visible>true</visible>
 <uuid/>
 <bgcolor mode="nobackground">
  <r>255</r>
  <g>255</g>
  <b>255</b>
 </bgcolor>
</bsbPanel>
<bsbPresets>
</bsbPresets>
