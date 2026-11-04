/**
 * Andromon's Fusion Shops (CMD11.4(k), EVOSEG): Card Fusion and Partner Fusion with the shop's level limit.
 * The shop dialogue (UNIT0k.MSD) runs on EVOSEG's own script commands, not decoded yet (❓), so the screen
 * goes straight to the fusion.
 */
import { useMemo, useState } from 'react';
import { cards } from '../../engine/cards/db';
import type { Card } from '../../engine/cards/types';
import { partnerCards } from '../../engine/game/partner';
import { copiesOf } from '../../engine/progression/collection';
import { canFuse, freeCopies, type FusionKind } from '../../engine/progression/fusion';
import { storyStore, useStory } from '../../game/useStory';
import { CardFace } from '../play/CardFace';
import { Chip } from '../decks/DeckEditor';
import { Button, Notice, PartName } from './common';

const act = () => storyStore.getState();
const LIMIT = ['Digimon de nivel R y cartas Option', 'Digimon hasta nivel C y cartas Option', 'cualquier carta'];
const limitText = (level: number) => LIMIT[level === 0 ? 0 : level === 2 ? 1 : 2];
const KIND_TEXT: Record<FusionKind, string> = { normal: 'Fusión', special: '¡Fusión especial!', mutation: '¡Fusión mutante!' };

type Outcome = { face: Card; title: string; detail?: React.ReactNode; showName?: boolean };

function Picker({ onPick, selected }: { onPick: (id: number) => void; selected: number[] }) {
  const save = useStory((s) => s.save)!;
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | Card['kind']>('all');
  const owned = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => copiesOf(save.collection, c.id) > 0 && (kind === 'all' || c.kind === kind) && (!q || c.name.toLowerCase().includes(q)));
  }, [save, query, kind]);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-haze">Buscar</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre de la carta" className="rounded-lg border border-grid bg-deep px-3 py-2" />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'digimon', 'option', 'digivolve'] as const).map((k) => (
            <Chip key={k} on={kind === k} onClick={() => setKind(k)}>
              {k === 'all' ? 'Todas' : k === 'digimon' ? 'Digimon' : k === 'option' ? 'Option' : 'Digivolve'}
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
                aria-label={`Elegir ${c.name} (${free} libres)`}
                className={`block w-full rounded-xl transition-transform ${free > 0 ? 'hover:-translate-y-1' : 'opacity-45'}`}
              >
                <CardFace card={c} size="sm" glow={selected.includes(c.id)} />
              </button>
              <span className="absolute right-1 bottom-1 rounded-md bg-abyss/85 px-1.5 text-xs tabular-nums text-haze">
                {free} de {copiesOf(save.collection, c.id)}
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
        <div className="grid h-44 w-32 place-items-center rounded-xl border-2 border-dashed border-grid text-sm text-haze">{label}</div>
      ) : (
        <button type="button" onClick={onClear} aria-label={`Quitar ${cards[id].name}`} className="rounded-xl">
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
  const pick = (id: number) => {
    const taken = [a, b].filter((x) => x === id).length;
    const why = canFuse(save, id, shopLevel) ?? (freeCopies(save, id) <= taken ? 'No te quedan más copias libres de esa carta.' : null);
    setNotice(why);
    if (why) return;
    if (a === null) setA(id);
    else if (b === null) setB(id);
    else setNotice('Ya elegiste dos cartas. Toca una para quitarla.');
  };
  const fuse = () => {
    if (a === null || b === null) return;
    const r = act().fuse(a, b);
    if ('error' in r) return setNotice(r.error);
    setA(null);
    setB(null);
    onDone({ face: cards[r.result], title: KIND_TEXT[r.kind], detail: `${cards[a].name} + ${cards[b].name}`, showName: true });
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-grid bg-panel/70 p-4">
        <Slot id={a} label="Carta 1" onClear={() => setA(null)} />
        <span className="font-display text-3xl text-haze" aria-hidden>
          +
        </span>
        <Slot id={b} label="Carta 2" onClear={() => setB(null)} />
        <div className="flex flex-col gap-2">
          <Button primary disabled={a === null || b === null} onClick={fuse}>
            Fusionar
          </Button>
          <span className="max-w-[24ch] text-sm text-haze">Se pierden las dos cartas y recibes una nueva.</span>
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
  const pick = (id: number) => {
    const why = canFuse(save, id, shopLevel);
    if (why) return setNotice(why);
    if (!confirm(`¿Dar ${cards[id].name} a ${cards[p.slot.id].name}?`)) return;
    const level = p.slot.level;
    const r = act().partnerFuse(k, id);
    if (r.error) return setNotice(r.error);
    setNotice(null);
    const name = cards[p.slot.id].name;
    const face = partnerCards(act().save!.partners[k].slot).card;
    if (r.part !== undefined) return onDone({ face, title: `${name} aprende una Digi-Part`, detail: <PartName id={r.part} /> });
    onDone({
      face,
      title: r.exp ? `${name} gana ${r.exp} EXP` : 'RANK MAX',
      detail: (
        <>
          {r.levels ? `Sube del nivel ${level} al ${level + r.levels}. ` : ''}
          {r.learned?.map((id) => (
            <span key={id} className="block">
              Aprende <PartName id={id} />
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
            {cards[pt.slot.id].name} · nivel {pt.slot.level}
          </Chip>
        ))}
      </div>
      <p className="max-w-[70ch] text-sm text-haze">
        Elige una carta para {cards[p.slot.id].name}. Cinco cartas concretas le enseñan una Digi-Part; cualquier otra le da tanta EXP como su valor
        Composite.
      </p>
      <Notice text={notice} />
      <Picker onPick={pick} selected={[]} />
    </div>
  );
}

export function FusionShop({ shop }: { shop: number }) {
  const shopLevel = useStory((s) => s.shopLevel);
  const [mode, setMode] = useState<'cards' | 'partner'>('cards');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold">Fusion Shop · Andromon No.{shop + 1}</h3>
          <p className="text-sm text-haze">Aquí se fusionan {limitText(shopLevel)}. Las cartas que usan tus mazos no se pueden fusionar.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip on={mode === 'cards'} onClick={() => setMode('cards')}>
            Fusión de cartas
          </Chip>
          <Chip on={mode === 'partner'} onClick={() => setMode('partner')}>
            Partner Fusion
          </Chip>
          <Button onClick={() => act().reply({ kind: 'ack' })}>Salir de la tienda</Button>
        </div>
      </div>
      {outcome && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 bg-deep p-4" style={{ borderColor: 'var(--color-rare)' }} role="status">
          <CardFace card={outcome.face} size="sm" />
          <div className="flex flex-col gap-1">
            <p className="font-display text-xl font-semibold">{outcome.title}</p>
            {outcome.detail && <div className="text-sm text-haze">{outcome.detail}</div>}
            {outcome.showName && <p className="font-display text-lg">{outcome.face.name}</p>}
          </div>
          <div className="ml-auto">
            <Button onClick={() => setOutcome(null)}>Seguir</Button>
          </div>
        </div>
      )}
      {mode === 'cards' ? <CardFusion shopLevel={shopLevel} onDone={setOutcome} /> : <PartnerFusionView shopLevel={shopLevel} onDone={setOutcome} />}
    </div>
  );
}
