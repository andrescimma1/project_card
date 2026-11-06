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
import type { Playback } from './Playback';
import { activeRef, cardAt } from './util';

export interface Seats {
  /** The player the board is asking now (always player 1 against the CPU). */
  me: PlayerId;
  names: [string, string];
  twoPlayer: boolean;
}

/** Phase groups of a turn (state machine SLUS 0x80034260). */
const STEPS = [
  { label: 'Preparación', phases: ['turnStart', 'mulligan', 'entrance', 'armorDigivolve'] },
  { label: 'DP', phases: ['dp'] },
  { label: 'Digivolve Option', phases: ['digivolveOption'] },
  { label: 'Digivolución', phases: ['digivolve'] },
  { label: 'Batalla', phases: ['attack', 'support'] },
];

const PHASE_TITLE: Record<string, [string, string]> = {
  turnStart: ['Preparación', 'robando cartas'],
  mulligan: ['Preparación', 'preparando la mano'],
  entrance: ['Preparación', 'entrada del Digimon'],
  armorDigivolve: ['Preparación', 'Armor-digievolución'],
  dp: ['Digivolución', 'carga de DP'],
  digivolveOption: ['Digivolución', 'Digivolve Option'],
  digivolve: ['Digivolución', 'digievolucionar'],
  attack: ['Batalla', 'decidiendo el ataque'],
  support: ['Batalla', 'carta de soporte'],
  gameOver: ['Fin de la partida', ''],
};

export function phaseTitle(game: GameState, playback: Playback | null): [string, string] {
  if (playback) return ['Batalla', 'resolución'];
  return PHASE_TITLE[game.phase.name] ?? [game.phase.name, ''];
}

export function PhaseBar({ game, playback, logOpen, onLog, onLeave }: { game: GameState; playback: Playback | null; logOpen: boolean; onLog: () => void; onLeave?: () => void }) {
  const [title, sub] = phaseTitle(game, playback);
  const current = playback ? STEPS.length - 1 : STEPS.findIndex((s) => s.phases.includes(game.phase.name));
  return (
    <header className="frame side-player h-[46px]" style={{ '--c': '14px' } as CSSProperties}>
      <div className="fill flex items-center gap-5 px-5">
        <h2 className="relative z-[1] flex items-baseline gap-2 font-display italic" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.span key={title + sub} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }} className="flex items-baseline gap-2">
              <span className="text-[26px] font-black text-white">{title}</span>
              {sub && <span className="text-[19px] font-semibold text-cyan">{sub}</span>}
            </motion.span>
          </AnimatePresence>
        </h2>
        <span className="flex-1" />
        <ol className="relative z-[1] flex items-center gap-1.5" aria-label="Fases del turno">
          {STEPS.map((s, i) => (
            <li key={s.label} className="flex items-center gap-1.5">
              <span
                aria-current={i === current ? 'step' : undefined}
                className={`px-2.5 py-0.5 font-display text-[14px] font-bold italic ${i === current ? 'bg-cyan text-abyss' : i < current ? 'text-ink' : 'text-haze/60'}`}
                style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ol>
        <span className="num relative z-[1] text-[20px] font-bold italic">
          <span className="text-haze">Turno</span> {game.turnNumber}
        </span>
        <button type="button" data-sfx="none" onClick={onLog} aria-expanded={logOpen} className="cmd relative z-[1] !py-1 !text-[15px]">
          <span>Registro</span>
        </button>
        {onLeave && (
          <button type="button" onClick={onLeave} className="relative z-[1] font-display text-[15px] font-semibold text-haze underline-offset-4 hover:text-ink hover:underline">
            Abandonar
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

const HINT: Record<string, string> = {
  mulligan: 'Quédate con estas cartas o descarta la mano entera y roba 4 nuevas.',
  entrance: 'Elige un Digimon de tu mano. Si entra un C, su HP y sus ataques quedan a la mitad; un U, a un cuarto.',
  armorDigivolve: 'Tu compañero tiene un Digi-Egg: puede convertirse ahora en su forma Armor.',
  dp: 'Puedes poner UNA carta Digimon de tu mano en el DP Slot. Suma su +P.',
  digivolveOption: 'Puedes jugar una Digivolve Option antes de digievolucionar.',
  digivolve: 'Las cartas que brillan son digievoluciones válidas. Al digievolucionar, el DP Slot va al descarte.',
  attack: 'Elige ◯, △ o ✕ en tu lista de ataques (teclas 1, 2 y 3).',
  support: 'Elige una carta de tu mano, apuesta con la de arriba de tu Online Deck o juega sin soporte.',
};

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
  const rivalName = twoPlayer ? names[them] : 'La CPU';
  const actor: PlayerId = waiting ? them : who;

  let hint: React.ReactNode = HINT[ph.name] ?? '';
  let commands: React.ReactNode = null;

  if (playback) {
    hint = playback.step ? describeEvent(playback.step, playback.board, twoPlayer ? names : undefined) : '';
    commands = (
      <>
        <span className="num text-[15px] text-haze">
          {playback.index + 1} / {playback.steps.length}
        </span>
        <Cmd primary onClick={playback.next}>
          {playback.finished ? 'Continuar' : 'Siguiente'}
        </Cmd>
        <Cmd onClick={playback.skip}>Saltar</Cmd>
      </>
    );
  } else if (waiting) {
    hint = (
      <>
        {twoPlayer ? `Le toca a ${names[them]}` : 'La CPU está pensando'}
        <Dots />
      </>
    );
  } else if (ph.name === 'mulligan') {
    commands = (
      <>
        <Cmd primary onClick={() => act(find('keepHand')!)}>
          Quedarme con esta mano
        </Cmd>
        {find('changeHand') && <Cmd onClick={() => act(find('changeHand')!)}>Cambiar toda la mano</Cmd>}
      </>
    );
  } else if (ph.name === 'armorDigivolve') {
    const ref = activeRef(game, who);
    const slot = ref === null ? undefined : me.partners[me.partnerOf[ref] ?? -1];
    const armor = slot?.armorId != null ? cards[slot.armorId] : null;
    commands = (
      <>
        <Cmd primary onClick={() => act(find('armorDigivolve')!)}>
          Armor-digievolucionar{armor ? ` a ${armor.name}` : ''}
        </Cmd>
        <Cmd onClick={() => act(find('skipArmorDigivolve')!)}>Seguir con {ref === null ? 'este Digimon' : cardAt(game, who, ref).name}</Cmd>
      </>
    );
  } else if (ph.name === 'dp') {
    commands = <Cmd onClick={() => act(find('skipDp')!)}>No cargar DP</Cmd>;
  } else if (ph.name === 'digivolveOption') {
    commands = <Cmd onClick={() => act(find('skipDigivolveOption')!)}>No usar Digivolve Option</Cmd>;
  } else if (ph.name === 'digivolve') {
    const can = actions.some((a) => a.type === 'digivolve');
    if (!can) hint = 'Ahora no hay digievoluciones posibles.';
    commands = (
      <Cmd primary={!can} onClick={() => act(find('skipDigivolve')!)}>
        {can ? 'No digievolucionar' : 'Ir a la batalla'}
      </Cmd>
    );
  } else if (ph.name === 'attack') {
    hint = rival.attack !== null ? `${HINT.attack} ${rivalName} ya eligió.` : HINT.attack;
    commands = <Cmd onClick={onPeek}>{peek ? 'Ver ataques' : 'Ver cartas'}</Cmd>;
  } else if (ph.name === 'support') {
    if (rival.support)
      hint = (
        <>
          {rivalName} eligió primero:{' '}
          <strong className="text-gold">
            {rival.support.kind === 'none' ? 'sin soporte' : rival.support.kind === 'gamble' ? 'la carta de arriba de su mazo, boca abajo' : cardAt(game, them, rival.support.card).name}
          </strong>
          . {HINT.support}
        </>
      );
    commands = (
      <>
        {actions.some((a) => a.type === 'chooseSupport' && a.choice.from === 'gamble') && (
          <Cmd onClick={() => act({ type: 'chooseSupport', player: who, choice: { from: 'gamble' } })}>Apostar ({count(me.online)})</Cmd>
        )}
        <Cmd onClick={() => act({ type: 'chooseSupport', player: who, choice: { from: 'none' } })}>Sin soporte</Cmd>
      </>
    );
  }

  return (
    <footer className={`frame h-[60px] ${actor === 0 ? 'side-player' : 'side-rival'}`} style={{ '--c': '14px' } as CSSProperties}>
      <div className="fill flex items-center gap-5 px-5">
        <span className="plate relative z-[1] h-[30px] min-w-[150px] justify-center text-[19px] font-extrabold italic">
          <span className="font-display">{playback ? 'Batalla' : names[actor]}</span>
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={playback ? `pb${playback.index}` : `${ph.name}${waiting}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className={`relative z-[1] min-w-0 flex-1 truncate ${playback ? 'font-display text-[21px] font-bold italic' : 'text-[16px] text-ink/90'}`}
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
