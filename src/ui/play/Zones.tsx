import { motion } from 'motion/react';
import type { Card } from '../../engine/cards/types';
import { playerDp } from '../../engine/game/digivolve';
import type { GameState, PlayerId } from '../../engine/game/types';
import { cardsIn, count, top } from '../../engine/game/zones';
import { DP_CAP } from '../../engine/rules/primitives';
import { frameColor } from '../theme';
import { CardArt, CardBack } from './CardFace';
import { cardAt } from './util';

/** DP as the game computes it: sum of +P of the DP Slot cards, capped at 90. */
export function DpGauge({ game, player, onInspect }: { game: GameState; player: PlayerId; onInspect: (c: Card) => void }) {
  const p = game.players[player];
  const dp = playerDp(p);
  const refs = cardsIn(p.dp);
  return (
    <div className="flex min-w-[10.5rem] flex-1 flex-col gap-1.5 rounded-xl border border-grid bg-deep/70 p-2.5 sm:max-w-sm">
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-haze">DP Slot</span>
        <span className="font-display text-2xl leading-none font-bold tabular-nums">
          {dp}
          <span className="text-xs font-normal text-haze"> / {DP_CAP}</span>
        </span>
      </div>
      <div className="grid grid-cols-9 gap-0.5" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <motion.span
            key={i}
            className="h-1.5 rounded-sm"
            initial={false}
            animate={{ backgroundColor: dp >= (i + 1) * 10 ? 'var(--color-verified)' : 'var(--color-grid)' }}
          />
        ))}
      </div>
      <ul className="flex min-h-7 flex-wrap gap-1">
        {refs.map((r) => {
          const c = cardAt(game, player, r);
          return (
            <motion.li key={r} layoutId={`card-${player}-${r}`}>
              <button
                type="button"
                onClick={() => onInspect(c)}
                title={`${c.name} (+${c.kind === 'digimon' ? c.dpGiven : 0})`}
                className="flex items-center gap-1 overflow-hidden rounded-md border bg-abyss pr-1.5 text-[10px] font-semibold tabular-nums"
                style={{ borderColor: frameColor(c) }}
              >
                <CardArt card={c} className="size-6" />+{c.kind === 'digimon' ? c.dpGiven : 0}
              </button>
            </motion.li>
          );
        })}
        {refs.length === 0 && <li className="text-[11px] text-haze">Sin cartas</li>}
      </ul>
    </div>
  );
}

export function RoundCrests({ rounds, label }: { rounds: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1" aria-label={`${label}: ${rounds} de 3 rondas`}>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-4 rotate-45 rounded-[3px] border-2"
            initial={false}
            animate={{ backgroundColor: i < rounds ? 'var(--color-rare)' : 'rgba(0,0,0,0)', borderColor: i < rounds ? 'var(--color-rare)' : 'var(--color-grid)' }}
          />
        ))}
      </div>
      <span className="text-[10px] text-haze">Rondas</span>
    </div>
  );
}

export function Piles({ game, player, onInspect }: { game: GameState; player: PlayerId; onInspect: (c: Card) => void }) {
  const p = game.players[player];
  const t = top(p.offline);
  const topCard = t === null ? null : cardAt(game, player, t);
  return (
    <div className="flex items-end gap-3">
      <CardBack count={count(p.online)} label="Online Deck" />
      <div className="flex flex-col items-center gap-1">
        {topCard ? (
          <button type="button" onClick={() => onInspect(topCard)} className="relative h-[4.6rem] w-[3.3rem] overflow-hidden rounded-lg border-2 opacity-80" style={{ borderColor: frameColor(topCard) }} title={`Arriba: ${topCard.name}`}>
            <CardArt card={topCard} className="h-full w-full grayscale-[60%]" />
            <span className="absolute right-0.5 bottom-0.5 rounded bg-abyss/85 px-1 font-display text-xs tabular-nums">{count(p.offline)}</span>
          </button>
        ) : (
          <CardBack count={0} label="" />
        )}
        <span className="text-[10px] text-haze">Offline Pile</span>
      </div>
      <RoundCrests rounds={p.rounds} label={player === 0 ? 'Tus rondas' : 'Rondas de la CPU'} />
    </div>
  );
}
