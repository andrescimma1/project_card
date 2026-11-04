import { useState, type PointerEvent } from 'react';
import { CROSS_EFFECT_LABEL } from '../../engine/cards/db';
import type { Card } from '../../engine/cards/types';
import { SLOT_GLYPH, SPECIALTY_NAME, frameColor } from '../theme';

/** Original card art extracted from the user's disc (npm run extract:art). Missing art falls back gracefully. */
export function artUrl(cardId: number) {
  return `/card-art/LC${String(cardId).padStart(3, '0')}.png`;
}

export function trackPointer(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
}

export function CardArt({ card, className = '' }: { card: Card; className?: string }) {
  const [missing, setMissing] = useState(false);
  const color = frameColor(card);
  if (missing)
    return (
      <div className={`grid place-items-center font-display text-3xl font-bold ${className}`} style={{ background: `radial-gradient(circle at 50% 35%, ${color}55, transparent 70%)`, color }}>
        {card.name.slice(0, 1)}
      </div>
    );
  return <img src={artUrl(card.id)} alt="" draggable={false} onError={() => setMissing(true)} className={`object-cover [image-rendering:pixelated] ${className}`} />;
}

type Size = 'xs' | 'sm' | 'md';
const WIDTH: Record<Size, string> = { xs: 'w-[5.25rem]', sm: 'w-[7.5rem]', md: 'w-[9rem]' };

/** Card face used in hands. */
export function CardFace({ card, size = 'md', glow = false }: { card: Card; size?: Size; glow?: boolean }) {
  const color = frameColor(card);
  const tiny = size === 'xs';
  return (
    <div
      onPointerMove={trackPointer}
      className={`holo flex ${WIDTH[size]} flex-col overflow-hidden rounded-xl border-2 bg-deep text-left`}
      style={{ borderColor: color, boxShadow: glow ? `0 0 0 2px var(--color-abyss), 0 0 22px ${color}` : '0 8px 20px rgb(5 8 25 / 0.5)' }}
    >
      <div className="flex items-center justify-between px-1.5 py-0.5 font-display text-[10px] font-semibold" style={{ background: color, color: '#0d1333' }}>
        <span>{card.kind === 'digimon' ? (tiny ? card.level : `${SPECIALTY_NAME[card.specialty]} ${card.level}`) : card.kind === 'option' ? 'Option' : 'Digivolve'}</span>
        {card.kind === 'digimon' && <span>+{card.dpGiven}</span>}
      </div>
      <CardArt card={card} className="aspect-square w-full bg-abyss" />
      <div className={`flex flex-col gap-0.5 px-1.5 pt-1 pb-1.5 ${tiny ? 'text-[9px]' : 'text-[11px]'}`}>
        <span className={`truncate font-display leading-tight font-semibold ${tiny ? 'text-[10px]' : 'text-[12.5px]'}`}>{card.name}</span>
        {card.kind === 'digimon' ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className={`font-display font-bold tabular-nums ${tiny ? 'text-xs' : 'text-base'}`} style={{ color }}>
                {card.hp}
              </span>
              {!tiny && card.level !== 'R' && card.level !== 'A' && <span className="text-[10px] text-haze">{card.dpRequired} DP</span>}
            </div>
            {!tiny && (
              <div className="grid grid-cols-3 gap-0.5 text-center font-display tabular-nums">
                {(['circle', 'triangle', 'cross'] as const).map((s) => (
                  <span key={s} className="rounded bg-abyss/70 py-0.5">
                    <span className="text-haze">{SLOT_GLYPH[s]}</span> {card.attacks[s].power}
                  </span>
                ))}
              </div>
            )}
            {!tiny && <span className="truncate text-[10px] text-haze">✕ {CROSS_EFFECT_LABEL[card.crossEffect]}</span>}
          </>
        ) : (
          !tiny && <span className="line-clamp-3 text-[10px] leading-snug text-haze">{card.kind === 'option' ? card.support.text : card.text}</span>
        )}
      </div>
    </div>
  );
}

export function CardBack({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-[4.6rem] w-[3.3rem]">
        {count > 1 && <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-lg border border-grid bg-deep" />}
        <div
          className="absolute inset-0 grid place-items-center rounded-lg border-2 border-grid font-display text-xs font-bold text-haze"
          style={{
            background:
              count > 0
                ? 'repeating-linear-gradient(135deg, var(--color-panel) 0 6px, var(--color-deep) 6px 12px)'
                : 'transparent',
            borderStyle: count > 0 ? 'solid' : 'dashed',
          }}
        >
          <span className="rounded bg-abyss/80 px-1 tabular-nums">{count}</span>
        </div>
      </div>
      <span className="text-[10px] text-haze">{label}</span>
    </div>
  );
}
