/**
 * What sits in each player's frame: the hand (four card slots, as in the original) or, while attacks are
 * being decided and resolved, that player's ◯ △ ✕ list.
 */
import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { gameEvents } from '../../audio/bus';
import type { Card } from '../../engine/cards/types';
import type { Action, CardRef, GameState, PlayerId } from '../../engine/game/types';
import { SPECIALTY_TEXT } from '../theme';
import { m } from '../../i18n';
import { ACTIONS, powerIndex, slotOf, type ActionKind } from '../vocab/actions';
import { crossEffectLabel, TERMS } from '../vocab/terms';
import { Count, type ActiveView } from './Arena';
import { CardFace } from './CardFace';
import { ActionDisc } from './glyphs';
import { cardAt } from './util';

/** "Enter with…", "Charge EP with…": what clicking a card does in each phase, in the current language. */
function playLabel(phase: string): string {
  const P = m().board.hand.play;
  switch (phase) {
    case 'entrance':
      return P.entrance;
    case 'dp':
      return P.dp(TERMS.dp);
    case 'digivolveOption':
      return P.digivolveOption;
    case 'digivolve':
      return P.digivolve;
    case 'support':
      return P.support;
    default:
      return P.other;
  }
}

const CHOOSING = ['entrance', 'dp', 'digivolveOption', 'digivolve', 'support'];

function actionForCard(actions: Action[], ref: CardRef): Action | undefined {
  return actions.find((a) => ('card' in a && a.card === ref) || (a.type === 'chooseSupport' && a.choice.from === 'hand' && a.choice.card === ref));
}

/** Four slots; the cards that can be played now pulse, the rest dim while the player is choosing. */
export function HandRow({
  game,
  player,
  actions,
  act,
  onInspect,
}: {
  game: GameState;
  player: PlayerId;
  actions: Action[];
  act: (a: Action) => void;
  onInspect: (c: Card) => void;
}) {
  const hand = game.players[player].hand;
  const choosing = actions.length > 0 && CHOOSING.includes(game.phase.name);
  const [picked, setPicked] = useState<CardRef | null>(null);
  useEffect(() => setPicked(null), [game]);

  const play = (ref: CardRef, a: Action) => {
    if (picked !== null) return;
    setPicked(ref);
    gameEvents.emit('CARD_SELECTED', { player });
    setTimeout(() => act(a), 170);
  };

  return (
    <ul className="flex items-center justify-center gap-[14px]" aria-label={TERMS.hand}>
      {Array.from({ length: 4 }, (_, i) => {
        const ref = hand[i];
        return (
          <li key={i} className="relative" style={{ fontSize: 10 } as CSSProperties}>
            <div className="slot-empty" aria-hidden>
              <span className="text-[2.3em]">{TERMS.card}</span>
            </div>
            <AnimatePresence>
              {ref !== null && ref !== undefined && (
                <HandCard
                  key={ref}
                  game={game}
                  player={player}
                  ref_={ref}
                  action={actionForCard(actions, ref)}
                  choosing={choosing}
                  picked={picked === ref}
                  onPlay={play}
                  onInspect={onInspect}
                />
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

function HandCard({
  game,
  player,
  ref_,
  action,
  choosing,
  picked,
  onPlay,
  onInspect,
}: {
  game: GameState;
  player: PlayerId;
  ref_: CardRef;
  action: Action | undefined;
  choosing: boolean;
  picked: boolean;
  onPlay: (ref: CardRef, a: Action) => void;
  onInspect: (c: Card) => void;
}) {
  const card = cardAt(game, player, ref_);
  return (
    <motion.div
      layoutId={`card-${player}-${ref_}`}
      className="group absolute inset-0"
      initial={{ opacity: 0, y: player === 0 ? 40 : -40, rotate: player === 0 ? 4 : -4 }}
      animate={picked ? { opacity: 1, y: player === 0 ? -26 : 26, scale: 1.1, rotate: 0 } : { opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    >
      <button
        type="button"
        data-sfx="none"
        data-sfx-hover={action ? 'card' : undefined}
        onClick={() => (action ? onPlay(ref_, action) : onInspect(card))}
        aria-label={action ? `${playLabel(game.phase.name)} ${card.name}` : m().board.hand.view(card.name)}
        className={`block transition-transform duration-150 ${action ? 'hover:-translate-y-3' : ''}`}
      >
        <CardFace card={card} size="hand" playable={!!action} glow={picked} dim={choosing && !action} />
      </button>
      {action && (
        <button
          type="button"
          data-sfx="none"
          onClick={() => onInspect(card)}
          aria-label={m().board.hand.details(card.name)}
          className="num absolute -right-2 -bottom-2 grid size-7 place-items-center rounded-full bg-soot text-[15px] font-bold text-brass opacity-0 shadow-[inset_0_0_0_2px_var(--color-brass)] transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          i
        </button>
      )}
    </motion.div>
  );
}

/**
 * The attack list of a creature, as the original shows it in each player's area while attacks are decided:
 * Furia, Técnica and Instinto with the creature's own attack names. `onPick` makes it the player's
 * choice (keys 1 2 3 as well).
 */
export function AttackList({
  player,
  view,
  name,
  chosen,
  hidden,
  status,
  onPick,
  delay = 0,
}: {
  player: PlayerId;
  view: ActiveView;
  name: string;
  chosen: ActionKind | null;
  hidden: boolean;
  status: string;
  onPick?: (action: ActionKind) => void;
  /** Seconds until changed powers count (with the battle step's sound). */
  delay?: number;
}) {
  useEffect(() => {
    if (!onPick) return;
    const keys: Record<string, ActionKind> = { '1': 'fury', '2': 'technique', '3': 'instinct' };
    const h = (e: KeyboardEvent) => {
      const a = keys[e.key];
      if (a) onPick(a);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onPick]);

  const card = view.card;
  if (!card)
    return (
      <p className="self-center font-display text-[20px] text-faded">
        {m().board.attacks.none(name, TERMS.creature.toLowerCase(), TERMS.arena.toLowerCase())}
      </p>
    );
  return (
    <motion.div
      className="flex w-[680px] flex-col gap-[6px] self-center"
      initial={{ opacity: 0, y: player === 0 ? 20 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label={m().board.attacks.of(card.name)}
    >
      <div className="flex h-[28px] items-center gap-3">
        <span className="plate h-[26px] text-[18px] font-extrabold">
          <span className="font-display">{card.name}</span>
        </span>
        <span className="num text-[18px] font-bold">
          <span className="text-gold">{TERMS.hp}</span> {view.hp}
        </span>
        <span className="font-display text-[16px] font-semibold" style={{ color: SPECIALTY_TEXT[view.specialty] }}>
          {TERMS.levels[card.level]}
        </span>
        <span className="flex-1" />
        <motion.span key={status} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="font-display text-[17px] font-semibold text-gold">
          {status}
        </motion.span>
        {hidden && (
          <span className="num grid size-[24px] place-items-center rounded-full bg-gold text-[15px] font-extrabold text-ink shadow-[0_0_0_2px_#2b1d12]" title={m().board.attacks.alreadyChose}>
            ?
          </span>
        )}
      </div>
      {ACTIONS.map((a, i) => {
        const state = chosen ? (chosen === a ? 'chosen' : 'off') : undefined;
        const power = view.powers[powerIndex(a)];
        const attack = card.attacks[slotOf(a)].name;
        const inner = (
          <>
            <ActionDisc action={a} size={30} />
            <span className="w-[86px] shrink-0 text-left font-display text-[15px] font-bold tracking-wide" style={{ color: 'color-mix(in srgb, var(--a) 45%, #f6e7c6)' }}>
              {TERMS.actions[a]}
            </span>
            <span className="min-w-0 flex-1 truncate text-left font-display text-[19px] font-bold">{attack}</span>
            {state === 'chosen' && (
              <motion.span initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-sm bg-gold px-1.5 font-display text-[14px] font-extrabold text-ink">
                {m().board.attacks.chosen}
              </motion.span>
            )}
            <span className="num w-[70px] text-right text-[30px] leading-none font-black">
              <Count value={power} delay={delay} />
            </span>
            {onPick && <span className="num w-5 text-[14px] text-bone/60">{i + 1}</span>}
          </>
        );
        return onPick ? (
          <button
            key={a}
            type="button"
            data-sfx="none"
            data-action={a}
            data-state={state}
            onClick={() => onPick(a)}
            className="atk-row h-[40px] cursor-pointer px-2"
            aria-label={m().board.attacks.pick(TERMS.actions[a], attack, power)}
          >
            {inner}
          </button>
        ) : (
          <div key={a} data-action={a} data-state={state} className="atk-row h-[40px] px-2">
            {inner}
          </div>
        );
      })}
      <p className="font-display text-[16px] font-semibold">
        <span className="text-bone/70">{TERMS.instinctEffect}: </span>
        <span className="text-[#a9c6dc]">{crossEffectLabel(card.crossEffect)}</span>
      </p>
    </motion.div>
  );
}
