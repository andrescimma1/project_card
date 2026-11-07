/**
 * Our own game's vocabulary: three action kinds over the rules' three slots, factions over the
 * specialties, and the terms the interface shows. The rules keep their original names underneath.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cards } from '../src/engine/cards/db';
import type { CrossEffect, Specialty } from '../src/engine/cards/types';
import { ACTIONS, actionOf, powerIndex, slotOf } from '../src/ui/vocab/actions';
import { FACTIONS, factionOf, factionOfSpecialty } from '../src/ui/vocab/factions';
import { cardText, crossEffectLabel, levelName, TERMS } from '../src/ui/vocab/terms';
import { messages } from '../src/i18n';

const SPECIALTIES: Specialty[] = ['fire', 'ice', 'nature', 'darkness', 'rare'];
const CROSS: CrossEffect[] = [
  'none',
  'firstAttack',
  'circleTo0',
  'triangleTo0',
  'crossTo0',
  'counterCircle',
  'counterTriangle',
  'counterCross',
  'crash',
  'eatUpHp',
  'jamming',
  'foeX3Fire',
  'foeX3Ice',
  'foeX3Nature',
  'foeX3Darkness',
  'foeX3Rare',
];
const FORBIDDEN = /Digimon|Digi-?[A-Z]|Digievol|Digivolve|Battle Slot|Online Deck|Offline Pile|DP Slot|Rookie|Ultimate|[◯△✕]/;
/** The interface is in neutral Latin American Spanish: no voseo, no Spain-only words. */
const REGIONAL = /\b(tenés|podés|querés|elegís|sabés|hacés|jugás|ganás|perdés|robás|usás|ponés|mirá|fijate|elegí|hacé|poné|sacá|tocá|probá|jugá|guardá|empezá|seguí|volvé|cerrá|esperá|confirmá|cambiá|quitá|vosotros|habéis|podéis|ordenador|fichero|pulsa|pulsar|coger)\b/i;

describe('action kinds', () => {
  it('Furia, Técnica and Instinto sit on the rules’ three slots, in the order of the powers', () => {
    expect(ACTIONS).toEqual(['fury', 'technique', 'instinct']);
    expect(ACTIONS.map(slotOf)).toEqual(['circle', 'triangle', 'cross']);
    for (const a of ACTIONS) expect(actionOf(slotOf(a))).toBe(a);
    expect(ACTIONS.map(powerIndex)).toEqual([0, 1, 2]);
    expect(ACTIONS.map((a) => TERMS.actions[a])).toEqual(['Furia', 'Técnica', 'Instinto']);
  });

  it('a creature keeps its own attack names; only the category is ours', () => {
    const c = cards.find((x) => x.kind === 'digimon')!;
    if (c.kind !== 'digimon') return;
    expect(c.attacks[slotOf('fury')].name).toBe(c.attacks.circle.name);
  });
});

describe('factions', () => {
  it('every specialty of the rules belongs to a faction with a full palette', () => {
    const ids = new Set(SPECIALTIES.map(factionOfSpecialty));
    expect(ids.size).toBe(5);
    expect(factionOfSpecialty('fire')).toBe('red');
    for (const f of Object.values(FACTIONS)) {
      expect(f.name).toBeTruthy();
      for (const k of ['main', 'dark', 'light'] as const) expect(f.palette[k], `${f.id}.${k}`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('the Red Faction is temperament, not fire', () => {
    expect(FACTIONS.red.name).toBe('Roja');
    expect(FACTIONS.red.temperament.toLowerCase()).not.toContain('fuego');
  });

  it('the faction of the Rare specialty is called Rara', () => {
    expect(FACTIONS[factionOfSpecialty('rare')].name).toBe('Rara');
  });

  it('only creatures have a faction', () => {
    const creature = cards.find((x) => x.kind === 'digimon')!;
    const support = cards.find((x) => x.kind === 'option')!;
    expect(factionOf(creature)).not.toBeNull();
    expect(factionOf(support)).toBeNull();
  });
});

describe('terms', () => {
  it('names the levels with our words', () => {
    expect([levelName('R'), levelName('C'), levelName('U')]).toEqual(['Novato', 'Campeón', 'Perfecto']);
    expect(TERMS.dpLong).toBe('Puntos de evolución');
    expect(TERMS.activeCreature).toBe('Criatura activa');
  });

  it('carries no Digimon vocabulary and no controller symbols', () => {
    for (const l of ['es', 'en'] as const) expect(JSON.stringify(messages(l).terms)).not.toMatch(FORBIDDEN);
    for (const e of CROSS) expect(crossEffectLabel(e), e).not.toMatch(FORBIDDEN);
  });

  it('card texts from the disc are shown with our action names and points (the data is untouched)', () => {
    const raw = 'Both players use ◯. Opponent ✕ to 0. +10 DP. Change △.';
    expect(cardText(raw)).toBe('Both players use Furia. Opponent Instinto to 0. +10 PE. Change Técnica.');
    expect(cardText(raw)).not.toMatch(FORBIDDEN);
    const support = cards.find((c) => c.kind === 'option' && /[◯△✕]/.test(c.support.text));
    if (support?.kind === 'option') expect(support.support.text).toMatch(/[◯△✕]/);
  });

  it('the ×3 effects name the faction they hit', () => {
    expect(crossEffectLabel('foeX3Fire')).toContain(FACTIONS.red.name);
    expect(crossEffectLabel('counterCircle')).toContain(TERMS.actions.fury);
  });
});

/** Visible text of a source file: string literals and JSX text (identifiers and comments do not count). */
function visibleText(src: string): string[] {
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
  const out: string[] = [];
  for (const m of code.matchAll(/'([^'\\\n]*)'|"([^"\\\n]*)"|`([^`]*)`/g)) out.push(m[1] ?? m[2] ?? m[3] ?? '');
  for (const m of code.matchAll(/>([^<>{}]+)</g)) out.push(m[1]);
  // identifiers of the rules inside quotes ('armorDigivolve', 'digimon') are code, not text
  return out.filter((t) => !/^[a-z][A-Za-z0-9]*$/.test(t));
}

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|ts)$/.test(f) ? [p] : [];
  });
}

describe('the interface speaks our language', () => {
  it('no screen shows Digimon terms or ◯ △ ✕', () => {
    const sources = [...files('src/ui'), ...files('src/audio'), 'src/App.tsx', 'src/game/describe.ts'];
    const found: string[] = [];
    for (const f of sources)
      for (const t of visibleText(readFileSync(f, 'utf8')))
        if (FORBIDDEN.test(t)) found.push(`${f}: ${t.trim().slice(0, 70)}`);
    expect(found).toEqual([]);
  });

  it('in neutral Latin American Spanish (no voseo, no Spain-only words)', () => {
    const sources = [...files('src/ui'), ...files('src/audio'), 'src/App.tsx', 'src/game/describe.ts'];
    const found: string[] = [];
    for (const f of sources)
      for (const t of visibleText(readFileSync(f, 'utf8')))
        if (REGIONAL.test(t)) found.push(`${f}: ${t.trim().slice(0, 70)}`);
    expect(found).toEqual([]);
  });
});
