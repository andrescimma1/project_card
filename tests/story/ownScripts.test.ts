/**
 * Our own story scripts: the logic lifted from a city keeps every jump, flag, battle and reward, so a
 * city rebuilt from it with the original dialogue is byte-for-byte the original script. Built with our
 * dialogue, every city runs in the same host, in both languages.
 */
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { newGame } from '../../src/engine/progression/save';
import { advance, enterCity } from '../../src/story/cityHost';
import { compile, lift, type CityLogic } from '../../src/story/own/ir';
import { buildCity, writtenRuns, writtenText } from '../../src/story/own/source';
import { decodeScriptString } from '../../src/story/present';
import { CHARACTERS } from '../../src/story/own/world';

const original = (city: number) => `public/scripts/CITY${String(city).padStart(2, '0')}.MSD`;
const logic = (city: number): CityLogic => JSON.parse(readFileSync(`public/story/CITY${String(city).padStart(2, '0')}.json`, 'utf8'));
const latin1 = (s: string) => Uint8Array.from([...s].map((c) => c.charCodeAt(0)).concat(0));
const counter = () => {
  let i = 0;
  return { next: () => i++ };
};

describe('own story scripts', () => {
  it.skipIf(!existsSync(original(0)))('the lifted logic rebuilds every original city exactly', () => {
    for (let city = 0; city < 12; city++) {
      const bytes = new Uint8Array(readFileSync(original(city)));
      const { logic, originals, names } = lift(bytes);
      const rebuilt = compile(logic, { unit: (u) => originals[u.id], name: latin1, nameInstruction: (n) => names[n] });
      expect(rebuilt.length, `CITY${city}`).toBe(bytes.length);
      expect(Buffer.from(rebuilt).equals(Buffer.from(bytes)), `CITY${city}`).toBe(true);
    }
  });

  it('every written run of dialogue exists in its city', () => {
    for (let city = 0; city < 12; city++) {
      const runs = new Set(logic(city).code.filter((x) => x[0] === 'u').map((x) => x[1]));
      expect(writtenRuns(city).filter((id) => !runs.has(id)), `CITY${city}`).toEqual([]);
    }
  });

  it('our dialogue never names the original franchise, its creatures or its places', () => {
    const banned = /\b(?!Common\b|Lemon\b)[A-Z][A-Za-z]*mon\b|Digi|Tamer|matrix|Beginner City|Flame City|Jungle City|Igloo|Wiseman|Infinity/;
    for (let city = 0; city < 12; city++)
      for (const id of writtenRuns(city)) {
        const w = writtenText(city, id)!;
        expect(`${w.es}\n${w.en}`.match(banned)?.[0], `CITY${city} ${id}`).toBeUndefined();
      }
  });

  it('every city builds in both languages and runs until it needs the player', () => {
    for (let city = 0; city < 12; city++)
      for (const locale of ['es', 'en'] as const) {
        const h = enterCity(newGame(0, counter()), city, buildCity(city, logic(city), locale));
        expect(advance(h, counter()).kind, `CITY${city} ${locale}`).not.toBe('end');
      }
  });

  it('a new game opens with our welcome, then the place menu', () => {
    const h = enterCity(newGame(0, counter()), 0, buildCity(0, logic(0), 'es'));
    const first = advance(h, counter());
    expect(first.kind).toBe('say');
    expect(first.kind === 'say' && first.lines.map(decodeScriptString)).toEqual(['Te damos la bienvenida', 'a las Tierras Quietas.']);
    let r = first;
    for (let i = 0; i < 10 && r.kind === 'say'; i++) r = advance(h, counter(), { kind: 'ack' });
    expect(r).toEqual({ kind: 'menu', options: [2, 3, 1, 0], big: true });
  });

  it('every character of the 12 cities has a name of our own, and no two share one', () => {
    const keys = new Set<string>();
    for (let city = 0; city < 12; city++)
      for (const it of logic(city).code) {
        if (it[0] === 'n') keys.add(it[2]);
        if (it[0] === 'u' && it[3]) keys.add(it[3]);
      }
    expect([...keys].filter((k) => !(k in CHARACTERS))).toEqual([]);
    const names = Object.entries(CHARACTERS)
      .filter(([k]) => !k.startsWith(','))
      .map(([, v]) => (typeof v === 'string' ? v : v.es));
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });

  it('the logic carries no dialogue: only names of characters and keys of shared lines', () => {
    for (let city = 0; city < 12; city++) {
      const words = logic(city)
        .code.flatMap((x) => x.slice(1))
        .filter((v): v is string => typeof v === 'string' && !/^[0-9A-F]{4,5}$/.test(v));
      expect(words.filter((w) => w.includes(' ') && w.length > 24), `CITY${city}`).toEqual([]);
    }
  });
});
