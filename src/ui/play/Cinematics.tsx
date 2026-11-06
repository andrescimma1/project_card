/**
 * Digivolution cinematic over the board. Pure presentation: it replays what the engine already did.
 * (Battles replay on the board itself, see Playback.tsx.)
 *
 * Stages, each with its sound (docs/audio.md): start → energy charging (particles, light) → burst →
 * the new Digimon → its stats counting from the old values to the new ones.
 */
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { emitCues, type Cue } from '../../audio/bus';
import { useAudioSettings } from '../../audio/react';
import type { GameState } from '../../engine/game/types';
import type { Scene } from '../../game/scenes';
import { sessionStore, useSession } from '../../game/useSession';
import { frameColor } from '../theme';
import { Count } from './Arena';
import { CardFace } from './CardFace';
import { ACTIONS } from '../vocab/actions';
import { TERMS } from '../vocab/terms';
import { ActionDisc } from './glyphs';
import { cardAt, partnerCardOf, seatNames } from './util';

type Stage = 'start' | 'charge' | 'burst' | 'reveal' | 'stats';
const ORDER: Stage[] = ['start', 'charge', 'burst', 'reveal', 'stats'];

/** When each stage starts (ms) and when the cinematic ends. */
const TIMING = {
  full: { charge: 350, burst: 1900, reveal: 2250, stats: 2700, statGap: 150, end: 4700 },
  calm: { charge: 250, burst: 1100, reveal: 1300, stats: 1700, statGap: 150, end: 3300 },
};

/** Points the energy comes from (deterministic, spread around the card). */
const PARTICLES = Array.from({ length: 40 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const r = 230 + ((i * 53) % 90);
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, delay: (i % 10) * 0.13, size: 4 + (i % 3) * 2 };
});

interface Stats {
  hp: number;
  powers: [number, number, number];
}

function DigivolveScene({ game, prev, scene, onDone }: { game: GameState; prev: GameState | null; scene: Extract<Scene, { kind: 'digivolve' }>; onDone: () => void }) {
  const reduceMotion = useReducedMotion();
  const reduceFx = useAudioSettings().reduceIntense;
  const calm = !!reduceMotion || reduceFx;
  const twoPlayer = useSession((s) => s.twoPlayer);
  const names = seatNames(twoPlayer, useSession((s) => s.names));
  const to = cardAt(game, scene.player, scene.card);
  const from = scene.fromId !== undefined ? partnerCardOf(game, scene.player, scene.fromId) : scene.from === null ? null : cardAt(prev ?? game, scene.player, scene.from);
  const [stage, setStage] = useState<Stage>('start');
  const at = (s: Stage) => ORDER.indexOf(stage) >= ORDER.indexOf(s);

  const after: Stats = { hp: game.players[scene.player].hp, powers: game.players[scene.player].powers };
  const before: Stats = useMemo(() => {
    if (prev) return { hp: prev.players[scene.player].hp, powers: prev.players[scene.player].powers };
    if (from?.kind === 'digimon') return { hp: from.hp, powers: [from.attacks.circle.power, from.attacks.triangle.power, from.attacks.cross.power] };
    return { hp: 0, powers: [0, 0, 0] };
  }, [prev, from, scene.player]);
  const [statsShown, setStatsShown] = useState(0);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onDone();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onDone]);

  useEffect(() => {
    const T = calm ? TIMING.calm : TIMING.full;
    const cues: Cue[] = [
      { name: 'EVOLUTION_START', data: { player: scene.player } },
      { name: 'EVOLUTION_CHARGE', delay: T.charge },
      { name: 'EVOLUTION_BURST', delay: T.burst },
      { name: 'MONSTER_EVOLVED', data: { player: scene.player }, delay: T.reveal },
      ...[0, 1, 2, 3].map((index): Cue => ({ name: 'EVOLUTION_STATS', data: { index }, delay: T.stats + index * T.statGap })),
    ];
    const cancelCues = emitCues(cues);
    const timers = [
      setTimeout(() => setStage('charge'), T.charge),
      setTimeout(() => setStage('burst'), T.burst),
      setTimeout(() => setStage('reveal'), T.reveal),
      setTimeout(() => setStage('stats'), T.stats),
      ...[1, 2, 3, 4].map((n) => setTimeout(() => setStatsShown(n), T.stats + (n - 1) * T.statGap)),
      setTimeout(onDone, T.end),
    ];
    return () => {
      cancelCues();
      timers.forEach(clearTimeout);
    };
  }, [calm, onDone, scene.player]);

  const color = frameColor(to);
  const c = TERMS.creature.toLowerCase();
  const who = twoPlayer ? `La ${c} de ${names[scene.player]}` : scene.player === 0 ? `Tu ${c}` : `La ${c} de la CPU`;
  const charging = stage === 'charge';
  const showFrom = from && !at('burst');

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={scene.armor ? TERMS.eggEvolution : TERMS.evolution}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 overflow-hidden bg-night/90"
      style={{ backgroundImage: `radial-gradient(circle at 50% 42%, color-mix(in srgb, ${color} ${at('reveal') ? 42 : 22}%, transparent), transparent 48%)` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDone}
    >
      <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-[22px] font-bold text-faded ">
        {who}
      </motion.p>

      <div className="relative grid h-[440px] w-[440px] place-items-center">
        {/* light rays turning behind the card */}
        <motion.div
          aria-hidden
          className="absolute -inset-24 rounded-full"
          style={{ background: `repeating-conic-gradient(from 0deg, color-mix(in srgb, ${color} 55%, transparent) 0deg 6deg, transparent 6deg 24deg)`, maskImage: 'radial-gradient(circle, black 18%, transparent 68%)' }}
          animate={{ rotate: 360, opacity: stage === 'start' ? 0.15 : charging ? 0.7 : at('reveal') ? 0.45 : 0.9, scale: charging ? 1.08 : 1 }}
          transition={{ rotate: { duration: calm ? 30 : 9, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.6 }, scale: { duration: 1.4 } }}
        />
        {!calm && (
          <>
            <motion.div className="absolute inset-6 rounded-full" style={{ border: `2px dashed ${color}`, opacity: 0.55 }} animate={{ rotate: 360 }} transition={{ duration: charging ? 3 : 8, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="absolute inset-16 rounded-full" style={{ border: '1px solid rgb(232 191 93 / 0.45)' }} animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
          </>
        )}

        {/* energy gathering into the card */}
        {charging &&
          (calm ? PARTICLES.slice(0, 10) : PARTICLES).map((p, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={{ width: p.size, height: p.size, background: i % 3 ? color : '#ffe9b0', boxShadow: `0 0 8px ${i % 3 ? color : '#e8bf5d'}` }}
              initial={{ x: p.x, y: p.y, opacity: 0, scale: 1.4 }}
              animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0], scale: 0.3 }}
              transition={{ duration: 0.9, delay: p.delay, repeat: Infinity, repeatDelay: 0.25, ease: 'easeIn' }}
            />
          ))}

        <AnimatePresence mode="popLayout">
          {showFrom ? (
            <motion.div
              key="from"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={
                charging && !calm
                  ? { scale: 1.06, opacity: 1, x: [0, -2, 2, -3, 3, -4, 4, 0], filter: ['brightness(1)', 'brightness(1.6)', 'brightness(2.4)'] }
                  : { scale: 1, opacity: 1, x: 0, filter: charging ? 'brightness(1.5)' : 'brightness(1)' }
              }
              exit={calm ? { opacity: 0 } : { scale: 1.3, opacity: 0, filter: 'blur(8px) brightness(4)' }}
              transition={charging && !calm ? { duration: 1.5, x: { duration: 0.3, repeat: Infinity }, filter: { duration: 1.5 } } : { duration: 0.4 }}
            >
              <CardFace card={from} size="md" glow={charging} />
            </motion.div>
          ) : at('reveal') ? (
            <motion.div
              key="to"
              initial={calm ? { opacity: 0, scale: 1.2 } : { scale: 0.4, opacity: 0, filter: 'brightness(4)' }}
              animate={{ scale: 1.32, opacity: 1, filter: 'brightness(1)' }}
              transition={calm ? { duration: 0.4 } : { type: 'spring', stiffness: 170, damping: 13 }}
            >
              <CardFace card={to} size="md" glow />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* the burst */}
        {stage === 'burst' && (
          <>
            {!calm && (
              <motion.div
                aria-hidden
                className="fx-intense pointer-events-none fixed inset-0 z-10 bg-[#fff4dc]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.95, 0] }}
                transition={{ duration: 0.45, times: [0, 0.15, 1] }}
              />
            )}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              initial={{ opacity: 0.95, scale: 0.2 }}
              animate={{ opacity: 0, scale: calm ? 1.4 : 2.6 }}
              transition={{ duration: 0.6 }}
              style={{ background: `radial-gradient(circle, #fff4dc, ${color}, transparent 70%)` }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-10 rounded-full"
              style={{ border: `4px solid ${color}`, boxShadow: `0 0 30px ${color}` }}
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </>
        )}
      </div>

      <motion.h2
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: at('reveal') ? 1 : 0.35 }}
        className="max-w-[900px] text-center font-display text-[48px] leading-tight font-black "
        style={{ color: '#fff1c6', textShadow: '0 4px 0 #1a120c, 3px 0 0 #1a120c, -3px 0 0 #1a120c' } as CSSProperties}
      >
        {from ? `${from.name} ${scene.armor ? TERMS.eggEvolves : TERMS.evolves} a ${to.name}` : `${TERMS.evolves[0].toUpperCase()}${TERMS.evolves.slice(1)} a ${to.name}`}
      </motion.h2>

      {/* stats, from the old values to the new ones */}
      <div className="flex h-[64px] items-stretch gap-3" aria-label="Estadísticas nuevas">
        {to.kind === 'digimon' &&
          (['hp', ...ACTIONS] as const).map((k, i) => {
            const old = k === 'hp' ? before.hp : before.powers[i - 1];
            const now = k === 'hp' ? after.hp : after.powers[i - 1];
            const shown = statsShown > i;
            const diff = now - old;
            return (
              <motion.div
                key={k}
                className="frame side-player w-[150px]"
                style={{ '--c': '10px' } as CSSProperties}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: at('stats') ? 1 : 0, y: at('stats') ? 0 : 12, scale: shown ? [1, 1.08, 1] : 1 }}
                transition={{ delay: at('stats') ? i * 0.15 : 0, duration: 0.3 }}
              >
                <div className="fill flex items-center gap-2 px-3">
                  <span className="relative z-[1] flex w-[34px] justify-center">
                    {k === 'hp' ? <span className="font-display text-[18px] font-black text-gold">{TERMS.hp}</span> : <ActionDisc action={k} size={28} />}
                  </span>
                  <span className="num relative z-[1] flex-1 text-right text-[28px] leading-none font-black ">
                    <Count value={shown ? now : old} />
                  </span>
                  {shown && diff !== 0 && (
                    <motion.span
                      initial={{ opacity: 0, y: diff > 0 ? 8 : -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="num relative z-[1] text-[14px] font-bold"
                      style={{ color: diff > 0 ? 'var(--color-technique)' : 'var(--color-blood)' }}
                    >
                      {diff > 0 ? '▲' : '▼'}
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>

      <button type="button" data-sfx="cancel" onClick={onDone} className="cmd absolute top-6 right-6">
        <span>Saltar</span>
      </button>
    </motion.div>
  );
}

/** Plays the queued digivolution scenes (battle scenes play on the board). */
export function CinematicHost({ game }: { game: GameState }) {
  const scene = useSession((s) => s.scenes[0]);
  const seq = useSession((s) => s.sceneSeq);
  const done = useMemo(() => () => sessionStore.getState().popScene(), []);
  return (
    <AnimatePresence>
      {scene?.kind === 'digivolve' && <DigivolveScene key={seq} game={scene.state ?? game} prev={scene.prev ?? null} scene={scene} onDone={done} />}
    </AnimatePresence>
  );
}
