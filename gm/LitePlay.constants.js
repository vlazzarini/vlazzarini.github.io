// MIDI NOTE constants

const acousticBassDrum = 35;
const kick = acousticBassDrum;
const bassDrum1 = 36;
const sideStick = 37;
const acousticSnare = 38;
const handClap = 39;
const electricSnare = 40;
const snare = electricSnare;
const lowFloorTom = 41;
const closedHiHat = 42;
const highFloorTom = 43;
const pedalHiHat = 44;
const lowTom = 45;
const tom = lowTom;
const openHiHat = 46;
const lowMidTom = 47;
const hiMidTom = 48;
const crashCymbal = 49;
const crash = crashCymbal;
const hiTom = 50;
const rideCymbal1 = 51;
const cymbal = rideCymbal1;
const chineseCymbal = 52;
const rideBell = 53;
const tambourine = 54;
const splashCymbal = 55;
const cowbell = 56;
const crashCymbal2 = 57;
const vibraslap = 58;
const rideCymbal2 = 59;
const hiBongo = 60;
const lowBongo = 61;
const muteHiConga = 62;
const openHiConga = 63;
const lowConga = 64;
const hiTimbale= 65;
const lowTimbale = 66;
const hiAgogo = 67;
const lowAgogo = 68;
const cabasa = 69;
const maracas = 70;
const shortWhistle = 71;
const longWhistle = 72;
const shortGuiro = 73;
const longGuiro = 74;
const claves = 75;
const hiWoodBlock= 76;
const lowWoodBlock = 77;
const muteCuica = 78;
const openCuica = 79;
const muteTriangle = 80;
const openTriangle = 81;

function notes(start) {
  let l = [];
  for (let i = start; i < 127; i += 12) l.push(i);
  return l;
}

const C = notes(0);
const C0 = C[0], C1 = C[1], C2 = C[2], C3 = C[3], C4 = C[4],
      C5 = C[5], C6 = C[6], C7 = C[7], C8 = C[8], C9 = C[9];
const Cs = notes(1);
const Cs0 = Cs[0], Cs1 = Cs[1], Cs2 = Cs[2], Cs3 = Cs[3], Cs4 = Cs[4],
      Cs5 = Cs[5], Cs6 = Cs[6], Cs7 = Cs[7], Cs8 = Cs[8], Cs9 = Cs[9];
const Db = Cs;
const Db0 = Db[0], Db1 = Db[1], Db2 = Db[2], Db3 = Db[3], Db4 = Db[4],
      Db5 = Db[5], Db6 = Db[6], Db7 = Db[7], Db8 = Db[8], Db9 = Db[9];
const D = notes(2);
const D0 = D[0], D1 = D[1], D2 = D[2], D3 = D[3], D4 = D[4],
      D5 = D[5], D6 = D[6], D7 = D[7], D8 = D[8], D9 = D[9];
const Ds = notes(3);
const Ds0 = Ds[0], Ds1 = Ds[1], Ds2 = Ds[2], Ds3 = Ds[3], Ds4 = Ds[4],
      Ds5 = Ds[5], Ds6 = Ds[6], Ds7 = Ds[7], Ds8 = Ds[8], Ds9 = Ds[9];
const Eb = Ds;
const Eb0 = Eb[0], Eb1 = Eb[1], Eb2 = Eb[2], Eb3 = Eb[3], Eb4 = Eb[4],
      Eb5 = Eb[5], Eb6 = Eb[6], Eb7 = Eb[7], Eb8 = Eb[8], Eb9 = Eb[9];
const E = notes(4);
const E0 = E[0], E1 = E[1], E2 = E[2], E3 = E[3], E4 = E[4],
      E5 = E[5], E6 = E[6], E7 = E[7], E8 = E[8], E9 = E[9];
const Es = notes(5);
const Es0 = Es[0], Es1 = Es[1], Es2 = Es[2], Es3 = Es[3], Es4 = Es[4],
      Es5 = Es[5], Es6 = Es[6], Es7 = Es[7], Es8 = Es[8], Es9 = Es[9];
const F = Es;
const F0 = F[0], F1 = F[1], F2 = F[2], F3 = F[3], F4 = F[4],
      F5 = F[5], F6 = F[6], F7 = F[7], F8 = F[8], F9 = F[9];
const Fs = notes(6);
const Fs0 = Fs[0], Fs1 = Fs[1], Fs2 = Fs[2], Fs3 = Fs[3], Fs4 = Fs[4],
      Fs5 = Fs[5], Fs6 = Fs[6], Fs7 = Fs[7], Fs8 = Fs[8], Fs9 = Fs[9];
const Gb = Fs;
const Gb0 = Gb[0], Gb1 = Gb[1], Gb2 = Gb[2], Gb3 = Gb[3], Gb4 = Gb[4],
      Gb5 = Gb[5], Gb6 = Gb[6], Gb7 = Gb[7], Gb8 = Gb[8], Gb9 = Gb[9];
const G = notes(7);
const G0 = G[0], G1 = G[1], G2 = G[2], G3 = G[3], G4 = G[4],
      G5 = G[5], G6 = G[6], G7 = G[7], G8 = G[8], G9 = G[9];
const Gs = notes(8);
const Gs0 = Gs[0], Gs1 = Gs[1], Gs2 = Gs[2], Gs3 = Gs[3], Gs4 = Gs[4],
      Gs5 = Gs[5], Gs6 = Gs[6], Gs7 = Gs[7], Gs8 = Gs[8];
const Ab = Gs;
const Ab0 = Ab[0], Ab1 = Ab[1], Ab2 = Ab[2], Ab3 = Ab[3], Ab4 = Ab[4],
      Ab5 = Ab[5], Ab6 = Ab[6], Ab7 = Ab[7], Ab8 = Ab[8];
const A = notes(9);
const A0 = A[0], A1 = A[1], A2 = A[2], A3 = A[3], A4 = A[4],
      A5 = A[5], A6 = A[6], A7 = A[7], A8 = A[8];
const As = notes(10);
const As0 = As[0], As1 = As[1], As2 = As[2], As3 = As[3], As4 = As[4],
      As5 = As[5], As6 = As[6], As7 = As[7], As8 = As[8];
const Bb = As;
const Bb0 = Bb[0], Bb1 = Bb[1], Bb2 = Bb[2], Bb3 = Bb[3], Bb4 = Bb[4],
      Bb5 = Bb[5], Bb6 = Bb[6], Bb7 = Bb[7], Bb8 = Bb[8];
const B = notes(12);
const B0 = B[0], B1 = B[1], B2 = B[2], B3 = B[3], B4 = B[4],
      B5 = B[5], B6 = B[6], B7 = B[7], B8 = B[8];
const Bs = C;
const Bs0 = Bs[0], Bs1 = Bs[1], Bs2 = Bs[2], Bs3 = Bs[3], Bs4 = Bs[4],
      Bs5 = Bs[5], Bs6 = Bs[6], Bs7 = Bs[7], Bs8 = Bs[8], Bs9 = Bs[9];
const O = -999;

