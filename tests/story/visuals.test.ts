/**
 * How the story looks: where each town sits on the map, its background, the fog over unreached regions,
 * and the face of every character (card art for creatures, our own portraits for people).
 */
import { describe, expect, it } from 'vitest';
import { newGame } from '../../src/engine/progression/save';
import { AREAS, CHARACTERS } from '../../src/story/own/world';
import { AVATARS, avatarFace, faceOf, focusPosition, foggedAreas, MAP_ROUTE, speakerKey, TOWNS, townBackground } from '../../src/ui/story/visuals';

const counter = () => {
  let i = 0;
  return { next: () => i++ };
};

describe('the map', () => {
  it('every town has a spot inside the map and a background of its own', () => {
    expect(TOWNS).toHaveLength(12);
    for (const [i, t] of TOWNS.entries()) {
      expect(t.at[0]).toBeGreaterThan(0);
      expect(t.at[0]).toBeLessThan(1);
      expect(t.at[1]).toBeGreaterThan(0);
      expect(t.at[1]).toBeLessThan(1);
      expect(townBackground(i)).toBe(`/story-art/pueblos/${String(i).padStart(2, '0')}.webp`);
    }
  });

  it('the road visits every town but the island once, in story order', () => {
    expect([...MAP_ROUTE].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11]);
  });

  it('a region is under the fog until one of its towns is on the map', () => {
    const s = newGame(0, counter());
    expect(foggedAreas(s)).toEqual([1, 2]);
    s.story.flags[(282 - 12) >> 5] |= 1 << ((282 - 12) & 31); // Aldea del Cruce is on the map
    s.story.city = 5; // and we are in Ciudad sin Faroles, in the Tierras Altas
    expect(foggedAreas(s)).toEqual([2]);
    expect(AREAS[2].cities).toContain(11);
  });
});

describe('faces', () => {
  it('a creature with our own card art shows that art, cropped to its face', () => {
    expect(faceOf('Meramon')).toMatchObject({ src: '/art/LC018.webp', dark: false });
    expect(faceOf('Veemon')?.src).toBe('/art/LC175.webp');
  });

  it('the crop puts the face at the centre of the frame, without leaving the picture', () => {
    expect(focusPosition([0.5, 0.5])).toBe('50% 50%');
    expect(focusPosition([0.7, 0.57], 3, 1)).toBe('80% 61%'); // Brezo's face, low on the right
    expect(focusPosition([0.95, 0.02], 3, 1)).toBe('100% 0%');
    expect(faceOf('Agumon')?.position).toBe(focusPosition([0.7, 0.57]));
  });

  it('people and creatures without a card have their own portrait', () => {
    expect(faceOf('Davis')).toMatchObject({ src: '/story-art/caras/dante.webp' });
    expect(faceOf('Digimon Emperor')?.src).toBe('/story-art/caras/coleccionista.webp');
    expect(faceOf('Babamon')?.src).toBe('/story-art/caras/abuela-retama.webp');
    expect(faceOf('???????')?.src).toBe('/story-art/caras/encapuchado.webp');
  });

  it('the dark forms reuse the art of their normal form, darkened', () => {
    const war = faceOf('WarGreymon');
    const black = faceOf('BlackWarGreymon');
    if (war) expect(black).toMatchObject({ src: war.src, dark: true });
  });

  it('every character has a face or a monogram to fall back on', () => {
    for (const key of Object.keys(CHARACTERS).filter(Boolean)) {
      const f = faceOf(key);
      if (f) expect(f.src).toMatch(/^\/(art|story-art)\//);
    }
  });

  it('the name in a dialogue header leads back to its character, in both languages', () => {
    expect(speakerKey('Pavesa')).toBe('Meramon');
    expect(speakerKey('El Coleccionista')).toBe('Digimon Emperor');
    expect(speakerKey('The Collector')).toBe('Digimon Emperor');
    expect(speakerKey('Nadie')).toBeNull();
  });

  it('the player picks one of four apprentice faces', () => {
    expect(AVATARS).toBe(4);
    expect(avatarFace(2).src).toBe('/story-art/caras/aprendiz-3.webp');
  });
});
