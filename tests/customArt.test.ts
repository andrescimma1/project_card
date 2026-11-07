/**
 * Our own art replaces a card's picture by id, without touching the art extracted from the disc.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cards } from '../src/engine/cards/db';
import { starterDecks } from '../src/engine/cards/decks';
import { artUrl, CUSTOM_ART, isCustomArt } from '../src/ui/art';

describe('card art', () => {
  it('uses our own art when the card has it, and the original disc art otherwise', () => {
    expect(artUrl(15)).toBe(CUSTOM_ART[15]!.file);
    expect(isCustomArt(15)).toBe(true);
    expect(artUrl(1)).toBe('/card-art/LC001.png');
    expect(isCustomArt(1)).toBe(false);
  });

  it('every creature of the Red starter deck has our own art', () => {
    const red = starterDecks.find((d) => d.name === 'Red')!;
    const creatures = [...new Set(red.cards)].filter((id) => cards[id].kind === 'digimon');
    expect(creatures.filter((id) => !isCustomArt(id))).toEqual([]);
  });

  it('every Rare Faction creature of the Yellow starter deck has our own art', () => {
    const yellow = starterDecks.find((d) => d.name === 'Yellow')!;
    const rare = [...new Set(yellow.cards)].filter((id) => cards[id].kind === 'digimon' && cards[id].specialty === 'rare');
    expect(rare.length).toBe(8);
    expect(rare.filter((id) => !isCustomArt(id))).toEqual([]);
  });

  it.skipIf(!existsSync('public/art'))('every custom art file exists in public/', () => {
    for (const [id, a] of Object.entries(CUSTOM_ART)) expect(existsSync(join('public', a!.file)), `card ${id}: ${a!.file}`).toBe(true);
  });
});
