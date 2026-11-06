/**
 * What sits in each player's frame: the hand (four card slots, as in the original) or, while attacks are
 * being decided and resolved, that player's ◯ △ ✕ list.
 */
import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { gameEvents } from '../../audio/bus';
import { CROSS_EFFECT_LABEL } from '../../engine/cards/db';
import type { AttackSlot, Card } from '../../engine/cards/types';
import type { Action, CardRef, GameState, PlayerId } from '../../engine/game/types';
import { SPECIALTY_COLOR } from '../theme';
import { Count, type ActiveView } from './Arena';
import { CardFace } from './CardFace';
import { SLOTS, SlotDisc } from './glyphs';
import { cardAt } from './util';

const PLAY_LABEL: Record<string, string> = {
  entrance: 'Entrar con',
  dp: 'Cargar DP con',
  digivolveOption: 'Usar',
  digivolve: 'Digievolucionar a',
  support: 'Usar como soporte',
};

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
    <ul className="flex items-center justify-center gap-[14px]" aria-label="Mano">
      {Array.from({ length: 4 }, (_, i) => {
        const ref = hand[i];
        return (
          <li key={i} className="relative" style={{ fontSize: 10 } as CSSProperties}>
            <div className="slot-empty" aria-hidden>
              <span className="text-[2.4em]">CARD</span>
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
        aria-label={action ? `${PLAY_LABEL[game.phase.name] ?? 'Jugar'} ${card.name}` : `Ver ${card.name}`}
        className={`block transition-transform duration-150 ${action ? 'hover:-translate-y-3' : ''}`}
      >
        <CardFace card={card} size="hand" playable={!!action} glow={picked} dim={choosing && !action} />
      </button>
      {action && (
        <button
          type="button"
          data-sfx="none"
          onClick={() => onInspect(card)}
          aria-label={`Ver detalle de ${card.name}`}
          className="num absolute -right-2 -bottom-2 grid size-7 place-items-center rounded-full bg-abyss text-[15px] font-bold text-cyan opacity-0 shadow-[inset_0_0_0_2px_var(--color-cyan)] transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          i
        </button>
      )}
    </motion.div>
  );
}

/**
 * The attack list of a Digimon, as the original shows it in each player's area while attacks are decided.
 * `onPick` makes it the player's choice (keys 1 2 3 as well).
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
  chosen: AttackSlot | null;
  hidden: boolean;
  status: string;
  onPick?: (slot: AttackSlot) => void;
  /** Seconds until changed powers count (with the battle step's sound). */
  delay?: number;
}) {
  useEffect(() => {
    if (!onPick) return;
    const keys: Record<string, AttackSlot> = { '1': 'circle', '2': 'triangle', '3': 'cross' };
    const h = (e: KeyboardEvent) => {
      const slot = keys[e.key];
      if (slot) onPick(slot);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onPick]);

  const card = view.card;
  if (!card) return <p className="self-center font-display text-[20px] text-haze italic">{name} no tiene Digimon en batalla.</p>;
  return (
    <motion.div
      className="flex w-[680px] flex-col gap-[6px] self-center"
      initial={{ opacity: 0, y: player === 0 ? 20 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label={`Ataques de ${card.name}`}
    >
      <div className="flex h-[28px] items-center gap-3">
        <span className="plate h-[26px] text-[18px] font-extrabold italic">
          <span className="font-display uppercase">{card.name}</span>
        </span>
        <span className="num text-[18px] font-bold italic">
          <span className="text-gold">HP</span> {view.hp}
        </span>
        <span className="font-display text-[15px] font-semibold" style={{ color: SPECIALTY_COLOR[view.specialty] }}>
          Nivel {card.level}
        </span>
        <span className="flex-1" />
        <motion.span key={status} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="font-display text-[16px] font-semibold text-cyan italic">
          {status}
        </motion.span>
        {hidden && (
          <span className="num grid size-[24px] rotate-45 place-items-center bg-gold text-[15px] font-extrabold text-abyss">
            <span className="-rotate-45">?</span>
          </span>
        )}
      </div>
      {SLOTS.map((s, i) => {
        const state = chosen ? (chosen === s ? 'chosen' : 'off') : undefined;
        const inner = (
          <>
            <SlotDisc slot={s} size={30} />
            <span className="min-w-0 flex-1 truncate text-left font-display text-[19px] font-bold">{card.attacks[s].name}</span>
            {state === 'chosen' && (
              <motion.span initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-[14px] font-extrabold text-gold italic">
                ELEGIDO
              </motion.span>
            )}
            <span className="num w-[70px] text-right text-[30px] leading-none font-black italic">
              <Count value={view.powers[i]} delay={delay} />
            </span>
            {onPick &&<span className="num w-5 text-[13px] text-ink/60">{i + 1}</span>}
          </>
        );
        return onPick ? (
          <button key={s} type="button" data-sfx="none" data-slot={s} data-state={state} onClick={() => onPick(s)} className="atk-row h-[40px] cursor-pointer px-2" aria-label={`Atacar con ${card.attacks[s].name}, ${view.powers[i]}`}>
            {inner}
          </button>
        ) : (
          <div key={s} data-slot={s} data-state={state} className="atk-row h-[40px] px-2">
            {inner}
          </div>
        );
      })}
      <p data-slot="cross" className="font-display text-[15px] font-semibold">
        <span className="text-ink/70">Efecto especial </span>
        <span style={{ color: 'var(--a)' }}>✕ {CROSS_EFFECT_LABEL[card.crossEffect]}</span>
      </p>
    </motion.div>
  );
}
