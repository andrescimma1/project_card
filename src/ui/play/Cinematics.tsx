/**
 * Cinematics: replay what the engine already resolved (digivolution, battle step by step).
 * Pure presentation — they read events, never change the game.
 */
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { DigimonCard } from '../../engine/cards/types';
import type { GameEvent, GameState, PlayerId } from '../../engine/game/types';
import { describeEvent } from '../../game/describe';
import type { Scene } from '../../game/scenes';
import { sessionStore, useSession } from '../../game/useSession';
import { CROSS_EFFECT_LABEL } from '../../engine/cards/db';
import { SLOT_GLYPH, SPECIALTY_COLOR, frameColor } from '../theme';
import { HpBar } from './Arena';
import { CardArt, CardFace } from './CardFace';
import { activeRef, cardAt, partnerCardOf } from './util';

const SPEED = ['None', 'Low', 'Mid', 'High'];

function useKeys(onNext: () => void, onSkip: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onNext, onSkip]);
}

function Shell({ children, label, onSkip }: { children: React.ReactNode; label: string; onSkip: () => void }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-y-auto bg-abyss/95 p-4 backdrop-blur"
      style={{ backgroundImage: 'radial-gradient(circle at 50% 40%, rgb(79 182 255 / 0.12), transparent 60%)' }}
    >
      {children}
      <button type="button" onClick={onSkip} className="absolute top-4 right-4 rounded-full border border-grid px-4 py-1.5 text-sm text-haze hover:text-ink">
        Saltar (Esc)
      </button>
    </motion.div>
  );
}

function DigivolveScene({ game, scene, onDone }: { game: GameState; scene: Extract<Scene, { kind: 'digivolve' }>; onDone: () => void }) {
  const reduce = useReducedMotion();
  const to = cardAt(game, scene.player, scene.card);
  const from = scene.fromId !== undefined ? partnerCardOf(game, scene.player, scene.fromId) : scene.from === null ? null : cardAt(game, scene.player, scene.from);
  const [stage, setStage] = useState<'from' | 'flash' | 'to'>(from && !reduce ? 'from' : 'to');
  useKeys(onDone, onDone);
  useEffect(() => {
    if (reduce) {
      const t = setTimeout(onDone, 1400);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setStage('flash'), 900);
    const t2 = setTimeout(() => setStage('to'), 1250);
    const t3 = setTimeout(onDone, 3000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone, reduce]);
  const color = frameColor(to);
  return (
    <Shell label={scene.armor ? 'Armor-digivolución' : 'Digivolución'} onSkip={onDone}>
      <p className="font-display text-sm tracking-wide text-haze">{scene.player === 0 ? 'Tu Digimon' : 'El Digimon de la CPU'}</p>
      <div className="relative grid h-[22rem] w-[16rem] place-items-center" onClick={onDone}>
        <AnimatePresence mode="popLayout">
          {stage !== 'to' && from ? (
            <motion.div
              key="from"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={stage === 'flash' ? { scale: 1.15, opacity: 0, filter: 'blur(6px) brightness(3)' } : { scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: stage === 'flash' ? 0.35 : 0.5 }}
            >
              <CardFace card={from} size="md" />
            </motion.div>
          ) : (
            <motion.div key="to" initial={{ scale: 0.5, opacity: 0, filter: 'brightness(4)' }} animate={{ scale: 1.25, opacity: 1, filter: 'brightness(1)' }} transition={{ type: 'spring', stiffness: 160, damping: 14 }}>
              <CardFace card={to} size="md" glow />
            </motion.div>
          )}
        </AnimatePresence>
        {stage === 'flash' && <motion.div className="pointer-events-none absolute inset-0 rounded-full" initial={{ opacity: 0.9, scale: 0.2 }} animate={{ opacity: 0, scale: 2.2 }} transition={{ duration: 0.6 }} style={{ background: `radial-gradient(circle, white, ${color}, transparent 70%)` }} />}
      </div>
      <motion.h2 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: stage === 'to' ? 1 : 0.4 }} className="text-center font-display text-3xl font-bold" style={{ color }}>
        {from ? `${from.name} ${scene.armor ? 'Armor-digievoluciona' : 'digievoluciona'} a ${to.name}` : `Digievoluciona a ${to.name}`}
      </motion.h2>
    </Shell>
  );
}

type Step = GameEvent;
const SHOWN = new Set(['reveal', 'effect', 'attackOrder', 'crash', 'hit', 'ko', 'roundWon', 'gameOver']);

function Fighter({ game, player, card, hp, max, attack, ko, lunge, hurt, dmg, heal }: {
  game: GameState; player: PlayerId; card: DigimonCard | null; hp: number; max: number; attack: string | null; ko: boolean; lunge: boolean; hurt: boolean; dmg: number | null; heal: number | null;
}) {
  const reduce = useReducedMotion();
  const color = card ? SPECIALTY_COLOR[game.players[player].specialty] : 'var(--color-grid)';
  const dir = player === 0 ? 1 : -1;
  return (
    <div className="relative flex w-[clamp(9rem,30vw,15rem)] flex-col items-center gap-2">
      <span className="font-display text-xs text-haze">{player === 0 ? 'Tú' : 'CPU'}</span>
      <motion.div
        animate={reduce ? {} : lunge ? { x: [0, 40 * dir, 0] } : hurt ? { x: [0, -8 * dir, 8 * dir, -4 * dir, 0] } : { x: 0 }}
        transition={{ duration: lunge ? 0.45 : 0.4 }}
        className={`relative w-full overflow-hidden rounded-2xl border-2 bg-panel ${ko ? 'grayscale' : ''}`}
        style={{ borderColor: color }}
      >
        {card && <CardArt card={card} className={`aspect-square w-full ${player === 1 ? '-scale-x-100' : ''}`} />}
        {attack && (
          <motion.span key={attack} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} className="absolute top-2 left-2 grid size-11 place-items-center rounded-full bg-abyss/85 font-display text-2xl">
            {attack}
          </motion.span>
        )}
        {ko && (
          <motion.span initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 grid place-items-center bg-abyss/50 font-display text-5xl font-bold" style={{ color: 'var(--color-fire)' }}>
            KO
          </motion.span>
        )}
        <AnimatePresence>
          {dmg !== null && (
            <motion.span key={`d${dmg}${hp}`} initial={{ y: 10, opacity: 0, scale: 0.6 }} animate={{ y: -30, opacity: 1, scale: 1.2 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-x-0 top-1/3 text-center font-display text-4xl font-bold text-white [text-shadow:0_2px_8px_#000]">
              −{dmg}
            </motion.span>
          )}
          {heal !== null && heal > 0 && (
            <motion.span key={`h${heal}${hp}`} initial={{ y: 10, opacity: 0 }} animate={{ y: -20, opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-1/4 text-center font-display text-3xl font-bold [text-shadow:0_2px_8px_#000]" style={{ color: 'var(--color-nature)' }}>
              +{heal}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <span className="w-full truncate text-center font-display text-sm font-semibold">{card?.name ?? '—'}</span>
      <div className="flex w-full items-center gap-2">
        <HpBar hp={hp} max={max} color={color} />
        <span className="font-display text-lg font-bold tabular-nums">{hp}</span>
      </div>
    </div>
  );
}

function BattleScene({ game, scene, onDone }: { game: GameState; scene: Extract<Scene, { kind: 'battle' }>; onDone: () => void }) {
  const steps = useMemo(() => scene.events.filter((e) => SHOWN.has(e.type)), [scene]);
  const [i, setI] = useState(0);
  const step: Step | undefined = steps[i];
  const finished = i >= steps.length - 1;
  const next = () => (finished ? onDone() : setI((x) => x + 1));
  useKeys(next, onDone);
  useEffect(() => {
    const t = setTimeout(next, finished ? 2600 : step?.type === 'hit' ? 1400 : 1150);
    return () => clearTimeout(t);
  });

  // Active Digimon of each side during this battle (from the hits; fallback: current board)
  const fighters = useMemo(() => {
    const refs: (number | null)[] = [activeRef(game, 0), activeRef(game, 1)];
    for (const e of scene.events) if (e.type === 'hit') {
      refs[e.attacker] = e.attackerCard;
      refs[e.defender] = e.defenderCard;
    }
    return refs.map((r, p) => (r === null || r < 0 ? null : (cardAt(game, p as PlayerId, r) as DigimonCard)));
  }, [game, scene]);

  const shown = steps.slice(0, i + 1);
  let hp: [number, number] = [0, 0];
  for (const e of shown) if ('hp' in e && Array.isArray(e.hp)) hp = e.hp as [number, number];
  const maxHp = [0, 1].map((p) => Math.max(fighters[p]?.hp ?? 1, ...scene.events.flatMap((e) => ('hp' in e && Array.isArray(e.hp) ? [e.hp[p]] : []))));
  let attacks: [string, string] | null = null;
  for (const e of shown) {
    if (e.type === 'reveal' || e.type === 'effect') attacks = [SLOT_GLYPH[e.attacks[0]], SLOT_GLYPH[e.attacks[1]]];
  }
  const ko = shown.filter((e) => e.type === 'ko' && !e.revived).map((e) => (e as Extract<GameEvent, { type: 'ko' }>).player);

  return (
    <Shell label="Batalla" onSkip={onDone}>
      <div className="flex w-full max-w-4xl items-center justify-center gap-[clamp(0.75rem,4vw,3rem)]" onClick={next}>
        {([0, 1] as PlayerId[]).map((p) => (
          <div key={p} className={p === 1 ? 'order-3' : 'order-1'}>
            <Fighter
              game={game}
              player={p}
              card={fighters[p]}
              hp={hp[p]}
              max={maxHp[p]}
              attack={attacks ? attacks[p] : null}
              ko={ko.includes(p)}
              lunge={step?.type === 'hit' && step.attacker === p}
              hurt={step?.type === 'hit' && step.defender === p}
              dmg={step?.type === 'hit' && step.defender === p ? step.damage : null}
              heal={step?.type === 'hit' && step.attacker === p ? step.eaten : null}
            />
          </div>
        ))}
        <div className="order-2 font-display text-2xl font-bold text-haze">VS</div>
      </div>

      <div className="flex min-h-[9rem] w-full max-w-xl flex-col items-center gap-3" aria-live="polite">
        <AnimatePresence mode="wait">
          {step && (
            <motion.div key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} className="flex flex-col items-center gap-2 text-center">
              {step.type === 'effect' && (() => {
                const c = cardAt(game, step.player, step.card);
                const text = step.source === 'cross' && c.kind === 'digimon' ? `✕ ${CROSS_EFFECT_LABEL[c.crossEffect]}` : c.kind !== 'digivolve' ? c.support.text : '';
                return (
                <div className="flex items-center gap-3">
                  <CardFace card={cardAt(game, step.player, step.card)} size="xs" />
                  <div className="flex flex-col items-start gap-1 text-left">
                    <span className="rounded-full border border-grid px-2 py-0.5 text-[11px] text-haze">Velocidad {SPEED[step.speed]}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold text-abyss"
                      style={{ background: step.voided ? 'var(--color-conflict)' : step.conditionsMet ? 'var(--color-verified)' : 'var(--color-unknown)' }}
                    >
                      {step.voided ? 'Anulado' : step.conditionsMet ? 'Se aplica' : 'Condición no cumplida'}
                    </span>
                    <span className="max-w-[34ch] text-sm text-haze">{text}</span>
                  </div>
                </div>
                );
              })()}
              <p className="max-w-[46ch] font-display text-xl font-semibold">{describeEvent(step, game)}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-3 text-sm text-haze">
          <span className="tabular-nums">
            {i + 1} / {steps.length}
          </span>
          <button type="button" onClick={next} className="rounded-full bg-ink px-4 py-1.5 font-semibold text-abyss hover:bg-white">
            {finished ? 'Continuar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </Shell>
  );
}

/** Plays the session's queued scenes one by one. */
export function CinematicHost({ game }: { game: GameState }) {
  const scene = useSession((s) => s.scenes[0]);
  const seq = useSession((s) => s.sceneSeq);
  const done = () => sessionStore.getState().popScene();
  return (
    <AnimatePresence>
      {scene?.kind === 'digivolve' && <DigivolveScene key={seq} game={game} scene={scene} onDone={done} />}
      {scene?.kind === 'battle' && <BattleScene key={seq} game={game} scene={scene} onDone={done} />}
    </AnimatePresence>
  );
}
