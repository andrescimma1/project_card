import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import type { Card } from '../../engine/cards/types';
import type { GameState, PlayerId } from '../../engine/game/types';
import { cardsIn, count, top } from '../../engine/game/zones';
import { frameColor } from '../theme';
import { m } from '../../i18n';
import { TERMS } from '../vocab/terms';
import { CardArt, CardBack } from './CardFace';
import { cardAt } from './util';

/** The evolution-point reserve (the rules' DP Slot): the cards charged this far, newest first, each with its PE. */
export function DpSlot({ game, player, onInspect }: { game: GameState; player: PlayerId; onInspect: (c: Card) => void }) {
  const refs = cardsIn(game.players[player].dp);
  return (
    <div className="flex w-[196px] shrink-0 flex-col gap-1.5 self-center" aria-label={m().board.zones.reserveOf(TERMS.dpZone, TERMS.dpLong.toLowerCase())} title={TERMS.dpLong}>
      <span className="font-display text-[16px] font-bold text-gold">
        {TERMS.dpZone} <span className="font-semibold text-faded">· {TERMS.dp}</span>
      </span>
      <ul className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }, (_, i) => {
          const r = refs[i];
          if (r === undefined) return <li key={`e${i}`} className="h-[44px] rounded-[5px] bg-black/30 shadow-[inset_0_0_0_1px_rgb(207_157_76/0.18),inset_0_2px_5px_rgb(0_0_0/0.5)]" aria-hidden />;
          const c = cardAt(game, player, r);
          return (
            <motion.li key={r} layoutId={`card-${player}-${r}`} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <button
                type="button"
                onClick={() => onInspect(c)}
                title={`${c.name}: +${c.kind === 'digimon' ? c.dpGiven : 0} ${TERMS.dp}`}
                className="relative block h-[44px] w-full overflow-hidden rounded-[5px]"
                style={{ boxShadow: `0 0 0 1px #2b1d12, inset 0 0 0 2px ${frameColor(c)}` }}
              >
                <CardArt card={c} className="h-full w-full" />
                <span className="num absolute right-0 bottom-0 rounded-tl-[4px] bg-[#f1e5ca] px-1 text-[13px] font-extrabold text-ink">+{c.kind === 'digimon' ? c.dpGiven : 0}</span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/** Rounds won: three wax seals, as many pressed as KOs. */
export function RoundCrests({ rounds, label }: { rounds: number; label: string }) {
  return (
    <span className="flex items-center gap-1.5" role="img" aria-label={m().board.zones.roundsOf(label, rounds)}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-[16px] rounded-full"
          initial={false}
          animate={{
            backgroundColor: i < rounds ? '#c9974a' : 'rgba(0,0,0,0.35)',
            boxShadow: i < rounds ? '0 0 0 2px #2b1d12, inset 0 0 0 2px #f3d58d, 0 0 8px rgba(232,191,93,0.6)' : 'inset 0 0 0 1px rgba(207,157,76,0.45), inset 0 2px 3px rgba(0,0,0,0.5)',
            scale: i < rounds ? [1.6, 1] : 1,
          }}
        />
      ))}
    </span>
  );
}

/** Deck and discard pile (the rules' Online Deck and Offline Pile). `onDeck` makes the deck playable (support gamble). */
export function Piles({ game, player, onInspect, onDeck }: { game: GameState; player: PlayerId; onInspect: (c: Card) => void; onDeck?: () => void }) {
  const p = game.players[player];
  const t = top(p.offline);
  const topCard = t === null ? null : cardAt(game, player, t);
  const deck = <CardBack count={count(p.online)} label={TERMS.deck} />;
  return (
    <div className={`flex shrink-0 items-start gap-3 self-center ${player === 1 ? 'flex-row-reverse' : ''}`}>
      {onDeck ? (
        <button type="button" onClick={onDeck} className="rounded-sm drop-shadow-[0_0_10px_rgb(232_191_93_/0.8)] transition-transform hover:-translate-y-1" aria-label={m().board.zones.gamble(TERMS.gamble, TERMS.deck.toLowerCase(), count(p.online))}>
          {deck}
        </button>
      ) : (
        deck
      )}
      <div className="flex flex-col items-center gap-1.5" style={{ fontSize: 6.2 } as CSSProperties}>
        {topCard ? (
          <button
            type="button"
            onClick={() => onInspect(topCard)}
            className="relative overflow-hidden rounded-[0.85em]"
            style={{ width: '12.6em', height: '17.6em', boxShadow: `0 0 0 1px #2b1d12, inset 0 0 0 3px ${frameColor(topCard)}` }}
            title={m().board.zones.top(topCard.name)}
          >
            <CardArt card={topCard} className="h-full w-full opacity-70 sepia-[40%]" />
            <span className="num absolute inset-x-0 bottom-0 bg-[#1d130c]/85 py-0.5 text-center text-[2.6em] font-extrabold">{count(p.offline)}</span>
          </button>
        ) : (
          <div className="slot-empty" style={{ fontSize: '1em' }}>
            <span className="text-[2.6em]">0</span>
          </div>
        )}
        <span className="font-display text-[1.7em] font-semibold text-faded">{TERMS.discard}</span>
      </div>
    </div>
  );
}
