/**
 * Our own art replaces a card's picture by id, without touching the art extracted from the disc.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { artUrl, CUSTOM_ART, isCustomArt } from '../src/ui/art';

describe('card art', () => {
  it('uses our own art when the card has it, and the original disc art otherwise', () => {
    expect(artUrl(15)).toBe(CUSTOM_ART[15]!.file);
    expect(isCustomArt(15)).toBe(true);
    expect(artUrl(27)).toBe('/card-art/LC027.png');
    expect(isCustomArt(27)).toBe(false);
  });

  it.skipIf(!existsSync('public/art'))('every custom art file exists in public/', () => {
    for (const [id, a] of Object.entries(CUSTOM_ART)) expect(existsSync(join('public', a!.file)), `card ${id}: ${a!.file}`).toBe(true);
  });
});
