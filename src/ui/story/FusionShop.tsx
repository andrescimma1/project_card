/**
 * Andromon's Fusion Shops (CMD11.4(k), EVOSEG): Card Fusion and Partner Fusion with the shop's level limit.
 * The shop dialogue (UNIT0k.MSD) runs on EVOSEG's own script commands, not decoded yet (❓), so the screen
 * goes straight to the fusion.
 */
import { useMemo, useState } from 'react';
import { cards } from '../../engine/cards/db';
import { TERMS } from '../vocab/terms';
import { m } from '../../i18n';
import type { Card } from '../../engine/cards/types';
import { partnerCards } from '../../engine/game/partner';
import { copiesOf } from '../../engine/progression/collection';
import { canFuse, freeCopies } from '../../engine/progression/fusion';
import { storyStore, useStory } from '../../game/useStory';
import { CardFace } from '../play/CardFace';
import { Chip } from '../decks/DeckEditor';
import { Button, Notice, PartName } from './common';

const act = () => storyStore.getState();

/** What a shop of this level fuses, in the current language. */
function limitText(level: number): string {
  const f = m().story.fusion;
  if (level === 0) return f.limitLow(TERMS.creatures, TERMS.levels.R);
  if (level === 2) return f.limitMid(TERMS.creatures, TERMS.levels.C);
  return f.limitAny;
}

type Outcome = { face: Card; title: string; detail?: React.ReactNode; showName?: boolean };

function Picker({ onPick, selected }: { onPick: (id: number) => void; selected: number[] }) {
  const save = useStory((s) => s.save)!;
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | Card['kind']>('all');
  const owned = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => copiesOf(save.collection, c.id) > 0 && (kind === 'all' || c.kind === kind) && (!q || c.name.toLowerCase().includes(q)));
  }, [save, query, kind]);
  const t = m().story;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-faded">{t.fusion.search}</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.fusion.searchPlaceholder} className="cut [--c:6px] border border-seam bg-leather px-3 py-2" />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'digimon', 'option', 'digivolve'] as const).map((k) => (
            <Chip key={k} on={kind === k} onClick={() => setKind(k)}>
              {k === 'all' ? t.fusion.all : k === 'digimon' ? TERMS.creatures : k === 'option' ? TERMS.supportShort : TERMS.evolution}
            </Chip>
          ))}
        </div>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3">
        {owned.map((c) => {
          const free = Math.max(0, freeCopies(save, c.id) - selected.filter((x) => x === c.id).length);
          return (
            <li key={c.id} className="relative">
              <button
                type="button"
                onClick={() => onPick(c.id)}
                aria-label={t.fusion.pick(c.name, free)}
                className={`block w-full rounded-xl transition-transform ${free > 0 ? 'hover:-translate-y-1' : 'opacity-45'}`}
              >
                <CardFace card={c} size="sm" glow={selected.includes(c.id)} />
              </button>
              <span className="absolute right-1 bottom-1 rounded-md bg-soot/85 px-1.5 text-xs tabular-nums text-faded">
                {t.shared.ofTotal(free, copiesOf(save.collection, c.id))}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Slot({ id, label, onClear }: { id: number | null; label: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {id === null ? (
        <div className="grid h-44 w-32 place-items-center cut [--c:10px] border-2 border-dashed border-seam text-sm text-faded">{label}</div>
      ) : (
        <button type="button" onClick={onClear} aria-label={m().story.shared.remove(cards[id].name)} className="cut [--c:10px]">
          <CardFace card={cards[id]} size="sm" />
        </button>
      )}
    </div>
  );
}

function CardFusion({ shopLevel, onDone }: { shopLevel: number; onDone: (o: Outcome) => void }) {
  const save = useStory((s) => s.save)!;
  const [a, setA] = useState<number | null>(null);
  const [b, setB] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const t = m().story.fusion;
  const pick = (id: number) => {
    const taken = [a, b].filter((x) => x === id).length;
    const why = canFuse(save, id, shopLevel) ?? (freeCopies(save, id) <= taken ? t.noFreeCopies : null);
    setNotice(why);
    if (why) return;
    if (a === null) setA(id);
    else if (b === null) setB(id);
    else setNotice(t.twoPicked);
  };
  const fuse = () => {
    if (a === null || b === null) return;
    const r = act().fuse(a, b);
    if ('error' in r) return setNotice(r.error);
    setA(null);
    setB(null);
    onDone({ face: cards[r.result], title: t.kinds[r.kind], detail: `${cards[a].name} + ${cards[b].name}`, showName: true });
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 cut [--c:16px] border border-seam bg-gradient-to-b from-hide/80 to-leather/80 p-4">
        <Slot id={a} label={t.slot(1)} onClear={() => setA(null)} />
        <span className="font-display text-3xl text-faded" aria-hidden>
          +
        </span>
        <Slot id={b} label={t.slot(2)} onClear={() => setB(null)} />
        <div className="flex flex-col gap-2">
          <Button primary disabled={a === null || b === null} onClick={fuse}>
            {t.fuse}
          </Button>
          <span className="max-w-[24ch] text-sm text-faded">{t.fuseNote}</span>
        </div>
      </div>
      <Notice text={notice} />
      <Picker onPick={pick} selected={[a, b].filter((x): x is number => x !== null)} />
    </div>
  );
}

function PartnerFusionView({ shopLevel, onDone }: { shopLevel: number; onDone: (o: Outcome) => void }) {
  const save = useStory((s) => s.save)!;
  const [k, setK] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const p = save.partners[k];
  const t = m().story.fusion;
  const pick = (id: number) => {
    const why = canFuse(save, id, shopLevel);
    if (why) return setNotice(why);
    if (!confirm(t.confirmGive(cards[id].name, cards[p.slot.id].name))) return;
    const level = p.slot.level;
    const r = act().partnerFuse(k, id);
    if (r.error) return setNotice(r.error);
    setNotice(null);
    const name = cards[p.slot.id].name;
    const face = partnerCards(act().save!.partners[k].slot).card;
    if (r.part !== undefined) return onDone({ face, title: t.learnsPart(name, TERMS.part), detail: <PartName id={r.part} /> });
    onDone({
      face,
      title: r.exp ? t.gainsExp(name, r.exp) : m().story.shared.rankMax,
      detail: (
        <>
          {r.levels ? t.levelsUp(level, level + r.levels) : ''}
          {r.learned?.map((id) => (
            <span key={id} className="block">
              {t.learns} <PartName id={id} />
            </span>
          ))}
        </>
      ),
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {save.partners.map((pt, i) => (
          <Chip key={pt.slot.id} on={i === k} onClick={() => setK(i)}>
            {t.partnerChip(cards[pt.slot.id].name, pt.slot.level)}
          </Chip>
        ))}
      </div>
      <p className="max-w-[70ch] text-sm text-faded">{t.partnerIntro(cards[p.slot.id].name, TERMS.part)}</p>
      <Notice text={notice} />
      <Picker onPick={pick} selected={[]} />
    </div>
  );
}

export function FusionShop({ shop }: { shop: number }) {
  const shopLevel = useStory((s) => s.shopLevel);
  const [mode, setMode] = useState<'cards' | 'partner'>('cards');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const t = m().story.fusion;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold">{t.title(m().game.places[7], shop + 1)}</h3>
          <p className="text-sm text-faded">{t.intro(limitText(shopLevel))}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip on={mode === 'cards'} onClick={() => setMode('cards')}>
            {t.cardFusion}
          </Chip>
          <Chip on={mode === 'partner'} onClick={() => setMode('partner')}>
            {t.partnerFusion}
          </Chip>
          <Button onClick={() => act().reply({ kind: 'ack' })}>{t.leave}</Button>
        </div>
      </div>
      {outcome && (
        <div className="flex flex-wrap items-center gap-4 cut [--c:16px] border-2 bg-leather p-4" style={{ borderColor: 'var(--color-rare)' }} role="status">
          <CardFace card={outcome.face} size="sm" />
          <div className="flex flex-col gap-1">
            <p className="font-display text-2xl font-bold ">{outcome.title}</p>
            {outcome.detail && <div className="text-sm text-faded">{outcome.detail}</div>}
            {outcome.showName && <p className="font-display text-lg">{outcome.face.name}</p>}
          </div>
          <div className="ml-auto">
            <Button onClick={() => setOutcome(null)}>{t.next}</Button>
          </div>
        </div>
      )}
      {mode === 'cards' ? <CardFusion shopLevel={shopLevel} onDone={setOutcome} /> : <PartnerFusionView shopLevel={shopLevel} onDone={setOutcome} />}
    </div>
  );
}
