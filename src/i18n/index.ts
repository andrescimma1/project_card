/**
 * Languages of the game. Every text the player reads comes from a dictionary (src/i18n/locales/<lang>/),
 * never written inside a component. `m()` returns the current language's dictionary; the app re-renders
 * entirely when the language changes (main.tsx keys the root by locale), so reading `m()` while
 * rendering is enough.
 *
 * To add a language: copy locales/en, translate it, and add it to CATALOG and LOCALES (the compiler
 * reports every missing key). Card texts live apart, in src/i18n/cards/.
 */
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { en } from './locales/en';
import { es, type Messages } from './locales/es';

export type Locale = 'es' | 'en';

export const LOCALES: { id: Locale; label: string; short: string }[] = [
  { id: 'es', label: 'Español', short: 'ES' },
  { id: 'en', label: 'English', short: 'EN' },
];

const CATALOG: Record<Locale, Messages> = { es, en };

export const LOCALE_KEY = 'cardevo.locale';

/** Spanish is the game's main language; the player's choice is remembered in this browser. */
function initial(): Locale {
  try {
    const saved = typeof localStorage === 'undefined' ? null : localStorage.getItem(LOCALE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    // storage blocked: use the default
  }
  return 'es';
}

export const localeStore = createStore<{ locale: Locale }>(() => ({ locale: initial() }));

export const getLocale = (): Locale => localeStore.getState().locale;

/** The dictionary of the current language. */
export const m = (): Messages => CATALOG[getLocale()];

/** The dictionary of a given language (tests, previews). */
export const messages = (l: Locale): Messages => CATALOG[l];

export function setLocale(l: Locale) {
  localeStore.setState({ locale: l });
  try {
    localStorage.setItem(LOCALE_KEY, l);
  } catch {
    // private mode: the choice lasts this visit
  }
  if (typeof document !== 'undefined') document.documentElement.lang = l;
}

export function useLocale(): Locale {
  return useStore(localeStore, (s) => s.locale);
}

export type { Messages };
