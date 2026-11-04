import { useStore } from 'zustand';
import { legalActions } from '../engine/game/turn';
import { createSession, type SessionState } from './session';

/** The single match session of the app. */
export const sessionStore = createSession();

// Dev-only handle for manual testing from the browser console.
if (import.meta.env.DEV && typeof window !== 'undefined') Object.assign(window, { __dcbSession: sessionStore, __dcbLegal: legalActions });

export function useSession<T>(selector: (s: SessionState) => T): T {
  return useStore(sessionStore, selector);
}
