import { useMemo } from 'react';
import { byId, cards, CROSS_EFFECT_LABEL } from '../engine/cards/db';
import { CROSS_EFFECT_BY_CODE } from '../engine/cards/romTables';
import type { Card, Level, Specialty } from '../engine/cards/types';
import { useBrowser, type KindFilter } from '../store';
import { CardTile } from './CardTile';
import { CardDetail } from './CardDetail';
import { SPECIALTY_COLOR, SPECIALTY_NAME } from './theme';

const SPECIALTIES: Specialty[] = ['fire', 'ice', 'nature', 'darkness', 'rare'];
const LEVELS: Level[] = ['R', 'C', 'U', 'A'];
const KINDS: { id: KindFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'digimon', label: 'Digimon' },
  { id: 'option', label: 'Option' },
  { id: 'digivolve', label: 'Digivolve' },
];

function searchable(c: Card) {
  const parts = [c.name, c.number];
  if (c.kind === 'digimon') parts.push(...Object.values(c.attacks).map((a) => a.name), c.support.text);
  else if (c.kind === 'option') parts.push(c.support.text);
  else parts.push(c.text);
  return parts.join(' ').toLowerCase();
}

function Toggle({ on, onClick, children, color }: { on: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="rounded-full border px-2.5 py-1 text-sm transition-colors"
      style={{
        borderColor: on ? (color ?? 'var(--color-ink)') : 'var(--color-grid)',
        background: on ? (color ?? 'var(--color-ink)') : 'transparent',
        color: on ? 'var(--color-abyss)' : 'var(--color-ink)',
      }}
    >
      {children}
    </button>
  );
}

export function CardBrowser() {
  const s = useBrowser();
  const filtered = useMemo(() => {
    const q = s.query.trim().toLowerCase();
    return cards.filter((c) => {
      if (s.kind !== 'all' && c.kind !== s.kind) return false;
      if (s.onlyIssues && c.issues.length === 0 && c.notes.length === 0) return false;
      if (q && !searchable(c).includes(q)) return false;
      const needsDigimon = s.specialties.length > 0 || s.levels.length > 0 || s.crossEffect !== 'any';
      if (needsDigimon) {
        if (c.kind !== 'digimon') return false;
        if (s.specialties.length && !s.specialties.includes(c.specialty)) return false;
        if (s.levels.length && !s.levels.includes(c.level)) return false;
        if (s.crossEffect !== 'any' && c.crossEffect !== s.crossEffect) return false;
      }
      return true;
    });
  }, [s.query, s.kind, s.specialties, s.levels, s.crossEffect, s.onlyIssues]);

  const selected = s.selectedId !== null ? byId.get(s.selectedId) : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
      <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start" aria-label="Filtros">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-haze">Buscar nombre, ataque o efecto</span>
          <input
            value={s.query}
            onChange={(e) => s.setQuery(e.target.value)}
            placeholder="WarGreymon, Eat-up, Draw…"
            className="rounded-lg border border-grid bg-deep px-3 py-2 placeholder:text-haze/60"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-sm text-haze">Tipo de carta</legend>
          <div className="flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <Toggle key={k.id} on={s.kind === k.id} onClick={() => s.setKind(k.id)}>
                {k.label}
              </Toggle>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-sm text-haze">Especialidad</legend>
          <div className="flex flex-wrap gap-1.5">
            {SPECIALTIES.map((sp) => (
              <Toggle key={sp} on={s.specialties.includes(sp)} onClick={() => s.toggleSpecialty(sp)} color={SPECIALTY_COLOR[sp]}>
                {SPECIALTY_NAME[sp]}
              </Toggle>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-sm text-haze">Nivel</legend>
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((l) => (
              <Toggle key={l} on={s.levels.includes(l)} onClick={() => s.toggleLevel(l)}>
                {l}
              </Toggle>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-haze">Efecto ✕</span>
          <select
            value={s.crossEffect}
            onChange={(e) => s.setCrossEffect(e.target.value as typeof s.crossEffect)}
            className="rounded-lg border border-grid bg-deep px-3 py-2"
          >
            <option value="any">Cualquiera</option>
            {CROSS_EFFECT_BY_CODE.map((ce) => (
              <option key={ce} value={ce}>
                {CROSS_EFFECT_LABEL[ce]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={s.onlyIssues} onChange={(e) => s.setOnlyIssues(e.target.checked)} className="size-4 accent-[var(--color-conflict)]" />
          Solo cartas con dudas o con texto que no coincide
        </label>

        <div className="flex items-center justify-between text-sm text-haze">
          <span>
            {filtered.length} de {cards.length} cartas
          </span>
          <button type="button" onClick={s.reset} className="underline underline-offset-4 hover:text-ink">
            Limpiar
          </button>
        </div>
      </aside>

      <div className={`grid gap-6 ${selected ? 'xl:grid-cols-[1fr_26rem]' : ''}`}>
        <section aria-label="Cartas" className="grid grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] content-start gap-4">
          {filtered.map((c) => (
            <CardTile key={c.id} card={c} active={c.id === s.selectedId} onSelect={() => s.select(c.id === s.selectedId ? null : c.id)} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-grid p-6 text-haze">
              Ninguna carta cumple estos filtros. Quita alguno o usa “Limpiar”.
            </p>
          )}
        </section>
        <div
          className={`pointer-events-none fixed inset-x-0 top-24 bottom-0 z-30 flex justify-end p-3 xl:pointer-events-auto xl:sticky xl:inset-auto xl:top-24 xl:z-auto xl:block xl:self-start xl:p-0 ${
            selected ? 'xl:h-[calc(100vh-7rem)]' : 'xl:hidden'
          }`}
        >
          {selected && <CardDetail key={selected.id} card={selected} onClose={() => s.select(null)} />}
        </div>
      </div>
    </div>
  );
}
