/**
 * City script host — port of SAISEG 0x801E390C (docs/research/progresion/01-mundo-y-guiones.md §2-§4).
 * The original runs one VM command per frame and blocks on screens; here `advance` runs the VM until
 * something needs the player and returns it as a request; the next call carries the answer.
 * Story variables persist in the save like 0x801E0B70 / 0x801E0A74: v12..v362 are bits of
 * save.story.flags, v363..v371 bytes of save.story.counters.
 */
import { cards } from '../engine/cards/db';
import { addCard } from '../engine/progression/collection';
import { openPack } from '../engine/progression/packs';
import { partnerBoosts } from '../engine/game/partner';
import type { SaveData } from '../engine/progression/save';
import { newVm, parseMscd, runUntilCommand, scriptText, type MscdScript, type VmState } from './vm';

type Rand = { next(): number };

export type StoryRequest =
  | { kind: 'say'; lines: string[] }
  | { kind: 'menu'; options: number[]; big: boolean }
  | { kind: 'talkTo'; npcs: number[] }
  | { kind: 'rival'; name: string; portrait: number; types: number; attack: number; defense: number; speed: number }
  | { kind: 'battle'; deck: number; lent: number | null }
  | { kind: 'reward'; pack?: number; cards: number[]; results: number[]; part?: number }
  | { kind: 'keyword' }
  | { kind: 'screen'; screen: 'fusion' | 'deckEdit' | 'save' | 'playerData' | 'ending'; arg: number }
  | { kind: 'end' };

export type StoryResponse = { kind: 'ack' } | { kind: 'choice'; value: number } | { kind: 'battleResult'; win: boolean };

export interface CityHost {
  city: number;
  script: MscdScript;
  vm: VmState;
  save: SaveData;
  lines: string[];
  menu: number[];
  menuBig: boolean;
  npcs: number[];
  /** Deck loaned for the next battle (11.17). */
  lent: number | null;
  /** Current place (11.8): 1 Battle Cafe, 2 Arena, others 🟡. */
  place: number;
  waiting: StoryRequest | null;
}

const FLAG_FIRST = 12;
const FLAG_LAST = 362;
const COUNTER_FIRST = 363;

function loadVars(h: CityHost): void {
  const { flags, counters } = h.save.story;
  for (let v = FLAG_FIRST; v <= FLAG_LAST; v++) {
    const i = v - FLAG_FIRST;
    h.vm.vars[v] = (flags[i >> 5] >>> (i & 31)) & 1;
  }
  for (let k = 0; k < counters.length; k++) h.vm.vars[COUNTER_FIRST + k] = counters[k];
}

function storeVars(h: CityHost): void {
  const flags = Array(12).fill(0);
  for (let v = FLAG_FIRST; v <= FLAG_LAST; v++) {
    const i = v - FLAG_FIRST;
    if (h.vm.vars[v] & 1) flags[i >> 5] = (flags[i >> 5] | (1 << (i & 31))) >>> 0;
  }
  h.save.story.flags = flags;
  h.save.story.counters = h.save.story.counters.map((_, k) => h.vm.vars[COUNTER_FIRST + k] & 0xff);
}

export function enterCity(save: SaveData, city: number, bytes: Uint8Array): CityHost {
  const script = parseMscd(bytes);
  const h: CityHost = { city, script, vm: newVm(script), save, lines: [], menu: [], menuBig: false, npcs: [], lent: null, place: 0, waiting: null };
  save.story.city = city;
  loadVars(h);
  h.vm.vars[0] = 1;
  return h;
}

/** Deck allowed by the mask of 11.21 (0x80046C0C): no card of a kind in the mask (0x40 Option, 0x80 Digivolve). */
function deckAllowed(deck: number[], mask: number): boolean {
  if (deck.length !== 30) return false;
  const bit = (id: number) => ({ digimon: 0x20, option: 0x40, digivolve: 0x80 })[cards[id].kind];
  return deck.every((id) => (bit(id) & mask) === 0);
}

function respond(h: CityHost, r: StoryResponse | undefined): void {
  const w = h.waiting;
  h.waiting = null;
  if (!w || !r) return;
  if (w.kind === 'menu' && r.kind === 'choice') h.vm.vars[1] = r.value;
  if (w.kind === 'talkTo' && r.kind === 'choice') h.vm.vars[2] = r.value;
  if (w.kind === 'keyword' && r.kind === 'choice') h.vm.vars[1] = r.value;
  if (w.kind === 'battle' && r.kind === 'battleResult') h.vm.vars[1] = r.win ? 1 : 0; // ctx+0x1A6 XOR 1
}

/** Run the city script until it needs the player. */
export function advance(h: CityHost, rand: Rand, response?: StoryResponse): StoryRequest {
  respond(h, response);
  const ask = (req: StoryRequest): StoryRequest => {
    storeVars(h);
    h.waiting = req;
    return req;
  };
  for (;;) {
    const c = runUntilCommand(h.script, h.vm, rand);
    if (!c) {
      storeVars(h);
      return { kind: 'end' };
    }
    const [p0, p1, p2] = c.params;
    const key = `${c.op}.${c.cmd}`;
    switch (key) {
      case '10.4': // print the line in v4
        h.lines.push(scriptText(h.script, h.vm.vars[4]));
        break;
      case '10.5': {
        const lines = h.lines;
        h.lines = [];
        return ask({ kind: 'say', lines });
      }
      case '10.6':
        h.lines = [];
        break;
      case '11.0':
        h.menu = [];
        h.menuBig = p0 === 120;
        break;
      case '11.1':
        h.menu.push(p0);
        break;
      case '10.1':
        return ask({ kind: 'menu', options: h.menu, big: h.menuBig });
      case '11.3':
        if (!h.npcs.includes(p0)) h.npcs.push(p0);
        break;
      case '10.3':
        return ask({ kind: 'talkTo', npcs: [...h.npcs] });
      case '10.13': {
        const v = h.vm.vars;
        return ask({ kind: 'rival', name: scriptText(h.script, v[9]), portrait: v[10], types: v[5], attack: v[6], defense: v[7], speed: v[8] });
      }
      case '11.17':
        h.lent = p0;
        break;
      case '11.2': {
        const req: StoryRequest = { kind: 'battle', deck: p0, lent: h.lent };
        h.lent = null;
        return ask(req);
      }
      case '11.9': {
        const rare = h.save.partners.reduce((s, p) => s + partnerBoosts(p.slot).rarePercent, 0);
        const ids = openPack(p0, rare, rand);
        const results = ids.map((id) => addCard(h.save.collection, id, 1, rand));
        h.save.lastPack = ids;
        return ask({ kind: 'reward', pack: p0, cards: ids, results });
      }
      case '13.1': {
        const ids = [p0, p1, p2].filter((id) => id !== 0xffff && id !== undefined);
        const results = ids.map((id) => addCard(h.save.collection, id, 1, rand));
        return ask({ kind: 'reward', cards: ids, results });
      }
      case '11.16': // 🟡 Digi-Part (handler 0x801F32CC not traced; matches the dialogue)
        h.save.ownedParts[p0] = true;
        return ask({ kind: 'reward', cards: [], results: [], part: p0 });
      case '10.16':
        h.vm.vars[1] = h.save.winsCom;
        break;
      case '10.18':
        h.save.tradeEnabled = true;
        break;
      case '10.19':
        h.save.story.points = 0;
        break;
      case '11.18':
        h.save.story.points += p0;
        break;
      case '11.21':
        h.vm.vars[1] = h.save.decks.some((d) => deckAllowed(d.cards, p0)) ? 0 : 1;
        break;
      case '11.8':
        h.place = p0;
        break;
      case '10.15':
        return ask({ kind: 'keyword' });
      case '11.4':
        return ask({ kind: 'screen', screen: 'fusion', arg: p0 });
      case '10.9':
      case '10.17':
        return ask({ kind: 'screen', screen: 'deckEdit', arg: c.cmd });
      case '11.6':
        return ask({ kind: 'screen', screen: 'save', arg: p0 });
      case '10.7':
        return ask({ kind: 'screen', screen: 'playerData', arg: 0 });
      case '11.19':
        return ask({ kind: 'screen', screen: 'ending', arg: p0 });
      default:
        // presentation only (10.0, 10.2, 10.12, 10.22, 11.13 sound, 11.14 wait, 11.15 music, 13.0 portraits,
        // 10.20/10.21/11.20 effects), no-ops (10.14, 11.12) and the commands not identified yet (11.7, 11.10, 10.10, 10.11)
        break;
    }
  }
}
