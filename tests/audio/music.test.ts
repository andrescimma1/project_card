import { describe, expect, it } from 'vitest';
import { musicFor, type MatchMood, type MusicContext } from '../../src/audio/music/select';
import { TRACKS } from '../../src/audio/music/tracks';

const match = (o: Partial<MatchMood> = {}): MatchMood => ({ phase: 'dp', turnNumber: 4, ended: false, viewerWon: false, rounds: [0, 0], evolving: false, ...o });
const ctx = (o: Partial<MusicContext> = {}): MusicContext => ({ view: 'play', story: null, storyWin: null, storyScreen: null, match: null, editingDeck: false, ...o });

describe('music selection', () => {
  it('picks the screen music outside a match', () => {
    expect(musicFor(ctx())).toBe('deckSelect');
    expect(musicFor(ctx({ view: 'decks' }))).toBe('deckBuild');
    expect(musicFor(ctx({ view: 'cards' }))).toBe('menu');
    expect(musicFor(ctx({ view: 'rules' }))).toBe('menu');
    expect(musicFor(ctx({ view: 'story', story: 'slots' }))).toBe('menu');
    expect(musicFor(ctx({ view: 'story', story: 'city' }))).toBe('story');
    expect(musicFor(ctx({ view: 'story', story: 'city', storyScreen: 'deckEdit' }))).toBe('deckBuild');
    expect(musicFor(ctx({ view: 'story', story: 'result', storyWin: true }))).toBe('victory');
    expect(musicFor(ctx({ view: 'story', story: 'result', storyWin: false }))).toBe('defeat');
  });

  it('follows the match: preparation, battle, match point, evolution and the result', () => {
    expect(musicFor(ctx({ match: match({ phase: 'mulligan', turnNumber: 1 }) }))).toBe('prep');
    // turn 1 has no battle; the second player sets up at the start of turn 2
    expect(musicFor(ctx({ match: match({ phase: 'dp', turnNumber: 1 }) }))).toBe('prep');
    expect(musicFor(ctx({ match: match({ phase: 'mulligan', turnNumber: 2 }) }))).toBe('prep');
    expect(musicFor(ctx({ match: match({ phase: 'dp', turnNumber: 2 }) }))).toBe('battle');
    expect(musicFor(ctx({ match: match() }))).toBe('battle');
    expect(musicFor(ctx({ match: match({ rounds: [2, 1] }) }))).toBe('climax');
    expect(musicFor(ctx({ match: match({ evolving: true, rounds: [2, 1] }) }))).toBe('evolution');
    expect(musicFor(ctx({ match: match({ ended: true, viewerWon: true }) }))).toBe('victory');
    expect(musicFor(ctx({ match: match({ ended: true, viewerWon: false }) }))).toBe('defeat');
    expect(musicFor(ctx({ view: 'story', story: 'battle', match: match() }))).toBe('battle');
  });
});

describe('music tracks', () => {
  it('are well formed: one chord per bar, patterns that tile the loop, an intro shorter than the track', () => {
    for (const [id, t] of Object.entries(TRACKS)) {
      expect(t.id, id).toBe(id);
      expect(t.chords.length, id).toBe(t.bars);
      expect(t.bpm, id).toBeGreaterThan(50);
      expect(t.bpm, id).toBeLessThan(200);
      expect(t.intro ?? 0, id).toBeLessThan(t.bars);
      for (const l of t.layers) {
        const p = l.pattern.replace(/\s/g, '');
        expect(p.length % 16, `${id} ${l.kind}`).toBe(0);
        expect((t.bars * 16) % p.length, `${id} ${l.kind}`).toBe(0);
        expect(p, `${id} ${l.kind}`).toMatch(/^[xXo.-]+$/);
        // melodies: one note per hit over the whole track
        if (l.kind === 'lead' || l.kind === 'bell') {
          const hits = p.repeat((t.bars * 16) / p.length).replace(/[^xXo]/g, '').length;
          expect(hits % l.notes.length, `${id} ${l.kind}: ${hits} hits, ${l.notes.length} notes`).toBe(0);
        }
      }
    }
  });
});
