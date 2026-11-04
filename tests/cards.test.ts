/**
 * Fidelity tests for the card database extracted from the original disc.
 * Every expectation below is a documented fact from the game itself (tutorial script BETA.MSD,
 * help screen, or the card table) — see docs/research/01-mecanicas-originales.md.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cards } from '../src/engine/cards/db';
import { decodeCardTable } from '../src/engine/cards/decodeCdd';
import type { Card, DigimonCard, OptionCard } from '../src/engine/cards/types';
import { readDrvFile } from '../tools/extract/drv';

const find = (name: string): Card => {
  const c = cards.find((x) => x.name === name);
  if (!c) throw new Error(`card ${name} missing`);
  return c;
};
const digimon = (name: string) => find(name) as DigimonCard;
const option = (name: string) => find(name) as OptionCard;

describe('card table shape (CARD2.CDD)', () => {
  it('has 301 cards: 191 Digimon, 102 Option, 8 Digivolve Option', () => {
    expect(cards).toHaveLength(301);
    expect(cards.filter((c) => c.kind === 'digimon')).toHaveLength(191);
    expect(cards.filter((c) => c.kind === 'option')).toHaveLength(102);
    expect(cards.filter((c) => c.kind === 'digivolve')).toHaveLength(8);
  });

  it('ids are unique and sequential', () => {
    cards.forEach((c, i) => expect(c.id).toBe(i));
  });
});

describe('cross-checks against the in-game tutorial (BETA.MSD)', () => {
  it('Frigimon needs 30 DP ("in order to digivolve to Frigimon, I need 30 DP")', () => {
    expect(digimon('Frigimon').dpRequired).toBe(30);
  });

  it('MoriShellmon gives 30 DP ("You can collect 30 DP with this")', () => {
    expect(digimon('MoriShellmon').dpGiven).toBe(30);
  });

  it('Recovery Floppy recovers 300 HP ("This Card recovers your HP by +300")', () => {
    const act = option('Recovery Floppy').support.program.actions.find((a) => a.enabled)!;
    expect(act.target.name).toBe('own.hp');
    expect(act.operands[2].ref?.name).toBe('own.hp');
    expect(act.opInner).toBe('add');
    expect(act.operands[1]).toEqual({ ref: null, value: 300 });
  });

  it('Drimogemon support boosts Attack Power +200', () => {
    const act = digimon('Drimogemon').support.program.actions.find((a) => a.enabled)!;
    expect(act.target.name).toBe('own.power[each slot]');
    expect(act.operands[1].value).toBe(200);
  });

  it('Birdramon is the red Level C card and Agumon is red Level R', () => {
    expect(digimon('Birdramon')).toMatchObject({ specialty: 'fire', level: 'C' });
    expect(digimon('Agumon')).toMatchObject({ specialty: 'fire', level: 'R' });
  });
});

describe('fields confirmed by the Wikimon card table (same game, JP "Digital Card Arena")', () => {
  it('Support Speed byte', () => {
    expect(digimon('Gigadramon').supportSpeed).toBe(0);
    expect(digimon('Imperialdramon').supportSpeed).toBe(1);
    expect(digimon('Aquilamon').supportSpeed).toBe(2);
    expect(option("Cherrymon's Mist").supportSpeed).toBe(3);
  });

  it('fusion values (Composite / Result)', () => {
    expect(digimon('WarGreymon').fusion).toEqual({ composite: 18, result: 35 });
    expect(digimon('Imperialdramon').fusion).toEqual({ composite: 18, result: 0 });
  });
});

describe('internal consistency of verified rules', () => {
  const all = cards.filter((c): c is DigimonCard => c.kind === 'digimon');

  it('Rookie and Armor cards need 0 DP', () => {
    for (const c of all.filter((x) => x.level === 'R' || x.level === 'A')) expect(c.dpRequired).toBe(0);
  });

  it('Counter and Crash cards have ✕ power 0 (they use the foe power / own HP)', () => {
    const zeroPower = ['counterCircle', 'counterTriangle', 'counterCross', 'crash'];
    for (const c of all.filter((x) => zeroPower.includes(x.crossEffect))) expect(c.attacks.cross.power).toBe(0);
  });

  it('Imperialdramon: (dpSlot.count x 100) + own power', () => {
    const a = digimon('Imperialdramon').support.program.actions[0];
    expect(a.operands[2].ref?.name).toBe('own.dpSlot.count');
    expect(a.opInner).toBe('mul');
    expect(a.operands[1].value).toBe(100);
    expect(a.opOuter).toBe('add');
    expect(a.operands[0].ref?.name).toBe('own.power[slot]');
  });

  it('Ogremon multiplies Attack Power by the number of DP cards (operand 1 is a variable)', () => {
    const a = digimon('Ogremon').support.program.actions[0];
    expect(a.operands[2].ref?.name).toBe('own.power[slot]');
    expect(a.opInner).toBe('mul');
    expect(a.operands[1].ref?.name).toBe('own.dpSlot.count');
  });

  it('Aquilamon support can never trigger (comparator 0xFF)', () => {
    expect(digimon('Aquilamon').support.program.conditions[0].cmp).toBe('never');
  });
});

const disc = process.env.DCB_DISC;
describe.skipIf(!disc || !existsSync(join(disc ?? '', 'B.DRV')))('re-decode from the original disc (set DCB_DISC)', () => {
  it('consumes CARD2.CDD byte-exactly and matches the committed JSON', () => {
    const res = decodeCardTable(readDrvFile(join(disc!, 'B.DRV'), 'CARD2.CDD'));
    expect(res.bytesConsumed).toBe(res.totalBytes);
    const strip = (c: Card) => ({ ...c, issues: undefined, notes: undefined });
    expect(res.cards.map(strip)).toEqual(cards.map(strip));
  });
});
