/**
 * Trade between two save slots — the original trades between two memory cards (OPENSEG, doc 03 §5).
 */
import { useMemo, useState } from 'react';
import { cards } from '../../engine/cards/db';
import { m } from '../../i18n';
import { copiesOf } from '../../engine/progression/collection';
import type { SaveData } from '../../engine/progression/save';
import { canOffer, tradable } from '../../engine/progression/trade';
import { storyStore, useStory } from '../../game/useStory';
import { CardFace } from '../play/CardFace';
import { Button, Notice } from './common';

const act = () => storyStore.getState();

function Side({ title, from, to, offer, setOffer }: { title: string; from: SaveData; to: SaveData; offer: number[]; setOffer: (ids: number[]) => void }) {
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => copiesOf(from.collection, c.id) > 0 && c.fusion.composite !== 0 && (!q || c.name.toLowerCase().includes(q)));
  }, [from, query]);
  const add = (id: number) => {
    const why = canOffer(from, to, id, offer);
    setNotice(why);
    if (!why) setOffer([...offer, id]);
  };
  const t = m().story;
  return (
    <section className="flex min-w-0 flex-col gap-3 cut [--c:16px] border border-seam bg-gradient-to-b from-hide/80 to-leather/80 p-4" aria-label={title}>
      <div>
        <h3 className="font-display text-2xl font-bold ">{title}</h3>
        <p className="text-sm text-faded">{t.trade.history(from.name, from.trades.given, from.trades.received)}</p>
      </div>
      <div className="flex min-h-44 flex-wrap gap-2">
        {[0, 1, 2].map((i) =>
          offer[i] === undefined ? (
            <div key={i} className="grid h-44 w-32 place-items-center cut [--c:10px] border-2 border-dashed border-seam text-sm text-faded">
              {t.trade.hole(i + 1)}
            </div>
          ) : (
            <button key={i} type="button" onClick={() => setOffer(offer.filter((_, k) => k !== i))} aria-label={t.shared.remove(cards[offer[i]].name)}>
              <CardFace card={cards[offer[i]]} size="sm" />
            </button>
          ),
        )}
      </div>
      <Notice text={notice} />
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.trade.search} aria-label={t.trade.search} className="cut [--c:6px] border border-seam bg-leather px-3 py-2" />
      <ul className="flex max-h-[28rem] flex-col gap-1 overflow-y-auto">
        {list.map((c) => {
          const n = tradable(from, to, c.id) - offer.filter((x) => x === c.id).length;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => add(c.id)}
                className={`flex w-full items-center justify-between gap-3 cut [--c:6px] px-3 py-1.5 text-left text-sm hover:bg-leather ${n > 0 ? '' : 'opacity-45'}`}
              >
                <span className="truncate">{c.name}</span>
                <span className="shrink-0 tabular-nums text-faded">{t.shared.ofTotal(Math.max(0, n), copiesOf(from.collection, c.id))}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function TradeView() {
  const slots = useStory((s) => s.slots);
  const t = useStory((s) => s.trade);
  const used = slots.flatMap((s, i) => (s ? [i] : []));
  const [pair, setPair] = useState<[number, number]>([used[0] ?? 0, used[1] ?? 1]);
  const [notice, setNotice] = useState<string | null>(null);
  const [offerA, setOfferA] = useState<number[]>([]);
  const [offerB, setOfferB] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  /** Bumped after each trade so both sides start clean. */
  const [round, setRound] = useState(0);
  const s = m().story;

  if (!t)
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-5 py-4">
        <div>
          <h2 className="font-display text-5xl font-black ">{s.trade.title}</h2>
          <p className="mt-2 max-w-[62ch] text-faded">{s.trade.intro}</p>
        </div>
        <Notice text={notice} />
        <div className="flex flex-wrap items-end gap-3">
          {s.shared.players.map((label, side) => (
            <label key={side} className="flex flex-col gap-1 text-sm">
              <span className="text-faded">{label}</span>
              <select
                value={pair[side]}
                onChange={(e) => setPair((p) => (side === 0 ? [Number(e.target.value), p[1]] : [p[0], Number(e.target.value)]))}
                className="cut [--c:6px] border border-seam bg-leather px-3 py-2"
              >
                {used.map((i) => (
                  <option key={i} value={i}>
                    {s.shared.slotOption('ABC'[i], slots[i]!.name, slots[i]!.partner)}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <Button primary onClick={() => setNotice(act().pickTrade(pair[0], pair[1]))}>
            {s.shared.start}
          </Button>
          <Button onClick={() => act().toSlots()}>{s.shared.back}</Button>
        </div>
      </div>
    );

  const [a, b] = t.saves;
  const confirmTrade = () => {
    if (!confirm(s.trade.confirm)) return;
    const why = act().doTrade(offerA, offerB);
    setNotice(why);
    if (why) return;
    setOfferA([]);
    setOfferB([]);
    setDone(true);
    setRound((r) => r + 1);
  };
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-4xl font-black ">
          {s.shared.slot('ABC'[t.slots[0]])} ⇄ {s.shared.slot('ABC'[t.slots[1]])}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button primary disabled={!offerA.length && !offerB.length} onClick={confirmTrade}>
            {s.trade.trade}
          </Button>
          <Button onClick={() => act().toSlots()}>{s.shared.finish}</Button>
        </div>
      </div>
      <Notice text={notice} />
      {done && !notice && (
        <p role="status" className="text-sm" style={{ color: 'var(--color-verified)' }}>
          {s.trade.done}
        </p>
      )}
      <p className="max-w-[75ch] text-sm text-faded">{s.trade.rules}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <Side key={`a${round}`} title={s.trade.gives(s.shared.players[0])} from={a} to={b} offer={offerA} setOffer={(ids) => (setOfferA(ids), setDone(false))} />
        <Side key={`b${round}`} title={s.trade.gives(s.shared.players[1])} from={b} to={a} offer={offerB} setOffer={(ids) => (setOfferB(ids), setDone(false))} />
      </div>
    </div>
  );
}
