/**
 * Original icons of our game: the three action kinds (Furia, Técnica, Instinto), the faction emblems
 * and the card-back sigil. Drawn as engravings: solid shapes and strokes that stay readable at 14 px.
 */
import { ACTIONS, type ActionKind } from '../vocab/actions';
import type { FactionId } from '../vocab/factions';

export { ACTIONS };

/** Furia: two crossed blades · Técnica: a sighting ring · Instinto: a shield. Colour from currentColor. */
export function ActionIcon({ action, className = '' }: { action: ActionKind; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {action === 'fury' && (
        <>
          <path d="M20 4l-1.6 4.4-8.9 8.9-2.8-2.8 8.9-8.9z" fill="currentColor" stroke="none" />
          <path d="M4.6 13.6l5.8 5.8M5.6 18.4L3.2 20.8" />
          <path d="M4 4l1.6 4.4 8.9 8.9 2.8-2.8-8.9-8.9z" fill="currentColor" stroke="none" />
          <path d="M19.4 13.6l-5.8 5.8M18.4 18.4l2.4 2.4" />
        </>
      )}
      {action === 'technique' && (
        <>
          <circle cx="12" cy="12" r="6.6" />
          <path d="M12 2.6v4.6M12 16.8v4.6M2.6 12h4.6M16.8 12h4.6" />
          <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
        </>
      )}
      {action === 'instinct' && (
        <>
          <path d="M12 2.8l7.6 3v5.6c0 4.8-3.2 8.2-7.6 9.8-4.4-1.6-7.6-5-7.6-9.8V5.8z" />
          <path d="M8.2 9.6L12 12.6l3.8-3M8.2 13.8L12 16.8l3.8-3" />
        </>
      )}
    </svg>
  );
}

/** The action's medallion: a coloured disc in a bronze ring with the icon in parchment. */
export function ActionDisc({ action, size = 34 }: { action: ActionKind; size?: number }) {
  return (
    <span data-action={action} className="glyph" style={{ width: size, height: size }}>
      <ActionIcon action={action} className="h-[62%] w-[62%]" />
    </span>
  );
}

/** Faction emblems (temperament, not element). */
export function FactionEmblem({ faction, className = '' }: { faction: FactionId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      {faction === 'red' && <path d="M6 3.5c2.5 4 3 8.4 1.4 13.8L5 20.5c1.8-5.4 1.6-11-1-17zM11.6 3c2.3 4.4 2.6 9.2.8 14.6L10.2 21c1.6-5.6 1.6-11.6-.9-18zM17.2 3.5c2.2 4.6 2.2 9.4.2 14.4L15 21c1.8-5.2 2-11-.5-17.4z" />}
      {faction === 'blue' && <path d="M14.5 3.2A9 9 0 1 0 20.8 15 7.2 7.2 0 0 1 14.5 3.2z" />}
      {faction === 'green' && <path d="M19.8 3.6C10 3.4 4.4 8.6 4.6 16.2l-1.6 3.6 1.6.8 1.6-3.4c7.4.2 13.2-5 13.6-13.6zM8.4 15.4c2-3.4 4.8-6 8-7.8-2.6 2.4-4.8 5.2-6.4 8.4z" />}
      {faction === 'shadow' && (
        <path d="M12 5.5c-4.6 0-8 3.2-9.6 6.5 1.6 3.3 5 6.5 9.6 6.5s8-3.2 9.6-6.5c-1.6-3.3-5-6.5-9.6-6.5zm0 10.3a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6zm0-2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z" fillRule="evenodd" />
      )}
      {faction === 'gold' && <path d="M12 2l2.2 6.3 6.6-.2-5.3 4 2 6.3L12 14.6l-5.5 3.8 2-6.3-5.3-4 6.6.2z" />}
    </svg>
  );
}

/** The sigil on the back of every card: a compass of three blades around an eye. Original. */
export function BackSigil({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" aria-hidden>
      <circle cx="24" cy="24" r="20" />
      <circle cx="24" cy="24" r="16.5" strokeDasharray="2 3" />
      <path d="M24 6l3.4 12.2L24 22l-3.4-3.8zM39.6 33l-12.3-3-1.6-4.9 5.1-1zM8.4 33l7.2-10.7 5 1-1.6 4.9z" fill="currentColor" fillOpacity=".35" />
      <circle cx="24" cy="25" r="3.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
