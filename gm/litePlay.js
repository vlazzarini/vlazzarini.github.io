// csound.js is the Csound WASM module
const csoundjs =
      "https://cdn.jsdelivr.net/npm/@csound/browser@6.18.5/dist/csound.js";
// csound is the Csound engine object (null as we start)
let csound = null;
// audio context
let audio_context = null;
// source URL for assets
const srcurl = "https://vlazzarini.github.io/gm/";
// CSD file name
const csd = "./gm.csd";
const sfont = "./gm.sf2";

// this is the JS function to start Csound
export async function startEngine(func = null) {
    // if the Csound object is not initialised
    if (csound == null) {
        // import the Csound method from csound.js
        const { Csound } = await import(csoundjs);
        // create a Csound engine object
        csound = await Csound();
        // get audio context
        audio_context = await csound.getAudioContext();
        // set realtime audio (dac) output
        await csound.setOption("-odac");
        // set realtime MIDI input
        await csound.setOption("-M0");
        // copy the sfont file to the Csound local filesystem
        await copyUrlToLocal(srcurl + sfont, sfont);
        // copy the CSD file to the Csound local filesystem
        await copyUrlToLocal(srcurl + csd, csd);
        // compile csound code
        await csound.compileCsd(csd);
        // start the engine
        await csound.start();
    }
    if(func) func();
}

// copy URL to local file
async function copyUrlToLocal(src, dest) {
    // fetch the file
    const srcfile = await fetch(src, { cache: "no-store" });
    // get the file data as an array
    const dat = await srcfile.arrayBuffer();
    // write the data as a new file in the filesystem
    await csound.fs.writeFile(dest, new Uint8Array(dat));
}

// generic midi message
export function midi(stat, b1, b2) {
    csound.midiMessage(stat, b1, b2);
}

// midi program message
export function midiProgram(n, chn = 1) {
    if (chn >= 1 && chn <= 16) csound.midiMessage(chn + 191, n, 0);
}

const globalObj = {
    freeChannel: 16,
    BPM: 60.0
};

// Csound instrument class
class Instrument {
    constructor(pgm, isDrums = false, rel = 0.1, instr = 10) {
        this.pgm = pgm;
        this.chn = globalObj.freeChannel++;
        this.rel = rel;
        this.isDrums = isDrums;
        this.what = 60;
        this.howLoud = 1;
        this.howLong = 1;
        this.on = new Uint8Array(128);
        this.instr = instr;
    }

    score(what, howLoud, when, howLong) {
        let rel = this.rel;
        let prog = this.pgm;
        let instr = this.instr + what / 1000000 + this.chn / 1000;
        if (this.isDrums) {
            if (prog == 7) rel = 2;
            else rel = 0.5;
            if (what == 29 || what == 30) instr = 10.97;
            else if (what == 42 || what == 44 || what == 46 || what == 49)
                instr = 10.91;
            else if (what == 71 || what == 72) instr = 10.92;
            else if (what == 73 || what == 74) instr = 10.93;
            else if (what == 78 || what == 79) instr = 10.94;
            else if (what == 80 || what == 81) instr = 10.95;
            else if (what == 86 || what == 87) instr = 10.96;
            prog = 317 + this.pgm;
        }

        if (howLong <= 0) this.on[what] = 1;
        if (howLoud < 0) {
            instr *= -1;
            this.on[what] = 0;
        }

        return (
            "i" +
                instr +
                " " +
                secs(when) +
                " " +
                (howLong > 0 ? secs(howLong) : -1) +
                " " +
                what +
                " " +
                127 * howLoud +
                " " +
                prog +
                " " +
                " " +
                this.chn +
                " " +
                rel +
                "\n"
        );
    }

    event(what, howLoud = this.howLoud, when = 0, howLong = this.howLong) {
        return [what, howLoud, when, howLong, this];
    }

    play(what = this.what, howLoud = this.howLoud, when = 0, howLong = 0) {
        csound.inputMessage(this.score(what, howLoud, when, howLong));
        return what;
    }

    stop(what = -1, when = 0) {
        if (what < 0) {
            for (what = 0; what < 128; what++) {
                if (this.on[what]) {
                    csound.inputMessage(this.score(what, 0, when, 0));
                }
            }
        } else csound.inputMessage(this.score(what, 0, when, 0));
        return what;
    }
}

// return seconds from beats
export function secs(b) {
    return (b * 60.0) / globalObj.BPM;
}

// return beats from seconds
export function beats(s) {
    return (s * globalObj.BPM) / 60.0;
}

// set beats per minute
export function setBpm(bpm) {
    globalObj.BPM = bpm;
}

// returns beats per minute
export function getBpm() {
    return globalObj.BPM; 
}

// current audio clock time
export function audioClock() {
    if (audio_context) return audio_context.currentTime;
    else return 0;
}

// sequencer object
export const sequencer = {
    clickOn: false,
    seqList: [],
    time: 0.0,
    callback: null,
    click: function (ref) {
        if (!this.clickOn) return;
        let t = secs(1);
        let delta = audioClock() - (t + ref);
        if (delta >= 0) {
            this.time = t + audioClock() - delta;
            this.seqList.forEach((v, i, a) => {
                v.play(beats(t - delta));
            });
            if (this.callback) {
                let s = this.callback;
                this.callback = null;
                s(beats(t - delta));
            }
            setTimeout(this.click.bind(this, audioClock() - delta));
        } else setTimeout(this.click.bind(this, ref));
    },
  sequence: function (i, w, a, b) {
    return {
      instr: i,
      what: w,
      amp: a,
      bbs: b,
      n: 0,
      on: true,
      play: function (sched) {
        const what = this.what,
          bbs = this.bbs;
        let amp = this.amp,
          theInstr = this.instr,
          dur = theInstr.isDrums ? 0 : this.bbs;
        for (let i = 0; i < 1 / bbs; i++) {
          let evt = what[this.n];
          this.n = this.n != what.length - 1 ? this.n + 1 : 0;
          if (typeof evt !== "object") {
            if (sched >= 0 && evt >= 0 && this.on)
              theInstr.play(evt, amp, sched + i * bbs, dur);
          } else {
            if (typeof evt[0] !== "object") {
              if (evt.length > 1) amp = evt[1];
              if (evt.length > 2) sched += evt[2];
              if (evt.length > 3) dur = evt[3];
              if (evt.length > 4) {
                theInstr = evt[4];
                dur = dur > 0 ? dur : theInstr.isDrums ? 0 : t;
              }
              if (sched >= 0 && evt[0] >= 0 && this.on)
                theInstr.play(evt[0], amp, sched + i * bbs, dur);
            } else {
              for (const el of evt) {
               amp = this.amp;
               theInstr = this.instr;
               dur = theInstr.isDrums ? 0 : this.bbs;
                if (el.length > 1) amp = el[1];
                if (el.length > 2) sched += el[2];
                if (el.length > 3) dur = el[3];
                if (el.length > 4) {
                  theInstr = el[4];
                  dur = dur > 0 ? dur : theInstr.isDrums ? 0 : t;
                }
                if (sched >= 0 && el[0] >= 0 && this.on)
                  theInstr.play(el[0], amp, sched + i * bbs, dur);
              }
            }
          }
        }
      },
    };
  },
    play: function (instr, what, howLoud, bbs = 1) {
        let id = this.seqList.length;
        if (bbs > 1) bbs = 1;
        this.seqList.push(this.sequence(instr, what, howLoud, bbs));
        return id;
    },
    start: function () {
        if(!this.clickOn) {
            this.clickOn = true;
            this.click(audioClock());
        }
    },
    stop: function () {
        this.clickOn = false;
        this.seqList.forEach( (v,i,a) => { v.n = 0 });
    },
    clear: function () {
        this.seqList = [];
    },
    togglePause () {
        this.clickOn =! this.clickOn;
        this.click(audioClock());
    },
    toggleMute: function (id = -1) {
        if (id != -1) this.seqList[id].on = !this.seqList[id].on;
        else
            this.seqList.forEach((v, i, a) => {
                v.on = !v.on;
            });
    },
    toggleSolo: function (id) {
        this.seqList.forEach((v, i, a) => {
            if (i != id) v.on = !v.on;
        });
    },
    clock: function () {
        return this.time;
    },
    isRunning: function () {
        return this.clickOn;
    },
};

// eventList object
export const eventList = {
    events: [],
    play: function (when = 0, evtLst = this.events) {
        this.score(when, evtLst).play();
        this.events = evtLst;
    },
    create: function (evtLst = []) {
        let e = Object.create(eventList);
        e.events = evtLst;
        return e;
    },
    score: function (when = 0, evtLst = this.events) {
        let mess = "";
        let instr = piano,
            amp = piano.howLoud,
            dur = piano.howLong,
            t = when, what;
        for (const evt of evtLst) {
            if (typeof evt === "object") {
                what = evt[0];
                instr = evt.length > 4 ? evt[4] : instr;
                dur = evt.length > 3 ? evt[3] : dur;
                t = evt.length > 2 ? evt[2] : t + dur;
                amp = evt.length > 1 ? evt[1] : amp;
            } else {
                what = evt;
                amp = instr.howLoud;
                t += dur;
                dur = instr.howLong;
            }
            mess += instr.score(what, amp, t, dur);
        }
        return {
            score: mess,
            play: function () {
                csound.inputMessage(this.score);
            },
        };
    },
};

// instrument collection
export const grandPiano = new Instrument(0);
export const  piano = grandPiano;
export const  brightPiano = new Instrument(1);
export const  electricGrand = new Instrument(2);
export const  honkyPiano = new Instrument(3);
export const  electricPiano = new Instrument(4);
export const  electricPiano2 = new Instrument(5);
export const  harpsichord = new Instrument(6);
export const  clavinet = new Instrument(7);

export const  celesta = new Instrument(8);
export const  glockenspiel = new Instrument(9);
export const musicBox = new Instrument(10);
export const vibraphone = new Instrument(11);
export const marimba = new Instrument(12);
export const xylophone = new Instrument(13);
export const tubularBells = new Instrument(14);
export const dulcimer = new Instrument(15);

export const drawbarOrgan = new Instrument(16);
export const percussiveOrgan = new Instrument(17);
export const rockOrgan = new Instrument(18);
export const organ = rockOrgan;
export const churchOrgan = new Instrument(19);
export const reedOrgan = new Instrument(20);
export const accordion = new Instrument(21);
export const harmonic = new Instrument(22);
export const tangoAccordion = new Instrument(23);

export const nylonAcousticGuitar = new Instrument(24);
export const guitar = nylonAcousticGuitar;
export const steelAcousticGuitar = new Instrument(25);
export const jazzElectricGuitar = new Instrument(26);
export const clearElectricGuitar = new Instrument(27);
export const mutedElectricGuitar = new Instrument(28);
export const overdrivenGuitar = new Instrument(29);
export const  distortionGuitar = new Instrument(30);
export const  guitarHarmonics = new Instrument(31);

export const  acousticBass = new Instrument(32);
export const  fingerElectricBass = new Instrument(33);
export const  pickElectricBass = new Instrument(34);
export const  fretlessBass = new Instrument(35);
export const  bass = fretlessBass;
export const  slapBass1 = new Instrument(36);
export const  slapBass2 = new Instrument(37);
export const  synthBass1 = new Instrument(38);
export const  synthBass2 = new Instrument(39);

export const  violin = new Instrument(40);
export const  viola = new Instrument(41);
export const  cello = new Instrument(42);
export const  contrabass = new Instrument(43);
export const  tremoloStrings = new Instrument(44);
export const  pizzicatoStrings = new Instrument(45);
export const  orchestralHarp = new Instrument(46);
export const  harp = orchestralHarp;
export const  timpani = new Instrument(47);
export const  stringEnsemble1 = new Instrument(48);
export const  strings = stringEnsemble1;
export const  stringEnsemble2 = new Instrument(49);
export const  synthStrings1 = new Instrument(50);
export const  synthStrings2 = new Instrument(51);

export const  choirAahs = new Instrument(52);
export const  voiceOohs = new Instrument(53);
export const  synthVoice = new Instrument(54);
export const  orchestralHit = new Instrument(55);

export const  trumpet = new Instrument(56);
export const  trombone = new Instrument(57);
export const  tuba = new Instrument(58);
export const  mutedTrumpet = new Instrument(59);
export const  frenchHorn = new Instrument(60);
export const  horn = frenchHorn;
export const  brassSection = new Instrument(61);
export const  brass = brassSection;
export const  synthBrass1 = new Instrument(62);
export const  synthBrass2 = new Instrument(63);

export const  sopranoSax = new Instrument(64);
export const  altoSax = new Instrument(65);
export const  tenorSax = new Instrument(66);
export const  baritoneSax = new Instrument(67);
export const  oboe = new Instrument(68);
export const  englishHorn = new Instrument(69);
export const  bassoon = new Instrument(70);
export const  clarinet = new Instrument(71);
export const  piccolo = new Instrument(72);
export const  flute = new Instrument(73);
export const  recorder = new Instrument(74);
export const  panFlute = new Instrument(75);
export const  blownBottle = new Instrument(76);
export const  shakuhachi = new Instrument(77);
export const  whistle = new Instrument(78);
export const  ocarina = new Instrument(79);

export const  lead1 = new Instrument(80);
export const  lead2 = new Instrument(81);
export const  lead3 = new Instrument(82);
export const  lead4 = new Instrument(83);
export const  lead5 = new Instrument(84);
export const  lead6 = new Instrument(85);
export const  lead7 = new Instrument(86);
export const  lead8 = new Instrument(87);

export const  pad1 = new Instrument(88);
export const  pad2 = new Instrument(89);
export const  pad3 = new Instrument(90);
export const  pad4 = new Instrument(91);
export const  pad5 = new Instrument(92);
export const  synth = pad5;
export const  pad6 = new Instrument(93);
export const  pad7 = new Instrument(94);
export const  pad8 = new Instrument(96);

export const  fx1 = new Instrument(97);
export const  fx2 = new Instrument(98);
export const  fx3 = new Instrument(99);
export const  fx4 = new Instrument(100);
export const  fx5 = new Instrument(101);
export const  fx6 = new Instrument(102);
export const  fx7 = new Instrument(103);
export const  fx8 = new Instrument(104);

export const  sitar = new Instrument(105);
export const  banjo = new Instrument(106);
export const  shamisen = new Instrument(107);
export const  koto = new Instrument(108);
export const  kalimba = new Instrument(109);
export const  bagPipe = new Instrument(110);
export const  fiddle = new Instrument(111);
export const  tinkleBell = new Instrument(112);

export const  agogo = new Instrument(113);
export const  steelDrums = new Instrument(114);
export const  woodblock = new Instrument(115);
export const  taikoDrum = new Instrument(116);
export const  melodicTom = new Instrument(117);
export const  synthDrum = new Instrument(118);
export const  reverseCymbal = new Instrument(119);
export const  guitarFretNoise = new Instrument(120);
export const  breathNoise = new Instrument(121);
export const  seaShore = new Instrument(122);
export const  birdTweet = new Instrument(123);
export const  telephoneRing = new Instrument(124);
export const  helicopter = new Instrument(125);
export const  applause = new Instrument(126);
export const  gunshot = new Instrument(127);

export const  drums1 = new Instrument(2, true);
export const  drums = drums1;
export const  drums2 = new Instrument(3, true);
export const  drums3 = new Instrument(4, true);
export const  drums4 = new Instrument(5, true);
export const  drums5 = new Instrument(6, true);
export const  drums6 = new Instrument(7, true);

