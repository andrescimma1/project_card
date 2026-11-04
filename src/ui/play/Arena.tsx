import { motion } from 'motion/react';
import { CROSS_EFFECT_LABEL } from '../../engine/cards/db';
import type { Card, DigimonCard } from '../../engine/cards/types';
import { battleStat } from '../../engine/rules/primitives';
import type { GameState, PlayerId } from '../../engine/game/types';
import { count } from '../../engine/game/zones';
import { SLOT_GLYPH, SPECIALTY_COLOR, SPECIALTY_NAME } from '../theme';
import { CardArt, trackPointer } from './CardFace';
import { useSession } from '../../game/useSession';
import { activeRef, cardAt, seatNames } from './util';

export function HpBar({ hp, max, color }: { hp: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (hp / Math.max(max, 1)) * 100));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-abyss" role="meter" aria-valuenow={hp} aria-valuemin={0} aria-valuemax={max} aria-label="HP">
      <motion.div className="h-full rounded-full" style={{ background: pct < 25 ? 'var(--color-fire)' : color }} initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
    </div>
  );
}

/** The Digimon in a Battle Slot: art, live HP and powers. */
export function ArenaCard({ game, player, onInspect, mirrored }: { game: GameState; player: PlayerId; onInspect: (c: Card) => void; mirrored?: boolean }) {
  const p = game.players[player];
  const ref = activeRef(game, player);
  const twoPlayer = useSession((s) => s.twoPlayer);
  const names = seatNames(twoPlayer, useSession((s) => s.names));
  if (ref === null) {
    return (
      <div className="grid h-36 w-full max-w-[16rem] place-items-center rounded-2xl border-2 border-dashed border-grid p-4 text-center text-sm text-haze">
        {twoPlayer ? `Battle Slot de ${names[player]} vacío` : player === 0 ? 'Tu Battle Slot está vacío' : 'Battle Slot de la CPU vacío'}
      </div>
    );
  }
  const card = cardAt(game, player, ref) as DigimonCard;
  const color = SPECIALTY_COLOR[p.specialty];
  const max = Math.max(p.hp, battleStat(card.hp, p.enteredAs));
  const below = count(p.stack) - 1;
  return (
    <motion.button
      layoutId={`card-${player}-${ref}`}
      type="button"
      onClick={() => onInspect(card)}
      onPointerMove={trackPointer}
      className="holo flex w-full max-w-[16rem] flex-col overflow-hidden rounded-2xl border-2 bg-panel text-left"
      style={{ borderColor: color, boxShadow: `0 0 40px color-mix(in srgb, ${color} 22%, transparent)` }}
      aria-label={`${card.name}, ${p.hp} HP${twoPlayer ? `, de ${names[player]}` : player === 1 ? ', de la CPU' : ''}`}
    >
      <div className="relative">
        <CardArt card={card} className={`aspect-[16/10] w-full bg-abyss ${mirrored ? '-scale-x-100' : ''}`} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-panel via-panel/70 to-transparent px-3 pt-8 pb-2">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate font-display text-xl leading-tight font-bold">{card.name}</div>
              <div className="text-xs text-haze">
                {SPECIALTY_NAME[p.specialty]}
                {p.specialty !== card.specialty ? ' (cambiada)' : ''}, nivel {card.level}
                {below > 0 ? `, ${below} debajo` : ''}
              </div>
            </div>
            <div className="text-right">
              <motion.div key={p.hp} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="font-display text-3xl leading-none font-bold tabular-nums" style={{ color }}>
                {p.hp}
              </motion.div>
              <div className="text-[10px] text-haze">HP</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3 pt-1 pb-3">
        <HpBar hp={p.hp} max={max} color={color} />
        {p.enteredAs && (
          <div className="self-start rounded-full border px-2 py-0.5 text-[11px]" style={{ borderColor: 'var(--color-probable)', color: 'var(--color-probable)' }}>
            Entró como {p.enteredAs}: {p.enteredAs === 'C' ? 'stats a la mitad' : p.enteredAs === 'U' ? 'stats a un cuarto' : 'stats normales'}
          </div>
        )}
        <ul className="grid grid-cols-3 gap-1.5">
          {(['circle', 'triangle', 'cross'] as const).map((s, i) => (
            <li key={s} className="rounded-lg bg-deep px-2 py-1">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm text-haze">{SLOT_GLYPH[s]}</span>
                <span className="font-display text-base font-semibold tabular-nums">{p.powers[i]}</span>
              </div>
              <div className="truncate text-[10px] text-haze">{card.attacks[s].name}</div>
            </li>
          ))}
        </ul>
        <div className="text-xs text-haze">✕ {CROSS_EFFECT_LABEL[card.crossEffect]}</div>
      </div>
    </motion.button>
  );
}
