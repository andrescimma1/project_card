import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { LayoutGroup, motion, useAnimate, useReducedMotion } from 'motion/react';
import { gameEvents } from '../../audio/bus';
import { useAudioSettings, useCue } from '../../audio/react';
import { cards } from '../../engine/cards/db';
import { opponentDecks, starterDecks } from '../../engine/cards/decks';
import type { OriginalDeck } from '../../engine/cards/decodeDecks';
import type { AttackSlot, Card } from '../../engine/cards/types';
import { legalActions, validateDeck } from '../../engine/game/turn';
import type { Action, GameState, PlayerId } from '../../engine/game/types';
import { controller, HUMAN } from '../../game/session';
import { sessionStore, useSession } from '../../game/useSession';
import { useDecks } from '../../game/deckStore';
import { CardDetail } from '../CardDetail';
import { ActivePanel, activeView } from './Arena';
import { CardArt } from './CardFace';
import { CinematicHost } from './Cinematics';
import { CommandBar, PhaseBar, type Seats } from './CommandBar';
import { AttackList, HandRow } from './Hands';
import { CardPopup, EffectCard, EndBanner, LogDrawer, PhaseBanner } from './Overlays';
import { usePlayback, type Playback } from './Playback';
import { GameStage } from './Stage';
import { actionOf, slotOf, type ActionKind } from '../vocab/actions';
import { TERMS } from '../vocab/terms';
import { boardNames, seatNames } from './util';
import { DpSlot, Piles, RoundCrests } from './Zones';

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

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cut px-4 py-2 font-display text-[16px] font-bold transition-colors [--c:8px] ${active ? 'bg-brass text-soot' : 'bg-leather text-faded hover:text-bone'}`}
    >
      {children}
    </button>
  );
}

function DeckSetup() {
  const saved = useDecks((s) => s.decks).filter((d) => validateDeck(d.cards).length === 0);
  const [mine, setMine] = useState(0);
  const [custom, setCustom] = useState<string | null>(null);
  const [opp, setOpp] = useState(opponentDecks.findIndex((d) => d.name === 'Tricolor Starter'));
  const [first, setFirst] = useState<'random' | 'me' | 'cpu'>('random');
  const customDeck = saved.find((d) => d.id === custom) ?? null;
  const my = customDeck ? { cards: customDeck.cards, name: customDeck.name } : { cards: starterDecks[mine].cards, name: `${starterDecks[mine].name} Deck` };
  const their = opponentDecks[opp];
  const so = deckSummary(their);
  const ownerCard = cards.find((c) => c.name === their.owner);

  const start = () => {
    const seed = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    const humanFirst = first === 'random' ? seed % 2 === 0 : first === 'me';
    sessionStore.getState().start({
      human: my.cards,
      cpu: their.cards,
      cpuAi: their.ai,
      cpuEgg: their.partnerEgg,
      seed,
      humanFirst,
      names: ['Jugador', their.owner],
      deckNames: [my.name, `${their.name} Deck`],
    });
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <div>
        <h2 className="font-display text-[56px] leading-none font-black ">Partida libre</h2>
        <p className="mt-3 max-w-[62ch] text-faded">Mazos originales del juego. El rival juega con la IA original de la CPU, portada del código del juego, y con la personalidad que trae su mazo.</p>
      </div>

      <section className="frame side-player" style={{ '--c': '18px' } as CSSProperties}>
        <div className="fill flex flex-col gap-4 p-5">
          <h3 className="relative z-[1] font-display text-[24px] font-extrabold ">Tu mazo</h3>
          <div className="relative z-[1] grid gap-3 sm:grid-cols-3">
            {starterDecks.map((d, i) => {
              const partner = cards.find((c) => c.name === STARTER_PARTNER[d.name]);
              const sum = deckSummary(d);
              const active = !customDeck && mine === i;
              return (
                <button
                  key={d.name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setMine(i);
                    setCustom(null);
                  }}
                  className={`cut flex items-center gap-3 p-3 text-left transition-colors [--c:12px] ${active ? 'bg-steel/35 shadow-[inset_0_0_0_2px_var(--color-brass)]' : 'bg-soot/60 hover:bg-leather'}`}
                >
                  {partner && <CardArt card={partner} className="size-16 shrink-0 bg-soot" />}
                  <span>
                    <span className="block font-display text-[20px] font-bold ">{STARTER_LABEL[d.name] ?? d.name}</span>
                    <span className="block text-sm text-faded">
                      {sum.digimon} {TERMS.creatures.toLowerCase()}, {sum.options} de apoyo, {sum.digivolve} de evolución
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {saved.length > 0 && (
            <div className="relative z-[1] flex flex-wrap gap-2">
              {saved.map((d) => (
                <Choice key={d.id} active={custom === d.id} onClick={() => setCustom(d.id)}>
                  {d.name}
                </Choice>
              ))}
            </div>
          )}
          <span className="relative z-[1] text-sm text-faded">Tus mazos guardados (pestaña Mazos) aparecen aquí cuando están completos.</span>
        </div>
      </section>

      <section className="frame side-rival" style={{ '--c': '18px' } as CSSProperties}>
        <label className="fill flex flex-col gap-3 p-5">
          <span className="relative z-[1] font-display text-[24px] font-extrabold ">Rival</span>
          <div className="relative z-[1] flex items-center gap-3">
            {ownerCard && <CardArt card={ownerCard} className="size-16 shrink-0 bg-soot" />}
            <select value={opp} onChange={(e) => setOpp(Number(e.target.value))} className="min-w-0 flex-1 bg-soot px-3 py-2.5 font-display text-[18px] shadow-[inset_0_0_0_1px_rgb(255_199_154/0.5)]">
              {opponentDecks.map((d, i) => (
                <option key={d.index} value={i}>
                  {d.owner}: {d.name}
                </option>
              ))}
            </select>
          </div>
          <span className="relative z-[1] text-sm text-faded">
            {so.digimon} {TERMS.creatures.toLowerCase()}, {so.options} de apoyo, {so.digivolve} de evolución. Niveles: {so.levels.map(([l, n]) => `${n} ${TERMS.levels[l]}`).join(', ')}.
          </span>
          <span className="relative z-[1] text-sm text-faded">
            Personalidad de la CPU: entrada y {TERMS.dp} {their.ai[0]}, ataque {their.ai[1]}, cambio de mano {their.ai[2]}, soporte {their.ai[3]} (2 es al azar).
          </span>
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <span className="font-display text-[20px] font-bold ">Quién empieza</span>
        {(
          [
            ['random', 'Al azar'],
            ['me', 'Yo'],
            ['cpu', 'La CPU'],
          ] as const
        ).map(([k, label]) => (
          <Choice key={k} active={first === k} onClick={() => setFirst(k)}>
            {label}
          </Choice>
        ))}
        <span className="flex-1" />
        <button type="button" onClick={start} data-primary className="cmd !px-8 !py-3 !text-[22px]">
          <span>Empezar partida</span>
        </button>
      </div>
    </div>
  );
}

function GameOver({ game }: { game: GameState }) {
  const won = game.winner === HUMAN;
  return (
    <EndBanner
      tone={won ? 'win' : 'lose'}
      title={won ? '¡Victoria!' : 'Derrota'}
      subtitle={game.endReason === 'rounds' ? `Rondas: tú ${game.players[0].rounds}, la CPU ${game.players[1].rounds}` : `Un jugador se quedó sin ${TERMS.creatures.toLowerCase()} que sacar`}
    >
      <button type="button" onClick={() => sessionStore.getState().reset()} data-primary className="cmd !px-8 !text-[22px]">
        <span>Nueva partida</span>
      </button>
    </EndBanner>
  );
}

/** "1st Attack" / "2nd Attack" tab on the edge of each player's area. */
function AttackTab({ first }: { first: boolean }) {
  return (
    <motion.div
      className="absolute inset-y-3 right-0 z-[2] grid w-[40px] place-items-center"
      initial={false}
      animate={{ opacity: 1 }}
      style={{
        background: first ? 'var(--grain), linear-gradient(180deg, #f3d58d, #d5a34e 50%, #a97a32)' : 'var(--grain), linear-gradient(180deg, #3a2c20, #221a14)',
        borderRadius: '8px 0 0 8px',
        boxShadow: first ? 'inset 0 0 0 1px #6b4a1f' : 'inset 0 0 0 1px #6f5638',
      }}
    >
      <motion.span
        key={String(first)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-[18px] font-black [writing-mode:vertical-rl]"
        style={{ color: first ? '#2b1d12' : '#b9a47f' }}
      >
        {first ? TERMS.firstAttack : TERMS.secondAttack}
      </motion.span>
    </motion.div>
  );
}

function sideStatus(game: GameState, p: PlayerId, mine: boolean, playback: Playback | null): string {
  if (playback) return 'Ataque revelado';
  if (mine) return 'Elige tu ataque';
  return game.players[p].attack !== null ? 'Ya eligió' : 'Eligiendo…';
}

/** The match board. `endScreen` replaces the default end banner (story mode); `onLeave` the abandon button. */
export function BattleBoard({ game, endScreen, onLeave, hideLeave }: { game: GameState; endScreen?: (game: GameState) => React.ReactNode; onLeave?: () => void; hideLeave?: boolean }) {
  const [inspect, setInspect] = useState<Card | null>(null);
  const [detail, setDetail] = useState<Card | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [peek, setPeek] = useState(false);
  const error = useSession((s) => s.error);
  const scene = useSession((s) => s.scenes[0]);
  const twoPlayer = useSession((s) => s.twoPlayer);
  const sessionNames = useSession((s) => s.names);
  const deckNames = useSession((s) => s.deckNames);
  const playback = usePlayback(game);
  const board = playback?.board ?? (scene?.kind === 'digivolve' && scene.state ? scene.state : game);
  const busy = !!scene;
  const seats: Seats = { me: controller(game, twoPlayer), names: seatNames(twoPlayer, sessionNames), twoPlayer };
  const labels = boardNames(twoPlayer, sessionNames);
  const logNames = twoPlayer ? seats.names : undefined;
  const actions = useMemo(() => (busy ? [] : legalActions(game, seats.me)), [game, seats.me, busy]);
  const act = (a: Action) => sessionStore.getState().act(a);
  useEffect(() => setPeek(false), [game.phase.name, game.turnNumber]);

  const first = playback?.first ?? board.turn;
  const deciding = !busy && board.phase.name === 'attack' && !peek;

  // the board answers the hits it hears: a shake as strong as the blow, a flash when the fight starts
  const reduceFx = useAudioSettings().reduceIntense;
  const reduceMotion = useReducedMotion();
  const [scope, animateBoard] = useAnimate<HTMLDivElement>();
  const [clash, setClash] = useState(0);
  useCue(['HIT_TAKEN', 'CLASH_START', 'MONSTER_DEFEATED', 'EVOLUTION_BURST'], (d, name) => {
    if (name === 'CLASH_START') setClash((c) => c + 1);
    if (reduceFx || reduceMotion || !scope.current) return;
    const amp =
      name === 'CLASH_START' ? 4 : name === 'MONSTER_DEFEATED' ? 6 : name === 'EVOLUTION_BURST' ? 8 : d.lethal ? 13 : d.action === 'fury' ? (d.heavy ? 11 : 8) : d.action === 'instinct' ? 5 : 3;
    void animateBoard(scope.current, { x: [0, -amp, amp * 0.8, -amp * 0.5, amp * 0.25, 0], y: [0, amp * 0.45, -amp * 0.3, amp * 0.15, 0, 0] }, { duration: 0.36, ease: 'easeOut' });
  });

  const content = (p: PlayerId) => {
    const mine = !busy && p === seats.me;
    if (playback || deciding) {
      const view = playback ? playback.views[p] : activeView(board, p);
      const own = board.players[p].attack;
      const slot: AttackSlot | null = playback ? (playback.attacks?.[p] ?? null) : !twoPlayer && p === 0 ? own : null;
      const revealed = slot ? actionOf(slot) : null;
      const canPick = mine && actions.some((a) => a.type === 'chooseAttack');
      const pick = (action: ActionKind) => {
        // in 2P the other player is watching: the confirmation must not tell which attack it was
        gameEvents.emit('ATTACK_SELECTED', { player: p, action: twoPlayer ? undefined : action });
        act(actions.find((a) => a.type === 'chooseAttack' && a.slot === slotOf(action))!);
      };
      return (
        <AttackList
          player={p}
          view={view}
          name={labels[p]}
          chosen={revealed}
          hidden={!playback && own !== null && revealed === null}
          status={sideStatus(board, p, canPick, playback)}
          onPick={canPick ? pick : undefined}
          delay={playback?.fx[p].delay}
        />
      );
    }
    return <HandRow game={board} player={p} actions={mine ? actions : []} act={act} onInspect={setInspect} />;
  };

  const gambleAction = (p: PlayerId) => (!busy && p === seats.me ? actions.find((a) => a.type === 'chooseSupport' && a.choice.from === 'gamble') : undefined);

  const frame = (p: PlayerId) => {
    const header = (
      <div className={`relative z-[1] flex h-[30px] shrink-0 items-center gap-4 px-5 ${p === 1 ? 'pt-1' : 'pb-1'}`}>
        <span className="plate h-[24px] text-[17px] font-extrabold ">
          <span className="font-display">{labels[p]}</span>
        </span>
        {deckNames && <span className="font-display text-[16px] font-semibold text-bone/70 ">{deckNames[p]}</span>}
        <RoundCrests rounds={playback ? playback.rounds[p] : board.players[p].rounds} label={`Rondas de ${labels[p]}`} />
        <span className="flex-1" />
      </div>
    );
    const gamble = gambleAction(p);
    return (
      <section aria-label={`Zona de ${labels[p]}`} className={`frame h-[230px] ${p === 0 ? 'side-player' : 'side-rival'}`} style={{ '--c': '20px' } as CSSProperties}>
        <div className="fill flex flex-col pr-[44px]">
          {p === 1 && header}
          <div className={`relative z-[1] flex min-h-0 flex-1 items-center gap-6 px-5 ${p === 1 ? 'flex-row-reverse' : ''}`}>
            <Piles game={board} player={p} onInspect={setInspect} onDeck={gamble ? () => act(gamble) : undefined} />
            <div className="flex min-w-0 flex-1 justify-center">{content(p)}</div>
            <DpSlot game={board} player={p} onInspect={setInspect} />
          </div>
          {p === 0 && header}
          <AttackTab first={first === p} />
        </div>
      </section>
    );
  };

  const chosenOnBoard = (p: PlayerId): ActionKind | null => {
    const slot = playback ? (playback.attacks?.[p] ?? null) : !twoPlayer && p === 0 ? board.players[0].attack : null;
    return slot ? actionOf(slot) : null;
  };

  return (
    <GameStage>
      <LayoutGroup>
        <div ref={scope} className="flex h-full flex-col gap-2 px-4 py-[10px]">
          <PhaseBar game={board} playback={playback} logOpen={logOpen} onLog={() => setLogOpen((o) => !o)} onLeave={hideLeave ? undefined : () => (onLeave ? onLeave() : sessionStore.getState().reset())} />
          {frame(1)}

          <div className="relative grid h-[266px] shrink-0 grid-cols-[1fr_110px_1fr]">
            {([0, 1] as PlayerId[]).map((p) => (
              <div key={p} className={p === 0 ? 'col-start-1' : 'col-start-3'}>
                <ActivePanel
                  player={p}
                  view={playback ? playback.views[p] : activeView(board, p)}
                  label={labels[p]}
                  chosen={chosenOnBoard(p)}
                  hiddenChoice={!playback && board.players[p].attack !== null && chosenOnBoard(p) === null}
                  fx={playback?.fx[p]}
                  emptyText={!busy && p === seats.me && board.phase.name === 'entrance' ? `Elige una ${TERMS.creature.toLowerCase()} de tu mano` : `${TERMS.arena} vacía`}
                  onInspect={setInspect}
                />
              </div>
            ))}
            <div className="col-start-2 row-start-1 flex flex-col items-center justify-center gap-2">
              <div className="h-[56px] w-[3px] rounded-full bg-gradient-to-b from-transparent to-brass/70" />
              {/* bronze medallion between the two creatures */}
              <motion.span
                key={clash}
                className="grid size-[84px] place-items-center rounded-full"
                style={{ background: 'var(--grain), radial-gradient(circle at 40% 32%, #f3d58d, #b9853d 45%, #5e3f1c 100%)' }}
                initial={false}
                animate={
                  clash
                    ? { scale: [1, 1.3, 1], boxShadow: ['0 0 0 3px #2b1d12, 0 0 0 6px #6f5638, 0 6px 16px rgb(0 0 0 / 0.6)', '0 0 0 3px #2b1d12, 0 0 0 6px #e8bf5d, 0 0 50px rgb(255 230 170 / 0.9)', '0 0 0 3px #2b1d12, 0 0 0 6px #6f5638, 0 6px 16px rgb(0 0 0 / 0.6)'] }
                    : { boxShadow: '0 0 0 3px #2b1d12, 0 0 0 6px #6f5638, 0 6px 16px rgb(0 0 0 / 0.6)' }
                }
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <span className="grid size-[64px] place-items-center rounded-full font-display text-[34px] font-black text-ink shadow-[inset_0_0_0_2px_rgb(43_29_18/0.55)]" style={{ textShadow: '0 1px 0 rgb(255 240 200 / 0.6)' }}>
                  VS
                </span>
              </motion.span>
              <div className="h-[56px] w-[3px] rounded-full bg-gradient-to-t from-transparent to-brass/70" />
            </div>
            {clash > 0 && !reduceFx && (
              <motion.div
                key={`flash${clash}`}
                aria-hidden
                className="fx-intense pointer-events-none absolute inset-x-0 top-1/2 z-10 h-[3px] -translate-y-1/2"
                style={{ background: 'linear-gradient(90deg, transparent, #fff1cf 35%, var(--color-gold) 50%, #fff1cf 65%, transparent)', boxShadow: '0 0 20px rgb(232 191 93 / 0.8)' }}
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              />
            )}
            <EffectCard playback={playback} />
          </div>

          {frame(0)}
          <CommandBar game={game} act={act} seats={seats} playback={playback} peek={peek} onPeek={() => setPeek((x) => !x)} />
        </div>

        {error && (
          <p role="alert" className="absolute bottom-[86px] left-1/2 z-30 -translate-x-1/2 bg-soot px-4 py-2 text-[15px] shadow-[inset_0_0_0_2px_var(--color-conflict)]">
            {error}
          </p>
        )}
        <PhaseBanner game={board} paused={busy} names={labels} twoPlayer={twoPlayer} />
        <LogDrawer open={logOpen} onClose={() => setLogOpen(false)} game={game} names={logNames} />
        <CardPopup card={inspect} onClose={() => setInspect(null)} onDetail={(c) => setDetail(c)} />
        {detail && (
          <div className="absolute inset-y-0 right-0 z-50 flex w-[480px] p-3">
            <CardDetail card={detail} onClose={() => setDetail(null)} />
          </div>
        )}
        <CinematicHost game={game} />
        {game.phase.name === 'gameOver' && !scene && (endScreen ? endScreen(game) : <GameOver game={game} />)}
      </LayoutGroup>
    </GameStage>
  );
}

export function PlayScreen() {
  const game = useSession((s) => s.game);
  return game ? <BattleBoard game={game} /> : <DeckSetup />;
}
