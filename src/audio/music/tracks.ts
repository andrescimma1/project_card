/**
 * Original music, written as data: one chord per bar and 16-step patterns per instrument, played live
 * by the sequencer (music/player.ts). Nothing here comes from the original game.
 *
 * Pattern alphabet (spaces are ignored): `x` hit, `X` accented hit, `o` open hat / bass an octave up,
 * `-` hold the previous note, `.` rest. A pattern shorter than the track repeats.
 * `lead` and `bell` take their notes (MIDI) in order, one per hit. `pad`, `arp` and `bass` take the
 * notes of the bar's chord. To swap a track for a recorded file, give it `file` (served from /public).
 */
export type TrackId = 'menu' | 'story' | 'deckSelect' | 'deckBuild' | 'prep' | 'battle' | 'climax' | 'evolution' | 'victory' | 'defeat';

export type Layer =
  | { kind: 'pad'; pattern: string; gain: number; shift?: number; wave?: OscillatorType; cutoff?: number }
  | { kind: 'bass'; pattern: string; gain: number; octave?: number }
  | { kind: 'arp'; pattern: string; gain: number; shift?: number; order?: 'up' | 'down' | 'updown'; wave?: OscillatorType }
  | { kind: 'lead'; pattern: string; gain: number; notes: number[]; wave?: OscillatorType; cutoff?: number }
  | { kind: 'bell'; pattern: string; gain: number; notes: number[] }
  | { kind: 'kick' | 'snare' | 'hat' | 'clap'; pattern: string; gain: number };

export interface TrackDef {
  id: TrackId;
  /** Where it plays (Spanish, for the docs). */
  label: string;
  bpm: number;
  bars: number;
  /** Bars played once before the loop. */
  intro?: number;
  /** MIDI notes of each bar's chord, lowest first. */
  chords: number[][];
  layers: Layer[];
  file?: string;
}

const T = <D extends TrackDef>(d: D) => d;

export const TRACKS: Record<TrackId, TrackDef> = {
  menu: T({
    id: 'menu',
    label: 'Menú principal, partidas guardadas, cartas y reglas: tranquila, digital',
    bpm: 90,
    bars: 4,
    chords: [
      [57, 60, 64, 67, 71],
      [53, 57, 60, 64],
      [52, 55, 60, 64],
      [55, 59, 62, 64],
    ],
    layers: [
      { kind: 'pad', pattern: 'x---------------', gain: 0.045, cutoff: 1100 },
      { kind: 'arp', pattern: 'x.x.x.x.x.x.x.x.', gain: 0.03, shift: 12, order: 'updown', wave: 'triangle' },
      { kind: 'bass', pattern: 'x.......x...x...', gain: 0.08 },
      { kind: 'bell', pattern: 'x.....x...x..... x.........x..... x.....x...x..... x...............', gain: 0.05, notes: [76, 74, 72, 69, 72, 71, 72, 74, 67] },
      { kind: 'kick', pattern: 'x.........x.....', gain: 0.1 },
      { kind: 'hat', pattern: '....x.......x...', gain: 0.018 },
    ],
  }),
  story: T({
    id: 'story',
    label: 'Modo historia: mapa y ciudades, aventurera',
    bpm: 108,
    bars: 4,
    chords: [
      [50, 54, 57, 62],
      [47, 50, 54, 59],
      [43, 47, 50, 55],
      [45, 49, 52, 57],
    ],
    layers: [
      { kind: 'pad', pattern: 'x-------x-------', gain: 0.035 },
      { kind: 'bass', pattern: 'x..x..x.x..x..x.', gain: 0.09 },
      { kind: 'arp', pattern: 'x.xxx.xxx.xxx.xx', gain: 0.022, shift: 12, wave: 'triangle' },
      {
        kind: 'lead',
        pattern: 'x.x.x---x.x.x--- x-------x.x.x--- x.x.x---x.x.x--- x-------x-------',
        gain: 0.035,
        notes: [74, 76, 78, 81, 78, 76, 74, 71, 74, 78, 79, 78, 76, 74, 76, 78, 76, 73],
      },
      { kind: 'kick', pattern: 'x...x...x...x...', gain: 0.12 },
      { kind: 'snare', pattern: '....x.......x...', gain: 0.06 },
      { kind: 'hat', pattern: '..x...x...x...x.', gain: 0.025 },
    ],
  }),
  deckSelect: T({
    id: 'deckSelect',
    label: 'Selección de mazos antes de la partida: expectante',
    bpm: 116,
    bars: 4,
    chords: [
      [52, 55, 59, 64],
      [48, 52, 55, 60],
      [50, 54, 57, 62],
      [47, 51, 54, 59],
    ],
    layers: [
      { kind: 'pad', pattern: 'x---------------', gain: 0.04 },
      { kind: 'arp', pattern: 'xxxxxxxxxxxxxxxx', gain: 0.018, shift: 12, order: 'up', wave: 'triangle' },
      { kind: 'bass', pattern: 'x.x.x.x.x.x.x.x.', gain: 0.075 },
      { kind: 'bell', pattern: 'x.......x.......', gain: 0.045, notes: [83, 79, 81, 78, 79, 76, 78, 75] },
      { kind: 'kick', pattern: 'x.......x.......', gain: 0.12 },
      { kind: 'clap', pattern: '....x.......x...', gain: 0.045 },
      { kind: 'hat', pattern: '..x...x...x...x.', gain: 0.022 },
    ],
  }),
  deckBuild: T({
    id: 'deckBuild',
    label: 'Construcción de mazos: relajada, para pensar',
    bpm: 86,
    bars: 4,
    chords: [
      [48, 52, 55, 59],
      [45, 48, 52, 55],
      [50, 53, 57, 60],
      [43, 47, 50, 53],
    ],
    layers: [
      { kind: 'pad', pattern: 'x-----x---------', gain: 0.05, wave: 'triangle', cutoff: 2200 },
      { kind: 'bass', pattern: 'x.....x...x.....', gain: 0.085 },
      { kind: 'bell', pattern: 'x...x.....x.....', gain: 0.04, notes: [71, 72, 74, 76, 79, 77, 76, 74, 72, 71, 69, 67] },
      { kind: 'kick', pattern: 'x.........x.....', gain: 0.1 },
      { kind: 'snare', pattern: '....x.......x...', gain: 0.04 },
      { kind: 'hat', pattern: 'x.x.x.x.x.x.x.x.', gain: 0.015 },
    ],
  }),
  prep: T({
    id: 'prep',
    label: 'Preparación de la partida (primer turno): tensión que crece',
    bpm: 124,
    bars: 4,
    chords: [
      [45, 57, 60, 64],
      [45, 57, 60, 65],
      [45, 55, 59, 62],
      [45, 56, 59, 64],
    ],
    layers: [
      { kind: 'pad', pattern: 'x---------------', gain: 0.035 },
      { kind: 'bass', pattern: 'x.x.x.x.x.x.x.x.', gain: 0.08 },
      { kind: 'arp', pattern: 'xxxxxxxxxxxxxxxx', gain: 0.02, shift: 12, order: 'up', wave: 'triangle' },
      { kind: 'kick', pattern: 'x...x...x...x...', gain: 0.13 },
      { kind: 'hat', pattern: '..x...x...x...x.', gain: 0.022 },
      { kind: 'snare', pattern: '................ ................ ................ ....x...x.x.xxxx', gain: 0.05 },
    ],
  }),
  battle: T({
    id: 'battle',
    label: 'Batalla: enérgica',
    bpm: 146,
    bars: 8,
    chords: [
      [57, 60, 64],
      [53, 57, 60],
      [55, 59, 62],
      [52, 55, 59],
      [57, 60, 64],
      [53, 57, 60],
      [55, 59, 62],
      [52, 56, 59],
    ],
    layers: [
      { kind: 'pad', pattern: 'x-------x-------', gain: 0.028, cutoff: 1800 },
      { kind: 'bass', pattern: 'x.xxx.xxx.xxx.xo', gain: 0.085 },
      { kind: 'arp', pattern: 'x.x.x.x.x.x.x.x.', gain: 0.018, shift: 12 },
      {
        kind: 'lead',
        pattern:
          'x.x.x.x-x.x.x--- x.x.x---x.x.x--- x.x.x.x-x.x.x--- x-------x.x.x.x. x.x.x.x-x.x.x--- x.x.x---x.x.x--- x.x.x.x-x.x.x.x. x-------x---x---',
        gain: 0.032,
        wave: 'sawtooth',
        cutoff: 2600,
        notes: [
          69, 72, 76, 74, 72, 71, 72, 69, 65, 69, 72, 69, 65, 67, 71, 74, 72, 71, 69, 71, 71, 67, 69, 71, 74, 76, 74, 72, 74, 76, 79, 76, 77, 76, 72, 69, 72, 77, 79, 77,
          76, 74, 74, 76, 77, 79, 80, 76, 71,
        ],
      },
      { kind: 'kick', pattern: 'x.....x.x.......', gain: 0.15 },
      { kind: 'snare', pattern: '....x.......x...', gain: 0.085 },
      { kind: 'hat', pattern: 'x.x.x.x.x.x.x.xo', gain: 0.028 },
    ],
  }),
  climax: T({
    id: 'climax',
    label: 'Momento decisivo: alguien está a una ronda de ganar',
    bpm: 156,
    bars: 4,
    chords: [
      [50, 53, 57, 62],
      [46, 50, 53, 58],
      [48, 52, 55, 60],
      [45, 49, 52, 57],
    ],
    layers: [
      { kind: 'pad', pattern: 'x-------x-------', gain: 0.03 },
      { kind: 'bass', pattern: 'x.xxx.xxx.xxx.xx', gain: 0.09 },
      { kind: 'arp', pattern: 'xxxxxxxxxxxxxxxx', gain: 0.016, shift: 12, order: 'updown' },
      {
        kind: 'lead',
        pattern: 'x.x.x.x.x---x--- x.x.x.x.x------- x.x.x.x.x---x--- x---x---x.x.x.x.',
        gain: 0.032,
        wave: 'sawtooth',
        cutoff: 3000,
        notes: [74, 77, 81, 79, 77, 74, 74, 77, 82, 81, 77, 76, 79, 84, 83, 79, 76, 81, 73, 76, 79, 81, 85],
      },
      { kind: 'kick', pattern: 'x...x...x...x.x.', gain: 0.15 },
      { kind: 'snare', pattern: '....x.......x..x', gain: 0.085 },
      { kind: 'hat', pattern: 'xxxxxxxxxxxxxxxx', gain: 0.02 },
    ],
  }),
  evolution: T({
    id: 'evolution',
    label: 'Evolución: sube sin parar mientras dura la animación',
    bpm: 132,
    bars: 4,
    chords: [
      [48, 55, 60, 64],
      [50, 57, 62, 66],
      [52, 59, 64, 68],
      [54, 61, 66, 70],
    ],
    layers: [
      { kind: 'pad', pattern: 'x---------------', gain: 0.045, cutoff: 2400 },
      { kind: 'arp', pattern: 'xxxxxxxxxxxxxxxx', gain: 0.024, shift: 12, order: 'up', wave: 'triangle' },
      { kind: 'bass', pattern: 'x.x.x.x.x.x.x.x.', gain: 0.08 },
      { kind: 'bell', pattern: 'x.......x.......', gain: 0.045, notes: [84, 86, 86, 88, 88, 90, 90, 94] },
      { kind: 'kick', pattern: 'x...x...x...x...', gain: 0.14 },
      { kind: 'hat', pattern: 'x.x.x.x.x.x.x.x.', gain: 0.02 },
      { kind: 'snare', pattern: '................ ................ ................ x.x.x.x.xxxxxxxx', gain: 0.055 },
    ],
  }),
  victory: T({
    id: 'victory',
    label: 'Victoria: fanfarria y después un tema alegre',
    bpm: 128,
    bars: 6,
    intro: 2,
    chords: [
      [48, 60, 64, 67],
      [43, 55, 59, 62, 65],
      [48, 55, 60, 64],
      [45, 52, 57, 60],
      [41, 53, 57, 60],
      [43, 55, 59, 62],
    ],
    layers: [
      { kind: 'pad', pattern: 'x---------------', gain: 0.04 },
      { kind: 'bass', pattern: 'x...x...x...x...', gain: 0.08 },
      {
        kind: 'lead',
        pattern: 'x.x.x.x-x------- x-----x-x-x-x--- x.......x.x.x... x.......x.x.x... x.......x.x.x... x-------x---x---',
        gain: 0.036,
        wave: 'sawtooth',
        cutoff: 3200,
        notes: [67, 72, 76, 79, 84, 83, 81, 79, 77, 79, 76, 74, 76, 79, 72, 71, 72, 76, 77, 76, 74, 72, 74, 71, 67],
      },
      { kind: 'bell', pattern: 'x...............', gain: 0.035, notes: [96, 91, 93, 91, 89, 91] },
      { kind: 'kick', pattern: 'x...x...x...x...', gain: 0.12 },
      { kind: 'snare', pattern: '....x.......x...', gain: 0.055 },
      { kind: 'hat', pattern: '..x...x...x...x.', gain: 0.024 },
    ],
  }),
  defeat: T({
    id: 'defeat',
    label: 'Derrota: lenta y grave',
    bpm: 70,
    bars: 5,
    intro: 1,
    chords: [
      [45, 57, 60, 64],
      [41, 57, 60, 65],
      [38, 57, 62, 65],
      [40, 56, 59, 64],
      [45, 57, 60, 64],
    ],
    layers: [
      { kind: 'pad', pattern: 'x---------------', gain: 0.05, cutoff: 900 },
      { kind: 'bass', pattern: 'x-------x-------', gain: 0.07 },
      { kind: 'bell', pattern: 'x---x---x------- x-------x------- x-------x------- x-------x---x--- x---------------', gain: 0.045, notes: [76, 74, 69, 72, 69, 74, 72, 71, 68, 71, 69] },
    ],
  }),
};

/** Steps of a pattern with the spaces taken out. */
export const steps = (pattern: string) => pattern.replace(/\s/g, '');
