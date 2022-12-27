---
layout: post
title:  "JS Audio Clock"
date:   2022-12-27 12:00:00
categories: blogpost
---

In the previous post, I explored the simplest form of timing in JS,
which is to use builtin timers such as `setTimeout()` to fire events
at specific times. We noticed that within a music context, this
approach is not resilient enough for applications requiring a steady
pulse, which are strongly timed. We can now investigate what the
alternatives are. The first one of these is the graphics drawing
clock, provided by `requestAnimationFrame()`, but we read it
may be called about 60 times a second, which does not allow us
enough precision on its own. 

Since we are after all generating audio in realtime, there should be
a way to pick up a clock that is derived from this data stream. This
should then be much more precise, in fact just what we need for musical
applications. It will probably not be as simple to handle, but hopefully also
not too complicated.

The Audio Clock
--------

Csound is running under the auspices of the Web Audio API, which
handles the realtime audio streams coming in and out of JS. Web Audio
provides the context for this, which is encapsulated in the
`AudioContext` object. We can access this with a handy asynchronous
method from the Csound object,

```
audio_context = await csound.getAudioContext()
```

Amongst other things, this gives us the current audio time,
which may be neatly packaged as

```
function audioClock() {
   if(audio_context)
   return audio_context.currentTime;
   else return 0;
}
```

Unfortunately, there is no simple mechanism to fire callbacks using
this clock, as there is with the JS timers. So we will need to try and
find a solution to apply it to event scheduling.

Correcting Time
----------

Let's then try the simplest approach. We can still use the JS timer
mechanism to fire events, but now having access to a much better
clock, we can apply a correction to the callback time. This can be
done by taking the difference between the current time (from `audioClock()`) 
and the expected time of the event. When that is zero or 
greater, it's time to play; if it's not, we do nothing and recurse.


This means that events may be scheduled late, but we are able to
record how late and so can adjust the time for the next one. The
callbacks are supposed to be run every millisecond; in practice that
is never quite the case, however the assumption is that they will be
called as soon as possible.

For this idea to work, we need to keep a reference to the time the event
was played (`old` in this code). This is updated taking into 
account the time difference at that moment, which indicates how late
the event was. The principle is shown in the code below, defining
a percussion part,

```
percussion = function (instr, vel, dur, old) {
 let t = secs(dur);
 let delta = audioClock() - (t + old);
 if(delta >= 0) {
  drums.play(instr,vel)
  setTimeout(percussion.bind(null, instr, vel, dur, 
                             audioClock() - delta));
 }
 else setTimeout(percussion.bind(null, instr, vel, 
                                 dur, old));
};

```

A similar function is defined for the bass line; as before it applies
an interval to create a 12-tone sequence for musical movement, 
and splits the sound event into start and stop calls. A
number of these sequences are primed with the current audio time 
to get them running,

```
let t = audioClock();
percussion(cymbal, 0.8, 1, t);
percussion(kick, 0.5, 1.5, t);
percussion(snare,0.5, 2, t);
bassline(Eb[3], 0.6, 1, t);
```

So how does this fare? Is this an improvement to the previous
mechanism? Is it worth the extra trouble? You can judge by yourself,
checking [this
sketch](https://editor.p5js.org/vlazzarini/sketches/b_VAlSWsR).

Results
-------

Again, it seems solid to start with, and for longer than the previous
example. So using the audio clock does appear to make a difference.
However after maybe a couple of minutes, things start to go wrong,
also in the bass line to start with. The effect of splitting the sound
event in two, for start and stop complicates things, but it is not
really the issue here as the percussion parts also fall apart later.

They do so in a different way now; there is a pulse going, which in
the previous case was obliterated. Now it holds together all parts,
but the individual events are mis-timed and make sub-rhythm patterns.
This is because keeping the time errors and correcting for them
has an effect, but does not solve it for individual callbacks being
very late at times (sometimes beyond 100ms). When things fall apart, 
it appears that for every 4 calls, three are reasonably on time,
within a few ms, and one is off by a lot.

It is interesting that functions are steadily fired at the
start but an irregularity is introduced as
time passes. This seems to be related to a loss of precision over
the elapsed period, because even if we stop all recursive calls and start them
again (while the sketch is running), the irregularity does not 
go away.  If we stop running the sketch and re-start, steady 
timing is restored.


Conclusions
------

This is clearly not the solution, but we have learned quite a lot from
it. We now know that for strong-timed applications in JS, it is not 
possible to use an immediate play approach, that is, 
a `instr.play()` interface that requires an external means of 
scheduling. JS does not have one that is fit for this purpose. We
can correct it to a certain extent, but we cannot rely on it. We have
also learned that there is a precise audio clock in JS and we can use
it as a reference.

So where does that leave us? We need to reassess our approach and
find a way to incorporate the strongly-timed Csound scheduler. We
can take this up in the next installment of the series.


