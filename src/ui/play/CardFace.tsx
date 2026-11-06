import { useState, type CSSProperties, type PointerEvent } from 'react';
import type { Card } from '../../engine/cards/types';
import { artUrl, isCustomArt } from '../art';
import { frameColor } from '../theme';
import { ACTIONS, slotOf } from '../vocab/actions';
import { factionOf, paletteOf } from '../vocab/factions';
import { cardText, TERMS } from '../vocab/terms';
import { ActionIcon, BackSigil, FactionEmblem } from './glyphs';

export { artUrl };

/** Sheen and 3D tilt follow the pointer (CSS variables read by `.tcg` / `.holo`). */
export function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--mx', `${x * 100}%`);
  el.style.setProperty('--my', `${y * 100}%`);
  el.style.setProperty('--rx', `${(0.5 - y) * 10}deg`);
  el.style.setProperty('--ry', `${(x - 0.5) * 13}deg`);
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
      // the disc art is 64×64 and is drawn pixelated; our own art is high resolution
      className={`object-cover ${isCustomArt(card.id) ? '' : '[image-rendering:pixelated]'} ${flip ? '-scale-x-100' : ''} ${className}`}
    />
  );
}

export type CardSize = 'xs' | 'sm' | 'hand' | 'md' | 'lg';
/** Every size is the same card: the face is drawn in em, the size only sets the font size. */
const FONT: Record<CardSize, number> = { xs: 6.6, sm: 8.9, hand: 10, md: 11.4, lg: 18 };

/** Level medallion: our initial for the level; support and evolution cards say what they are. */
function badgeOf(card: Card): string {
  if (card.kind === 'digimon') return TERMS.levelShort[card.level];
  return card.kind === 'option' ? 'Ap' : 'Ev';
}

/**
 * A physical card in its faction's colours: the art in an inked window, the name on a parchment strip,
 * level medallion, +PE, HP and the three actions (Furia, Técnica, Instinto) with their powers.
 * `playable` pulses (the board can play it now); `glow` marks it as selected; `dim` darkens it.
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
  const pal = paletteOf(card);
  const style = { fontSize: FONT[size], '--f-main': pal.main, '--f-dark': pal.dark, '--f-light': pal.light } as CSSProperties;
  const creature = card.kind === 'digimon' ? card : null;
  const faction = factionOf(card);
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
          <span className="tcg-badge" title={creature ? TERMS.levels[creature.level] : card.kind === 'option' ? TERMS.supportCard : TERMS.evolutionCard}>
            {badgeOf(card)}
          </span>
          {creature && (
            <span className="tcg-chip num" title={`Da ${creature.dpGiven} ${TERMS.dp} al cargarla`}>
              <small>{TERMS.dp}</small>+{creature.dpGiven}
            </span>
          )}
          <span className="tcg-name">{card.name}</span>
        </div>
        <div className="tcg-foot">
          {creature ? (
            <>
              <div className="tcg-hp">
                <span>
                  <small>{TERMS.hp} </small>
                  <b className="num">{creature.hp}</b>
                </span>
                {creature.level === 'C' || creature.level === 'U' ? (
                  <small>
                    {creature.dpRequired} {TERMS.dp}
                  </small>
                ) : (
                  faction && <FactionEmblem faction={faction.id} className="h-[1.25em] w-[1.25em]" />
                )}
              </div>
              <div className="tcg-atk">
                {ACTIONS.map((a) => (
                  <span key={a} data-action={a} className="num">
                    <ActionIcon action={a} />
                    {creature.attacks[slotOf(a)].power}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="tcg-text">{cardText(card.kind === 'option' ? card.support.text : card.kind === 'digivolve' ? card.text : '')}</p>
          )}
        </div>
        <div className="tcg-holo" />
      </div>
    </div>
  );
}

/** Face-down deck: our own back (leather, bronze edge and sigil) with the number of cards. */
export function CardBack({ count, label, size = 'hand' }: { count: number; label: string; size?: CardSize }) {
  const back = {
    background: 'radial-gradient(circle at 50% 46%, rgb(232 191 93 / 0.18), transparent 46%), var(--grain), linear-gradient(160deg, #5b3a22, #2e1d12 55%, #4a2f1b)',
    boxShadow: 'inset 0 0 0 0.25em #c9974a, inset 0 0 0 0.4em #2b1d12, inset 0 0 0 0.55em rgb(201 151 74 / 0.45)',
  };
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ fontSize: FONT[size] * 0.62 }}>
      <div className="relative" style={{ width: '12.6em', height: '17.6em' }}>
        {count > 1 && <div className="absolute inset-0 translate-x-[0.5em] translate-y-[0.5em] rounded-[0.85em] bg-[#1d130c]" />}
        {count > 8 && <div className="absolute inset-0 translate-x-[0.25em] translate-y-[0.25em] rounded-[0.85em] bg-[#2a1b11]" />}
        {count > 0 ? (
          <div className="absolute inset-0 grid place-items-center rounded-[0.85em]" style={back}>
            <BackSigil className="absolute size-[8.5em] text-[#c9974a] opacity-80" />
            <span className="num relative grid size-[5.4em] place-items-center rounded-full bg-[#1d130c]/85 text-[2.6em] font-extrabold text-bone shadow-[0_0_0_0.08em_#c9974a]">
              <span className="text-[0.42em]">{count}</span>
            </span>
          </div>
        ) : (
          <div className="slot-empty absolute inset-0" style={{ width: '100%', height: '100%', fontSize: '1.6em' }}>
            0
          </div>
        )}
      </div>
      {label && <span className="font-display text-[1.7em] font-semibold text-faded">{label}</span>}
    </div>
  );
}
