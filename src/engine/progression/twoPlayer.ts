/**
 * "2 Player Battle" between two saves (OPENSEG menu; result SLUS 0x80041A1C, which runs 0x8003EC4C without
 * the COM parts): for each save the deck slot used records the result, then 2P wins (+0x1C) / losses
 * (+0x1E), up to 999; rounds per card for both (KAWSEG 0x801ED0A0). No EXP, no Prize Pack, no COM records.
 * The highest attack powers are only kept for the first save (KAWSEG 0x801EA5F4 skips player 1).
 */
import type { GameEvent, GameState, PlayerId } from '../game/types';
import { updateRanks } from './ranks';
import { applyBattleRecords, recordAttackUse, recordMaxAttack, recordRounds } from './records';
import type { SaveData } from './save';

const CAP = 999;

export function apply2pResult(saves: [SaveData, SaveData], m: { state: GameState; events: GameEvent[] }): void {
  saves.forEach((s, i) => {
    const p = i as PlayerId;
    const win = m.state.winner === p;
    applyBattleRecords(s, { win, lent: null, rival: null });
    if (win) s.wins2p = Math.min(s.wins2p + 1, CAP);
    else s.losses2p = Math.min(s.losses2p + 1, CAP);
    recordRounds(s, p, m.state, m.events);
    recordAttackUse(s, p, m.events); // 🟡 where the game counts it is not traced
    s.ranks = updateRanks(s.ranks, s);
  });
  recordMaxAttack(saves[0], m.state, m.events);
}
