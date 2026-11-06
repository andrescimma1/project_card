/**
 * Which music fits the screen and the moment of the match. Pure: the director feeds it what the stores
 * say and hands the result to the AudioManager, which crossfades.
 */
import { ROUNDS_TO_WIN } from '../../engine/rules/primitives';
import type { StoryView } from '../../game/storyStore';
import type { View } from '../../store';
import type { TrackId } from './tracks';

export interface MatchMood {
  phase: string;
  turnNumber: number;
  /** Game over and nothing left to replay. */
  ended: boolean;
  /** The result is good news for the person playing (2P: always). */
  viewerWon: boolean;
  rounds: [number, number];
  /** A digivolution cinematic is on screen. */
  evolving: boolean;
}

export interface MusicContext {
  view: View;
  story: StoryView | null;
  storyWin: boolean | null;
  /** Screen the story script opened (deck editing, fusion shop…). */
  storyScreen: string | null;
  match: MatchMood | null;
  editingDeck: boolean;
}

const PREP = ['turnStart', 'mulligan', 'entrance', 'armorDigivolve'];

function matchMusic(m: MatchMood): TrackId {
  if (m.evolving) return 'evolution';
  if (m.ended) return m.viewerWon ? 'victory' : 'defeat';
  if (Math.max(...m.rounds) >= ROUNDS_TO_WIN - 1) return 'climax';
  // turn 1 has no battle; the second player sets up at the start of turn 2
  if (m.turnNumber <= 1 || (m.turnNumber === 2 && PREP.includes(m.phase))) return 'prep';
  return 'battle';
}

export function musicFor(c: MusicContext): TrackId {
  switch (c.view) {
    case 'play':
      return c.match ? matchMusic(c.match) : 'deckSelect';
    case 'decks':
      return 'deckBuild';
    case 'story':
      if ((c.story === 'battle' || c.story === 'duel') && c.match) return matchMusic(c.match);
      if (c.story === 'result') return c.storyWin === false ? 'defeat' : 'victory';
      if (c.story === 'slots' || c.story === 'newGame' || c.story === null) return 'menu';
      if (c.storyScreen === 'deckEdit') return 'deckBuild';
      return 'story';
    default:
      return 'menu';
  }
}
