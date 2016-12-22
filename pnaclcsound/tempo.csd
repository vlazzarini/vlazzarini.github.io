<CsoundSynthesizer>
<CsOptions>
-odac -t60
</CsOptions>
<CsInstruments>

nchnls = 2
gi1 chnget "tempo"
schedule 2, 0, -1

instr 1
  a2 expon 0.5,p3,0.001
  a1 oscil 0dbfs*a2, cpspch(p4)
  out a1
endin

instr 2
k1 chnget "tempo"
tempo 60*(k1+1), 60*(gi1+1)
k2 tempoval
printk2 k2
endin

instr 3
setscorepos 0
schedule 2, 0, -1
turnoff
endin


</CsInstruments>
<CsScore>

{ 100 CNT
i 1 [00.00+$CNT] 00.5 8.00
i 1 [00.25+$CNT] 00.5 8.04
i 1 [00.50+$CNT] 00.5 8.07
i 1 [00.75+$CNT] 00.5 8.10
}


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
 <bsbObject type="BSBHSlider" version="2">
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
  <maximum>1.00000000</maximum>
  <value>0.46666667</value>
  <mode>lin</mode>
  <mouseControl act="jump">continuous</mouseControl>
  <resolution>-1.00000000</resolution>
  <randomizable group="0">false</randomizable>
 </bsbObject>
 <bsbObject type="BSBButton" version="2">
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
  <latched>false</latched>
 </bsbObject>
</bsbPanel>
<bsbPresets>
</bsbPresets>
