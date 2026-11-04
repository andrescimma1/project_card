import { useEffect, useState } from 'react';
import { cards } from '../../engine/cards/db';
import { percentages, rankTitles } from '../../engine/progression/ranks';
import { progression } from '../../engine/progression/tables';
import type { SaveData } from '../../engine/progression/save';
import type { StoryRequest } from '../../story/cityHost';
import { decodeScriptString, menuLabel, storySegments, visibleCities, type Segment } from '../../story/present';
import { useSession } from '../../game/useSession';
import { storyStore, useStory } from '../../game/useStory';
import { CardFace } from '../play/CardFace';
import { BattleBoard } from '../play/PlayScreen';
import type { GameState } from '../../engine/game/types';

const act = () => storyStore.getState();
const COLOR: Record<number, string> = {
  2: 'var(--color-fire)',
  4: 'var(--color-nature)',
  5: 'var(--color-ice)',
  6: 'var(--color-rare)',
  8: 'var(--color-darkness)',
};
const AREAS: { name: string; cities: number[] }[] = [
  { name: 'Mega Area', cities: [0, 1, 2, 3, 4] },
  { name: 'Giga Area', cities: [5, 7, 8, 6] },
  { name: 'Tera Area', cities: [9, 10, 11] },
];
const permille = (v: number) => `${Math.floor(v / 10)}.${v % 10} %`;

function Button({ children, onClick, primary, disabled }: { children: React.ReactNode; onClick: () => void; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40 ${primary ? 'bg-ink text-abyss hover:bg-white' : 'border border-grid hover:bg-deep'}`}
    >
      {children}
    </button>
  );
}

function Text({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((s, i) => (
        <span key={i} style={COLOR[s.color] ? { color: COLOR[s.color] } : undefined}>
          {s.text}
        </span>
      ))}
    </>
  );
}

function ErrorNote() {
  const error = useStory((s) => s.error);
  return error ? (
    <p role="alert" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--color-conflict)' }}>
      {error}
    </p>
  ) : null;
}

/* ---------- slots and new game ---------- */

function SlotsView() {
  const slots = useStory((s) => s.slots);
  useEffect(() => act().refreshSlots(), []);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-4">
      <div>
        <h2 className="font-display text-4xl font-bold">Modo historia</h2>
        <p className="mt-2 max-w-[62ch] text-haze">
          Las ciudades, los torneos y los diálogos son los guiones originales del juego, leídos de tu disco. Hay tres partidas, como los tres archivos
          de la tarjeta de memoria. Se guarda cuando eliges Guardar, igual que en el original.
        </p>
      </div>
      <ErrorNote />
      <ol className="flex flex-col gap-3">
        {slots.map((s, i) => (
          <li key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-grid bg-panel/70 p-4">
            <div>
              <p className="font-display text-lg font-semibold">Partida {'ABC'[i]}</p>
              <p className="text-sm text-haze">{s ? `${s.name} con ${s.partner} · ${s.tamer} · ${s.winsCom} victorias · ${permille(Math.floor((s.storyPoints * 1000) / 166))}` : 'Vacía'}</p>
            </div>
            <div className="flex gap-2">
              {s && (
                <Button primary onClick={() => act().continueGame(i)}>
                  Continuar
                </Button>
              )}
              <Button onClick={() => act().chooseNewGame(i)}>{s ? 'Empezar de nuevo' : 'Nueva partida'}</Button>
              {s && <Button onClick={() => act().deleteSlot(i)}>Borrar</Button>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const STARTERS: { id: number; deck: string }[] = [
  { id: 175, deck: 'Mazo rojo' },
  { id: 182, deck: 'Mazo verde' },
  { id: 190, deck: 'Mazo amarillo' },
];

function NewGameView() {
  const slot = useStory((s) => s.slot);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-4">
      <div>
        <h2 className="font-display text-4xl font-bold">Elige tu compañero</h2>
        <p className="mt-2 text-haze">Empiezas con su mazo y cinco cartas más, elegidas al azar entre parejas fijas como en el original.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {STARTERS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => void act().newGame(slot ?? 0, i as 0 | 1 | 2)}
            className="flex flex-col items-center gap-3 rounded-2xl border border-grid bg-panel/70 p-4 transition-colors hover:border-ink"
          >
            <CardFace card={cards[s.id]} size="md" />
            <span className="font-display text-lg font-semibold">{cards[s.id].name}</span>
            <span className="text-sm text-haze">{s.deck}</span>
          </button>
        ))}
      </div>
      <Button onClick={() => act().toSlots()}>Volver</Button>
    </div>
  );
}

/* ---------- player data and map ---------- */

function PlayerPanel({ save }: { save: SaveData }) {
  const t = rankTitles(save.ranks);
  const p = percentages({ storyPoints: save.story.points, collection: save.collection, ownedParts: save.ownedParts });
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-grid bg-panel/70 p-4" aria-label="Datos del jugador">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">{save.name}</h3>
        <span className="text-sm text-haze">
          {save.winsCom} victorias, {save.lossesCom} derrotas
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        <div><dt className="text-haze">Título de batalla</dt><dd>{t.tamer}</dd></div>
        <div><dt className="text-haze">Coleccionista</dt><dd>{t.collector}</dd></div>
        <div><dt className="text-haze">Juego completado</dt><dd>{permille(p.game)}</dd></div>
        <div><dt className="text-haze">Cartas</dt><dd>{permille(p.cards)}</dd></div>
        <div><dt className="text-haze">Digi-Parts</dt><dd>{permille(p.parts)}</dd></div>
      </dl>
      <ul className="flex flex-wrap gap-3">
        {save.partners.map((pt) => (
          <li key={pt.slot.id} className="flex items-center gap-2 rounded-xl bg-deep px-3 py-2 text-sm">
            <strong>{cards[pt.slot.id].name}</strong>
            <span className="text-haze">nivel {pt.slot.level}, {pt.exp} EXP</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MapView() {
  const save = useStory((s) => s.save)!;
  const open = visibleCities(save);
  const [saved, setSaved] = useState(false);
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl font-bold">Mapa de Digi-land</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              act().saveNow();
              setSaved(true);
            }}
          >
            {saved ? 'Guardado' : 'Guardar'}
          </Button>
          <Button onClick={() => act().toSlots()}>Salir</Button>
        </div>
      </div>
      <ErrorNote />
      <PlayerPanel save={save} />
      {AREAS.map((a) => (
        <section key={a.name} className="flex flex-col gap-2">
          <h3 className="font-display text-sm font-semibold text-haze">{a.name}</h3>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {a.cities.map((c) => {
              const visible = open.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  disabled={!visible}
                  onClick={() => {
                    setSaved(false);
                    void act().enterCity(c);
                  }}
                  className="flex min-h-20 flex-col justify-between rounded-2xl border-2 bg-deep px-4 py-3 text-left transition-colors enabled:hover:border-ink disabled:opacity-35"
                  style={{ borderColor: save.story.city === c ? 'var(--color-rare)' : 'var(--color-grid)' }}
                >
                  <span className="font-display text-lg font-semibold">{visible ? progression.world.cities[c] : '???'}</span>
                  <span className="text-xs text-haze">{visible ? (save.story.city === c ? 'Estás aquí' : 'Entrar') : 'Sin passcode'}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ---------- city ---------- */

function Dialogue({ lines, playerName, onNext }: { lines: string[]; playerName: string; onNext: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onNext]);
  const decoded = lines.map(decodeScriptString);
  const speaker = decoded[0]?.startsWith('*c') ? decoded[0] : null;
  const body = speaker ? decoded.slice(1) : decoded;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-grid bg-deep p-5" role="dialog" aria-live="polite">
      {speaker && (
        <p className="font-display text-lg font-semibold">
          <Text segments={storySegments(speaker, playerName)} />
        </p>
      )}
      <div className="flex min-h-[3.5rem] flex-col gap-1 text-lg leading-snug">
        {body.map((l, i) => (
          <p key={i}>
            <Text segments={storySegments(l, playerName)} />
          </p>
        ))}
      </div>
      <div className="flex justify-end">
        <Button primary onClick={onNext}>
          Continuar
        </Button>
      </div>
    </div>
  );
}

function Reward({ req }: { req: Extract<StoryRequest, { kind: 'reward' }> }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 bg-deep p-5" style={{ borderColor: 'var(--color-rare)' }}>
      {req.pack !== undefined && <p className="font-display text-xl font-semibold">Recibiste un {progression.packs[req.pack].name}</p>}
      {req.part !== undefined && (
        <p className="font-display text-xl font-semibold">
          Digi-Part: <Text segments={storySegments(progression.digiParts[req.part].name, '')} />
        </p>
      )}
      {req.cards.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {req.cards.map((id, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <CardFace card={cards[id]} size="sm" />
              <span className="text-xs text-haze">{req.results[i] === -2 || req.results[i] === -1 ? 'FULL SET' : req.results[i] === 1 ? '¡Nueva!' : `${req.results[i]} copias`}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Button primary onClick={() => act().reply({ kind: 'ack' })}>
          Continuar
        </Button>
      </div>
    </div>
  );
}

function Keyword() {
  const [word, setWord] = useState('');
  const submit = () => {
    const i = progression.world.keywords.indexOf(word.trim().toUpperCase());
    act().reply({ kind: 'choice', value: i });
  };
  return (
    <form
      className="flex flex-wrap items-end gap-3 rounded-2xl border-2 border-grid bg-deep p-5"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-haze">Palabra clave</span>
        <input value={word} onChange={(e) => setWord(e.target.value)} maxLength={12} className="rounded-lg border border-grid bg-abyss px-3 py-2 uppercase" autoFocus />
      </label>
      <Button primary onClick={submit}>
        Decir
      </Button>
      <Button onClick={() => act().reply({ kind: 'choice', value: -1 })}>Cancelar</Button>
    </form>
  );
}

function ScreenRequest({ req, save }: { req: Extract<StoryRequest, { kind: 'screen' }>; save: SaveData }) {
  const done = () => act().reply({ kind: 'ack' });
  if (req.screen === 'playerData') {
    return (
      <div className="flex flex-col gap-3">
        <PlayerPanel save={save} />
        <Button primary onClick={done}>
          Volver
        </Button>
      </div>
    );
  }
  if (req.screen === 'deckEdit') {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border-2 border-grid bg-deep p-5">
        <h3 className="font-display text-lg font-semibold">Mazo activo</h3>
        <ul className="flex flex-col gap-2">
          {save.decks.map((d, i) => (
            <li key={i}>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deck"
                  disabled={d.cards.length !== 30}
                  checked={save.selectedDeck === i}
                  onChange={() => {
                    save.selectedDeck = i;
                    storyStore.setState({ save: { ...save } });
                  }}
                />
                {d.cards.length ? `${d.name} (${d.wins} victorias, ${d.losses} derrotas)` : 'Vacío'}
              </label>
            </li>
          ))}
        </ul>
        <p className="text-sm text-haze">Editar los mazos con tu colección y equipar Digi-Parts llegan en el siguiente paso.</p>
        <Button primary onClick={done}>
          Volver
        </Button>
      </div>
    );
  }
  const text =
    req.screen === 'fusion' ? 'La Fusion Shop llega en el siguiente paso.' : req.screen === 'ending' ? 'Fin de esta parte de la historia.' : '';
  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-grid bg-deep p-5">
      <p>{text}</p>
      <Button primary onClick={done}>
        Continuar
      </Button>
    </div>
  );
}

function CityView() {
  const req = useStory((s) => s.request);
  const host = useStory((s) => s.host);
  const save = useStory((s) => s.save)!;
  const npcs = useStory((s) => s.npcs);
  const city = host?.city ?? save.story.city;
  if (!req) return null;
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl font-bold">{progression.world.cities[city]}</h2>
        <span className="text-sm text-haze">{host?.place === 1 ? 'Battle Cafe' : host?.place === 2 ? 'Arena' : ''}</span>
      </div>
      <ErrorNote />
      {req.kind === 'say' && <Dialogue lines={req.lines} playerName={save.name} onNext={() => act().reply({ kind: 'ack' })} />}
      {req.kind === 'menu' && (
        <div className="flex flex-wrap gap-2 rounded-2xl border-2 border-grid bg-deep p-5">
          {req.options.map((id, i) => (
            <Button key={i} primary={i === 0} onClick={() => act().reply({ kind: 'choice', value: i + 1 })}>
              {menuLabel(id, city)}
            </Button>
          ))}
          <Button onClick={() => act().reply({ kind: 'choice', value: -1 })}>{req.big ? 'Salir de la ciudad' : 'Volver'}</Button>
        </div>
      )}
      {req.kind === 'talkTo' && (
        <div className="flex flex-col gap-3 rounded-2xl border-2 border-grid bg-deep p-5">
          <p className="text-haze">¿Con quién quieres hablar?</p>
          <div className="flex flex-wrap gap-2">
            {req.npcs.map((n) => (
              <Button key={n} onClick={() => act().reply({ kind: 'choice', value: n })}>
                {npcs[n] ?? `Personaje ${n}`}
              </Button>
            ))}
            <Button onClick={() => act().reply({ kind: 'choice', value: -1 })}>Salir del Cafe</Button>
          </div>
        </div>
      )}
      {req.kind === 'rival' && (
        <div className="flex flex-col gap-2 rounded-2xl border-2 bg-deep p-5" style={{ borderColor: 'var(--color-fire)' }}>
          <p className="font-display text-xl font-semibold">
            <Text segments={storySegments(decodeScriptString(req.name), save.name)} />
          </p>
          <p className="text-sm text-haze">
            Ataque {req.attack} · Defensa {req.defense} · Velocidad de digivolución {req.speed}
          </p>
          <div className="flex justify-end">
            <Button primary onClick={() => act().reply({ kind: 'ack' })}>
              Continuar
            </Button>
          </div>
        </div>
      )}
      {req.kind === 'reward' && <Reward req={req} />}
      {req.kind === 'keyword' && <Keyword />}
      {req.kind === 'screen' && <ScreenRequest req={req} save={save} />}
    </div>
  );
}

/* ---------- battle and result ---------- */

function BattleEnd({ game }: { game: GameState }) {
  const won = game.winner === 0;
  const log = useSession((s) => s.log);
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-abyss/85 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label="Fin de la batalla">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border-2 bg-panel p-8 text-center" style={{ borderColor: won ? 'var(--color-rare)' : 'var(--color-grid)' }}>
        <h2 className="font-display text-5xl font-bold" style={{ color: won ? 'var(--color-rare)' : undefined }}>
          {won ? '¡Ganaste!' : 'Perdiste'}
        </h2>
        <Button primary onClick={() => act().finishBattle(game, log.map((l) => l.event))}>
          Ver resultados
        </Button>
      </div>
    </div>
  );
}

function BattleView() {
  const game = useSession((s) => s.game);
  return game ? <BattleBoard game={game} endScreen={(g) => <BattleEnd game={g} />} hideLeave /> : null;
}

function ResultView() {
  const result = useStory((s) => s.result);
  const save = useStory((s) => s.save)!;
  const won = useStory((s) => s.won);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 py-4">
      <h2 className="font-display text-4xl font-bold">{won ? 'Victoria' : 'Derrota'}</h2>
      {!result && <p className="text-haze">Fin del tutorial: el juego no guarda el resultado de esta batalla.</p>}
      {result && (
        <>
          <section className="flex flex-col gap-2 rounded-2xl border border-grid bg-panel/70 p-4">
            <h3 className="font-display text-lg font-semibold">Experiencia</h3>
            <ul className="flex flex-col gap-1 text-sm">
              {result.bonuses.granted.map((b) => (
                <li key={b.id} className="flex justify-between gap-3">
                  <span>{b.name}</span>
                  <span className="tabular-nums">+{b.exp}</span>
                </li>
              ))}
              <li className="flex justify-between gap-3 border-t border-grid pt-1 font-semibold">
                <span>Total (con la EXP del rival)</span>
                <span className="tabular-nums">{result.bonuses.exp}</span>
              </li>
            </ul>
            <ul className="flex flex-col gap-1 text-sm">
              {save.partners.map((p, i) => (
                <li key={p.slot.id}>
                  {cards[p.slot.id].name}: {result.expGained[i] ? `+${result.expGained[i]} EXP` : 'no estaba en el mazo'}
                  {result.levelsGained[i] ? `, sube a nivel ${p.slot.level}` : ''}
                </li>
              ))}
              {result.learned.map((id) => (
                <li key={id}>
                  Aprende la Digi-Part <Text segments={storySegments(progression.digiParts[id].name, '')} />
                </li>
              ))}
            </ul>
          </section>
          {result.pack.length > 0 && (
            <section className="flex flex-col gap-3 rounded-2xl border-2 bg-deep p-4" style={{ borderColor: 'var(--color-rare)' }}>
              <h3 className="font-display text-lg font-semibold">Prize Pack</h3>
              <div className="flex flex-wrap gap-3">
                {result.pack.map((id, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <CardFace card={cards[id]} size="sm" />
                    <span className="text-xs text-haze">{result.packResults[i] < 0 ? 'FULL SET' : result.packResults[i] === 1 ? '¡Nueva!' : `${result.packResults[i]} copias`}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
      <Button primary onClick={() => act().closeResult()}>
        Continuar
      </Button>
    </div>
  );
}

export function StoryScreen() {
  const view = useStory((s) => s.view);
  if (view === 'slots') return <SlotsView />;
  if (view === 'newGame') return <NewGameView />;
  if (view === 'map') return <MapView />;
  if (view === 'battle') return <BattleView />;
  if (view === 'result') return <ResultView />;
  return <CityView />;
}
