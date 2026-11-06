/**
 * The two Battle Slots facing each other in the middle of the board, as in the original: DP on the outer
 * edge, the ◯ △ ✕ powers, and the art towards the centre. The rival's panel is the mirror image.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { animate, AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CROSS_EFFECT_LABEL } from '../../engine/cards/db';
import type { AttackSlot, Card, DigimonCard, Level, Specialty } from '../../engine/cards/types';
import { playerDp } from '../../engine/game/digivolve';
import type { GameState, PlayerId } from '../../engine/game/types';
import { count } from '../../engine/game/zones';
import { battleStat, DP_CAP } from '../../engine/rules/primitives';
import { SPECIALTY_COLOR, SPECIALTY_NAME } from '../theme';
import { CardArt } from './CardFace';
import { SLOTS, SlotDisc } from './glyphs';
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
      style={{ height, background: 'linear-gradient(180deg, #020716, #0a1a44)', boxShadow: 'inset 0 0 0 1px rgb(159 208 255 / 0.35)' }}
      role="meter"
      aria-valuenow={hp}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label="HP"
    >
      <motion.div className="absolute inset-y-0 left-0 bg-white/80" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, delay: delay + 0.45, ease: 'easeOut' }} />
      <motion.div
        className="absolute inset-y-0 left-0"
        style={{
          background: low ? 'linear-gradient(180deg, #ff8a9a, var(--color-crimson) 55%, #9e0f26)' : 'linear-gradient(180deg, #b8f7ff, var(--color-cyan) 40%, var(--color-electric) 100%)',
          boxShadow: low ? '0 0 10px var(--color-crimson)' : '0 0 10px rgb(72 228 255 / 0.6)',
        }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      />
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg, transparent 0 9px, rgb(2 7 22 / 0.55) 9px 10px)' }} />
    </div>
  );
}

function DpColumn({ dp, mirrored }: { dp: number; mirrored: boolean }) {
  const shown = useCountTo(dp);
  return (
    <div className={`flex w-[78px] shrink-0 flex-col items-center gap-1.5 py-1 ${mirrored ? '' : ''}`} aria-label={`DP ${dp} de ${DP_CAP}`}>
      <span className="font-display text-[15px] font-bold text-gold italic">DP</span>
      <span className="num text-[40px] leading-none font-extrabold text-ink italic">{shown}</span>
      <div className="flex flex-col-reverse gap-[3px]" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <motion.span
            key={i}
            className="h-[9px] w-[34px]"
            style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}
            initial={false}
            animate={{
              background: dp >= (i + 1) * 10 ? 'linear-gradient(90deg, #fff1b8, #ffc934)' : 'linear-gradient(90deg, #12285e, #0a1a44)',
              boxShadow: dp >= (i + 1) * 10 ? '0 0 8px rgb(255 201 52 / 0.7)' : '0 0 0 rgb(0 0 0 / 0)',
            }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
          />
        ))}
      </div>
      <span className="num text-[12px] text-haze">/ {DP_CAP}</span>
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
  chosen?: AttackSlot | null;
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
      aria-label={`Battle Slot de ${label}`}
      className={`frame h-full ${mirrored ? 'side-rival' : 'side-player'}`}
      style={{ '--c': '20px', filter: 'drop-shadow(0 14px 24px rgb(0 0 0 / 0.5))' } as CSSProperties}
    >
      <div className={`fill flex flex-col`}>
        {/* header */}
        <div className={`relative z-[1] flex h-[34px] shrink-0 items-center gap-3 px-4 ${mirrored ? 'flex-row-reverse' : ''}`}>
          <span className="plate h-[26px] text-[19px] font-extrabold italic">
            <span className="font-display tracking-wide uppercase">{card ? card.name : 'Sin Digimon'}</span>
          </span>
          {card && (
            <span className="font-display text-[15px] font-semibold" style={{ color }}>
              {SPECIALTY_NAME[view.specialty]}
              {view.specialty !== card.specialty ? ' (cambiada)' : ''} · Nivel {card.level}
            </span>
          )}
          <span className="flex-1" />
          {hiddenChoice && (
            <motion.span
              initial={{ scale: 1.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="num grid size-[26px] rotate-45 place-items-center bg-gold text-[16px] font-extrabold text-abyss"
              title="Ya eligió su ataque"
            >
              <span className="-rotate-45">?</span>
            </motion.span>
          )}
          {view.below > 0 && <span className="text-[13px] text-haze">{view.below} debajo</span>}
        </div>

        {card ? (
          <div className={`relative z-[1] flex min-h-0 flex-1 items-stretch gap-3 px-3 pb-3 ${mirrored ? 'flex-row-reverse' : ''}`}>
            <DpColumn dp={view.dp} mirrored={mirrored} />

            {/* ◯ △ ✕ */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-[7px]">
              {SLOTS.map((s, i) => (
                <div
                  key={s}
                  data-slot={s}
                  data-mirror={mirrored || undefined}
                  data-state={chosen ? (chosen === s ? 'chosen' : 'off') : undefined}
                  className={`atk-row h-[46px] px-2 ${mirrored ? 'flex-row-reverse' : ''}`}
                >
                  <SlotDisc slot={s} size={32} />
                  <span className={`min-w-0 flex-1 truncate font-display text-[15px] font-semibold text-ink/85 ${mirrored ? 'text-right' : ''}`}>{card.attacks[s].name}</span>
                  <span className="num w-[64px] text-[30px] leading-none font-extrabold italic" style={{ textAlign: mirrored ? 'left' : 'right' }}>
                    <Count value={view.powers[i]} delay={fx.delay} />
                  </span>
                </div>
              ))}
              <div className={`flex items-center gap-2 text-[13px] ${mirrored ? 'flex-row-reverse' : ''}`}>
                <span data-slot="cross" className="font-display font-semibold" style={{ color: 'var(--a)' }}>
                  ✕ {CROSS_EFFECT_LABEL[card.crossEffect]}
                </span>
                {view.enteredAs && (
                  <span className="bg-gold/15 px-1.5 font-display font-semibold text-gold" title="Entró directo desde la mano">
                    Entró como {view.enteredAs}: {view.enteredAs === 'C' ? 'mitad' : view.enteredAs === 'U' ? 'un cuarto' : 'normal'}
                  </span>
                )}
              </div>
            </div>

            {/* art, towards the centre */}
            <div className="flex w-[206px] shrink-0 flex-col gap-1.5">
              <motion.button
                type="button"
                onClick={() => onInspect(card)}
                aria-label={`Ver ${card.name}, ${view.hp} HP`}
                className="cut relative h-[170px] w-full overflow-hidden [--c:16px]"
                style={{ background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${color} 45%, #020716), #020716 75%)`, boxShadow: `inset 0 0 0 2px ${color}` }}
                animate={reduce ? {} : fx.lunge ? { x: [0, 54 * toward, 0], scale: [1, 1.08, 1] } : fx.hurt ? { x: [0, -10 * toward, 10 * toward, -5 * toward, 0] } : { x: 0, scale: 1 }}
                transition={{ duration: fx.lunge ? 0.45 : 0.4, delay: fx.hurt ? fx.delay : 0 }}
              >
                <CardArt card={card} flip={mirrored} className={`h-full w-full ${fx.ko ? 'grayscale' : ''}`} />
                <span className="tcg-badge" style={{ '--spec': color, fontSize: 15 } as CSSProperties}>
                  {card.level}
                </span>
                <AnimatePresence>
                  {fx.hurt && (
                    <motion.span
                      key="flash"
                      className="fx-intense absolute inset-0 bg-crimson mix-blend-screen"
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
                      className="num absolute inset-x-0 top-[34%] text-center text-[54px] font-black text-white italic"
                      style={{ textShadow: '0 3px 0 #9e0f26, 0 0 18px rgb(255 61 88 / 0.9)' }}
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
                      className="num absolute inset-x-0 top-[12%] text-center text-[38px] font-black italic"
                      style={{ color: 'var(--color-atk-triangle)', textShadow: '0 2px 0 #02331a, 0 0 14px rgb(47 212 124 / 0.8)' }}
                    >
                      +{fx.heal}
                    </motion.span>
                  )}
                  {fx.ko && (
                    <motion.span
                      key="ko"
                      initial={{ scale: 2.4, opacity: 0, rotate: -12 }}
                      animate={{ scale: 1, opacity: 1, rotate: -8 }}
                      className="absolute inset-0 grid place-items-center bg-abyss/45 font-display text-[64px] font-black text-crimson italic"
                      style={{ textShadow: '0 3px 0 #000, 0 0 20px rgb(255 61 88 / 0.8)' }}
                    >
                      KO
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className={`absolute bottom-1 flex items-baseline gap-1 ${mirrored ? 'left-2' : 'right-2'}`}>
                  <span className="font-display text-[15px] font-bold text-gold italic">HP</span>
                  <span className="num text-[38px] leading-none font-black italic" style={{ textShadow: '0 2px 0 #000, 0 0 12px rgb(0 0 0 / 0.9)' }}>
                    {hp}
                  </span>
                </span>
              </motion.button>
              <HpGauge hp={view.hp} max={view.max} delay={fx.delay} />
            </div>
          </div>
        ) : (
          <div className="relative z-[1] flex flex-1 items-center justify-center px-6 pb-4">
            <div className="slot-empty !h-full !w-full text-[44px]" style={{ width: '100%', height: '100%' }}>
              <span className="flex flex-col items-center gap-1">
                DIGIMON
                <span className="font-body text-[15px] font-medium text-haze not-italic">{emptyText}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
