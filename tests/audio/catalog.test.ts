/**
 * The sound catalogue is the single place that says which sound answers each cue. These checks keep
 * it, the synthesis recipes and the written catalogue (docs/audio.md) in step.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CUE_NAMES, type CueData } from '../../src/audio/bus';
import { SOUNDS, soundsFor, type SoundId } from '../../src/audio/catalog';
import { RECIPES } from '../../src/audio/sfx/recipes';
import { TRACKS } from '../../src/audio/music/tracks';
import type { CrossEffect } from '../../src/engine/cards/types';

const SAMPLES: CueData[] = [{}, { player: 0 }, { player: 1, slot: 'circle' }, { slot: 'triangle' }, { slot: 'cross', effect: 'crash' }, { slot: 'cross', lethal: true }, { win: true }, { win: false }, { dp: 70 }, { index: 3 }, { source: 'option' }];

describe('sound catalogue', () => {
  it('every cue the game emits has a sound, and every sound requested is defined with that variant', () => {
    for (const name of CUE_NAMES) {
      for (const data of SAMPLES) {
        const reqs = soundsFor(name, data);
        expect(reqs.length, name).toBeGreaterThan(0);
        for (const r of reqs) {
          expect(SOUNDS[r.id], `${name} → ${r.id}`).toBeDefined();
          if (r.variant) expect(SOUNDS[r.id].variants, `${r.id}:${r.variant}`).toContain(r.variant);
        }
      }
    }
  });

  it('every sound has a synthesis recipe (original, generated in code)', () => {
    for (const id of Object.keys(SOUNDS) as SoundId[]) expect(RECIPES[id], id).toBeTypeOf('function');
  });

  it('◯ △ ✕ each have their own identity, and ✕ changes with its special effect', () => {
    const swing = (slot: 'circle' | 'triangle' | 'cross', effect?: CrossEffect) => soundsFor('ATTACK_RESOLVED', { slot, effect, player: 0 })[0];
    expect(new Set([swing('circle').id, swing('triangle').id, swing('cross').id]).size).toBe(3);
    expect(swing('cross', 'crash').variant).not.toBe(swing('cross', 'eatUpHp').variant);
    expect(swing('cross', 'foeX3Fire').variant).not.toBe(swing('cross', 'foeX3Ice').variant);
  });

  it('a hidden 2P pick does not give the attack away by its sound', () => {
    expect(soundsFor('ATTACK_SELECTED', {})[0].id).toBe(soundsFor('ATTACK_SELECTED', { player: 1 })[0].id);
    expect(soundsFor('ATTACK_SELECTED', { slot: 'circle' })[0].id).not.toBe(soundsFor('ATTACK_SELECTED', { slot: 'cross' })[0].id);
  });

  it('docs/audio.md lists every sound and every music track', () => {
    const doc = readFileSync('docs/audio.md', 'utf8');
    for (const id of Object.keys(SOUNDS)) expect(doc, id).toContain(`\`${id}\``);
    for (const id of Object.keys(TRACKS)) expect(doc, id).toContain(`\`${id}\``);
  });
});
