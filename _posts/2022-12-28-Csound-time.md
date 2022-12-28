---
layout: post
title:  "It's Csound Time in JS"
date:   2022-12-28 11:00:00
categories: blogpost
---

In the previous posts, we have looked at how we can handle musical
time in JS. It is not straightforward, if a steady pulse is required,
as JS was never designed as a music programming language. However,
[Csound](https://csound.com) was, and since we are already using it
for making sound, why not take advantage of its scheduling strengths?
As we will see, this requires some rethinking, but once that is out of
the way, we can reap the benefits.

Scheduling 
--------

The original idea was to have instruments with a `play()` action
that would make sound immediately, coupled with a `stop()` that 
made it quit playing. This was very simply implemented by sending
two respective MIDI messages to Csound, NOTEON and NOTEOFF. However,
after the first experiments, we concluded that there is no simple way
to schedule these accurately to start and stop sounds. Therefore we
now change tack. The idea is to add a `when` parameter so the sound
can be scheduled to happen at some precise time in the future (or now,
if the time is zero),

```
instr.play(when, ...)
instr.stop(when, ...)
```

The Csound scheduler then acts diligently to count time without any
further delay (beyond the one involved in the JS call, which is
hopefully negligible). The beauty of this is that now we can work
independently of the JS timer, as we can compute the required time
for the next event and just schedule it ahead. The
`setTimeout()` function is still used, but just as a means to allow
the recursion to work without locking the JS interpreter. We ignore
its exact timing; as long as it gets called repeatedly without an
exceptionally big break, we are good.

We can adopt the previous strategy to use the audio stream clock as a
reference. All we need to do is to slot in the new `play()` call and
give it the corrected time,

```
percussion = function (instr, amp, dur, old) {
 let t = secs(dur);
 let delta = audioClock() - (t + old);
 if (delta >= 0) {
  drums.play(t - delta, instr, amp);
  setTimeout(percussion.bind(null, instr, amp, 
                             dur, audioClock() - delta));
 } else setTimeout(percussion.bind(null, instr, amp, 
                                   dur, old));
};
```

In the case of the bass line, we can also schedule when to stop, which
solves also some of the difficulties we had before,

```
bassline = function (note, amp, dur, old) {
 let t = secs(dur);
 let delta = audioClock() - (t + old);
 if (delta >= 0) {
  bass.play(t - delta, note, amp);
  bass.stop(t - delta + t * 0.9, note);
  note += 7;
  if (note > Bb[3]) note -= 24;
  setTimeout(bassline.bind(null, note, amp, 
	                       dur, audioClock() - delta));
  } else setTimeout(bassline.bind(null, note, amp, 
                                  dur, old));
};
```

The result can be checked out in [this
sketch](https://editor.p5js.org/vlazzarini/sketches/ifsOSPL7r).

Results
-----

Finally, we seem to have got somewhere. The combination of using the
audio clock for reference and the Csound scheduler give us a means of
delivering a steady stream of events. Tests have shown this to be very
resilient and continue playing regularly for long periods. I am not
sure what would happen if the timeout recursion had a long
interruption for one or reason or another, although that has not
happened yet in any tests. It is possible to stop the sequences
playing (by redefining the callbacks to stop recursing) and start
again, without any issues.

Conclusions
------

These three experiments with JS time taught us a solid method to
construct sequencers for musical applications. We have now the basis
to create an environment to explore beat-based (or strong-timed) music
programming in JS. The learnings achieved can now be incorporated in a
*lite programming* API, which we will introduce in the next posts.
