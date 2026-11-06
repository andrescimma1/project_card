import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { gameEvents } from '../../audio/bus';
import { TERMS } from '../vocab/terms';
import { cards } from '../../engine/cards/db';
import type { Card, Level, Specialty } from '../../engine/cards/types';
import { DECK_SIZE, deckStats } from '../../game/deckbook';
import { CardDetail } from '../CardDetail';
import { CardArt, CardFace } from '../play/CardFace';
import { SPECIALTY_COLOR, SPECIALTY_NAME, frameColor } from '../theme';

const SPECIALTIES: Specialty[] = ['fire', 'ice', 'nature', 'darkness', 'rare'];
const LEVELS: Level[] = ['R', 'C', 'U', 'A'];
const KIND_LABEL = { digimon: TERMS.creatures, option: TERMS.supportShort, digivolve: TERMS.evolution } as const;

export function Chip({ on, onClick, children, color }: { on: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="rounded-full border px-2.5 py-1 text-sm"
      style={{ borderColor: on ? (color ?? 'var(--color-bone)') : 'var(--color-seam)', background: on ? (color ?? 'var(--color-bone)') : 'transparent', color: on ? 'var(--color-soot)' : undefined }}
    >
      {children}
    </button>
  );
}

export interface DeckEditorProps {
  name: string;
  cards: number[];
  onChange: (name: string, cards: number[]) => void;
  /** Why `id` cannot be added to `deck`, or null. */
  canAdd: (deck: number[], id: number) => string | null;
  /** Cards offered at all (story mode: the ones owned). Defaults to every card. */
  offered?: (id: number) => boolean;
  /** Copies owned, shown on each tile (story mode). */
  owned?: (id: number) => number;
  nameMaxLength?: number;
  /** Extra problems shown with the deck errors (e.g. from saving). */
  notice?: string | null;
  footer: React.ReactNode;
}

/** The deck editor shared by free play (every card) and story mode (the collection). */
export function DeckEditor({ name, cards: ids, onChange, canAdd, offered, owned, nameMaxLength, notice, footer }: DeckEditorProps) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | Card['kind']>('all');
  const [specs, setSpecs] = useState<Specialty[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [inspect, setInspect] = useState<Card | null>(null);
  const stats = deckStats({ id: '', name, cards: ids });

  const pool = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (offered && !offered(c.id)) return false;
      if (kind !== 'all' && c.kind !== kind) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if ((specs.length || levels.length) && c.kind !== 'digimon') return false;
      if (c.kind === 'digimon' && specs.length && !specs.includes(c.specialty)) return false;
      if (c.kind === 'digimon' && levels.length && !levels.includes(c.level)) return false;
      return true;
    });
  }, [query, kind, specs, levels, offered]);

  const grouped = useMemo(() => {
    const m = new Map<number, number>();
    for (const id of ids) m.set(id, (m.get(id) ?? 0) + 1);
    return [...m.entries()].map(([id, n]) => ({ card: cards[id], n }));
  }, [ids]);

  const add = (id: number) => {
    const why = canAdd(ids, id);
    setMessage(why);
    gameEvents.emit(why ? 'UI_DENIED' : 'CARD_PLACED');
    if (!why) onChange(name, [...ids, id].sort((a, b) => a - b));
  };
  const remove = (id: number) => {
    const i = ids.indexOf(id);
    setMessage(null);
    if (i >= 0) {
      gameEvents.emit('CARD_DISCARDED');
      onChange(name, ids.filter((_, k) => k !== i));
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
      <section aria-label="Cartas disponibles" className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-faded">Buscar</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre de la carta" className="cut [--c:6px] border border-seam bg-leather px-3 py-2" />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'digimon', 'option', 'digivolve'] as const).map((k) => (
              <Chip key={k} on={kind === k} onClick={() => setKind(k)}>
                {k === 'all' ? 'Todas' : KIND_LABEL[k]}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SPECIALTIES.map((s) => (
              <Chip key={s} on={specs.includes(s)} color={SPECIALTY_COLOR[s]} onClick={() => setSpecs((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]))}>
                {SPECIALTY_NAME[s]}
              </Chip>
            ))}
            {LEVELS.map((l) => (
              <Chip key={l} on={levels.includes(l)} onClick={() => setLevels((x) => (x.includes(l) ? x.filter((y) => y !== l) : [...x, l]))}>
                {l}
              </Chip>
            ))}
          </div>
        </div>
        {pool.length === 0 && <p className="cut [--c:10px] border border-dashed border-seam p-6 text-faded">Ninguna carta coincide con los filtros.</p>}
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3">
          {pool.map((c) => {
            const n = ids.filter((x) => x === c.id).length;
            const blocked = canAdd(ids, c.id) !== null;
            const have = owned?.(c.id);
            return (
              <li key={c.id} className="relative">
                <button
                  type="button"
                  data-sfx="none"
                  data-sfx-hover="card"
                  onClick={() => add(c.id)}
                  aria-label={`Añadir ${c.name} (${n} en el mazo${have !== undefined ? `, tienes ${have}` : ''})`}
                  className={`block w-full rounded-xl transition-transform ${blocked ? 'opacity-45' : 'hover:-translate-y-1'}`}
                >
                  <CardFace card={c} size="sm" glow={n > 0} />
                </button>
                {n > 0 && <span className="absolute -top-2 -left-2 grid size-7 place-items-center rounded-full bg-bone font-display text-sm font-bold text-soot">{n}</span>}
                {have !== undefined && <span className="absolute right-1 bottom-1 rounded-md bg-soot/85 px-1.5 text-xs tabular-nums text-faded">×{have}</span>}
                <button
                  type="button"
                  onClick={() => setInspect(c)}
                  aria-label={`Ver detalle de ${c.name}`}
                  className="absolute top-5 right-1 grid size-6 place-items-center rounded-full border border-seam bg-soot/85 text-[11px] text-faded hover:text-bone"
                >
                  i
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <aside aria-label="Tu mazo" className="flex flex-col gap-3 lg:sticky lg:top-0 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto">
        <input
          value={name}
          maxLength={nameMaxLength}
          onChange={(e) => onChange(e.target.value, ids)}
          aria-label="Nombre del mazo"
          className="cut [--c:6px] border border-seam bg-leather px-3 py-2 font-display text-xl font-bold "
        />
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-faded">Cartas</span>
            <span className="font-display text-2xl font-bold tabular-nums">
              {stats.total}
              <span className="text-sm font-normal text-faded"> / {DECK_SIZE}</span>
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-soot">
            <motion.div className="h-full rounded-full" animate={{ width: `${(stats.total / DECK_SIZE) * 100}%` }} style={{ background: stats.total === DECK_SIZE ? 'var(--color-verified)' : 'var(--color-brass)' }} />
          </div>
        </div>
        <p className="text-sm text-faded">
          {stats.digimon} {TERMS.creatures.toLowerCase()} ({LEVELS.map((l) => `${stats.levels[l]} ${TERMS.levels[l]}`).join(', ')}), {stats.option} de apoyo, {stats.digivolve} de evolución.
        </p>
        <div className="flex h-2 overflow-hidden rounded-full" aria-label="Reparto por especialidad">
          {SPECIALTIES.map((s) => (
            <span key={s} style={{ flex: stats.specialties[s], background: SPECIALTY_COLOR[s] }} title={`${SPECIALTY_NAME[s]}: ${stats.specialties[s]}`} />
          ))}
        </div>
        {(message ?? notice) && (
          <p role="alert" data-sfx="none" className="cut [--c:6px] border px-3 py-2 text-sm" style={{ borderColor: 'var(--color-probable)' }}>
            {message ?? notice}
          </p>
        )}
        {stats.errors.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm" style={{ color: 'var(--color-probable)' }}>
            {stats.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        <ul className="flex flex-col gap-1">
          {grouped.map(({ card, n }) => (
            <li key={card.id} className="flex items-center gap-2 cut [--c:6px] bg-leather/70 py-1 pr-1 pl-1">
              <CardArt card={card} className="size-8 shrink-0 rounded-md" />
              <span className="min-w-0 flex-1 truncate text-sm" style={{ color: frameColor(card) }}>
                {card.name}
              </span>
              <span className="font-display text-sm tabular-nums">×{n}</span>
              <button type="button" data-sfx="none" onClick={() => remove(card.id)} aria-label={`Quitar una copia de ${card.name}`} className="grid size-7 place-items-center rounded-md border border-seam hover:bg-hide">
                −
              </button>
              <button type="button" onClick={() => add(card.id)} aria-label={`Añadir una copia de ${card.name}`} className="grid size-7 place-items-center rounded-md border border-seam hover:bg-hide">
                +
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">{footer}</div>
      </aside>

      {inspect && (
        <div className="fixed inset-y-0 right-0 z-30 flex w-full max-w-[28rem] p-3">
          <CardDetail card={inspect} onClose={() => setInspect(null)} />
        </div>
      )}
    </div>
  );
}
