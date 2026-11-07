/**
 * Player's Complete Stats (ENDSEG 0x801DF47C): one long page in the original order, with jumps between
 * sections (L2 / R2 in the game). Mode 1 (after the secret battle, CMD11.19(1)) scrolls by itself like
 * credits; any mode can be left at any time (Start in the game).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { cards } from '../../engine/cards/db';
import type { SaveData } from '../../engine/progression/save';
import { completeStats } from '../../engine/progression/stats';
import { rankNames } from '../../game/titles';
import { m } from '../../i18n';
import { deckLabel, ownerName } from '../../story/own/decks';
import { SPECIALTY_COLOR, SPECIALTY_NAME } from '../theme';
import { actionOf } from '../vocab/actions';
import { TERMS } from '../vocab/terms';
import { CardArt } from '../play/CardFace';
import { Button } from './common';

/** Section ids in the original order; their names are in the dictionary (story.stats.sections). */
const SECTIONS = ['cards', 'events', 'com', 'bonuses', 'trade', 'fusion', 'attacks', 'specialty', 'results', 'titles'] as const;
const SLOTS = ['circle', 'triangle', 'cross'] as const;
const pct = (permille: number) => `${Math.floor(permille / 10)}.${permille % 10} %`;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={`stats-${id}`} className="flex scroll-mt-4 flex-col gap-3 border-t border-seam pt-6 first:border-t-0 first:pt-0">
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-seam/50 py-1.5">
      <span>{label}</span>
      <span className="font-display tabular-nums">{value}</span>
    </div>
  );
}

const WinLoss = ({ w, l }: { w: number; l: number }) => {
  const t = m().story.shared;
  return (
    <>
      {w} <span className="text-faded">{t.winsWord(w)}</span> · {l} <span className="text-faded">{t.lossesWord(l)}</span>
    </>
  );
};

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

  const s = m().story.stats;
  const shared = m().story.shared;
  return (
    <div className="flex flex-col gap-3" aria-label={s.label}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-4xl font-black ">{s.title}</h2>
        <Button primary onClick={onClose}>
          {shared.exit}
        </Button>
      </div>
      <nav className="flex flex-wrap gap-1.5" aria-label={s.sectionsLabel}>
        {SECTIONS.map((id) => (
          <button key={id} type="button" onClick={() => jump(id)} className="cut bg-leather px-3 py-1 font-display text-[15px] font-semibold [--c:6px] hover:bg-hide">
            {s.sections[id]}
          </button>
        ))}
      </nav>
      <div ref={page} className="flex max-h-[70vh] flex-col gap-8 overflow-y-auto cut [--c:16px] border border-seam bg-gradient-to-b from-hide/80 to-leather/80 p-4 sm:p-6">
        <Section id="cards" title={s.cardsTitle}>
          <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {st.cards.map((c) => (
              <li key={c.id} className="flex gap-3 cut [--c:10px] bg-leather/70 p-2">
                {c.known ? <CardArt card={cards[c.id]} className="size-14 shrink-0 cut [--c:6px] bg-soot" /> : <div className="size-14 shrink-0 cut [--c:6px] bg-soot" aria-hidden />}
                <div className="min-w-0 flex-1 text-sm">
                  <p className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-semibold">{c.known ? cards[c.id].name : '?????????????'}</span>
                    <span className="shrink-0 text-xs text-faded">{s.cardNo(c.id)}</span>
                  </p>
                  {c.known && (
                    <p className="text-faded">
                      {shared.copies(c.copies)}
                      {c.traded && <span className="ml-2" style={{ color: 'var(--color-rare)' }}>{s.traded}</span>}
                    </p>
                  )}
                  {c.digimon && (
                    <>
                      <p>
                        <WinLoss w={c.digimon.wins} l={c.digimon.losses} />
                      </p>
                      <p className="text-faded">
                        {s.best}{' '}
                        {SLOTS.map((sl, k) => (
                          <span key={sl} className="mr-2 tabular-nums text-bone">
                            {TERMS.actions[actionOf(sl)]} {c.digimon!.max[k]}
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

        <Section id="events" title={s.eventsTitle}>
          {st.eventDecks.length === 0 && <p className="text-faded">{s.noDecks}</p>}
          {st.eventDecks.map((d) => (
            <Row key={d.index} label={deckLabel(d.index)} value={<WinLoss w={d.wins} l={d.losses} />} />
          ))}
        </Section>

        <Section id="com" title={s.comTitle}>
          {st.comDecks.length === 0 && <p className="text-faded">{s.noRivals}</p>}
          {st.comDecks.map((d) => (
            <Row key={d.index} label={ownerName(d.owner)} value={<WinLoss w={d.wins} l={d.losses} />} />
          ))}
        </Section>

        <Section id="bonuses" title={s.bonusesTitle}>
          <div className="grid gap-x-8 sm:grid-cols-2">
            {st.bonuses.map((b) => (
              <Row key={b.id} label={b.name} value={s.times(b.times)} />
            ))}
          </div>
        </Section>

        <Section id="trade" title={s.sections.trade}>
          <Row label={s.given} value={st.trading.given} />
          <Row label={s.received} value={st.trading.received} />
        </Section>

        <Section id="fusion" title={s.sections.fusion}>
          <Row label={s.used} value={st.fusion.used} />
          <Row label={s.fused} value={st.fusion.fused} />
          <Row label={s.mutations} value={s.times(st.fusion.mutations)} />
        </Section>

        <Section id="attacks" title={s.attacksTitle}>
          {SLOTS.map((sl, k) => (
            <Row key={sl} label={s.attacksOf(TERMS.actions[actionOf(sl)])} value={pct(st.attackRate[k])} />
          ))}
        </Section>

        <Section id="specialty" title={s.specialtyTitle}>
          {st.specialty.rows.map((r, i) => (
            <Row
              key={r.specialty}
              label={
                <>
                  {s.rank(i + 1)} <span style={{ color: SPECIALTY_COLOR[r.specialty] }}>{SPECIALTY_NAME[r.specialty]}</span>
                </>
              }
              value={
                <>
                  <WinLoss w={r.wins} l={r.losses} /> · {r.cards} <span className="text-faded">{s.cardsWord(r.cards)}</span>
                </>
              }
            />
          ))}
          <Row
            label={s.allCards}
            value={
              <>
                <WinLoss w={st.specialty.all.wins} l={st.specialty.all.losses} /> · {st.specialty.all.cards} <span className="text-faded">{s.cardsWord(st.specialty.all.cards)}</span>
              </>
            }
          />
        </Section>

        <Section id="results" title={s.sections.results}>
          <Row label={s.vsCom} value={<WinLoss w={st.results.com[0]} l={st.results.com[1]} />} />
          <Row label={s.vsPlayer} value={<WinLoss w={st.results.twoP[0]} l={st.results.twoP[1]} />} />
          <Row label={s.saves} value={st.results.saves} />
        </Section>

        <Section id="titles" title={s.sections.titles}>
          <Row label={s.battleTitle} value={rankNames(save.ranks).tamer} />
          <Row label={s.collectorTitle} value={rankNames(save.ranks).collector} />
          <Row label={s.battle2pTitle} value={rankNames(save.ranks).battle2p} />
          <p className="pt-6 text-center font-display text-4xl font-black " style={{ color: 'var(--color-rare)' }}>
            {s.youAre(st.finalTitle)}
          </p>
        </Section>
        {autoScroll && (
          <div className="flex justify-center pb-4">
            <Button primary onClick={onClose}>
              {shared.exit}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
