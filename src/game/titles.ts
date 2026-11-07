/** The player's rank titles in the current language (the original table is in English). */
import type { Ranks } from '../engine/progression/ranks';
import { m } from '../i18n';

export function rankNames(r: Ranks): { tamer: string; collector: string; battle2p: string } {
  const t = m().story.ranks;
  return { tamer: t.tamer[r.tamer], collector: t.collector[r.collector], battle2p: t.battle2p[r.battle2p] };
}
