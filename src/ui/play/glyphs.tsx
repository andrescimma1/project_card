import type { AttackSlot } from '../../engine/cards/types';

export const SLOTS: readonly AttackSlot[] = ['circle', 'triangle', 'cross'];

/** ◯ △ ✕ drawn as controller buttons. Colour comes from the surrounding `data-slot` (--a) or currentColor. */
export function SlotIcon({ slot, className = '' }: { slot: AttackSlot; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {slot === 'circle' && <circle cx="12" cy="12" r="7.5" />}
      {slot === 'triangle' && <path d="M12 4.5 20 18.5H4z" />}
      {slot === 'cross' && <path d="M6 6l12 12M18 6 6 18" />}
    </svg>
  );
}

/** The round button: a lit disc in the attack's colour with the glyph inside. */
export function SlotDisc({ slot, size = 34 }: { slot: AttackSlot; size?: number }) {
  return (
    <span data-slot={slot} className="glyph" style={{ width: size, height: size }}>
      <SlotIcon slot={slot} className="h-[58%] w-[58%]" />
    </span>
  );
}
