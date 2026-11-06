import { describe, expect, it } from 'vitest';
import { createBus, emitCues, type Cue } from '../../src/audio/bus';

describe('game event bus', () => {
  it('delivers to listeners of that event and to wildcard listeners, until they unsubscribe', () => {
    const bus = createBus();
    const got: string[] = [];
    const off = bus.on('CARD_DRAWN', (d) => got.push(`draw:${d.player}`));
    bus.on('*', (_, name) => got.push(`any:${name}`));
    bus.emit('CARD_DRAWN', { player: 1 });
    bus.emit('BATTLE_WON');
    off();
    bus.emit('CARD_DRAWN', { player: 0 });
    expect(got).toEqual(['draw:1', 'any:CARD_DRAWN', 'any:BATTLE_WON', 'any:CARD_DRAWN']);
  });

  it('emits timed cues on their delay and can cancel the ones still pending', () => {
    const bus = createBus();
    const got: string[] = [];
    bus.on('*', (_, name) => got.push(name));
    const timers: { fn: () => void; ms: number; dead: boolean }[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const t = { fn, ms, dead: false };
      timers.push(t);
      return () => void (t.dead = true);
    };
    const cues: Cue[] = [{ name: 'ATTACK_RESOLVED', data: { slot: 'circle' } }, { name: 'HIT_TAKEN', delay: 220 }, { name: 'MONSTER_DEFEATED', delay: 600 }];
    const cancel = emitCues(cues, bus, schedule);
    expect(got).toEqual(['ATTACK_RESOLVED']);
    timers[0].fn();
    cancel();
    for (const t of timers) if (!t.dead) t.fn();
    expect(got).toEqual(['ATTACK_RESOLVED', 'HIT_TAKEN']);
  });
});
