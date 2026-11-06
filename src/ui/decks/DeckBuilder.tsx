import { useState } from 'react';
import { cards } from '../../engine/cards/db';
import { decks as originalDecks } from '../../engine/cards/decks';
import { addCard, DECK_SIZE, deckStats } from '../../game/deckbook';
import { useDecks } from '../../game/deckStore';
import { CardArt } from '../play/CardFace';
import { DeckEditor } from './DeckEditor';

function DeckList() {
  const { decks, edit, create, remove } = useDecks();
  const [source, setSource] = useState(142);
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 py-4">
      <div>
        <h2 className="font-display text-5xl font-black italic">Tus mazos</h2>
        <p className="mt-2 max-w-[62ch] text-haze">
          Arma mazos con las reglas originales: 30 cartas, hasta 4 copias de cada una y al menos un Digimon. Todavía no hay progresión, así que las 301 cartas están
          disponibles. Los mazos se guardan en este navegador.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <button type="button" onClick={() => create('Mazo nuevo')} data-primary className="cmd">
          <span>Crear mazo vacío</span>
        </button>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-haze">O empezar desde un mazo original</span>
          <div className="flex gap-2">
            <select value={source} onChange={(e) => setSource(Number(e.target.value))} className="max-w-[18rem] cut [--c:6px] border border-grid bg-deep px-3 py-2">
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
              className="cmd"
            >
              <span>Copiar</span>
            </button>
          </div>
        </label>
      </div>
      {decks.length === 0 ? (
        <p className="cut [--c:10px] border border-dashed border-grid p-6 text-haze">Todavía no guardaste ningún mazo.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {decks.map((d) => {
            const s = deckStats(d);
            const lead = d.cards.map((id) => cards[id]).find((c) => c.kind === 'digimon');
            return (
              <li key={d.id} className="flex items-center gap-3 cut [--c:16px] border border-grid bg-deep/60 p-3">
                {lead && <CardArt card={lead} className="size-14 shrink-0 cut [--c:10px] bg-abyss" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display font-semibold">{d.name}</div>
                  <div className="text-xs text-haze">
                    {s.total}/{DECK_SIZE} cartas, {s.digimon} Digimon. {s.errors.length === 0 ? 'Listo para jugar.' : 'Incompleto.'}
                  </div>
                </div>
                <button type="button" onClick={() => edit(d)} className="cmd">
                  <span>Editar</span>
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
  const deck = draft!;
  return (
    <DeckEditor
      name={deck.name}
      cards={deck.cards}
      onChange={(name, ids) => setDraft({ ...deck, name, cards: ids })}
      canAdd={(ids, id) => addCard({ ...deck, cards: ids }, id).error}
      footer={
        <>
          <button type="button" onClick={save} disabled={!dirty} data-primary className="cmd">
            <span>{dirty ? 'Guardar mazo' : 'Guardado'}</span>
          </button>
          <button type="button" onClick={() => (!dirty || confirm('Hay cambios sin guardar. ¿Salir igual?')) && close()} className="cmd">
            <span>Volver a mis mazos</span>
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
