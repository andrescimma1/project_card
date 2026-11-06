import type { PointerEvent } from 'react';
import type { Card } from '../engine/cards/types';
import { LEVEL_NAME, SPECIALTY_NAME, frameColor } from './theme';
import { ACTIONS, slotOf } from './vocab/actions';
import { crossEffectLabel, TERMS } from './vocab/terms';
import { ActionIcon } from './play/glyphs';
import { CardArt } from './play/CardFace';

function trackPointer(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
}

export function CardTile({ card, active, onSelect }: { card: Card; active: boolean; onSelect: () => void }) {
  const color = frameColor(card);
  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerMove={trackPointer}
      data-active={active}
      aria-pressed={active}
      aria-label={`${card.name}, carta ${card.number}`}
      className="holo group flex aspect-[63/88] w-full flex-col overflow-hidden rounded-[14px] border-2 bg-leather text-left transition-transform duration-150 hover:-translate-y-0.5"
      style={{
        borderColor: color,
        boxShadow: active ? `0 0 0 3px var(--color-soot), 0 0 0 5px ${color}` : undefined,
      }}
    >
      <div className="flex items-center justify-between px-2.5 pt-2 pb-1.5" style={{ background: color, color: '#fff3dc' }}>
        <span className="font-display text-xs font-semibold tabular-nums">#{card.number}</span>
        {card.kind === 'digimon' ? (
          <span className="font-display text-xs font-semibold" title={LEVEL_NAME[card.level]}>
            {SPECIALTY_NAME[card.specialty]} · {TERMS.levelShort[card.level]}
          </span>
        ) : (
          <span className="font-display text-xs font-semibold">{card.kind === 'option' ? TERMS.supportShort : TERMS.evolutionShort}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-2.5 pt-2 pb-2.5">
        <div className="flex items-center gap-2">
          <CardArt card={card} className="size-11 shrink-0 rounded-md bg-soot" />
          <h3 className="min-w-0 font-display text-[15px] leading-tight font-semibold [overflow-wrap:anywhere] text-bone">{card.name}</h3>
        </div>

        {card.kind === 'digimon' ? (
          <>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl leading-none font-bold tabular-nums" style={{ color }}>
                {card.hp}
              </span>
              <span className="text-xs text-faded">{TERMS.hp}</span>
            </div>
            <ul className="flex flex-col gap-0.5 text-[12px]">
              {ACTIONS.map((a) => (
                <li key={a} data-action={a} className="flex items-center gap-1.5" title={TERMS.actions[a]}>
                  <ActionIcon action={a} className="size-3.5 shrink-0 text-[color:var(--a)]" />
                  <span className="min-w-0 flex-1 truncate" title={card.attacks[slotOf(a)].name}>{card.attacks[slotOf(a)].name}</span>
                  <span className="font-display font-semibold tabular-nums">{card.attacks[slotOf(a)].power}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-1 text-[11px]">
              {card.crossEffect !== 'none' && (
                <span className="rounded-full border border-seam px-1.5 py-0.5">{crossEffectLabel(card.crossEffect)}</span>
              )}
              <span className="text-faded">
                {card.level === 'R' || card.level === 'A' ? '' : `${card.dpRequired} ${TERMS.dp} `}
                <span className="text-bone">+{card.dpGiven}</span>
              </span>
            </div>
          </>
        ) : (
          <p className="line-clamp-6 text-[12px] leading-snug text-faded">{card.kind === 'option' ? card.support.text : card.text}</p>
        )}

        {card.issues.length > 0 ? (
          <span className="mt-1 self-start rounded-full px-1.5 py-0.5 text-[11px] font-semibold text-soot" style={{ background: 'var(--color-conflict)' }}>
            {card.issues.length === 1 ? '1 punto a verificar' : `${card.issues.length} puntos a verificar`}
          </span>
        ) : (
          card.notes.length > 0 && (
            <span className="mt-1 self-start rounded-full border px-1.5 py-0.5 text-[11px]" style={{ borderColor: 'var(--color-probable)', color: 'var(--color-probable)' }}>
              El texto no coincide con el juego
            </span>
          )
        )}
      </div>
    </button>
  );
}
