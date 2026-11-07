/**
 * Rank titles are shown in the player's language and never use the franchise's words.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { rankNames } from '../src/game/titles';
import { setLocale } from '../src/i18n';

const all = (r: number) => ({ tamer: r, collector: r, battle2p: r });

describe('rank titles', () => {
  afterEach(() => setLocale('es'));

  it('are in Spanish in the Spanish game', () => {
    setLocale('es');
    expect(rankNames(all(0))).toEqual({ tamer: 'Aprendiz principiante', collector: 'Público general', battle2p: 'Principiante de duelos' });
  });

  it('every rank has a title in both languages, without "Tamer"', () => {
    for (const locale of ['es', 'en'] as const) {
      setLocale(locale);
      for (let r = 0; r < 8; r++) {
        for (const title of Object.values(rankNames(all(r)))) {
          expect(title, `${locale} rank ${r}`).toBeTruthy();
          expect(title).not.toMatch(/Tamer|Digi/);
        }
      }
    }
  });
});
