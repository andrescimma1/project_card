/**
 * Original decks from B.DRV/DECK2.DEK (159 records of 110 bytes).
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cards } from '../src/engine/cards/db';
import { decks, starterDecks } from '../src/engine/cards/decks';
import { decodeDeckFile } from '../src/engine/cards/decodeDecks';
import { validateDeck } from '../src/engine/game/turn';
import { readDrvFile } from '../tools/extract/drv';

describe('original decks (DECK2.DEK)', () => {
  it('has 159 decks of 30 valid cards, none above 4 copies', () => {
    expect(decks).toHaveLength(159);
    for (const d of decks) expect(validateDeck(d.cards)).toEqual([]);
  });

  it('the three player starter decks are Red, Green and Yellow', () => {
    expect(starterDecks.map((d) => d.name)).toEqual(['Red', 'Green', 'Yellow']);
    for (const d of starterDecks) expect(d.owner).toBe('Player');
  });

  it('each deck carries the 4 CPU personality parameters (copied to player flags bits 22..29)', () => {
    expect(decks[0].ai).toEqual([2, 2, 2, 2]);
    expect(decks.find((d) => d.name === 'New Power')!.ai).toEqual([2, 2, 1, 1]);
    for (const d of decks) for (const v of d.ai) expect(v).toBeLessThanOrEqual(3);
  });

  it('records start at file + 8: the last bytes are the EXP the deck gives and the CPU partner Digi-Egg', () => {
    const byName = (n: string) => decks.find((d) => d.name === n)!;
    expect([decks[0].exp, decks[1].exp, decks[3].exp, decks[140].exp]).toEqual([2, 3, 5, 30]);
    expect(decks[140]).toMatchObject({ name: 'Darkness Wave', owner: 'A' });
    expect([byName('Dig').partnerEgg, byName('Quetzal').partnerEgg]).toEqual([1, 2]);
    for (const d of decks.filter((x) => x.owner === 'Player')) expect(d.exp).toBe(0);
  });

  it('each CPU deck sets the Prize Pack won by beating it (Basic, Hyper, Super, Great; Black once)', () => {
    const count = (t: number) => decks.filter((d) => d.prizePack === t).length; // all 159 records
    expect(decks.find((d) => d.name === 'Evil King')!.prizePack).toBe(7);
    expect([count(0), count(1), count(2), count(3), count(7)]).toEqual([36, 49, 49, 24, 1]);
  });

  it('the tutorial deck belongs to Betamon and contains Betamon', () => {
    const t = decks[0];
    expect(t).toMatchObject({ name: 'Tutorial', owner: 'Betamon' });
    expect(t.cards.map((id) => cards[id].name)).toContain('Betamon');
  });
});

const disc = process.env.DCB_DISC;
describe.skipIf(!disc || !existsSync(join(disc ?? '', 'B.DRV')))('re-decode DECK2.DEK from the disc', () => {
  it('matches the committed JSON', () => {
    expect(decodeDeckFile(readDrvFile(join(disc!, 'B.DRV'), 'DECK2.DEK'))).toEqual(decks);
  });
});
