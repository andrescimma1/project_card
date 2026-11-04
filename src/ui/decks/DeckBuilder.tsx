import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { cards } from '../../engine/cards/db';
import { decks as originalDecks } from '../../engine/cards/decks';
import type { Card, Level, Specialty } from '../../engine/cards/types';
import { addCard, copiesOf, DECK_SIZE, deckStats, MAX_COPIES, removeCard } from '../../game/deckbook';
import { useDecks } from '../../game/deckStore';
import { CardDetail } from '../CardDetail';
import { CardArt, CardFace } from '../play/CardFace';
import { SPECIALTY_COLOR, SPECIALTY_NAME, frameColor } from '../theme';

const SPECIALTIES: Specialty[] = ['fire', 'ice', 'nature', 'darkness', 'rare'];
const LEVELS: Level[] = ['R', 'C', 'U', 'A'];
const KIND_LABEL = { digimon: 'Digimon', option: 'Option', digivolve: 'Digivolve' } as const;

function Chip({ on, onClick, children, color }: { on: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="rounded-full border px-2.5 py-1 text-sm"
      style={{ borderColor: on ? (color ?? 'var(--color-ink)') : 'var(--color-grid)', background: on ? (color ?? 'var(--color-ink)') : 'transparent', color: on ? 'var(--color-abyss)' : undefined }}
    >
      {children}
    </button>
  );
}

function DeckList() {
  const { decks, edit, create, remove } = useDecks();
  const [source, setSource] = useState(142);
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 py-4">
      <div>
        <h2 className="font-display text-4xl font-bold">Tus mazos</h2>
        <p className="mt-2 max-w-[62ch] text-haze">
          Arma mazos con las reglas originales: 30 cartas, hasta 4 copias de cada una y al menos un Digimon. Todavía no hay progresión, así que las 301 cartas están
          disponibles. Los mazos se guardan en este navegador.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <button type="button" onClick={() => create('Mazo nuevo')} className="rounded-full bg-ink px-5 py-2.5 font-semibold text-abyss hover:bg-white">
          Crear mazo vacío
        </button>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-haze">O empezar desde un mazo original</span>
          <div className="flex gap-2">
            <select value={source} onChange={(e) => setSource(Number(e.target.value))} className="max-w-[18rem] rounded-lg border border-grid bg-deep px-3 py-2">
              {originalDecks.map((d) => (
                <option key={d.index} value={d.index}>
                  {d.owner}: {d.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const d = originalDecks[source];
                create(`${d.name} (copia)`, d.cards);
              }}
              className="rounded-full border border-grid px-4 py-2 text-sm hover:bg-deep"
            >
              Copiar
            </button>
          </div>
        </label>
      </div>
      {decks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-grid p-6 text-haze">Todavía no guardaste ningún mazo.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {decks.map((d) => {
            const s = deckStats(d);
            const lead = d.cards.map((id) => cards[id]).find((c) => c.kind === 'digimon');
            return (
              <li key={d.id} className="flex items-center gap-3 rounded-2xl border border-grid bg-deep/60 p-3">
                {lead && <CardArt card={lead} className="size-14 shrink-0 rounded-xl bg-abyss" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display font-semibold">{d.name}</div>
                  <div className="text-xs text-haze">
                    {s.total}/{DECK_SIZE} cartas, {s.digimon} Digimon. {s.errors.length === 0 ? 'Listo para jugar.' : 'Incompleto.'}
                  </div>
                </div>
                <button type="button" onClick={() => edit(d)} className="rounded-full border border-grid px-3 py-1.5 text-sm hover:bg-panel">
                  Editar
                </button>
                <button type="button" onClick={() => confirm(`¿Borrar el mazo "${d.name}"?`) && remove(d.id)} className="text-sm text-haze underline underline-offset-4 hover:text-ink">
                  Borrar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Editor() {
  const { draft, dirty, setDraft, save, close } = useDecks();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | Card['kind']>('all');
  const [specs, setSpecs] = useState<Specialty[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [inspect, setInspect] = useState<Card | null>(null);
  const deck = draft!;
  const stats = deckStats(deck);

  const pool = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (kind !== 'all' && c.kind !== kind) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if ((specs.length || levels.length) && c.kind !== 'digimon') return false;
      if (c.kind === 'digimon' && specs.length && !specs.includes(c.specialty)) return false;
      if (c.kind === 'digimon' && levels.length && !levels.includes(c.level)) return false;
      return true;
    });
  }, [query, kind, specs, levels]);

  const grouped = useMemo(() => {
    const m = new Map<number, number>();
    for (const id of deck.cards) m.set(id, (m.get(id) ?? 0) + 1);
    return [...m.entries()].map(([id, n]) => ({ card: cards[id], n }));
  }, [deck.cards]);

  const add = (id: number) => {
    const r = addCard(deck, id);
    setMessage(r.error);
    if (!r.error) setDraft(r.deck);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
      <section aria-label="Cartas disponibles" className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-haze">Buscar</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre de la carta" className="rounded-lg border border-grid bg-deep px-3 py-2" />
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
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3">
          {pool.map((c) => {
            const n = copiesOf(deck, c.id);
            const full = n >= MAX_COPIES || deck.cards.length >= DECK_SIZE;
            return (
              <li key={c.id} className="relative">
                <button type="button" onClick={() => add(c.id)} disabled={full} aria-label={`Añadir ${c.name} (${n} en el mazo)`} className={`block w-full rounded-xl transition-transform ${full ? 'opacity-45' : 'hover:-translate-y-1'}`}>
                  <CardFace card={c} size="sm" glow={n > 0} />
                </button>
                {n > 0 && (
                  <span className="absolute -top-2 -left-2 grid size-7 place-items-center rounded-full bg-ink font-display text-sm font-bold text-abyss">{n}</span>
                )}
                <button
                  type="button"
                  onClick={() => setInspect(c)}
                  aria-label={`Ver detalle de ${c.name}`}
                  className="absolute top-5 right-1 grid size-6 place-items-center rounded-full border border-grid bg-abyss/85 text-[11px] text-haze hover:text-ink"
                >
                  i
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <aside aria-label="Tu mazo" className="flex flex-col gap-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
        <input
          value={deck.name}
          onChange={(e) => setDraft({ ...deck, name: e.target.value })}
          aria-label="Nombre del mazo"
          className="rounded-lg border border-grid bg-deep px-3 py-2 font-display text-lg font-semibold"
        />
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-haze">Cartas</span>
            <span className="font-display text-2xl font-bold tabular-nums">
              {stats.total}
              <span className="text-sm font-normal text-haze"> / {DECK_SIZE}</span>
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-abyss">
            <motion.div className="h-full rounded-full" animate={{ width: `${(stats.total / DECK_SIZE) * 100}%` }} style={{ background: stats.total === DECK_SIZE ? 'var(--color-verified)' : 'var(--color-ice)' }} />
          </div>
        </div>
        <p className="text-sm text-haze">
          {stats.digimon} Digimon ({LEVELS.map((l) => `${stats.levels[l]} ${l}`).join(', ')}), {stats.option} Option, {stats.digivolve} Digivolve.
        </p>
        <div className="flex h-2 overflow-hidden rounded-full" aria-label="Reparto por especialidad">
          {SPECIALTIES.map((s) => (
            <span key={s} style={{ flex: stats.specialties[s], background: SPECIALTY_COLOR[s] }} title={`${SPECIALTY_NAME[s]}: ${stats.specialties[s]}`} />
          ))}
        </div>
        {message && <p className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--color-probable)' }}>{message}</p>}
        {stats.errors.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm" style={{ color: 'var(--color-probable)' }}>
            {stats.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        <ul className="flex flex-col gap-1">
          {grouped.map(({ card, n }) => (
            <li key={card.id} className="flex items-center gap-2 rounded-lg bg-deep/70 py-1 pr-1 pl-1">
              <CardArt card={card} className="size-8 shrink-0 rounded-md" />
              <span className="min-w-0 flex-1 truncate text-sm" style={{ color: frameColor(card) }}>
                {card.name}
              </span>
              <span className="font-display text-sm tabular-nums">×{n}</span>
              <button type="button" onClick={() => setDraft(removeCard(deck, card.id))} aria-label={`Quitar una copia de ${card.name}`} className="grid size-7 place-items-center rounded-md border border-grid hover:bg-panel">
                −
              </button>
              <button type="button" onClick={() => add(card.id)} aria-label={`Añadir una copia de ${card.name}`} className="grid size-7 place-items-center rounded-md border border-grid hover:bg-panel">
                +
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button type="button" onClick={save} disabled={!dirty} className="rounded-full bg-ink px-5 py-2 font-semibold text-abyss hover:bg-white disabled:opacity-50">
            {dirty ? 'Guardar mazo' : 'Guardado'}
          </button>
          <button type="button" onClick={() => (!dirty || confirm('Hay cambios sin guardar. ¿Salir igual?')) && close()} className="rounded-full border border-grid px-4 py-2 text-sm hover:bg-deep">
            Volver a mis mazos
          </button>
        </div>
      </aside>

      {inspect && (
        <div className="fixed inset-y-0 right-0 z-30 flex w-full max-w-[28rem] p-3">
          <CardDetail card={inspect} onClose={() => setInspect(null)} />
        </div>
      )}
    </div>
  );
}

export function DeckBuilder() {
  const draft = useDecks((s) => s.draft);
  return draft ? <Editor /> : <DeckList />;
}
