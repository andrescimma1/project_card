import { describe, expect, it } from 'vitest';
import { SoundGate } from '../../src/audio/gate';

const rule = (o: Partial<{ throttleMs: number; maxVoices: number; priority: number }> = {}) => ({ throttleMs: 50, maxVoices: 2, priority: 1, ...o });

describe('sound gate', () => {
  it('drops the same sound fired again inside its throttle window', () => {
    let now = 0;
    const g = new SoundGate(() => now);
    expect(g.admit('hit', rule(), 300)).toBe(true);
    now = 20;
    expect(g.admit('hit', rule(), 300)).toBe(false);
    expect(g.admit('draw', rule(), 300)).toBe(true);
    now = 60;
    expect(g.admit('hit', rule(), 300)).toBe(true);
  });

  it('caps the voices of one sound while they still ring', () => {
    let now = 0;
    const g = new SoundGate(() => now);
    expect(g.admit('draw', rule({ throttleMs: 0 }), 500)).toBe(true);
    now = 10;
    expect(g.admit('draw', rule({ throttleMs: 0 }), 500)).toBe(true);
    now = 20;
    expect(g.admit('draw', rule({ throttleMs: 0 }), 500)).toBe(false);
    now = 520;
    expect(g.admit('draw', rule({ throttleMs: 0 }), 500)).toBe(true);
  });

  it('when everything is busy only high-priority sounds get through', () => {
    const now = 0;
    const g = new SoundGate(() => now, 3);
    for (const k of ['a', 'b', 'c']) expect(g.admit(k, rule(), 1000)).toBe(true);
    expect(g.admit('hover', rule({ priority: 0 }), 50)).toBe(false);
    expect(g.admit('impact', rule({ priority: 2 }), 400)).toBe(true);
  });
});
