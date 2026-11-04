/**
 * Player's Complete Stats (ENDSEG 0x801DF47C): one long page in the original order, with jumps between
 * sections (L2 / R2 in the game). Mode 1 (after the secret battle, CMD11.19(1)) scrolls by itself like
 * credits; any mode can be left at any time (Start in the game).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { cards } from '../../engine/cards/db';
import type { SaveData } from '../../engine/progression/save';
import { completeStats } from '../../engine/progression/stats';
import { SLOT_GLYPH, SPECIALTY_COLOR, SPECIALTY_NAME } from '../theme';
import { CardArt } from '../play/CardFace';
import { Button } from './common';

const SECTIONS = [
  ['cards', 'Cartas'],
  ['events', 'Mazos de evento'],
  ['com', 'Contra la CPU'],
  ['bonuses', 'Bonos'],
  ['trade', 'Intercambio'],
  ['fusion', 'Fusión'],
  ['attacks', 'Ataques'],
  ['specialty', 'Especialidades'],
  ['results', 'Resultados'],
  ['titles', 'Títulos'],
] as const;
const SLOTS = ['circle', 'triangle', 'cross'] as const;
const RANK = ['1.º', '2.º', '3.º', '4.º', '5.º'];
const pct = (permille: number) => `${Math.floor(permille / 10)}.${permille % 10} %`;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={`stats-${id}`} className="flex scroll-mt-4 flex-col gap-3 border-t border-grid pt-6 first:border-t-0 first:pt-0">
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-grid/50 py-1.5">
      <span>{label}</span>
      <span className="font-display tabular-nums">{value}</span>
    </div>
  );
}

const WinLoss = ({ w, l }: { w: number; l: number }) => (
  <>
    {w} <span className="text-haze">victorias</span> · {l} <span className="text-haze">derrotas</span>
  </>
);

export function CompleteStats({ save, autoScroll, onClose }: { save: SaveData; autoScroll: boolean; onClose: () => void }) {
  const st = useMemo(() => completeStats(save), [save]);
  const page = useRef<HTMLDivElement>(null);
  const [rolling, setRolling] = useState(autoScroll);

  useEffect(() => {
    if (!rolling) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return setRolling(false);
    let raf = 0;
    let last = performance.now();
    const step = (t: number) => {
      const el = page.current;
      if (!el) return;
      el.scrollTop += ((t - last) / 1000) * 40;
      last = t;
      if (el.scrollTop + el.clientHeight < el.scrollHeight - 1) raf = requestAnimationFrame(step);
      else setRolling(false);
    };
    raf = requestAnimationFrame(step);
    const stop = () => setRolling(false);
    const el = page.current;
    el?.addEventListener('wheel', stop, { passive: true });
    el?.addEventListener('pointerdown', stop);
    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener('wheel', stop);
      el?.removeEventListener('pointerdown', stop);
    };
  }, [rolling]);

  const jump = (id: string) => {
    setRolling(false);
    document.getElementById(`stats-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-col gap-3" aria-label="Estadísticas completas del jugador">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl font-bold">Estadísticas completas</h2>
        <Button primary onClick={onClose}>
          Salir
        </Button>
      </div>
      <nav className="flex flex-wrap gap-1.5" aria-label="Secciones">
        {SECTIONS.map(([id, label]) => (
          <button key={id} type="button" onClick={() => jump(id)} className="rounded-full border border-grid px-2.5 py-1 text-sm hover:bg-deep">
            {label}
          </button>
        ))}
      </nav>
      <div ref={page} className="flex max-h-[70vh] flex-col gap-8 overflow-y-auto rounded-2xl border border-grid bg-panel/70 p-4 sm:p-6">
        <Section id="cards" title="Cartas que tienes">
          <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {st.cards.map((c) => (
              <li key={c.id} className="flex gap-3 rounded-xl bg-deep/70 p-2">
                {c.known ? <CardArt card={cards[c.id]} className="size-14 shrink-0 rounded-lg bg-abyss" /> : <div className="size-14 shrink-0 rounded-lg bg-abyss" aria-hidden />}
                <div className="min-w-0 flex-1 text-sm">
                  <p className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-semibold">{c.known ? cards[c.id].name : '?????????????'}</span>
                    <span className="shrink-0 text-xs text-haze">No.{c.id}</span>
                  </p>
                  {c.known && (
                    <p className="text-haze">
                      {c.copies} {c.copies === 1 ? 'copia' : 'copias'}
                      {c.traded && <span className="ml-2" style={{ color: 'var(--color-rare)' }}>Recibida por intercambio</span>}
                    </p>
                  )}
                  {c.digimon && (
                    <>
                      <p>
                        <WinLoss w={c.digimon.wins} l={c.digimon.losses} />
                      </p>
                      <p className="text-haze">
                        Máximo{' '}
                        {SLOTS.map((s, k) => (
                          <span key={s} className="mr-2 tabular-nums text-ink">
                            {SLOT_GLYPH[s]} {c.digimon!.max[k]}
                          </span>
                        ))}
                      </p>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="events" title="Por mazo de evento">
          {st.eventDecks.length === 0 && <p className="text-haze">Todavía no conoces ningún mazo.</p>}
          {st.eventDecks.map((d) => (
            <Row key={d.index} label={`${d.name} Deck`} value={<WinLoss w={d.wins} l={d.losses} />} />
          ))}
        </Section>

        <Section id="com" title="Por rival de la CPU">
          {st.comDecks.length === 0 && <p className="text-haze">Todavía no le ganaste a ningún rival.</p>}
          {st.comDecks.map((d) => (
            <Row key={d.index} label={d.owner} value={<WinLoss w={d.wins} l={d.losses} />} />
          ))}
        </Section>

        <Section id="bonuses" title="Bonos obtenidos">
          <div className="grid gap-x-8 sm:grid-cols-2">
            {st.bonuses.map((b) => (
              <Row key={b.id} label={b.name} value={`${b.times} veces`} />
            ))}
          </div>
        </Section>

        <Section id="trade" title="Intercambio">
          <Row label="Cartas entregadas" value={st.trading.given} />
          <Row label="Cartas recibidas" value={st.trading.received} />
        </Section>

        <Section id="fusion" title="Fusión">
          <Row label="Cartas usadas" value={st.fusion.used} />
          <Row label="Cartas fusionadas" value={st.fusion.fused} />
          <Row label="Mutaciones" value={`${st.fusion.mutations} veces`} />
        </Section>

        <Section id="attacks" title="Ataques que usaste">
          {SLOTS.map((s, k) => (
            <Row key={s} label={`Ataque ${SLOT_GLYPH[s]}`} value={pct(st.attackRate[k])} />
          ))}
        </Section>

        <Section id="specialty" title="Datos por especialidad">
          {st.specialty.rows.map((r, i) => (
            <Row
              key={r.specialty}
              label={
                <>
                  {RANK[i]} <span style={{ color: SPECIALTY_COLOR[r.specialty] }}>{SPECIALTY_NAME[r.specialty]}</span>
                </>
              }
              value={
                <>
                  <WinLoss w={r.wins} l={r.losses} /> · {r.cards} <span className="text-haze">cartas</span>
                </>
              }
            />
          ))}
          <Row
            label="Todas las cartas"
            value={
              <>
                <WinLoss w={st.specialty.all.wins} l={st.specialty.all.losses} /> · {st.specialty.all.cards} <span className="text-haze">cartas</span>
              </>
            }
          />
        </Section>

        <Section id="results" title="Resultados">
          <Row label="Contra la CPU" value={<WinLoss w={st.results.com[0]} l={st.results.com[1]} />} />
          <Row label="Contra otro jugador" value={<WinLoss w={st.results.twoP[0]} l={st.results.twoP[1]} />} />
          <Row label="Veces que guardaste" value={st.results.saves} />
        </Section>

        <Section id="titles" title="Títulos">
          <Row label="Título de batalla" value={st.titles.tamer} />
          <Row label="Título de coleccionista" value={st.titles.collector} />
          <Row label="Título de batalla 2P" value={st.titles.battle2p} />
          <p className="pt-6 text-center font-display text-3xl font-bold" style={{ color: 'var(--color-rare)' }}>
            Eres «{st.finalTitle}»
          </p>
        </Section>
        {autoScroll && (
          <div className="flex justify-center pb-4">
            <Button primary onClick={onClose}>
              Salir
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
