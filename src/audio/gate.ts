/**
 * Decides whether a sound may start: drops repeats fired too close together, caps the voices of one
 * sound, and when too much is ringing keeps only the important ones (combat, evolution).
 */
export interface GateRule {
  /** The same sound again within this window is a duplicate. */
  throttleMs: number;
  /** Voices of this sound ringing at once. */
  maxVoices: number;
  /** 0 interface, 1 cards, 2 combat / evolution / results. */
  priority: number;
}

export class SoundGate {
  private last = new Map<string, number>();
  private voices: { key: string; end: number }[] = [];

  constructor(
    private now: () => number,
    private maxTotal = 24,
  ) {}

  admit(key: string, rule: GateRule, durationMs: number): boolean {
    const t = this.now();
    this.voices = this.voices.filter((v) => v.end > t);
    const prev = this.last.get(key);
    if (prev !== undefined && t - prev < rule.throttleMs) return false;
    if (this.voices.filter((v) => v.key === key).length >= rule.maxVoices) return false;
    if (this.voices.length >= this.maxTotal && rule.priority < 2) return false;
    this.last.set(key, t);
    this.voices.push({ key, end: t + durationMs });
    return true;
  }

  /** Voices still ringing (for the debug handle). */
  get active(): number {
    const t = this.now();
    return this.voices.filter((v) => v.end > t).length;
  }
}
