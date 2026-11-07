/**
 * Our names for the 159 built-in decks: the story, the battle screen and the deck lists use the same ones.
 */
import { describe, expect, it } from 'vitest';
import { decks } from '../../src/engine/cards/decks';
import { DECK_NAMES, deckName, ownerName } from '../../src/story/own/decks';
import { writtenRuns, writtenText } from '../../src/story/own/source';

const banned = /\b(?!Common\b|Lemon\b)[A-Z][A-Za-z]*mon\b|Digi|Tamer|matrix|Kamiya|Sukamon|Raidra|Halse|Holse|Shuri|Neferti|Shadra|Pegasus/;

/** Every deck a written run names on its title line (`*c3Mazo X` / `*c3X Deck`). */
function storyDeckNames() {
  const es = new Set<string>();
  const en = new Set<string>();
  for (let city = 0; city < 12; city++) {
    for (const id of writtenRuns(city)) {
      const w = writtenText(city, id)!;
      for (const m of w.es.matchAll(/\*c3Mazo ([^\n*]+?)(?=\*c7|\n|$)/g)) es.add(m[1].trim());
      for (const m of w.en.matchAll(/\*c3([^\n*]+?) Deck(?=\*c7|\n|$)/g)) en.add(m[1].trim());
    }
  }
  return { es, en };
}

describe('our deck names', () => {
  it('every original deck has a name of ours in Spanish and in English', () => {
    expect(DECK_NAMES).toHaveLength(decks.length);
    for (const d of decks) {
      for (const locale of ['es', 'en'] as const) {
        const name = deckName(d.index, locale);
        expect(name.trim(), `deck ${d.index} ${locale}`).not.toBe('');
        expect(name, `deck ${d.index} ${locale}`).not.toMatch(banned);
      }
    }
  });

  it('two decks share a name only when the original game gives them the same name and owner', () => {
    const key = (i: number) => `${decks[i].owner}|${decks[i].name}`;
    for (const a of decks) {
      for (const b of decks) {
        if (b.index <= a.index) continue;
        const same = key(a.index) === key(b.index);
        for (const locale of ['es', 'en'] as const) {
          expect(deckName(a.index, locale) === deckName(b.index, locale), `decks ${a.index} and ${b.index} (${locale})`).toBe(same);
        }
      }
    }
  });

  it('every deck owner is shown with the name it has in our world', () => {
    for (const d of decks.filter((x) => x.owner !== 'Player')) {
      for (const locale of ['es', 'en'] as const) {
        const name = ownerName(d.owner, locale);
        if (d.owner !== 'A') expect(name, `${d.owner} (${locale})`).not.toBe(d.owner);
        expect(name, `${d.owner} (${locale})`).not.toMatch(banned);
      }
    }
    expect(ownerName('Meramon', 'es')).toBe('Pavesa');
    expect(ownerName('BK WarGreymon', 'es')).toBe('Hollín');
  });

  it('every deck the story names is one of these names', () => {
    const { es, en } = storyDeckNames();
    const ours = { es: new Set(decks.map((d) => deckName(d.index, 'es'))), en: new Set(decks.map((d) => deckName(d.index, 'en'))) };
    expect(es.size).toBeGreaterThan(100);
    expect([...es].filter((n) => !ours.es.has(n))).toEqual([]);
    expect([...en].filter((n) => !ours.en.has(n))).toEqual([]);
  });
});
