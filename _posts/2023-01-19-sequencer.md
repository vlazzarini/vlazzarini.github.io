---
layout: post
title:  "Event lists and Sequencer"
date:   2023-01-19 09:00:00
categories: blogpost
---

In our previous post, I introduced `litePlay.js` and its basic
principles of operation. We emphasised the idea of *lite coding*, as
opposed to the more arcane and complex practices of *live coding*.
Although based on simple concepts, it is my intention that the
system should allow enough scope for musical expression within
various forms of music making. 

Within that post, we spoke about the concept of *events*, which are
the bricks with which we can construct a composition. Such events
are defined by five attributes, `what`, `howLoud`, `when`, `howLong`,
and `instr`. The `what` largely depends on the `instr`  used for
the event. For example, an instrument modelled after a piano may
ask for pitches, while another modelled after percussion requires 
the definition of a sound to play. This in fact is fairly open and
can be expanded to instruments that are not modelled after
conventional ones such as these. 

The other attributes are more straightforward as far as their
definition is concerned. How loud an event is defines its intensity
in a scale from 0 to 1. We also should determine the timings
of the events and for how they last; both of these are given in
beats. These timings can be translated to wall clock times in
seconds via the global beats per minute (BPM) setting (`getBPM()`
gives the current BPM, which is set to 60 at the start).

Event Lists
------

We can now introduce the notion of lists of events. The idea is
not completely new, as we have seen that the `.play()` interface
can handle multiple events, and these are effectively lists of events.
More generally, `litePlay.js` has an event list format, which is
nothing more than an array of events, and an `eventList` object
that encapsulates this,

```
list = lp.eventList.create()
```

We can then add events to the list, as in

```
list.add([Bb5, 0.2, 0, 1, lp.piano], [Eb5, 0.4, 0.2, 2, lp.piano])
```

and of course, there's a `.play()` interface as we should expect

```
list.play()
```

In this case, the `.play()` can take as a first argument time offset
so the eventList can be scheduled to play in the future. 

We can clear the list (`.clear()`), remove elements
(`.remove(index)`), or insert (`.insert(ndx, ...events)`). The
eventList create method can also be passed a series of events as
parameters.

Abbreviated Events
------------

As we noted before, events can be abbreviated by passing only
a few attributes. The form of this is

```
[what [,howLoud [,when [,howLong [,instr]]]]]
```

each instrument has a `howLoud` and `howLong` default,
which can be set by the user. The default instrument can also
be set by the `instrument(instr)` function. The `when` in
the case of eventList objects defaults to the end time of the previous
event in the list.


Step Sequencer
--------

Event lists can be used to define complete compositions or parts of
them. They can be used modularly to start patterns, melodies, chord
or sound sequences, at any time on-the-fly. Since the lists themselves
are only JS arrays, it is possible to use algorithmic processes to
fill these, and create `eventList` objects to play them. Separate
event lists however can only be soft-synchronised, as individual
play commands do not reference an external clock. The timing of 
events inside each list is precisely defined, in reference to the list
playback start time, but there is no explict syncing of lists with
other lists.

For that, we introduce the concept of a step sequencer, which is
designed to provide a clock to which any number of sequences
are aligned. With the `sequencer` object, we can have

* sequences: these are defined by event lists (JS arrays) with a
similar format as used in `eventLists`

* callbacks: functions that can be registered to be executed in sync
with the sequencer clock. We can trigger the playback of event
lists with these.

The sequencer runs by moving from one step to another at the
global BPM. This makes its clock beat-based. 

### Sequences

Any number of
sequences can be defined to run on it. For each sequence, we can subdivide
this clock by any (meaningful) number of integer divisions (2, 3, 4, 5
etc). Sequences are given a list of events (as a JS array) and play
these at each beat or subdivided beat. 

To set up a sequence, we use the `.add()` interface to the sequencer

```
sequencer.add(instrument, whatList, [howLoud [,beatDiv]])
```

where we have to provide an instrument, an list of what to play, an optional
overall volume control, and a beat subdivision.

For example, we can have these `whatLists`,

```
const shuf = [[cymbal, 1, 0, 1 / 3], O, [cymbal, 0.9], [cymbal, 0.9]];
const kck = [[kick, 0.1], O, [kick, 0.2]];c
const snr = [snare,O];
```

where an `O` means play nothing, and we can add these to the sequencer

```
const sequencer = lp.sequencer;
const drums = lp.drums;
const cymbals = sequencer.play(drums, shuf, amp, 1/3);
const kicks = sequencer.play(drums, kck, amp, 1/3);
const snares = sequencer.play(drums, snr, amp);
```

When `litePlay.js` starts, the sequencer is stopped. So to hear these
sequences, we need to

```
sequencer.play()
```

The sequencer has a complete set of playback and sequence controls:
`.play()`, `.stop()`, `.togglePause`. Each sequence can be
muted with `.toggleMute(sequence)`,  soloed 
`.toggleSolo(sequence)`, and removed with `.remove(sequence)`.

Since each sequence uses a reference to an existing `whatList`, these
can be modified on the fly to change the patterns played by the step
sequencer. JS offers many array-manipulation methods to easily
pop, push, splice, iterate over, slice, etc. This simplifies the
manipulation of sequences, making the process very malleable.

The sequencer, as all the timing of events, etc in `litePlay.js` is
controlled by the global BPM, which can be adjusted at any time using
the `setBPM()` function. This allows us to manipulate the tempo
of sequences more or less at will.


### Callbacks

Callbacks are functions that can be passed to the sequencer to be
run at the next clock cycle (beat). This guarantees that events
triggered by the sequence are hard-synced to the sequencer
clock. The callback signature is `func(t)` , where `t` is the
sequencer clock time. This should be used to align the playback
of an `eventList` so that the event list is played exactly in sync
with the sequences.

For example,

```
const piano = lp.piano;
const eList = lp.eventList.create(
    piano.event(Eb7, 0.1, 0, 1),
    piano.event(Bb6, 0.1, 0.25, 1),
    piano.event(G6, 0.1, 0.75, 1),
    piano.event(Eb6, 0.1, 1, 1));
sequencer.addCallback((t) => { eList.play(t) });
```

In this code, we are using the `.event()` method from an
instrument, which creates an event with a set of parameters
(`what, howLoud, when, howLong`). The `eList` then
is used in an arrow function defining the callback, and
we can add to the sequencer. The callback is run
only once but it may be rescheduled recursively. 


Conclusions
--------

In this blogpost, we discussed the scheduling and sequencing
components of `litePlay.js`, which can be seen in action in
[this sketch](https://editor.p5js.org/vlazzarini/sketches/c4PhzF39r). 
In keeping with the overall
principle of *lite coding*, we have very simple interfaces, which
nevertheless are quite powerful for constructing event patterns
and whole compositions on-the-fly. As the platform is designed
to be open, it is possible to employ it for various kinds of music
making. In the following posts we will explore a little more the
instrument side of `litePlay.js`, and expand our means of 
control beyond the manipulation of events.



