/**
 * The strips above and below the board, as in the original: the phase title on top, and at the bottom
 * whose input it is, what to do, and the commands of the current phase.
 */
import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cards } from '../../engine/cards/db';
import { legalActions } from '../../engine/game/turn';
import type { Action, GameState, PlayerId } from '../../engine/game/types';
import { count } from '../../engine/game/zones';
import { describeEvent } from '../../game/describe';
import { m } from '../../i18n';
import { TERMS } from '../vocab/terms';
import type { Playback } from './Playback';
import { activeRef, cardAt } from './util';

export interface Seats {
  /** The player the board is asking now (always player 1 against the CPU). */
  me: PlayerId;
  names: [string, string];
  twoPlayer: boolean;
}

/** Phase groups of a turn (state machine SLUS 0x80034260). Labels in the current language. */
const steps = () => [
  { label: TERMS.phases.prep, phases: ['turnStart', 'mulligan', 'entrance', 'armorDigivolve'] },
  { label: TERMS.dp, phases: ['dp'] },
  { label: TERMS.evolutionCard, phases: ['digivolveOption'] },
  { label: TERMS.evolution, phases: ['digivolve'] },
  { label: TERMS.phases.battle, phases: ['attack', 'support'] },
];

export function phaseTitle(game: GameState, playback: Playback | null): [string, string] {
  const P = m().board.phaseTitle;
  const pair = (x: string[]) => [x[0], x[1]] as [string, string];
  if (playback) return pair(P.playback);
  switch (game.phase.name) {
    case 'turnStart':
      return pair(P.turnStart);
    case 'mulligan':
      return pair(P.mulligan);
    case 'entrance':
      return pair(P.entrance(TERMS.creature.toLowerCase()));
    case 'armorDigivolve':
      return pair(P.armorDigivolve(TERMS.eggEvolution.toLowerCase()));
    case 'dp':
      return pair(P.dp(TERMS.evolution, TERMS.dp));
    case 'digivolveOption':
      return pair(P.digivolveOption(TERMS.evolution, TERMS.evolutionCard.toLowerCase()));
    case 'digivolve':
      return pair(P.digivolve(TERMS.evolution));
    case 'attack':
      return pair(P.attack);
    case 'support':
      return pair(P.support);
    case 'gameOver':
      return pair(P.gameOver);
  }
}

export function PhaseBar({ game, playback, logOpen, onLog, onLeave }: { game: GameState; playback: Playback | null; logOpen: boolean; onLog: () => void; onLeave?: () => void }) {
  const B = m().board;
  const [title, sub] = phaseTitle(game, playback);
  const STEPS = steps();
  const current = playback ? STEPS.length - 1 : STEPS.findIndex((s) => s.phases.includes(game.phase.name));
  return (
    <header className="frame side-player h-[46px]" style={{ '--c': '14px' } as CSSProperties}>
      <div className="fill flex items-center gap-5 px-5">
        <h2 className="relative z-[1] flex items-baseline gap-2 font-display " aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.span key={title + sub} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }} className="flex items-baseline gap-2">
              <span className="text-[26px] font-black text-white">{title}</span>
              {sub && <span className="text-[19px] font-semibold text-brass">{sub}</span>}
            </motion.span>
          </AnimatePresence>
        </h2>
        <span className="flex-1" />
        <ol className="relative z-[1] flex items-center gap-1.5" aria-label={B.phaseSteps}>
          {STEPS.map((s, i) => (
            <li key={s.label} className="flex items-center gap-1.5">
              <span
                aria-current={i === current ? 'step' : undefined}
                className={`px-2.5 py-0.5 font-display text-[14px] font-bold ${i === current ? 'bg-brass text-soot' : i < current ? 'text-bone' : 'text-faded/60'}`}
                style={{ borderRadius: 4 }}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ol>
        <span className="num relative z-[1] text-[20px] font-bold ">
          <span className="text-faded">{B.turn}</span> {game.turnNumber}
        </span>
        <button type="button" data-sfx="none" onClick={onLog} aria-expanded={logOpen} className="cmd relative z-[1] !py-1 !text-[15px]">
          <span>{B.log}</span>
        </button>
        {onLeave && (
          <button type="button" onClick={onLeave} className="relative z-[1] font-display text-[15px] font-semibold text-faded underline-offset-4 hover:text-bone hover:underline">
            {B.leave}
          </button>
        )}
      </div>
    </header>
  );
}

function Cmd({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button type="button" onClick={onClick} data-primary={primary || undefined} className="cmd">
      <span>{children}</span>
    </button>
  );
}

function Dots() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((x) => (x + 1) % 4), 380);
    return () => clearInterval(t);
  }, []);
  return <span className="inline-block w-6 text-left">{'.'.repeat(n)}</span>;
}

/** What to do in each phase, in the current language. */
function hints(): Record<string, string> {
  const H = m().board.hints;
  const T = TERMS;
  return {
    mulligan: H.mulligan,
    entrance: H.entrance(T.creature.toLowerCase(), T.levels.C, T.levels.U),
    armorDigivolve: H.armorDigivolve(T.partner.toLowerCase(), T.egg.toLowerCase(), T.levels.A),
    dp: H.dp(T.creature.toLowerCase(), T.dpZone.toLowerCase(), T.dp),
    digivolveOption: H.digivolveOption(T.evolutionCard.toLowerCase()),
    digivolve: H.digivolve(T.dpZone.toLowerCase(), T.discard.toLowerCase()),
    attack: H.attack(T.actions.fury, T.actions.technique, T.actions.instinct),
    support: H.support,
  };
}

export function CommandBar({
  game,
  act,
  seats,
  playback,
  peek,
  onPeek,
}: {
  game: GameState;
  act: (a: Action) => void;
  seats: Seats;
  playback: Playback | null;
  peek: boolean;
  onPeek: () => void;
}) {
  const { me: who, names, twoPlayer } = seats;
  const them: PlayerId = who === 0 ? 1 : 0;
  const actions = legalActions(game, who);
  const ph = game.phase;
  const find = (t: Action['type']) => actions.find((a) => a.type === t);
  const waiting = !playback && actions.length === 0 && ph.name !== 'gameOver';
  const me = game.players[who];
  const rival = game.players[them];
  const B = m().board;
  const C = B.commands;
  const HINT = hints();
  const rivalName = twoPlayer ? names[them] : B.seats.theCpu;
  const actor: PlayerId = waiting ? them : who;

  let hint: React.ReactNode = HINT[ph.name] ?? '';
  let commands: React.ReactNode = null;

  if (playback) {
    hint = playback.step ? describeEvent(playback.step, playback.board, twoPlayer ? names : undefined) : '';
    commands = (
      <>
        <span className="num text-[15px] text-faded">
          {playback.index + 1} / {playback.steps.length}
        </span>
        <Cmd primary onClick={playback.next}>
          {playback.finished ? C.continue : C.next}
        </Cmd>
        <Cmd onClick={playback.skip}>{C.skip}</Cmd>
      </>
    );
  } else if (waiting) {
    hint = (
      <>
        {twoPlayer ? B.hints.turnOf(names[them]) : B.hints.cpuThinking}
        <Dots />
      </>
    );
  } else if (ph.name === 'mulligan') {
    commands = (
      <>
        <Cmd primary onClick={() => act(find('keepHand')!)}>
          {C.keepHand}
        </Cmd>
        {find('changeHand') && <Cmd onClick={() => act(find('changeHand')!)}>{C.changeHand}</Cmd>}
      </>
    );
  } else if (ph.name === 'armorDigivolve') {
    const ref = activeRef(game, who);
    const slot = ref === null ? undefined : me.partners[me.partnerOf[ref] ?? -1];
    const armor = slot?.armorId != null ? cards[slot.armorId] : null;
    commands = (
      <>
        <Cmd primary onClick={() => act(find('armorDigivolve')!)}>
          {C.eggEvolve(TERMS.egg.toLowerCase(), armor ? armor.name : null)}
        </Cmd>
        <Cmd onClick={() => act(find('skipArmorDigivolve')!)}>{C.keepGoing(ref === null ? C.thisCreature(TERMS.creature.toLowerCase()) : cardAt(game, who, ref).name)}</Cmd>
      </>
    );
  } else if (ph.name === 'dp') {
    commands = <Cmd onClick={() => act(find('skipDp')!)}>{C.noDp(TERMS.dp)}</Cmd>;
  } else if (ph.name === 'digivolveOption') {
    commands = <Cmd onClick={() => act(find('skipDigivolveOption')!)}>{C.noEvolutionCard(TERMS.evolutionCard.toLowerCase())}</Cmd>;
  } else if (ph.name === 'digivolve') {
    const can = actions.some((a) => a.type === 'digivolve');
    if (!can) hint = B.hints.noEvolution;
    commands = (
      <Cmd primary={!can} onClick={() => act(find('skipDigivolve')!)}>
        {can ? C.noEvolve : C.toBattle}
      </Cmd>
    );
  } else if (ph.name === 'attack') {
    hint = rival.attack !== null ? `${HINT.attack} ${B.hints.rivalChose(rivalName)}` : HINT.attack;
    commands = <Cmd onClick={onPeek}>{peek ? C.showAttacks : C.showCards}</Cmd>;
  } else if (ph.name === 'support') {
    if (rival.support)
      hint = (
        <>
          {B.hints.rivalChoseFirst(rivalName)}{' '}
          <strong className="text-gold">
            {rival.support.kind === 'none' ? B.hints.noSupport : rival.support.kind === 'gamble' ? B.hints.faceDown : cardAt(game, them, rival.support.card).name}
          </strong>
          . {HINT.support}
        </>
      );
    commands = (
      <>
        {actions.some((a) => a.type === 'chooseSupport' && a.choice.from === 'gamble') && (
          <Cmd onClick={() => act({ type: 'chooseSupport', player: who, choice: { from: 'gamble' } })}>
            {TERMS.gamble} ({count(me.online)})
          </Cmd>
        )}
        <Cmd onClick={() => act({ type: 'chooseSupport', player: who, choice: { from: 'none' } })}>{C.noSupport}</Cmd>
      </>
    );
  }

  return (
    <footer className={`frame h-[60px] ${actor === 0 ? 'side-player' : 'side-rival'}`} style={{ '--c': '14px' } as CSSProperties}>
      <div className="fill flex items-center gap-5 px-5">
        <span className="plate relative z-[1] h-[30px] min-w-[150px] justify-center text-[19px] font-extrabold ">
          <span className="font-display">{playback ? C.battle : names[actor]}</span>
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={playback ? `pb${playback.index}` : `${ph.name}${waiting}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className={`relative z-[1] min-w-0 flex-1 truncate ${playback ? 'font-display text-[21px] font-bold ' : 'text-[16px] text-bone/90'}`}
            aria-live="polite"
          >
            {hint}
          </motion.p>
        </AnimatePresence>
        <div className="relative z-[1] flex shrink-0 items-center gap-3">{commands}</div>
      </div>
    </footer>
  );
}
