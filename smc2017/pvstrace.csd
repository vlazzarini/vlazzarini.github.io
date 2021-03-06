<CsoundSynthesizer>
<CsOptions>
-odac -d
</CsOptions>
<CsInstruments>
nchnls = 2
ksmps = 64

instr 1
kenv = expsegr(1,1,1,0.1,0.001)
k1 chnget "trace"
a1[] = diskin("eskers1.wav")
fs1 pvsanal (a1[0]+a1[1])/2,2048,256,2048,1
fs2 pvstrace fs1, k1
a3 pvsynth fs2
  out a3*kenv, a3*kenv
endin
schedule(1,0,-1)
</CsInstruments>
<CsScore>
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
 <bsbObject type="BSBVSlider" version="2">
  <objectName>trace</objectName>
  <x>143</x>
  <y>94</y>
  <width>20</width>
  <height>100</height>
  <uuid>{27033f1d-34c0-4ed4-b3da-3415e02f0493}</uuid>
  <visible>true</visible>
  <midichan>0</midichan>
  <midicc>0</midicc>
  <minimum>1.00000000</minimum>
  <maximum>128.00000000</maximum>
  <value>63.23000000</value>
  <mode>lin</mode>
  <mouseControl act="jump">continuous</mouseControl>
  <resolution>-1.00000000</resolution>
  <randomizable group="0">false</randomizable>
 </bsbObject>
</bsbPanel>
<bsbPresets>
</bsbPresets>
