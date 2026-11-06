/**
 * Trade between two save slots — the original trades between two memory cards (OPENSEG, doc 03 §5).
 */
import { useMemo, useState } from 'react';
import { cards } from '../../engine/cards/db';
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
  return (
    <section className="flex min-w-0 flex-col gap-3 cut [--c:16px] border border-grid bg-gradient-to-b from-panel/80 to-deep/80 p-4" aria-label={title}>
      <div>
        <h3 className="font-display text-2xl font-bold italic">{title}</h3>
        <p className="text-sm text-haze">
          {from.name} · {from.trades.given} entregadas, {from.trades.received} recibidas
        </p>
      </div>
      <div className="flex min-h-44 flex-wrap gap-2">
        {[0, 1, 2].map((i) =>
          offer[i] === undefined ? (
            <div key={i} className="grid h-44 w-32 place-items-center cut [--c:10px] border-2 border-dashed border-grid text-sm text-haze">
              Hueco {i + 1}
            </div>
          ) : (
            <button key={i} type="button" onClick={() => setOffer(offer.filter((_, k) => k !== i))} aria-label={`Quitar ${cards[offer[i]].name}`}>
              <CardFace card={cards[offer[i]]} size="sm" />
            </button>
          ),
        )}
      </div>
      <Notice text={notice} />
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar carta" aria-label="Buscar carta" className="cut [--c:6px] border border-grid bg-deep px-3 py-2" />
      <ul className="flex max-h-[28rem] flex-col gap-1 overflow-y-auto">
        {list.map((c) => {
          const n = tradable(from, to, c.id) - offer.filter((x) => x === c.id).length;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => add(c.id)}
                className={`flex w-full items-center justify-between gap-3 cut [--c:6px] px-3 py-1.5 text-left text-sm hover:bg-deep ${n > 0 ? '' : 'opacity-45'}`}
              >
                <span className="truncate">{c.name}</span>
                <span className="shrink-0 tabular-nums text-haze">
                  {Math.max(0, n)} de {copiesOf(from.collection, c.id)}
                </span>
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

  if (!t)
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-5 py-4">
        <div>
          <h2 className="font-display text-5xl font-black italic">Intercambio</h2>
          <p className="mt-2 max-w-[62ch] text-haze">
            En el original se intercambia entre dos tarjetas de memoria. Aquí eliges dos de tus partidas. Las dos tienen que tener el intercambio desbloqueado
            en la historia.
          </p>
        </div>
        <Notice text={notice} />
        <div className="flex flex-wrap items-end gap-3">
          {(['Jugador 1', 'Jugador 2'] as const).map((label, side) => (
            <label key={label} className="flex flex-col gap-1 text-sm">
              <span className="text-haze">{label}</span>
              <select
                value={pair[side]}
                onChange={(e) => setPair((p) => (side === 0 ? [Number(e.target.value), p[1]] : [p[0], Number(e.target.value)]))}
                className="cut [--c:6px] border border-grid bg-deep px-3 py-2"
              >
                {used.map((i) => (
                  <option key={i} value={i}>
                    Partida {'ABC'[i]}: {slots[i]!.name} con {slots[i]!.partner}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <Button primary onClick={() => setNotice(act().pickTrade(pair[0], pair[1]))}>
            Empezar
          </Button>
          <Button onClick={() => act().toSlots()}>Volver</Button>
        </div>
      </div>
    );

  const [a, b] = t.saves;
  const confirmTrade = () => {
    if (!confirm('¿Hacer el intercambio? Las cartas cambian de partida y quedan guardadas.')) return;
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
        <h2 className="font-display text-4xl font-black italic">
          Partida {'ABC'[t.slots[0]]} ⇄ Partida {'ABC'[t.slots[1]]}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button primary disabled={!offerA.length && !offerB.length} onClick={confirmTrade}>
            Intercambiar
          </Button>
          <Button onClick={() => act().toSlots()}>Terminar</Button>
        </div>
      </div>
      <Notice text={notice} />
      {done && !notice && (
        <p role="status" className="text-sm" style={{ color: 'var(--color-verified)' }}>
          Intercambio hecho y guardado en las dos partidas.
        </p>
      )}
      <p className="max-w-[75ch] text-sm text-haze">
        Hasta 3 cartas por jugador; también se puede regalar sin recibir nada. No se pueden dar las copias que usan tus mazos, ni pasar a nadie de 6
        copias. Cada copia viaja con su número de serie, así que una carta recibida no puede volver a la misma partida.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <Side key={`a${round}`} title="Jugador 1 da" from={a} to={b} offer={offerA} setOffer={(ids) => (setOfferA(ids), setDone(false))} />
        <Side key={`b${round}`} title="Jugador 2 da" from={b} to={a} offer={offerB} setOffer={(ids) => (setOfferB(ids), setDone(false))} />
      </div>
    </div>
  );
}
