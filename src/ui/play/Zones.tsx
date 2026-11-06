import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import type { Card } from '../../engine/cards/types';
import type { GameState, PlayerId } from '../../engine/game/types';
import { cardsIn, count, top } from '../../engine/game/zones';
import { frameColor } from '../theme';
import { CardArt, CardBack } from './CardFace';
import { cardAt } from './util';

/** The DP Slot: the cards charged this far, newest first, each with its +P. */
export function DpSlot({ game, player, onInspect }: { game: GameState; player: PlayerId; onInspect: (c: Card) => void }) {
  const refs = cardsIn(game.players[player].dp);
  return (
    <div className="flex w-[196px] shrink-0 flex-col gap-1.5 self-center" aria-label="DP Slot">
      <span className="font-display text-[15px] font-bold text-gold italic">DP Slot</span>
      <ul className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }, (_, i) => {
          const r = refs[i];
          if (r === undefined) return <li key={`e${i}`} className="cut h-[44px] bg-abyss/50 shadow-[inset_0_0_0_1px_rgb(159_208_255/0.12)] [--c:7px]" aria-hidden />;
          const c = cardAt(game, player, r);
          return (
            <motion.li key={r} layoutId={`card-${player}-${r}`} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <button
                type="button"
                onClick={() => onInspect(c)}
                title={`${c.name}: +${c.kind === 'digimon' ? c.dpGiven : 0} DP`}
                className="cut relative block h-[44px] w-full overflow-hidden [--c:7px]"
                style={{ boxShadow: `inset 0 0 0 2px ${frameColor(c)}` }}
              >
                <CardArt card={c} className="h-full w-full" />
                <span className="num absolute right-0 bottom-0 bg-abyss/85 px-1 text-[12px] font-bold text-gold">+{c.kind === 'digimon' ? c.dpGiven : 0}</span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/** Rounds won: three crests, as many lit as KOs. */
export function RoundCrests({ rounds, label }: { rounds: number; label: string }) {
  return (
    <span className="flex items-center gap-1.5" role="img" aria-label={`${label}: ${rounds} de 3 rondas`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-[15px] rotate-45"
          initial={false}
          animate={{
            backgroundColor: i < rounds ? '#ffc934' : 'rgba(2,7,22,0.6)',
            boxShadow: i < rounds ? '0 0 12px rgba(255,201,52,0.8), inset 0 0 0 2px #fff1b8' : 'inset 0 0 0 2px rgba(159,208,255,0.35)',
            scale: i < rounds ? [1.6, 1] : 1,
          }}
        />
      ))}
    </span>
  );
}

/** Online Deck and Offline Pile. `onDeck` makes the deck playable (support gamble). */
export function Piles({ game, player, onInspect, onDeck }: { game: GameState; player: PlayerId; onInspect: (c: Card) => void; onDeck?: () => void }) {
  const p = game.players[player];
  const t = top(p.offline);
  const topCard = t === null ? null : cardAt(game, player, t);
  const deck = <CardBack count={count(p.online)} label="Online Deck" />;
  return (
    <div className={`flex shrink-0 items-start gap-3 self-center ${player === 1 ? 'flex-row-reverse' : ''}`}>
      {onDeck ? (
        <button type="button" onClick={onDeck} className="rounded-sm drop-shadow-[0_0_10px_rgb(72_228_255_/0.8)] transition-transform hover:-translate-y-1" aria-label={`Apostar con la carta de arriba del mazo (${count(p.online)} cartas)`}>
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
            className="cut relative overflow-hidden [--c:1.1em]"
            style={{ width: '12.6em', height: '17.6em', boxShadow: `inset 0 0 0 2px ${frameColor(topCard)}` }}
            title={`Arriba: ${topCard.name}`}
          >
            <CardArt card={topCard} className="h-full w-full opacity-70 grayscale-[55%]" />
            <span className="num absolute inset-x-0 bottom-0 bg-abyss/85 py-0.5 text-center text-[2.6em] font-extrabold italic">{count(p.offline)}</span>
          </button>
        ) : (
          <div className="slot-empty" style={{ fontSize: '1em' }}>
            <span className="text-[2.6em]">0</span>
          </div>
        )}
        <span className="font-display text-[1.7em] font-semibold text-haze">Offline Pile</span>
      </div>
    </div>
  );
}
