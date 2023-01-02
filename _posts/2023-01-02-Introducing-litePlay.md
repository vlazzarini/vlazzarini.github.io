---
layout: post
title:  "Introducing litePlay.js"
date:   2023-01-02 11:00:00
categories: blogpost
---

The combination of two off-the-shelf technologies, Csound and p5.js,
provides a formidable platform for computer music and multimedia on
the web. I have already shown some simple examples of this in my
[Vanilla Guide to Csound WASM](https://vlazzarini.githb.io/vanilla),
and further demos are also due to be made available with the upcoming
release of [p5.Csound.js](https://rorywalsh.github.io/p5.Csound/#/). 

This started me thinking of how we could
leverage such technologies for a live coding environment, particularly
considering that the [p5.js editor](https://editor.p5js.org/) provides
a handy JS console where we can type commands on-the-fly. Other JS
IDEs (online or otherwise) may be used, but at the time of writing, I
have not yet found a better environment for what I am proposing here.


Simple as Simple
-------

So, the first idea was to demonstrate how a flexible and simple system
could be constructed using Csound, as I'd already discussed in earlier
posts. I began playing with an interface called GMPlay.js, which
contained means to make sound with very simple JS statements. Then the
question of providing a stable musical time platform was investigated,
and when that part was solved, I could concentrate on the interface
design proper. At that point, litePlay.js was born, provided as an
ECMA6 module, which we will henceforth refer to through 
the namespace `lp`.

The first thing was to reduce everything to a `play()` action that
could be invoked on different objects. Depending on what these were,
slightly different interpretations of play would be effective. That's
the well-known idea of polymorphism in action. We can start at the
outer scope of the platform and say 

```
lp.play()
```

and that would play a sound, which would last for a given duration.
This and all other examples in this post can be run in [this
sketch](https://editor.p5js.org/vlazzarini/sketches/gSpXKc2sX).
We could go to a specific instrument, and similarly

```
lp.organ.play();
```

However, the differences are now that we are being more particular
about the sound we are asking for. Also, when an instrument is turned
on, it stays on until we 

```
lp.organ.stop()
```

And so on, the interface would include more complex musical objects that
can be played in different ways, as we will see later.

What?
------------

Now we may want to be able to define other characteristics of the
sounds played on the platform. Ideally, we want to be able to be
define these in the simplest way possible: `what` shall we play?

The system should be able to respond that in ways that are
recognisable by the user. If we are considering, for instance, 
common-practice Western music, then what could be for instance,
a pitch, defined in scientific pitch notation, or perhaps an unpitched
sound from a standard collection. That seems to be a reasonable
place to start. Now we can say

```
lp.play(Eb5)
```

and we get a pitch corresponding to E flat in the 5th octave (with the
A4 standard tuning, 440Hz). We can also say

```
lp.drums.play(snare)
```

to get a snare drum sound. The interface should allow you to ask for
more sounds from a single instrument at one time,

```
lp.organ.play(C4, E4, G4)
```

and we should be able to hear a major chord. Equally, if we want a
sequence of notes, the generic `play()` should respond appropriately,

```
lp.play(C4, E4, G4)
```

giving us an arpeggio. We should note the polymorphism here: by asking
more than one sound out of an instrument, we get them at the same time
(and held until we tell it to stop playing); conversely, when we ask
the system to play, it gives us the sounds in a sequence (each lasting
for the same duration). It is important to note that the `what` is a
generic attribute that can be made to fit whatever specification we want.
Although we have used the conventions of scientific pitch notation
here, the system itself does not necessarily need to be limited to
these. 

How Loud?
---------

Now we may want to go one step further and give specific
characteristics to the sounds we play. All sounds played on
a given instrument have been played at the same loudness level,
but the interface should allow us to modify that for each sound.
We need to find a way to provide both `what` and `howLoud` 
for each sound played. Here's how it can be done,


```
lp.play([C4, 0.1], [E4, 0.5], [G4, 0.9])
```

We can now group these two attributes together using square
braces `[ ]`, something facilitated through JS arrays. The
resulting arpeggio is then played in a crescendo.

When?
-----

The arpeggio sounds above are each separated by the
previous by an even amount of time (which we may call one beat).
What if we want to disrupt this pattern and make the second note
come earlier in time? As before, the interface should allow us to do
this, and we may use the same method to group the attributes in a
simple way, adding the `when` to it,

```
lp.play([C4, 0.1, 0], [E4, 0.2, 0.5], [G4, 0.4, 2])
```

Now, the first sound comes immediately (0 beats delay), the
second one half a beat later, and the third is played two beats
after the first.

How Long?
-----

We have already noted that in the case of the generic play
interface each sound has the same duration. Changing its
start time (`when`) does not make this any different. So we
can add another attribute to define how long it should last,

```
lp.play([C4, 0.1, 0, 3], [E4, 0.2, 0.5, 0.5], [G4, 0.4, 2, 0.1])
```

In this case, the first sound will be held for three beats, the second
one for half a beat, and the third for 1/10 of a beat.

Instruments
-----

Seeing that different instruments can be used, it would be good to 
allow this to be controlled from the generic play interface. So far,
we have only used a piano sound, which is what we get when
the system is started. We can modify this by

```
lp.instrument(lp.synth);
lp.play(F5, D6);
```

This is good, but it seems to be limiting. The interface should allow
us to give each sound a different instrument,


```
lp.play([C4, 0.3, 0, 3, lp.organ], [E4, 0.6, 0.5, 0.5, lp.synth], [G4,
0.9, 2, 0.2, lp.piano]);
```

Events
-----

With this, we now have defined an important object of the litePlay.js
platform, the event. This is simply a JS array,

```
[what, howLoud, when, howLong, instr]
```

defining the attributes of a sound. Note that any missing parameters
are generally replaced by defaults, and so an event can be given in an
abbreviated form. At its simplest, we can dispense with the array form
and just pass a `what` as we have shown at the start.

Events also work for the instrument play interface, the only change is
that in this case the final parameter is a non-op (the instrument
cannot be changed),

```
lp.organ.play([C4, 0.1, 0, 3], [E4, 0.2, 0.5, 0.5], [G4, 0.4, 2, 0.1])
```

Conclusions
--------

This blogpost introduced litePlay.js, a JS module that is designed to
support music making and live, *lite*, coding. As we were able to see,
it has been written to provide a simple interface, leveraging
intuitive and standard notions about sound and music. It is also
constructed in an open way: while it works on the principle of sounds
as events, it is not prescriptive in terms of what these are beyond
having a character (`what`), an intensity (`howLoud`), a start time
(`when`), a duration (`howLong`) and being played on sound making
object (`instr`). In follow up posts, I will be looking at other
components of litePlay.js that can support the creation of more 
complex musical structures.



