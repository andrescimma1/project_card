import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { cards } from '../../engine/cards/db';
import { opponentDecks, starterDecks } from '../../engine/cards/decks';
import type { OriginalDeck } from '../../engine/cards/decodeDecks';
import type { Card } from '../../engine/cards/types';
import { legalActions } from '../../engine/game/turn';
import type { Action, CardRef, GameState, PlayerId } from '../../engine/game/types';
import { cardsIn } from '../../engine/game/zones';
import { describeEvent } from '../../game/describe';
import { CPU, HUMAN } from '../../game/session';
import { sessionStore, useSession } from '../../game/useSession';
import { CardDetail } from '../CardDetail';
import { ArenaCard } from './Arena';
import { CardArt, CardFace } from './CardFace';
import { useDecks } from '../../game/deckStore';
import { validateDeck } from '../../engine/game/turn';
import { CinematicHost } from './Cinematics';
import { PhasePanel } from './PhasePanel';
import { PhaseRail } from './PhaseRail';
import { cardAt } from './util';
import { DpGauge, Piles } from './Zones';

const STARTER_LABEL: Record<string, string> = { Red: 'Rojo (Veemon)', Green: 'Verde (Hawkmon)', Yellow: 'Amarillo (Armadillomon)' };
const STARTER_PARTNER: Record<string, string> = { Red: 'Veemon', Green: 'Hawkmon', Yellow: 'Armadillomon' };

function deckSummary(d: OriginalDeck) {
  const cs = d.cards.map((id) => cards[id]);
  const digimon = cs.filter((c) => c.kind === 'digimon');
  return {
    digimon: digimon.length,
    options: cs.filter((c) => c.kind === 'option').length,
    digivolve: cs.filter((c) => c.kind === 'digivolve').length,
    levels: (['R', 'C', 'U', 'A'] as const).map((l) => [l, digimon.filter((c) => c.kind === 'digimon' && c.level === l).length] as const),
  };
}

function DeckSetup() {
  const saved = useDecks((s) => s.decks).filter((d) => validateDeck(d.cards).length === 0);
  const [mine, setMine] = useState(0);
  const [custom, setCustom] = useState<string | null>(null);
  const [opp, setOpp] = useState(opponentDecks.findIndex((d) => d.name === 'Tricolor Starter'));
  const [first, setFirst] = useState<'random' | 'me' | 'cpu'>('random');
  const customDeck = saved.find((d) => d.id === custom) ?? null;
  const my = customDeck ? { cards: customDeck.cards } : starterDecks[mine];
  const their = opponentDecks[opp];
  const so = deckSummary(their);
  const ownerCard = cards.find((c) => c.name === their.owner);

  const start = () => {
    const seed = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    const humanFirst = first === 'random' ? seed % 2 === 0 : first === 'me';
    sessionStore.getState().start({ human: my.cards, cpu: their.cards, cpuAi: their.ai, cpuEgg: their.partnerEgg, seed, humanFirst });
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-7 py-4">
      <div>
        <h2 className="font-display text-4xl font-bold">Nueva partida</h2>
        <p className="mt-2 max-w-[62ch] text-haze">
          Mazos originales del juego. El rival juega con la IA original de la CPU, portada del código del juego, y con la personalidad que trae su mazo.
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-display text-lg font-semibold">Tu mazo inicial</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {starterDecks.map((d, i) => {
            const partner = cards.find((c) => c.name === STARTER_PARTNER[d.name]);
            const sum = deckSummary(d);
            return (
              <button
                key={d.name}
                type="button"
                aria-pressed={!customDeck && mine === i}
                onClick={() => {
                  setMine(i);
                  setCustom(null);
                }}
                className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors ${!customDeck && mine === i ? 'border-ink bg-panel' : 'border-grid hover:bg-deep'}`}
              >
                {partner && <CardArt card={partner} className="size-16 shrink-0 rounded-xl bg-abyss" />}
                <span>
                  <span className="block font-display font-semibold">{STARTER_LABEL[d.name] ?? d.name}</span>
                  <span className="block text-xs text-haze">
                    {sum.digimon} Digimon, {sum.options} Option, {sum.digivolve} Digivolve
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {saved.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {saved.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={custom === d.id}
                onClick={() => setCustom(d.id)}
                className={`rounded-full border px-4 py-1.5 text-sm ${custom === d.id ? 'border-ink bg-ink text-abyss' : 'border-grid'}`}
              >
                {d.name}
              </button>
            ))}
          </div>
        )}
        <span className="text-xs text-haze">Tus mazos guardados (pestaña Mazos) aparecen aquí cuando están completos.</span>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="font-display text-lg font-semibold">Rival</span>
        <div className="flex items-center gap-3">
          {ownerCard && <CardArt card={ownerCard} className="size-14 shrink-0 rounded-xl bg-abyss" />}
          <select value={opp} onChange={(e) => setOpp(Number(e.target.value))} className="min-w-0 flex-1 rounded-lg border border-grid bg-deep px-3 py-2">
            {opponentDecks.map((d, i) => (
              <option key={d.index} value={i}>
                {d.owner}: {d.name}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-haze">
          {so.digimon} Digimon, {so.options} Option, {so.digivolve} Digivolve. Niveles: {so.levels.map(([l, n]) => `${n} ${l}`).join(', ')}.
        </span>
        <span className="text-xs text-haze">
          Personalidad de la CPU: entrada y DP {their.ai[0]}, ataque {their.ai[1]}, cambio de mano {their.ai[2]}, soporte {their.ai[3]} (2 es al azar).
        </span>
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-display text-lg font-semibold">Quién empieza</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['random', 'Al azar'],
              ['me', 'Yo'],
              ['cpu', 'La CPU'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              aria-pressed={first === k}
              onClick={() => setFirst(k)}
              className={`rounded-full border px-4 py-1.5 text-sm ${first === k ? 'border-ink bg-ink text-abyss' : 'border-grid'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <button type="button" onClick={start} className="self-start rounded-full bg-ink px-7 py-3 font-display text-lg font-semibold text-abyss hover:bg-white">
        Empezar partida
      </button>
    </div>
  );
}

const PLAY_LABEL: Record<string, string> = {
  entrance: 'Entrar con',
  dp: 'Cargar DP con',
  digivolveOption: 'Usar',
  digivolve: 'Digievolucionar a',
  support: 'Usar como soporte',
};

function actionForCard(actions: Action[], ref: CardRef): Action | undefined {
  return actions.find((a) => ('card' in a && a.card === ref) || (a.type === 'chooseSupport' && a.choice.from === 'hand' && a.choice.card === ref));
}

function Hand({ game, player, actions, act, onInspect }: { game: GameState; player: PlayerId; actions: Action[]; act: (a: Action) => void; onInspect: (c: Card) => void }) {
  const refs = cardsIn(game.players[player].hand);
  const choosing = player === HUMAN && actions.length > 0 && ['entrance', 'dp', 'digivolveOption', 'digivolve', 'support'].includes(game.phase.name);
  if (!refs.length) return <p className="py-4 text-sm text-haze">{player === HUMAN ? 'Tu mano está vacía.' : 'La mano de la CPU está vacía.'}</p>;
  return (
    <ul className={`flex gap-2.5 overflow-x-auto px-1 pt-3 pb-2 ${player === CPU ? 'justify-end' : ''}`}>
      <AnimatePresence initial={false}>
        {refs.map((r) => {
          const card = cardAt(game, player, r);
          const a = player === HUMAN ? actionForCard(actions, r) : undefined;
          return (
            <motion.li
              key={`${player}-${r}`}
              layoutId={`card-${player}-${r}`}
              initial={{ opacity: 0, y: player === HUMAN ? 24 : -24 }}
              animate={{ opacity: choosing && !a ? 0.4 : 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative shrink-0"
            >
              <button
                type="button"
                onClick={() => (a ? act(a) : onInspect(card))}
                aria-label={a ? `${PLAY_LABEL[game.phase.name] ?? 'Jugar'} ${card.name}` : `Ver ${card.name}`}
                className={`block rounded-xl transition-transform duration-150 ${a ? 'hover:-translate-y-2' : ''}`}
              >
                <CardFace card={card} size={player === HUMAN ? 'md' : 'xs'} glow={!!a} />
              </button>
              {player === HUMAN && (
                <button
                  type="button"
                  onClick={() => onInspect(card)}
                  aria-label={`Ver detalle de ${card.name}`}
                  className="absolute top-5 right-1 grid size-6 place-items-center rounded-full border border-grid bg-abyss/85 text-[11px] text-haze hover:text-ink"
                >
                  i
                </button>
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

function Log({ game }: { game: GameState }) {
  const log = useSession((s) => s.log);
  const recent = log.filter((l) => l.event.type !== 'cardsDiscarded' && !(l.event.type === 'draw' && l.event.player === CPU)).slice(-80).reverse();
  return (
    <section className="flex max-h-[34rem] flex-col gap-2 overflow-y-auto rounded-2xl border border-grid bg-deep/60 p-3" aria-label="Registro de la partida">
      <h2 className="font-display text-sm font-semibold text-haze">Registro</h2>
      <ul className="flex flex-col gap-1 text-[13px]">
        {recent.map((l) => (
          <li key={l.id} className={l.event.type === 'turnStart' ? 'mt-1.5 font-semibold' : 'text-haze'}>
            {describeEvent(l.event, game)}
          </li>
        ))}
      </ul>
    </section>
  );
}

function GameOver({ game }: { game: GameState }) {
  const won = game.winner === HUMAN;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-40 grid place-items-center bg-abyss/85 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label="Fin de la partida">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="flex max-w-md flex-col items-center gap-4 rounded-3xl border-2 bg-panel p-8 text-center" style={{ borderColor: won ? 'var(--color-rare)' : 'var(--color-grid)' }}>
        <h2 className="font-display text-5xl font-bold" style={{ color: won ? 'var(--color-rare)' : 'var(--color-ink)' }}>
          {won ? '¡Ganaste!' : 'Ganó la CPU'}
        </h2>
        <p className="text-haze">
          {game.endReason === 'rounds' ? `Rondas: tú ${game.players[HUMAN].rounds}, la CPU ${game.players[CPU].rounds}.` : 'Un jugador se quedó sin Digimon que sacar.'}
        </p>
        <button type="button" onClick={() => sessionStore.getState().reset()} className="rounded-full bg-ink px-6 py-2.5 font-semibold text-abyss hover:bg-white">
          Nueva partida
        </button>
      </motion.div>
    </motion.div>
  );
}

function Field({ game, player, onInspect }: { game: GameState; player: PlayerId; onInspect: (c: Card) => void }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <DpGauge game={game} player={player} onInspect={onInspect} />
      <Piles game={game} player={player} onInspect={onInspect} />
    </div>
  );
}

/** The match board. `endScreen` replaces the default end dialog (story mode); `onLeave` the abandon button. */
export function BattleBoard({ game, endScreen, onLeave, hideLeave }: { game: GameState; endScreen?: (game: GameState) => React.ReactNode; onLeave?: () => void; hideLeave?: boolean }) {
  const [inspect, setInspect] = useState<Card | null>(null);
  const error = useSession((s) => s.error);
  const report = useSession((s) => s.battleReport);
  const cinematic = useSession((s) => s.scenes.length > 0);
  const actions = useMemo(() => legalActions(game, HUMAN), [game]);
  const act = (a: Action) => sessionStore.getState().act(a);

  return (
    <LayoutGroup>
      <div className="grid gap-5 xl:grid-cols-[1fr_21rem]">
        <div
          className="flex min-w-0 flex-col gap-4 rounded-3xl border border-grid p-3 sm:p-4"
          style={{ background: 'linear-gradient(180deg, rgb(24 33 90 / 0.55), rgb(13 19 51 / 0.2) 45%, rgb(24 33 90 / 0.55))' }}
        >
          <section aria-label="CPU" className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-sm font-semibold text-haze">CPU, mano abierta como en el original</h2>
            </div>
            <Hand game={game} player={CPU} actions={[]} act={act} onInspect={setInspect} />
            <Field game={game} player={CPU} onInspect={setInspect} />
          </section>

          <section aria-label="Arena" className="grid grid-cols-1 items-center gap-2 py-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
            <div className="order-3 flex justify-center sm:order-1 sm:justify-end">
              <ArenaCard game={game} player={HUMAN} onInspect={setInspect} />
            </div>
            <div className="order-2 flex flex-col items-center gap-1">
              <span className="font-display text-xl font-bold text-haze sm:text-3xl">VS</span>
              <span className="text-center text-[10px] text-haze">{game.turn === HUMAN ? 'Atacas primero' : 'La CPU ataca primero'}</span>
            </div>
            <div className="order-1 flex justify-center sm:order-3 sm:justify-start">
              <ArenaCard game={game} player={CPU} onInspect={setInspect} mirrored />
            </div>
          </section>

          <div className="flex flex-col gap-3">
            <PhaseRail game={game} />
            <PhasePanel game={game} act={act} />
            {error && (
              <p role="alert" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--color-conflict)' }}>
                {error}
              </p>
            )}
          </div>

          <section aria-label="Tú" className="flex flex-col gap-2">
            <Field game={game} player={HUMAN} onInspect={setInspect} />
            <h2 className="mt-1 font-display text-sm font-semibold text-haze">Tu mano</h2>
            <Hand game={game} player={HUMAN} actions={actions} act={act} onInspect={setInspect} />
          </section>
        </div>

        <aside className="flex flex-col gap-3">
          {report && (
            <section className="flex flex-col gap-2 rounded-2xl border-2 bg-deep p-3" style={{ borderColor: 'var(--color-rare)' }} aria-label="Última batalla">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-sm font-semibold">Última batalla</h2>
                <button type="button" onClick={() => sessionStore.getState().dismissReport()} className="text-xs text-haze underline underline-offset-4 hover:text-ink">
                  Ocultar
                </button>
              </div>
              <ol className="flex list-decimal flex-col gap-1 pl-5 text-[13px]">
                {report
                  .filter((e) => e.type !== 'cardsDiscarded')
                  .map((e, i) => (
                    <li key={i}>{describeEvent(e, game)}</li>
                  ))}
              </ol>
            </section>
          )}
          <Log game={game} />
          {!hideLeave && (
            <button type="button" onClick={() => (onLeave ? onLeave() : sessionStore.getState().reset())} className="self-start text-sm text-haze underline underline-offset-4 hover:text-ink">
              Abandonar partida
            </button>
          )}
        </aside>

        {inspect && (
          <div className="fixed inset-y-0 right-0 z-30 flex w-full max-w-[28rem] p-3">
            <CardDetail card={inspect} onClose={() => setInspect(null)} />
          </div>
        )}
        <CinematicHost game={game} />
        {game.phase.name === 'gameOver' && !cinematic && (endScreen ? endScreen(game) : <GameOver game={game} />)}
      </div>
    </LayoutGroup>
  );
}

export function PlayScreen() {
  const game = useSession((s) => s.game);
  return game ? <BattleBoard game={game} /> : <DeckSetup />;
}
