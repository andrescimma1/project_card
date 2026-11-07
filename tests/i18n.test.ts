/**
 * Languages: every text the player reads comes from a dictionary, every language is complete, and
 * switching the language really switches what the game shows.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { afterAll, describe, expect, it } from 'vitest';
import { cards } from '../src/engine/cards/db';
import { validateDeck } from '../src/engine/game/turn';
import { describeEvent } from '../src/game/describe';
import { LOCALES, messages, setLocale, type Locale } from '../src/i18n';
import { CARD_TEXTS } from '../src/i18n/cards';
import { localizeMessage } from '../src/i18n/engineMessages';
import { cardText, crossEffectLabel, TERMS } from '../src/ui/vocab/terms';
import { buildGame } from './engine/build';

const FORBIDDEN = /Digimon|Digi-?[A-Z]|Digievol|digivolv|Battle Slot|Online Deck|Offline Pile|DP Slot|Rookie|Ultimate|[◯△✕]/;
const REGIONAL = /\b(tenés|podés|querés|elegís|sabés|hacés|jugás|ganás|perdés|robás|usás|ponés|mirá|fijate|elegí|hacé|poné|sacá|tocá|probá|jugá|guardá|empezá|seguí|volvé|cerrá|esperá|confirmá|cambiá|quitá|vosotros|habéis|podéis|ordenador|fichero|pulsa|pulsar|coger)\b/i;
const SPANISH = /[áéíóúñ¿¡]/i;

/** Every text of a dictionary: strings as they are, functions called with sample arguments. */
function texts(node: unknown, path = ''): [string, string][] {
  if (typeof node === 'string') return [[path, node]];
  if (typeof node === 'function') {
    // a value that works both as a text and inside a template (counts, names, levels…)
    const args = Array.from({ length: node.length }, () => new String('X'));
    const out = node(...args);
    return Array.isArray(out) ? out.map((s, i) => [`${path}[${i}]`, String(s)] as [string, string]) : [[`${path}()`, String(out)]];
  }
  if (Array.isArray(node)) return node.flatMap((v, i) => texts(v, `${path}[${i}]`));
  if (node && typeof node === 'object') return Object.entries(node).flatMap(([k, v]) => texts(v, path ? `${path}.${k}` : k));
  return [];
}

afterAll(() => setLocale('es'));

describe('dictionaries', () => {
  it.each(LOCALES.map((l) => l.id))('%s: no empty text and no Digimon vocabulary', (l) => {
    const all = texts(messages(l as Locale));
    expect(all.length).toBeGreaterThan(300);
    // a few texts are empty on purpose (no subtitle at game over, no language note in Spanish)
    expect(all.filter(([p, t]) => !t.trim() && !/gameOver\[1\]|languageNote/.test(p)).map(([p]) => p)).toEqual([]);
    expect(all.filter(([, t]) => FORBIDDEN.test(t)).map(([p, t]) => `${p}: ${t}`)).toEqual([]);
  });

  it('Spanish is neutral Latin American Spanish', () => {
    expect(
      texts(messages('es'))
        .filter(([, t]) => REGIONAL.test(t))
        .map(([p, t]) => `${p}: ${t}`),
    ).toEqual([]);
  });

  it('English has no Spanish left in it', () => {
    const leftovers = texts(messages('en')).filter(([, t]) => SPANISH.test(t));
    expect(leftovers.map(([p, t]) => `${p}: ${t}`)).toEqual([]);
  });
});

describe('card texts', () => {
  it('every card text of the disc has its version in each language, in our vocabulary', () => {
    for (const l of LOCALES.map((x) => x.id)) {
      const table = CARD_TEXTS[l];
      for (const c of cards) {
        const raw = c.kind === 'digivolve' ? c.text : c.support.text;
        expect(table[raw], `${l}: ${c.name}`).toBeTruthy();
        expect(table[raw], `${l}: ${c.name}`).not.toMatch(/Digimon|digivolv|\bDP\b|[◯△✕]/i);
      }
    }
  });

  it('the shown text follows the language', () => {
    const raw = cards.find((c) => c.kind === 'option' && /[◯△✕]/.test(c.support.text))!;
    const text = raw.kind === 'option' ? raw.support.text : '';
    setLocale('en');
    expect(cardText(text)).toBe(CARD_TEXTS.en[text]);
    setLocale('es');
    expect(cardText(text)).toBe(CARD_TEXTS.es[text]);
  });
});

describe('switching the language', () => {
  const { state, refs } = buildGame({ p0: { stack: ['Agumon'] }, p1: { stack: ['Goburimon'] } });

  it('changes the game terms, the Instinto effects and the log', () => {
    setLocale('en');
    expect([TERMS.actions.fury, TERMS.actions.technique, TERMS.actions.instinct]).toEqual(['Fury', 'Technique', 'Instinct']);
    expect(crossEffectLabel('counterCircle')).toBe('Counter Fury');
    expect(describeEvent({ type: 'hit', attacker: 0, defender: 1, attackerCard: refs[0].Agumon[0], defenderCard: refs[1].Goburimon[0], damage: 380, eaten: 0, hp: [500, 120], slot: 'circle' }, state)).toBe(
      'Your Agumon hits Goburimon for 380.',
    );
    expect(describeEvent({ type: 'reveal', attacks: ['circle', 'cross'], hp: [1, 1] }, state)).toBe('Attacks: you Fury, the CPU Instinct.');
    setLocale('es');
    expect(TERMS.actions.fury).toBe('Furia');
    expect(describeEvent({ type: 'reveal', attacks: ['circle', 'cross'], hp: [1, 1] }, state)).toBe('Ataques: tú Furia, la CPU Instinto.');
  });

  it('shows the rules engine’s messages in the current language', () => {
    const errors = validateDeck([cards.find((c) => c.kind === 'option')!.id]);
    expect(errors.length).toBeGreaterThan(0);
    setLocale('en');
    const shown = errors.map((e) => localizeMessage(e));
    for (const s of shown) expect(s).not.toMatch(SPANISH);
    expect(shown.join(' ')).toMatch(/creatures/);
    expect(localizeMessage('Ese Digi-Egg no lo tienes.')).toBe("You don't have that egg.");
    expect(localizeMessage('Algo que el motor no dice.')).toBe('Algo que el motor no dice.');
    setLocale('es');
    expect(localizeMessage('Ese Digi-Egg no lo tienes.')).toBe('No tienes ese huevo.');
  });
});

const TEXT_ATTRS = new Set(['aria-label', 'title', 'placeholder', 'alt', 'label', 'hint', 'emptyText', 'subtitle']);

/** JSX text and text attributes written directly in a component (they must come from a dictionary). */
function hardCoded(file: string, src: string): string[] {
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out: string[] = [];
  const visit = (n: ts.Node) => {
    if (ts.isJsxText(n) && /[A-Za-zÁ-ú]{2,}/.test(n.text)) out.push(n.text.trim());
    if (ts.isJsxAttribute(n) && n.initializer && ts.isStringLiteral(n.initializer) && TEXT_ATTRS.has(n.name.getText(sf)) && /[A-Za-zÁ-ú]{3,}/.test(n.initializer.text))
      out.push(`${n.name.getText(sf)}="${n.initializer.text}"`);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out.filter((t) => !/^(VS|KO|HP)$/.test(t));
}

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : f.endsWith('.tsx') ? [p] : [];
  });
}

describe('no text written inside components', () => {
  it('every visible text of the interface comes from a dictionary', () => {
    const found: string[] = [];
    for (const f of [...files('src/ui'), 'src/App.tsx']) for (const t of hardCoded(f, readFileSync(f, 'utf8'))) found.push(`${f}: ${t.slice(0, 60)}`);
    expect(found).toEqual([]);
  });
});
