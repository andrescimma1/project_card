/**
 * Trade between two saves — OPENSEG (docs/research/progresion/03-companero-fusion-intercambio.md §5):
 *   0x801EB2E8 requirements · 0x801E2068 tradable copies · 0x801E3214 choosing a card ·
 *   0x801E2B34 confirm (one-sided gifts allowed) · 0x801E1C8C / 0x801E1AA4 transfer with the serial number
 */
import { describe, expect, it } from 'vitest';
import { addCard, copiesOf } from '../../src/engine/progression/collection';
import { newGame, type SaveData } from '../../src/engine/progression/save';
import { canOffer, tradable, trade, tradeBlocked } from '../../src/engine/progression/trade';

const counter = (from = 0) => {
  let i = from;
  return { next: () => i++ };
};
function pair(): [SaveData, SaveData] {
  const a = newGame(0, counter(0));
  const b = newGame(1, counter(5000));
  a.tradeEnabled = b.tradeEnabled = true;
  return [a, b];
}
const HITTER = 251; // Cross Hitter (Option, Composite ≠ 0)

describe('who can trade (0x801EB2E8)', () => {
  it('both saves need trade enabled and different registration numbers', () => {
    const [a, b] = pair();
    expect(tradeBlocked(a, b)).toBeNull();
    b.tradeEnabled = false;
    expect(tradeBlocked(a, b)).toMatch(/jugador 2/i);
    b.tradeEnabled = true;
    b.registration = a.registration;
    expect(tradeBlocked(a, b)).toMatch(/misma/);
  });
});

describe('how many copies can go (0x801E2068)', () => {
  it('copies not in decks, never pushing the receiver past 6', () => {
    const [a, b] = pair();
    addCard(a.collection, 27, 6, counter(100));
    addCard(b.collection, 27, 4, counter(200));
    expect(tradable(a, b, 27)).toBe(2);
    a.decks[1] = { name: 'x', cards: Array(5).fill(27), wins: 0, losses: 0 };
    expect(tradable(a, b, 27)).toBe(1);
  });

  it('a copy whose serial number the receiver already has cannot go back', () => {
    const [a, b] = pair();
    addCard(a.collection, 99, 1, counter(300));
    const had = copiesOf(b.collection, 99); // Salamon ×2 in the Green deck
    expect(trade(a, b, [99], [])).toBeNull();
    expect(copiesOf(b.collection, 99)).toBe(had + 1);
    addCard(a.collection, 99, 1, counter(300)); // same serial again (same generator start)
    a.collection.serials[99][0] = b.collection.serials[99][0];
    expect(tradable(a, b, 99)).toBe(0);
  });
});

describe('choosing cards (0x801E3214)', () => {
  it('unidentified, Composite 0, nothing left, or more than 3 cards', () => {
    const [a, b] = pair();
    expect(canOffer(a, b, 1, [])).toMatch(/identificada/);
    a.collection.flags[293] |= 0x41; // Download Digivolve, Composite 0
    expect(canOffer(a, b, 293, [])).toMatch(/no se puede intercambiar/);
    addCard(a.collection, 99, 2, counter(500));
    expect(canOffer(a, b, 99, [99, 99])).toMatch(/más/);
    addCard(a.collection, 98, 2, counter(600));
    expect(canOffer(a, b, 98, [99, 99, 98])).toMatch(/3/);
    expect(canOffer(a, b, 98, [99])).toBeNull();
  });
});

describe('the trade (0x801E1C8C / 0x801E1AA4)', () => {
  it('moves the copies with their serial numbers, counts them and marks both saves as traded', () => {
    const [a, b] = pair();
    addCard(a.collection, 99, 2, counter(700));
    addCard(b.collection, 98, 1, counter(800));
    const serial = b.collection.serials[98][0]; // a has no Palmon: b's first copy goes
    const before = [copiesOf(a.collection, 99), copiesOf(b.collection, 99), copiesOf(a.collection, 98), copiesOf(b.collection, 98)];
    expect(trade(a, b, [99], [98])).toBeNull();
    expect([copiesOf(a.collection, 99), copiesOf(b.collection, 99), copiesOf(a.collection, 98), copiesOf(b.collection, 98)]).toEqual([
      before[0] - 1,
      before[1] + 1,
      before[2] + 1,
      before[3] - 1,
    ]);
    expect(a.collection.serials[98].slice(0, copiesOf(a.collection, 98))).toContain(serial);
    expect([a.traded, b.traded, a.trades, b.trades]).toEqual([true, true, { received: 1, given: 1 }, { received: 1, given: 1 }]);
    expect(a.collection.flags[98] & 0xc8).toBe(0xc8); // received by trading (ENDSEG), obtained, just received
  });

  it('0x801E195C quirk: the copy given is the first whose serial differs from one of the receiver serials', () => {
    const [a, b] = pair();
    addCard(a.collection, 99, 2, counter(700)); // a: Salamon serials 700, 701
    const bs = b.collection.serials[99].slice(0, copiesOf(b.collection, 99));
    a.collection.serials[99][0] = bs[0]; // a's first copy has a serial b already owns
    expect(tradable(a, b, 99)).toBe(1);
    expect(trade(a, b, [99], [])).toBeNull();
    // bs[0] differs from b's second serial, so the original gives that copy anyway
    expect(b.collection.serials[99].slice(0, copiesOf(b.collection, 99)).filter((x) => x === bs[0])).toHaveLength(2);
    expect(a.collection.serials[99][0]).toBe(701);
  });

  it('one-sided gifts are allowed, an empty trade is not', () => {
    const [a, b] = pair();
    expect(trade(a, b, [], [])).toMatch(/0 cartas/);
    addCard(a.collection, HITTER, 1, counter(1000));
    expect(trade(a, b, [HITTER], [])).toBeNull();
  });
});
