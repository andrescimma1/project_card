/**
 * Our dialogue for the city scripts: what the compiler writes in each run of dialogue of a city.
 * Written text first (texts/cityNN.ts), then the lines every town repeats, then generic text from what
 * follows the run (a menu, a reward). A character whose lines are not written yet says "…" once.
 */
import type { Locale } from '../../i18n';
import { compile, encodeCaption, encodeName, encodeUnit, type CityLogic, type Page, type TextSource, type UnitContext, type UnitText } from './ir';
import { CITY00 } from './texts/city00';
import { CITY01 } from './texts/city01';
import { CITY02 } from './texts/city02';
import { CITY03 } from './texts/city03';
import { CITY04 } from './texts/city04';
import { CITY05 } from './texts/city05';
import { CITY06 } from './texts/city06';
import { CITY07 } from './texts/city07';
import { CITY08 } from './texts/city08';
import { CITY09 } from './texts/city09';
import { CITY10 } from './texts/city10';
import { CITY11 } from './texts/city11';
import { GENERIC, SHARED } from './texts/shared';
import type { CityTexts, Written } from './texts/types';
import { characterName } from './world';

const WRITTEN: Partial<Record<number, CityTexts>> = { 0: CITY00, 1: CITY01, 2: CITY02, 3: CITY03, 4: CITY04, 5: CITY05, 6: CITY06, 7: CITY07, 8: CITY08, 9: CITY09, 10: CITY10, 11: CITY11 };

const PLAYER = '*h0';
/** Places on the city menu (CMD11.1 ids 0..7). */
const PLACE_IDS = new Set([0, 1, 2, 3, 4, 5, 6, 7]);

function toUnit(text: string, kind: UnitContext['kind'], speaker: string | null): UnitText {
  const pages: Page[] = text.split(/\n\s*\n/).map((p) => ({ speaker: speaker ?? undefined, lines: p.split('\n') }));
  if (kind !== 'p') return { pages };
  const last = pages.pop()!;
  return { pages, prompt: [...(last.speaker ? [header(last.speaker)] : []), ...last.lines] };
}

const header = (speaker: string) => (speaker === PLAYER ? `*c5${PLAYER}*c7` : `*c4${speaker}*c7`);

function encode(text: UnitText): Uint8Array {
  // the player's pages use the player's colour
  const out = encodeUnit({ ...text, pages: text.pages.map((p) => (p.speaker === PLAYER ? { ...p, speaker: undefined, lines: [header(PLAYER), ...p.lines] } : p)) });
  return out;
}

function speakerFor(w: Written, ctx: UnitContext, locale: Locale): string | null {
  if (w.who === null) return null;
  if (w.who === 'me') return PLAYER;
  const key = w.who ?? ctx.speaker;
  return key ? characterName(key, locale) : null;
}

function generic(ctx: UnitContext, locale: Locale): UnitText | null {
  const ids = ctx.next.filter((c) => c.op === 11 && c.cmd === 1).map((c) => c.params[0]);
  const speaker = ctx.speaker ? characterName(ctx.speaker, locale) : null;
  const opens = (op: number, cmd: number) => ctx.next.some((c) => c.op === op && c.cmd === cmd);
  if (ctx.kind === 'p' && opens(11, 0)) {
    const say = (t: Record<Locale, string>) => toUnit(t[locale], 'p', speaker);
    if (ids.includes(16)) return say(GENERIC.yesNo);
    if (ids.includes(12)) return say(GENERIC.whatToDo);
    if (ids.includes(8)) return toUnit(SHARED.enterArena[locale], 'p', null);
    if (ids.some((id) => PLACE_IDS.has(id))) return toUnit(SHARED.whereGo[locale], 'p', null);
    return toUnit(SHARED.pickOption[locale], 'p', null);
  }
  if (ctx.kind === 'p') {
    const reward = ctx.next.find((c) => (c.op === 11 && (c.cmd === 9 || c.cmd === 16)) || (c.op === 13 && c.cmd === 1));
    if (reward?.op === 11 && reward.cmd === 9) return toUnit(GENERIC.pack[locale], 'p', null);
    if (reward?.op === 11) return toUnit(GENERIC.part[locale], 'p', null);
    if (reward) return toUnit(GENERIC.cards(reward.params.filter((id) => id !== 0xffff).length)[locale], 'p', null);
    return null;
  }
  if (ctx.kind === 's' && speaker && !ctx.afterUnit) return { pages: [{ speaker, lines: [GENERIC.silent] }] };
  return null;
}

/** The text of a city in a language. */
export function textSource(city: number, locale: Locale): TextSource {
  const written = WRITTEN[city] ?? {};
  return {
    unit(ctx) {
      if (ctx.kind === 'c') {
        const w = written[ctx.id];
        return encodeCaption(w ? w[locale] : GENERIC.silent);
      }
      const w = written[ctx.id] ?? (ctx.shared ? SHARED[ctx.shared] : undefined);
      if (w) return encode(toUnit(w[locale], ctx.kind, speakerFor(w, ctx, locale)));
      const g = generic(ctx, locale);
      return g ? encode(g) : null;
    },
    name: (key) => encodeName(characterName(key, locale)),
  };
}

/** Build the script of a city from its logic, with our dialogue in the given language. */
export function buildCity(city: number, logic: CityLogic, locale: Locale): Uint8Array {
  return compile(logic, textSource(city, locale));
}

/** Runs of dialogue written for a city (to check every one exists in its logic). */
export const writtenRuns = (city: number): string[] => Object.keys(WRITTEN[city] ?? {});

export const writtenText = (city: number, id: string): Written | undefined => WRITTEN[city]?.[id];
