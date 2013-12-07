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
tempo 60*(k1/100+1), 60*(gi1/100+1)
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
