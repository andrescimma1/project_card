import { useState, type CSSProperties, type PointerEvent } from 'react';
import type { Card } from '../../engine/cards/types';
import { SPECIALTY_NAME, frameColor } from '../theme';
import { SLOTS, SlotIcon } from './glyphs';

/** Original card art extracted from the user's disc (npm run extract:art). Missing art falls back gracefully. */
export function artUrl(cardId: number) {
  return `/card-art/LC${String(cardId).padStart(3, '0')}.png`;
}

/** Foil and 3D tilt follow the pointer (CSS variables read by `.tcg` / `.holo`). */
export function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--mx', `${x * 100}%`);
  el.style.setProperty('--my', `${y * 100}%`);
  el.style.setProperty('--rx', `${(0.5 - y) * 14}deg`);
  el.style.setProperty('--ry', `${(x - 0.5) * 18}deg`);
}

export function resetPointer(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

export function CardArt({ card, className = '', flip = false }: { card: Card; className?: string; flip?: boolean }) {
  const [missing, setMissing] = useState(false);
  const color = frameColor(card);
  if (missing)
    return (
      <div className={`grid place-items-center font-display text-3xl font-bold ${className}`} style={{ background: `radial-gradient(circle at 50% 35%, ${color}55, transparent 70%)`, color }}>
        {card.name.slice(0, 1)}
      </div>
    );
  return (
    <img
      src={artUrl(card.id)}
      alt=""
      loading="lazy"
      draggable={false}
      onError={() => setMissing(true)}
      className={`object-cover [image-rendering:pixelated] ${flip ? '-scale-x-100' : ''} ${className}`}
    />
  );
}

export type CardSize = 'xs' | 'sm' | 'hand' | 'md' | 'lg';
/** Every size is the same card: the face is drawn in em, the size only sets the font size. */
const FONT: Record<CardSize, number> = { xs: 6.6, sm: 8.9, hand: 10, md: 11.4, lg: 18 };

/**
 * A card as a collectible: metal edge in its specialty colour, big art, level badge, +P, HP and ◯ △ ✕.
 * `playable` pulses (the board can play it now); `glow` marks it as selected; `dim` greys it out.
 */
export function CardFace({
  card,
  size = 'md',
  glow = false,
  playable = false,
  dim = false,
  className = '',
}: {
  card: Card;
  size?: CardSize;
  glow?: boolean;
  playable?: boolean;
  dim?: boolean;
  className?: string;
}) {
  const style = { fontSize: FONT[size], '--spec': frameColor(card) } as CSSProperties;
  const digimon = card.kind === 'digimon' ? card : null;
  return (
    <div
      className={`tcg ${className}`}
      data-size={size}
      data-playable={playable || undefined}
      data-active={glow || undefined}
      data-dim={dim || undefined}
      style={style}
      onPointerMove={trackPointer}
      onPointerLeave={resetPointer}
    >
      <div className="tcg-edge" />
      <div className="tcg-body">
        <div className="tcg-art">
          <CardArt card={card} className="h-full w-full" />
          <span className="tcg-badge">{digimon ? digimon.level : card.kind === 'option' ? 'OP' : 'DV'}</span>
          {digimon && <span className="tcg-chip num">+P {digimon.dpGiven}</span>}
          <span className="tcg-name">{card.name}</span>
        </div>
        <div className="tcg-foot">
          {digimon ? (
            <>
              <div className="tcg-hp">
                <span>
                  <small>HP </small>
                  <b className="num">{digimon.hp}</b>
                </span>
                <small>{digimon.level === 'C' || digimon.level === 'U' ? `${digimon.dpRequired} DP` : SPECIALTY_NAME[digimon.specialty]}</small>
              </div>
              <div className="tcg-atk">
                {SLOTS.map((s) => (
                  <span key={s} data-slot={s} className="num">
                    <SlotIcon slot={s} />
                    {digimon.attacks[s].power}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="tcg-text">{card.kind === 'option' ? card.support.text : card.kind === 'digivolve' ? card.text : ''}</p>
          )}
        </div>
        <div className="tcg-holo" />
      </div>
    </div>
  );
}

/** Face-down deck: an original back (not the game's) with the number of cards. */
export function CardBack({ count, label, size = 'hand' }: { count: number; label: string; size?: CardSize }) {
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ fontSize: FONT[size] * 0.62 }}>
      <div className="relative" style={{ width: '12.6em', height: '17.6em' }}>
        {count > 1 && <div className="cut absolute inset-0 translate-x-[0.5em] translate-y-[0.5em] bg-[#06133b] [--c:1.1em]" />}
        {count > 8 && <div className="cut absolute inset-0 translate-x-[0.25em] translate-y-[0.25em] bg-[#0a1d52] [--c:1.1em]" />}
        {count > 0 ? (
          <div
            className="cut absolute inset-0 grid place-items-center [--c:1.1em]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgb(72 228 255 / 0.35), transparent 38%), repeating-linear-gradient(45deg, rgb(72 228 255 / 0.08) 0 2px, transparent 2px 9px), linear-gradient(160deg, #2a62c9, #0b2463 55%, #1c4aa8)',
              boxShadow: 'inset 0 0 0 2px rgb(159 208 255 / 0.6)',
            }}
          >
            <span className="grid size-[6em] rotate-45 place-items-center border-2 border-cyan/70 bg-abyss/70">
              <span className="num -rotate-45 text-[2.6em] font-extrabold text-ink italic">{count}</span>
            </span>
          </div>
        ) : (
          <div className="slot-empty absolute inset-0" style={{ width: '100%', height: '100%', fontSize: '1.6em' }}>
            0
          </div>
        )}
      </div>
      {label && <span className="font-display text-[1.7em] font-semibold text-haze">{label}</span>}
    </div>
  );
}
