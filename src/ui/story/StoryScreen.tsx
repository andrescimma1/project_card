import { useEffect, useState } from 'react';
import { cards } from '../../engine/cards/db';
import { percentages, rankTitles } from '../../engine/progression/ranks';
import { progression } from '../../engine/progression/tables';
import type { SaveData } from '../../engine/progression/save';
import type { StoryRequest } from '../../story/cityHost';
import { decodeScriptString, menuLabel, storySegments, visibleCities } from '../../story/present';
import { useSession } from '../../game/useSession';
import { storyStore, useStory } from '../../game/useStory';
import { CardFace } from '../play/CardFace';
import { BattleBoard } from '../play/PlayScreen';
import { EndBanner } from '../play/Overlays';
import type { GameState } from '../../engine/game/types';
import { Button, PartName, Text } from './common';
import { PartnerGet, StoryMenu } from './StoryMenus';
import { FusionShop } from './FusionShop';
import { CompleteStats } from './CompleteStats';
import { cleanName } from '../../game/storyStore';
import { TradeView } from './TradeView';
import { DuelView } from './DuelView';

const act = () => storyStore.getState();
const AREAS: { name: string; cities: number[] }[] = [
  { name: 'Mega Area', cities: [0, 1, 2, 3, 4] },
  { name: 'Giga Area', cities: [5, 7, 8, 6] },
  { name: 'Tera Area', cities: [9, 10, 11] },
];
const permille = (v: number) => `${Math.floor(v / 10)}.${v % 10} %`;

function ErrorNote() {
  const error = useStory((s) => s.error);
  return error ? (
    <p role="alert" className="cut [--c:6px] border px-3 py-2 text-sm" style={{ borderColor: 'var(--color-conflict)' }}>
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
        <h2 className="font-display text-5xl font-black italic">Modo historia</h2>
        <p className="mt-2 max-w-[62ch] text-haze">
          Las ciudades, los torneos y los diálogos son los guiones originales del juego, leídos de tu disco. Hay tres partidas, como los tres archivos
          de la tarjeta de memoria. Se guarda cuando eliges Guardar, igual que en el original.
        </p>
      </div>
      <ErrorNote />
      <ol className="flex flex-col gap-3">
        {slots.map((s, i) => (
          <li key={i} className="flex flex-wrap items-center justify-between gap-3 cut [--c:16px] border border-grid bg-gradient-to-b from-panel/80 to-deep/80 p-4">
            <div>
              <p className="font-display text-xl font-bold italic">Partida {'ABC'[i]}</p>
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
      {slots.filter(Boolean).length >= 2 && (
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => act().openTrade()}>Intercambiar cartas</Button>
          <Button onClick={() => act().openDuel()}>Batalla 2P</Button>
          <span className="text-sm text-haze">Entre dos de tus partidas, como con dos tarjetas de memoria.</span>
        </div>
      )}
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
  // OPENSEG: User Registration (NAME ENTRY, 12 letters) comes before STARTER SELECT
  const [name, setName] = useState('Player');
  const [named, setNamed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!named)
    return (
      <form
        className="mx-auto flex max-w-xl flex-col gap-5 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!cleanName(name)) return setError('Escribe un nombre para tu partida.');
          setError(null);
          setNamed(true);
        }}
      >
        <div>
          <h2 className="font-display text-5xl font-black italic">Registro</h2>
          <p className="mt-2 text-haze">Elige tu nombre para este mundo. Los personajes te llaman así en los diálogos.</p>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-haze">Nombre del jugador (hasta 12 letras)</span>
          <input
            value={name}
            maxLength={12}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            className="cut [--c:6px] border border-grid bg-deep px-3 py-2 font-display text-xl"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm" style={{ color: 'var(--color-probable)' }}>
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button type="submit" data-primary className="cmd">
            <span>Este nombre está bien</span>
          </button>
          <Button onClick={() => act().toSlots()}>Volver</Button>
        </div>
      </form>
    );
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-4">
      <div>
        <h2 className="font-display text-5xl font-black italic">Elige tu compañero</h2>
        <p className="mt-2 text-haze">Empiezas con su mazo y cinco cartas más, elegidas al azar entre parejas fijas como en el original.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {STARTERS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => void act().newGame(slot ?? 0, i as 0 | 1 | 2, name)}
            className="flex flex-col items-center gap-3 cut [--c:16px] border border-grid bg-gradient-to-b from-panel/80 to-deep/80 p-4 transition-colors hover:border-ink"
          >
            <CardFace card={cards[s.id]} size="md" />
            <span className="font-display text-xl font-bold italic">{cards[s.id].name}</span>
            <span className="text-sm text-haze">{s.deck}</span>
          </button>
        ))}
      </div>
      <Button onClick={() => setNamed(false)}>Volver</Button>
    </div>
  );
}

/* ---------- player data and map ---------- */

function PlayerPanel({ save }: { save: SaveData }) {
  const t = rankTitles(save.ranks);
  const p = percentages({ storyPoints: save.story.points, collection: save.collection, ownedParts: save.ownedParts });
  return (
    <section className="flex flex-col gap-3 cut [--c:16px] border border-grid bg-gradient-to-b from-panel/80 to-deep/80 p-4" aria-label="Datos del jugador">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-bold italic">{save.name}</h3>
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
          <li key={pt.slot.id} className="flex items-center gap-2 cut [--c:10px] bg-deep px-3 py-2 text-sm">
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
  const [menu, setMenu] = useState(false);
  if (menu)
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-5 py-4">
        <h2 className="font-display text-4xl font-black italic">Mazos y compañeros</h2>
        <StoryMenu
          onClose={() => {
            setMenu(false);
            setSaved(false);
          }}
        />
      </div>
    );
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-4xl font-black italic">Mapa de Digi-land</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setMenu(true)}>Mazos y compañeros</Button>
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
                  className="flex min-h-20 flex-col justify-between cut [--c:16px] border-2 bg-deep px-4 py-3 text-left transition-colors enabled:hover:border-ink disabled:opacity-35"
                  style={{ borderColor: save.story.city === c ? 'var(--color-rare)' : 'var(--color-grid)' }}
                >
                  <span className="font-display text-xl font-bold italic">{visible ? progression.world.cities[c] : '???'}</span>
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
    <div className="flex flex-col gap-3 cut [--c:16px] border-2 border-grid bg-deep p-5" role="dialog" aria-live="polite">
      {speaker && (
        <p className="font-display text-xl font-bold italic">
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
    <div className="flex flex-col gap-4 cut [--c:16px] border-2 bg-deep p-5" style={{ borderColor: 'var(--color-rare)' }}>
      {req.pack !== undefined && <p className="font-display text-2xl font-bold italic">Recibiste un {progression.packs[req.pack].name}</p>}
      {req.part !== undefined && (
        <p className="font-display text-2xl font-bold italic">
          Digi-Part: <PartName id={req.part} />
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
      className="flex flex-wrap items-end gap-3 cut [--c:16px] border-2 border-grid bg-deep p-5"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-haze">Palabra clave</span>
        <input value={word} onChange={(e) => setWord(e.target.value)} maxLength={12} className="cut [--c:6px] border border-grid bg-abyss px-3 py-2 uppercase" autoFocus />
      </label>
      <Button primary onClick={submit}>
        Decir
      </Button>
      <Button onClick={() => act().reply({ kind: 'choice', value: -1 })}>Cancelar</Button>
    </form>
  );
}

function PlayerDataScreen({ save, onDone }: { save: SaveData; onDone: () => void }) {
  // SAISEG 0x801E186C: with story flag v15 the ◯ button opens the Complete Stats (ENDSEG mode 2)
  const cleared = useStory((s) => (s.host?.vm.vars[15] ?? 0) !== 0);
  const [stats, setStats] = useState(false);
  if (stats)
    return (
      <CompleteStats
        save={save}
        autoScroll={false}
        onClose={() => {
          act().closeStats();
          setStats(false);
        }}
      />
    );
  return (
    <div className="flex flex-col gap-3">
      <PlayerPanel save={save} />
      <div className="flex flex-wrap gap-2">
        <Button primary onClick={onDone}>
          Volver
        </Button>
        {cleared && <Button onClick={() => setStats(true)}>Estadísticas completas</Button>}
      </div>
    </div>
  );
}

/** CMD11.19(0): the final ending. The game plays its ending video (not reproduced) and returns to the title. */
function Ending() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-col items-center gap-5 cut [--c:24px] border-2 bg-deep px-6 py-12 text-center" style={{ borderColor: 'var(--color-rare)' }}>
      <h3 className="font-display text-5xl font-bold" style={{ color: 'var(--color-rare)' }}>
        Fin
      </h3>
      <p className="max-w-[52ch] text-haze">
        Aquí el juego original pasa su video final y vuelve a la pantalla de título. El video no se reproduce en este remake.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          onClick={() => {
            act().saveNow();
            setSaved(true);
          }}
        >
          {saved ? 'Guardado' : 'Guardar'}
        </Button>
        <Button primary onClick={() => act().toSlots()}>
          Volver a las partidas
        </Button>
      </div>
    </div>
  );
}

function ScreenRequest({ req, save }: { req: Extract<StoryRequest, { kind: 'screen' }>; save: SaveData }) {
  const done = () => act().reply({ kind: 'ack' });
  if (req.screen === 'playerData') return <PlayerDataScreen save={save} onDone={done} />;
  if (req.screen === 'deckEdit') return <StoryMenu onClose={done} />;
  if (req.screen === 'fusion') return <FusionShop shop={req.arg} />;
  if (req.screen === 'ending') return req.arg === 0 ? <Ending /> : <CompleteStats save={save} autoScroll={req.arg === 1} onClose={() => act().closeStats()} />;
  return null;
}

function CityView() {
  const req = useStory((s) => s.request);
  const host = useStory((s) => s.host);
  const save = useStory((s) => s.save)!;
  const npcs = useStory((s) => s.npcs);
  const city = host?.city ?? save.story.city;
  if (!req) return null;
  return (
    <div className={`mx-auto flex ${req.kind === 'screen' && req.screen !== 'playerData' ? 'max-w-6xl' : 'max-w-3xl'} flex-col gap-4 py-4`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-4xl font-black italic">{progression.world.cities[city]}</h2>
        <span className="text-sm text-haze">{host?.place === 1 ? 'Battle Cafe' : host?.place === 2 ? 'Arena' : ''}</span>
      </div>
      <ErrorNote />
      {req.kind === 'say' && <Dialogue lines={req.lines} playerName={save.name} onNext={() => act().reply({ kind: 'ack' })} />}
      {req.kind === 'menu' && (
        <div className="flex flex-wrap gap-2 cut [--c:16px] border-2 border-grid bg-deep p-5">
          {req.options.map((id, i) => (
            <Button key={i} primary={i === 0} onClick={() => act().reply({ kind: 'choice', value: i + 1 })}>
              {menuLabel(id, city)}
            </Button>
          ))}
          <Button onClick={() => act().reply({ kind: 'choice', value: -1 })}>{req.big ? 'Salir de la ciudad' : 'Volver'}</Button>
        </div>
      )}
      {req.kind === 'talkTo' && (
        <div className="flex flex-col gap-3 cut [--c:16px] border-2 border-grid bg-deep p-5">
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
        <div className="flex flex-col gap-2 cut [--c:16px] border-2 bg-deep p-5" style={{ borderColor: 'var(--color-fire)' }}>
          <p className="font-display text-2xl font-bold italic">
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
      {req.kind === 'partnerGet' && <PartnerGet candidates={req.candidates} />}
    </div>
  );
}

/* ---------- battle and result ---------- */

function BattleEnd({ game }: { game: GameState }) {
  const won = game.winner === 0;
  const log = useSession((s) => s.log);
  return (
    <EndBanner tone={won ? 'win' : 'lose'} title={won ? '¡Victoria!' : 'Derrota'} subtitle={`Rondas: ${game.players[0].rounds} a ${game.players[1].rounds}`}>
      <Button primary onClick={() => act().finishBattle(game, log.map((l) => l.event))}>
        Ver resultados
      </Button>
    </EndBanner>
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
      <h2 className="font-display text-5xl font-black italic">{won ? 'Victoria' : 'Derrota'}</h2>
      {!result && <p className="text-haze">Fin del tutorial: el juego no guarda el resultado de esta batalla.</p>}
      {result && (
        <>
          <section className="flex flex-col gap-2 cut [--c:16px] border border-grid bg-gradient-to-b from-panel/80 to-deep/80 p-4">
            <h3 className="font-display text-xl font-bold italic">Experiencia</h3>
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
                  Aprende la Digi-Part <PartName id={id} />
                </li>
              ))}
            </ul>
          </section>
          {result.pack.length > 0 && (
            <section className="flex flex-col gap-3 cut [--c:16px] border-2 bg-deep p-4" style={{ borderColor: 'var(--color-rare)' }}>
              <h3 className="font-display text-xl font-bold italic">Prize Pack</h3>
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
  if (view === 'trade') return <TradeView />;
  if (view === 'duel') return <DuelView />;
  return <CityView />;
}
