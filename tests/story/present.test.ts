/**
 * Presentation helpers for the story screens (they never change the rules).
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { newGame } from '../../src/engine/progression/save';
import { menuLabel, npcNames, storySegments, visibleCities } from '../../src/story/present';
import { setLocale } from '../../src/i18n';
import { parseMscd } from '../../src/story/vm';
import { readDrvPath } from '../../tools/extract/drv';
import { asm, cmd, goto, skipIf, str } from './mscdAsm';

describe('script text', () => {
  it('colour codes, the player name and icons', () => {
    expect(storySegments('*c4Betamon*c7', 'Ana')).toEqual([{ text: 'Betamon', color: 4 }]);
    expect(storySegments('*c5*h0*c7', 'Ana')).toEqual([{ text: 'Ana', color: 5 }]);
    expect(storySegments('Use the *b0 Attack!', 'Ana')).toEqual([{ text: 'Use the ◯ Attack!', color: 7 }]);
  });
});

describe('menus and the map', () => {
  it('menu ids: places and choices in the current language, arenas of the city as the disc names them', () => {
    const labels = () => [menuLabel(2, 0), menuLabel(3, 2), menuLabel(5, 2), menuLabel(6, 5), menuLabel(13, 0), menuLabel(16, 0)];
    setLocale('es');
    expect(labels()).toEqual(['Café de batallas', 'Jungle Arena', 'Beet Arena', 'Haunted Arena', 'Combatir', 'Sí']);
    setLocale('en');
    expect(labels()).toEqual(['Battle Cafe', 'Jungle Arena', 'Beet Arena', 'Haunted Arena', 'Battle', 'Yes']);
    setLocale('es');
  });

  it('a city is on the map when its flag v(282 + i) is set', () => {
    const s = newGame(0, { next: (() => { let i = 0; return () => i++; })() });
    expect(visibleCities(s)).toEqual([]);
    s.story.flags[(282 - 12) >> 5] |= 1 << ((282 - 12) & 31);
    s.story.flags[(284 - 12) >> 5] |= 1 << ((284 - 12) & 31);
    expect(visibleCities(s)).toEqual([0, 2]);
  });

  it('Battle Cafe names: the first speaker of each `v2 == k` branch', () => {
    const s = parseMscd(asm(16, cmd(10, 3), skipIf(2, 0, 4), goto(48), str(4, '*c4Rosemon*c7'), cmd(10, 4), cmd(10, 5)));
    expect(npcNames(s)).toEqual({ 4: 'Rosemon' });
  });
});

const disc = process.env.DCB_DISC;
describe.skipIf(!disc || !existsSync(join(disc ?? '', 'C.DRV')))('names from a real script', () => {
  it('Beginner City Cafe: Betamon (10) and Babamon (9)', () => {
    const names = npcNames(parseMscd(readDrvPath(join(disc!, 'C.DRV'), 'DEBUG/CITY00.MSD')));
    expect([names[10], names[9]]).toEqual(['Betamon', 'Babamon']);
  });
});
