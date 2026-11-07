import { useState } from 'react';
import { cards } from '../../engine/cards/db';
import { decks as originalDecks } from '../../engine/cards/decks';
import { addCard, DECK_SIZE, deckStats } from '../../game/deckbook';
import { useDecks } from '../../game/deckStore';
import { CardArt } from '../play/CardFace';
import { DeckEditor } from './DeckEditor';
import { TERMS } from '../vocab/terms';
import { m } from '../../i18n';
import { deckLabel, ownerName } from '../../story/own/decks';

function DeckList() {
  const { decks, edit, create, remove } = useDecks();
  const [source, setSource] = useState(142);
  const t = m().decks.list;
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 py-4">
      <div>
        <h2 className="font-display text-5xl font-black ">{t.title}</h2>
        <p className="mt-2 max-w-[62ch] text-faded">{t.intro(TERMS.creature.toLowerCase())}</p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <button type="button" onClick={() => create(t.newDeckName)} data-primary className="cmd">
          <span>{t.createEmpty}</span>
        </button>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-faded">{t.startFrom}</span>
          <div className="flex gap-2">
            <select value={source} onChange={(e) => setSource(Number(e.target.value))} className="max-w-[18rem] cut [--c:6px] border border-seam bg-leather px-3 py-2">
              {originalDecks.map((d) => (
                <option key={d.index} value={d.index}>
                  {ownerName(d.owner)}: {deckLabel(d.index)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const d = originalDecks[source];
                create(t.copyName(deckLabel(d.index)), d.cards);
              }}
              className="cmd"
            >
              <span>{t.copy}</span>
            </button>
          </div>
        </label>
      </div>
      {decks.length === 0 ? (
        <p className="cut [--c:10px] border border-dashed border-seam p-6 text-faded">{t.empty}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {decks.map((d) => {
            const s = deckStats(d);
            const lead = d.cards.map((id) => cards[id]).find((c) => c.kind === 'digimon');
            return (
              <li key={d.id} className="flex items-center gap-3 cut [--c:16px] border border-seam bg-leather/60 p-3">
                {lead && <CardArt card={lead} className="size-14 shrink-0 cut [--c:10px] bg-soot" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display font-semibold">{d.name}</div>
                  <div className="text-xs text-faded">
                    {t.summary(s.total, DECK_SIZE, s.digimon, TERMS.creature.toLowerCase(), TERMS.creatures.toLowerCase())} {s.errors.length === 0 ? t.ready : t.incomplete}
                  </div>
                </div>
                <button type="button" onClick={() => edit(d)} className="cmd">
                  <span>{t.edit}</span>
                </button>
                <button type="button" onClick={() => confirm(t.confirmDelete(d.name)) && remove(d.id)} className="text-sm text-faded underline underline-offset-4 hover:text-bone">
                  {t.delete}
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
  const deck = draft!;
  const t = m().decks.builder;
  return (
    <DeckEditor
      name={deck.name}
      cards={deck.cards}
      onChange={(name, ids) => setDraft({ ...deck, name, cards: ids })}
      canAdd={(ids, id) => addCard({ ...deck, cards: ids }, id).error}
      footer={
        <>
          <button type="button" onClick={save} disabled={!dirty} data-primary className="cmd">
            <span>{dirty ? t.save : t.saved}</span>
          </button>
          <button type="button" onClick={() => (!dirty || confirm(t.confirmLeave)) && close()} className="cmd">
            <span>{t.back}</span>
          </button>
        </>
      }
    />
  );
}

export function DeckBuilder() {
  const draft = useDecks((s) => s.draft);
  return draft ? <Editor /> : <DeckList />;
}
