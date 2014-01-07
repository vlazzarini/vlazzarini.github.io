<CsoundSynthesizer>
<CsOptions>
-odac 
</CsOptions>
<CsInstruments>

nchnls = 2
gi1 chnget "tempo"
schedule 2, 0, -1
gkpitch init 0
gkpan init 0

instr 1
  a2 expon 0.5,p3,0.001
  a1 oscil 0dbfs*a2, cpspch(p4)
  outs a1*p5, a1*(1-p5)
endin

instr 2
k1 chnget "tempo"
k1 /= 100
k1 = k1*2 + 0.2
ktrig metro k1
if ktrig == 1 then
gkpitch = (gkpitch == 8.00 ? 8.07 : 8.00)
gkpan = (gkpan == 0 ? 1 : 0)
event "i", 1, 0, 0.5, gkpitch, gkpan
endif
endin

instr 3
schedule 2,0,-1
endin


</CsInstruments>
<CsScore>



</CsScore>
</CsoundSynthesizer>
<bsbPanel>
 <label>Widgets</label>
 <objectName/>
 <x>379</x>
 <y>110</y>
 <width>852</width>
 <height>431</height>
 <visible>true</visible>
 <uuid/>
 <bgcolor mode="nobackground">
  <r>255</r>
  <g>255</g>
  <b>255</b>
 </bgcolor>
 <bsbObject version="2" type="BSBHSlider">
  <objectName>tempo</objectName>
  <x>23</x>
  <y>23</y>
  <width>150</width>
  <height>25</height>
  <uuid>{9799b272-4b78-4bdf-a0ed-46705ca90623}</uuid>
  <visible>true</visible>
  <midichan>0</midichan>
  <midicc>0</midicc>
  <minimum>0.00000000</minimum>
  <maximum>100.00000000</maximum>
  <value>100.00000000</value>
  <mode>lin</mode>
  <mouseControl act="jump">continuous</mouseControl>
  <resolution>-1.00000000</resolution>
  <randomizable group="0">false</randomizable>
 </bsbObject>
 <bsbObject version="2" type="BSBButton">
  <objectName>button1</objectName>
  <x>20</x>
  <y>59</y>
  <width>100</width>
  <height>30</height>
  <uuid>{4fb0158a-a29f-4ea3-821f-fbd6e147a2f3}</uuid>
  <visible>true</visible>
  <midichan>0</midichan>
  <midicc>0</midicc>
  <type>event</type>
  <pressedValue>1.00000000</pressedValue>
  <stringvalue/>
  <text>reset</text>
  <image>/</image>
  <eventLine>i3 0 1</eventLine>
  <latch>false</latch>
  <latched>true</latched>
 </bsbObject>
</bsbPanel>
<bsbPresets>
</bsbPresets>
