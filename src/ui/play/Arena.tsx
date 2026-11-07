/**
 * The two Battle Slots facing each other in the middle of the board, as in the original: DP on the outer
 * edge, the ◯ △ ✕ powers, and the art towards the centre. The rival's panel is the mirror image.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { animate, AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Card, DigimonCard, Level, Specialty } from '../../engine/cards/types';
import { playerDp } from '../../engine/game/digivolve';
import type { GameState, PlayerId } from '../../engine/game/types';
import { count } from '../../engine/game/zones';
import { battleStat, DP_CAP } from '../../engine/rules/primitives';
import { SPECIALTY_COLOR, SPECIALTY_NAME, SPECIALTY_TEXT } from '../theme';
import { m } from '../../i18n';
import { ACTIONS, powerIndex, slotOf, type ActionKind } from '../vocab/actions';
import { crossEffectLabel, TERMS } from '../vocab/terms';
import { CardArt } from './CardFace';
import { ActionDisc } from './glyphs';
import { activeRef, cardAt } from './util';

/** What a Battle Slot shows. Built from the board, or from a battle being replayed. */
export interface ActiveView {
  card: DigimonCard | null;
  hp: number;
  max: number;
  powers: [number, number, number];
  specialty: Specialty;
  enteredAs: Level | null;
  below: number;
  dp: number;
}

export function activeView(game: GameState, player: PlayerId): ActiveView {
  const p = game.players[player];
  const ref = activeRef(game, player);
  const card = ref === null ? null : (cardAt(game, player, ref) as DigimonCard);
  return {
    card,
    hp: p.hp,
    max: card ? Math.max(p.hp, battleStat(card.hp, p.enteredAs)) : 1,
    powers: p.powers,
    specialty: p.specialty,
    enteredAs: p.enteredAs,
    below: Math.max(0, count(p.stack) - 1),
    dp: playerDp(p),
  };
}

/** Effects of the battle step being replayed on one fighter. */
export interface FighterFx {
  lunge: boolean;
  hurt: boolean;
  dmg: number | null;
  heal: number | null;
  ko: boolean;
  /** Seconds until the numbers change (they land with the hit / the effect, and its sound). */
  delay: number;
}

/** A number that counts to its new value (after `delay` seconds). */
export function useCountTo(value: number, delay = 0) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (reduce || from.current === value) {
      from.current = value;
      setShown(value);
      return;
    }
    const c = animate(from.current, value, { duration: 0.75, delay, ease: 'easeOut', onUpdate: (v) => setShown(Math.round(v)) });
    from.current = value;
    return () => c.stop();
  }, [value, reduce, delay]);
  return shown;
}

/** A power or HP figure that counts to its new value and flashes gold when it changes. */
export function Count({ value, delay = 0 }: { value: number; delay?: number }) {
  const shown = useCountTo(value, delay);
  const changing = shown !== value;
  return <span style={changing ? { color: '#ffe58a', textShadow: '0 0 12px rgb(255 201 52 / 0.9)' } : undefined}>{shown}</span>;
}

/** HP bar with a white "ghost" that drains after the hit, like a fighting game. */
export function HpGauge({ hp, max, height = 12, delay = 0 }: { hp: number; max: number; height?: number; delay?: number }) {
  const pct = Math.max(0, Math.min(100, (hp / Math.max(max, 1)) * 100));
  const low = pct < 30;
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height, borderRadius: height / 2, background: 'linear-gradient(180deg, #0c0805, #2a1d13)', boxShadow: 'inset 0 0 0 1px #6f5638, inset 0 2px 3px rgb(0 0 0 / 0.6)' }}
      role="meter"
      aria-valuenow={hp}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={TERMS.hp}
    >
      <motion.div className="absolute inset-y-0 left-0 bg-[#f1e5ca]/75" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, delay: delay + 0.45, ease: 'easeOut' }} />
      <motion.div
        className="absolute inset-y-0 left-0"
        style={{
          background: low ? 'linear-gradient(180deg, #e58a72, var(--color-blood) 55%, #6f1810)' : 'linear-gradient(180deg, #cfe39a, var(--color-vital) 50%, #46661f)',
        }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      />
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg, transparent 0 11px, rgb(20 14 9 / 0.5) 11px 12px)' }} />
    </div>
  );
}

function DpColumn({ dp, mirrored }: { dp: number; mirrored: boolean }) {
  const shown = useCountTo(dp);
  return (
    <div className={`flex w-[78px] shrink-0 flex-col items-center gap-1.5 py-1 ${mirrored ? '' : ''}`} aria-label={m().board.arena.dpMeter(TERMS.dpLong, dp, DP_CAP)} title={TERMS.dpLong}>
      <span className="font-display text-[16px] font-bold text-gold">{TERMS.dp}</span>
      <span className="num text-[40px] leading-none font-extrabold text-bone ">{shown}</span>
      <div className="flex flex-col-reverse gap-[3px]" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <motion.span
            key={i}
            className="h-[9px] w-[34px] rounded-[3px]"
            initial={false}
            animate={{
              background: dp >= (i + 1) * 10 ? 'linear-gradient(180deg, #f6dc98, #c9974a)' : 'linear-gradient(180deg, #0f0a06, #241911)',
              boxShadow: dp >= (i + 1) * 10 ? '0 0 0 1px #2b1d12, 0 0 7px rgb(232 191 93 / 0.55)' : '0 0 0 1px #4a3725',
            }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
          />
        ))}
      </div>
      <span className="num text-[12px] text-faded">/ {DP_CAP}</span>
    </div>
  );
}

const FX_NONE: FighterFx = { lunge: false, hurt: false, dmg: null, heal: null, ko: false, delay: 0 };

/**
 * One Battle Slot. `chosen` highlights an attack (own choice, or revealed in the battle);
 * `hiddenChoice` says the player already chose but it is still secret.
 */
export function ActivePanel({
  player,
  view,
  label,
  chosen = null,
  hiddenChoice = false,
  fx = FX_NONE,
  emptyText,
  onInspect,
}: {
  player: PlayerId;
  view: ActiveView;
  label: string;
  chosen?: ActionKind | null;
  hiddenChoice?: boolean;
  fx?: FighterFx;
  emptyText: string;
  onInspect: (c: Card) => void;
}) {
  const reduce = useReducedMotion();
  const mirrored = player === 1;
  const card = view.card;
  const hp = useCountTo(view.hp, fx.delay);
  const color = SPECIALTY_COLOR[view.specialty];
  const toward = mirrored ? -1 : 1;

  return (
    <section
      aria-label={m().board.arena.of(TERMS.activeCreature, label)}
      className={`frame h-full ${mirrored ? 'side-rival' : 'side-player'}`}
      style={{ '--c': '20px', filter: 'drop-shadow(0 14px 24px rgb(0 0 0 / 0.5))' } as CSSProperties}
    >
      <div className={`fill flex flex-col`}>
        {/* header */}
        <div className={`relative z-[1] flex h-[34px] shrink-0 items-center gap-3 px-4 ${mirrored ? 'flex-row-reverse' : ''}`}>
          <span className="plate h-[26px] text-[19px] font-extrabold ">
            <span className="font-display tracking-wide">{card ? card.name : m().board.arena.without(TERMS.creature.toLowerCase())}</span>
          </span>
          {card && (
            <span className="font-display text-[16px] font-semibold" style={{ color: SPECIALTY_TEXT[view.specialty] }}>
              {TERMS.factionNamed(SPECIALTY_NAME[view.specialty])}
              {view.specialty !== card.specialty ? m().board.arena.changed : ''} · {TERMS.levels[card.level]}
            </span>
          )}
          <span className="flex-1" />
          {hiddenChoice && (
            <motion.span
              initial={{ scale: 1.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="num grid size-[26px] place-items-center rounded-full bg-gold text-[17px] font-extrabold text-ink shadow-[0_0_0_2px_#2b1d12]"
              title={m().board.attacks.alreadyChoseAttack}
            >
              <span>?</span>
            </motion.span>
          )}
          {view.below > 0 && <span className="text-[13px] text-faded">{m().board.arena.below(view.below)}</span>}
        </div>

        {card ? (
          <div className={`relative z-[1] flex min-h-0 flex-1 items-stretch gap-3 px-3 pb-3 ${mirrored ? 'flex-row-reverse' : ''}`}>
            <DpColumn dp={view.dp} mirrored={mirrored} />

            {/* Furia, Técnica, Instinto */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-[7px]">
              {ACTIONS.map((a) => (
                <div
                  key={a}
                  data-action={a}
                  data-mirror={mirrored || undefined}
                  data-state={chosen ? (chosen === a ? 'chosen' : 'off') : undefined}
                  className={`atk-row h-[46px] px-2 ${mirrored ? 'flex-row-reverse' : ''}`}
                  title={`${TERMS.actions[a]}: ${card.attacks[slotOf(a)].name}`}
                >
                  <ActionDisc action={a} size={32} />
                  <span className={`min-w-0 flex-1 truncate font-display text-[16px] font-semibold text-bone/90 ${mirrored ? 'text-right' : ''}`}>{card.attacks[slotOf(a)].name}</span>
                  <span className="num w-[64px] text-[30px] leading-none font-extrabold" style={{ textAlign: mirrored ? 'left' : 'right' }}>
                    <Count value={view.powers[powerIndex(a)]} delay={fx.delay} />
                  </span>
                </div>
              ))}
              <div className={`flex items-center gap-2 text-[14px] ${mirrored ? 'flex-row-reverse' : ''}`}>
                <span data-action="instinct" className="flex items-center gap-1 font-display font-semibold text-[#a9c6dc]" title={TERMS.instinctEffect}>
                  {TERMS.actions.instinct}: {crossEffectLabel(card.crossEffect)}
                </span>
                {view.enteredAs && (
                  <span className="rounded-sm bg-gold/15 px-1.5 font-display font-semibold text-gold" title={m().board.arena.enteredHint}>
                    {m().board.arena.enteredAs(TERMS.levels[view.enteredAs], view.enteredAs === 'C' ? 'half' : view.enteredAs === 'U' ? 'quarter' : 'full')}
                  </span>
                )}
              </div>
            </div>

            {/* art, towards the centre */}
            <div className="flex w-[206px] shrink-0 flex-col gap-1.5">
              <motion.button
                type="button"
                onClick={() => onInspect(card)}
                aria-label={m().board.arena.view(card.name, view.hp)}
                className="cut relative h-[170px] w-full overflow-hidden [--c:16px]"
                style={{ background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${color} 45%, #140e09), #140e09 75%)`, boxShadow: `0 0 0 2px #2b1d12, 0 0 0 4px ${color}` }}
                animate={reduce ? {} : fx.lunge ? { x: [0, 54 * toward, 0], scale: [1, 1.08, 1] } : fx.hurt ? { x: [0, -10 * toward, 10 * toward, -5 * toward, 0] } : { x: 0, scale: 1 }}
                transition={{ duration: fx.lunge ? 0.45 : 0.4, delay: fx.hurt ? fx.delay : 0 }}
              >
                <CardArt card={card} flip={mirrored} className={`h-full w-full ${fx.ko ? 'grayscale' : ''}`} />
                <span className="tcg-badge" style={{ '--f-main': color, '--f-dark': '#20140c', '--f-light': '#f1e5ca', fontSize: 15 } as CSSProperties} title={TERMS.levels[card.level]}>
                  {TERMS.levelShort[card.level]}
                </span>
                <AnimatePresence>
                  {fx.hurt && (
                    <motion.span
                      key="flash"
                      className="fx-intense absolute inset-0 bg-blood mix-blend-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, delay: fx.delay, times: [0, 0.08, 1] }}
                    />
                  )}
                  {fx.dmg !== null && (
                    <motion.span
                      key={`d${fx.dmg}`}
                      initial={{ y: 16, opacity: 0, scale: 0.5 }}
                      animate={{ y: -18, opacity: 1, scale: 1.15 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ duration: 0.5, delay: fx.delay }}
                      className="num absolute inset-x-0 top-[34%] text-center text-[56px] font-black text-[#fff3dc]"
                      style={{ textShadow: '0 3px 0 #6f1810, 0 0 2px #2b1d12, 2px 0 0 #2b1d12, -2px 0 0 #2b1d12' }}
                    >
                      −{fx.dmg}
                    </motion.span>
                  )}
                  {fx.heal !== null && fx.heal > 0 && (
                    <motion.span
                      key={`h${fx.heal}`}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: -12, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: fx.delay + 0.42 }}
                      className="num absolute inset-x-0 top-[12%] text-center text-[38px] font-black "
                      style={{ color: '#d6ec9c', textShadow: '0 2px 0 #2c3f12, 2px 0 0 #2b1d12, -2px 0 0 #2b1d12' }}
                    >
                      +{fx.heal}
                    </motion.span>
                  )}
                  {fx.ko && (
                    <motion.span
                      key="ko"
                      initial={{ scale: 2.4, opacity: 0, rotate: -12 }}
                      animate={{ scale: 1, opacity: 1, rotate: -8 }}
                      className="absolute inset-0 grid place-items-center bg-soot/45 font-display text-[64px] font-black text-blood "
                      style={{ textShadow: '0 3px 0 #000, 2px 0 0 #1a0f08, -2px 0 0 #1a0f08' }}
                    >
                      KO
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className={`absolute bottom-1 flex items-baseline gap-1 ${mirrored ? 'left-2' : 'right-2'}`}>
                  <span className="font-display text-[16px] font-bold text-gold" style={{ textShadow: '0 1px 0 #000' }}>{TERMS.hp}</span>
                  <span className="num text-[38px] leading-none font-black" style={{ textShadow: '0 2px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 0 10px rgb(0 0 0 / 0.8)' }}>
                    {hp}
                  </span>
                </span>
              </motion.button>
              <HpGauge hp={view.hp} max={view.max} delay={fx.delay} />
            </div>
          </div>
        ) : (
          <div className="relative z-[1] flex flex-1 items-center justify-center px-6 pb-4">
            <div className="slot-empty !h-full !w-full text-[40px]" style={{ width: '100%', height: '100%' }}>
              <span className="flex flex-col items-center gap-1">
                {TERMS.creature}
                <span className="font-body text-[15px] font-medium text-faded not-italic">{emptyText}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
