import { create } from 'zustand';
import type { CrossEffect, Level, Specialty } from './engine/cards/types';

export type View = 'play' | 'decks' | 'cards' | 'rules';
export type KindFilter = 'all' | 'digimon' | 'option' | 'digivolve';

interface BrowserState {
  view: View;
  query: string;
  kind: KindFilter;
  specialties: Specialty[];
  levels: Level[];
  crossEffect: CrossEffect | 'any';
  onlyIssues: boolean;
  selectedId: number | null;
  docId: string;
  setView: (v: View) => void;
  setQuery: (q: string) => void;
  setKind: (k: KindFilter) => void;
  toggleSpecialty: (s: Specialty) => void;
  toggleLevel: (l: Level) => void;
  setCrossEffect: (c: CrossEffect | 'any') => void;
  setOnlyIssues: (v: boolean) => void;
  select: (id: number | null) => void;
  setDoc: (id: string) => void;
  reset: () => void;
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

const initialFilters = {
  query: '',
  kind: 'all' as KindFilter,
  specialties: [] as Specialty[],
  levels: [] as Level[],
  crossEffect: 'any' as CrossEffect | 'any',
  onlyIssues: false,
};

export const useBrowser = create<BrowserState>((set) => ({
  view: 'play',
  selectedId: null,
  docId: 'mecanicas',
  ...initialFilters,
  setView: (view) => set({ view }),
  setQuery: (query) => set({ query }),
  setKind: (kind) => set({ kind }),
  toggleSpecialty: (s) => set((st) => ({ specialties: toggle(st.specialties, s) })),
  toggleLevel: (l) => set((st) => ({ levels: toggle(st.levels, l) })),
  setCrossEffect: (crossEffect) => set({ crossEffect }),
  setOnlyIssues: (onlyIssues) => set({ onlyIssues }),
  select: (selectedId) => set({ selectedId }),
  setDoc: (docId) => set({ docId }),
  reset: () => set(initialFilters),
}));
