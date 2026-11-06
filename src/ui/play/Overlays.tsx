/**
 * Things that appear over the board: the phase announcement, the event log, a card's full text, the
 * support card of a battle step, and the end of the match.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { gameEvents } from '../../audio/bus';
import { usePanelCue } from '../../audio/react';
import type { Card } from '../../engine/cards/types';
import type { GameEvent, GameState } from '../../engine/game/types';
import { describeEvent } from '../../game/describe';
import { CPU } from '../../game/session';
import { sessionStore, useSession } from '../../game/useSession';
import { LEVEL_NAME } from '../theme';
import { CardFace } from './CardFace';
import { CUSTOM_ART } from '../art';
import { ACTIONS, slotOf } from '../vocab/actions';
import { factionOf } from '../vocab/factions';
import { cardText, crossEffectLabel, TERMS } from '../vocab/terms';
import { ActionDisc, FactionEmblem } from './glyphs';
import type { Playback } from './Playback';
import { cardAt } from './util';

const SPEED_NAME = ['ninguna', 'baja', 'media', 'alta'];

const GROUP: Record<string, string> = {
  turnStart: 'Preparación',
  mulligan: 'Preparación',
  entrance: 'Preparación',
  armorDigivolve: 'Preparación',
  dp: TERMS.evolution,
  digivolveOption: TERMS.evolution,
  digivolve: TERMS.evolution,
  attack: 'Batalla',
  support: 'Batalla',
};

/** "Prep Phase / Draw Cards": a short banner each time the turn enters a new phase. */
export function PhaseBanner({ game, paused, names, twoPlayer }: { game: GameState; paused: boolean; names: [string, string]; twoPlayer: boolean }) {
  const group = GROUP[game.phase.name];
  const key = group ? `${game.turnNumber}-${group}` : null;
  const last = useRef<string | null>(null);
  const [shown, setShown] = useState<{ key: string; title: string; sub: string } | null>(null);

  useEffect(() => {
    if (!key || paused || key === last.current) return;
    last.current = key;
    const first = twoPlayer ? names[game.turn] : game.turn === 0 ? 'Tú' : 'La CPU';
    const sub = group === 'Preparación' ? `Turno ${game.turnNumber} · ${first} ataca${game.turn === 0 && !twoPlayer ? 's' : ''} primero` : group === 'Batalla' ? 'Elige tu ataque' : `Carga ${TERMS.dp} y evoluciona`;
    setShown({ key, title: `Fase de ${group}`, sub });
    gameEvents.emit('PHASE_BANNER');
  }, [key, paused, group, game.turn, game.turnNumber, names, twoPlayer]);

  useEffect(() => {
    if (paused) setShown(null);
  }, [paused]);

  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setShown(null), 1600);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          key={shown.key}
          className="pointer-events-none absolute right-0 bottom-[96px] z-30 flex w-[760px] flex-col items-end pr-16"
          initial={{ x: 380, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          aria-hidden
        >
          <div
            className="absolute inset-y-1 right-6 left-16"
            style={{
              background: 'var(--grain), linear-gradient(180deg, #f3e6c4, #d9c393)',
              clipPath: 'polygon(0 0, 100% 0, calc(100% - 22px) 50%, 100% 100%, 0 100%, 22px 50%)',
              boxShadow: 'inset 0 -3px 0 #a97a32',
              filter: 'drop-shadow(0 8px 14px rgb(0 0 0 / 0.55))',
            }}
          />
          <span className="relative font-display text-[60px] leading-none font-black text-ink" style={{ textShadow: '0 1px 0 rgb(255 248 225 / 0.7)' }}>
            {shown.title}
          </span>
          <span className="relative pb-1 font-display text-[24px] font-bold text-[#7a4e24]">{shown.sub}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** The match log, folded away until asked for. */
export function LogDrawer({ open, onClose, game, names }: { open: boolean; onClose: () => void; game: GameState; names?: [string, string] }) {
  const log = useSession((s) => s.log);
  const report = useSession((s) => s.battleReport);
  const recent = log.filter((l) => l.event.type !== 'cardsDiscarded' && !(l.event.type === 'draw' && l.event.player === CPU && !names)).slice(-120).reverse();
  usePanelCue(open);
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className="frame side-player absolute top-[60px] right-4 bottom-[80px] z-30 w-[420px]"
          style={{ '--c': '16px', filter: 'drop-shadow(0 18px 30px rgb(0 0 0 / 0.6))' } as CSSProperties}
          initial={{ x: 460, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 460, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          aria-label="Registro de la partida"
        >
          <div className="fill flex flex-col">
            <div className="relative z-[1] flex items-center justify-between px-4 pt-3 pb-2">
              <h2 className="font-display text-[24px] font-black ">Registro</h2>
              <button type="button" data-sfx="none" onClick={onClose} className="cmd !py-1 !text-[14px]">
                <span>Cerrar</span>
              </button>
            </div>
            <div className="thin-scroll relative z-[1] min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              {report && (
                <section className="mb-3 rounded-md bg-gold/10 p-3 shadow-[inset_0_0_0_1px_rgb(232_191_93/0.45)]" aria-label="Última batalla">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="font-display text-[17px] font-bold text-gold ">Última batalla</h3>
                    <button type="button" onClick={() => sessionStore.getState().dismissReport()} className="text-[13px] text-faded underline underline-offset-4 hover:text-bone">
                      Ocultar
                    </button>
                  </div>
                  <ol className="flex list-decimal flex-col gap-1 pl-5 text-[14px]">
                    {report
                      .filter((e: GameEvent) => e.type !== 'cardsDiscarded')
                      .map((e: GameEvent, i: number) => (
                        <li key={i}>{describeEvent(e, game, names)}</li>
                      ))}
                  </ol>
                </section>
              )}
              <ul className="flex flex-col gap-1 text-[14px]">
                {recent.map((l) => (
                  <li key={l.id} className={l.event.type === 'turnStart' ? 'mt-2 font-display text-[16px] font-bold text-brass ' : 'text-bone/80'}>
                    {describeEvent(l.event, game, names)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/** A card's full text, like the original's info window. */
export function CardPopup({ card, onClose, onDetail }: { card: Card | null; onClose: () => void; onDetail: (c: Card) => void }) {
  useEffect(() => {
    if (!card) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [card, onClose]);
  usePanelCue(card !== null);
  return (
    <AnimatePresence>
      {card && (
        <motion.div
          className="absolute inset-0 z-40 grid place-items-center bg-night/70 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={card.name}
        >
          <motion.div
            className="frame side-player w-[900px]"
            style={{ '--c': '22px' } as CSSProperties}
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fill flex gap-7 p-7">
              <motion.div className="relative z-[1]" initial={{ rotateY: -25 }} animate={{ rotateY: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
                <CardFace card={card} size="lg" />
              </motion.div>
              <div className="relative z-[1] flex min-w-0 flex-1 flex-col gap-3">
                <span className="plate self-start text-[28px] font-black">
                  <span className="font-display">{card.name}</span>
                </span>
                {card.kind === 'digimon' ? (
                  <>
                    <p className="flex flex-wrap items-center gap-x-2 font-display text-[19px] font-semibold">
                      {(() => {
                        const f = factionOf(card)!;
                        return (
                          <span className="flex items-center gap-1.5" style={{ color: f.palette.light }} title={f.temperament}>
                            <FactionEmblem faction={f.id} className="size-[20px]" />
                            {TERMS.faction} {f.name}
                          </span>
                        );
                      })()}
                      <span>· {LEVEL_NAME[card.level]} ·</span>
                      <span className="text-gold">
                        {TERMS.hp} {card.hp}
                      </span>
                      {(card.level === 'C' || card.level === 'U') && (
                        <span>
                          · evoluciona con {card.dpRequired} {TERMS.dp}
                        </span>
                      )}
                      <span>
                        · da {card.dpGiven} {TERMS.dp}
                      </span>
                    </p>
                    {CUSTOM_ART[card.id] && (CUSTOM_ART[card.id]!.habitat || CUSTOM_ART[card.id]!.element) && (
                      <p className="text-[16px] text-faded">
                        {CUSTOM_ART[card.id]!.habitat && (
                          <>
                            {TERMS.habitat}: <span className="text-bone">{CUSTOM_ART[card.id]!.habitat}</span>
                          </>
                        )}
                        {CUSTOM_ART[card.id]!.habitat && CUSTOM_ART[card.id]!.element && ' · '}
                        {CUSTOM_ART[card.id]!.element && (
                          <>
                            {TERMS.element}: <span className="text-bone">{CUSTOM_ART[card.id]!.element}</span>
                          </>
                        )}
                      </p>
                    )}
                    <div className="flex flex-col gap-1.5">
                      {ACTIONS.map((a) => (
                        <div key={a} data-action={a} className="atk-row h-[42px] px-2">
                          <ActionDisc action={a} size={30} />
                          <span className="w-[90px] shrink-0 font-display text-[16px] font-bold" style={{ color: 'color-mix(in srgb, var(--a) 45%, #f6e7c6)' }}>
                            {TERMS.actions[a]}
                          </span>
                          <span className="flex-1 font-display text-[19px] font-bold">{card.attacks[slotOf(a)].name}</span>
                          <span className="num text-[30px] font-black">{card.attacks[slotOf(a)].power}</span>
                        </div>
                      ))}
                    </div>
                    <p className="font-display text-[18px] font-semibold">
                      {TERMS.instinctEffect}: <span className="text-[#a9c6dc]">{crossEffectLabel(card.crossEffect)}</span>
                    </p>
                    <SupportText title={TERMS.supportEffect} text={card.support.text} speed={card.supportSpeed} />
                  </>
                ) : card.kind === 'option' ? (
                  <SupportText title={TERMS.supportCard} text={card.support.text} speed={card.supportSpeed} />
                ) : (
                  <SupportText title={TERMS.evolutionCard} text={card.text} />
                )}
                <span className="flex-1" />
                <div className="flex gap-3">
                  <button type="button" data-sfx="none" onClick={onClose} data-primary className="cmd">
                    <span>Cerrar</span>
                  </button>
                  <button type="button" onClick={() => onDetail(card)} className="cmd">
                    <span>Ficha técnica</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SupportText({ title, text, speed }: { title: string; text: string; speed?: number }) {
  return (
    <div className="rounded-md p-3 text-ink" style={{ background: 'var(--grain), linear-gradient(180deg, #f2e4c2, #dfcb9e)', boxShadow: 'inset 0 0 0 1px #6f5638' }}>
      <p className="mb-1 flex items-baseline justify-between font-display text-[17px] font-bold text-[#7a4e24]">
        {title}
        {speed !== undefined && <span className="text-[15px] text-[#6a4c2e]">Velocidad {SPEED_NAME[speed]}</span>}
      </p>
      <p className="text-[17px] leading-snug">{cardText(text)}</p>
    </div>
  );
}

/** The support or Instinto effect of the battle step, shown between the two creatures. */
export function EffectCard({ playback }: { playback: Playback | null }) {
  const e = playback?.effect ?? null;
  return (
    <AnimatePresence>
      {e && playback && (
        <motion.div
          key={`${playback.index}`}
          className="pointer-events-none absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-4"
          initial={{ opacity: 0, scale: 0.7, x: e.player === 0 ? -160 : 160 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        >
          {(() => {
            const c = cardAt(playback.board, e.player, e.card);
            const text = e.source === 'cross' && c.kind === 'digimon' ? `${TERMS.actions.instinct}: ${crossEffectLabel(c.crossEffect)}` : c.kind !== 'digivolve' ? cardText(c.support.text) : '';
            return (
              <div className="frame side-player" style={{ '--c': '18px', filter: 'drop-shadow(0 20px 30px rgb(0 0 0 / 0.7))' } as CSSProperties}>
                <div className="fill flex items-center gap-5 p-4">
                  <div className="relative z-[1]">
                    <CardFace card={c} size="md" glow />
                  </div>
                  <div className="relative z-[1] flex w-[300px] flex-col gap-2">
                    <span className="font-display text-[15px] font-bold text-faded ">
                      {e.source === 'cross' ? TERMS.instinctEffect : e.source === 'option' ? TERMS.supportCard : TERMS.supportEffect} · velocidad {SPEED_NAME[e.speed]}
                    </span>
                    <p className="text-[17px] leading-snug">{cardText(text)}</p>
                    {/* the outcome lands with its sound (battleStepCues: 700 ms) */}
                    <motion.span
                      className="self-start px-2.5 py-0.5 font-display text-[16px] font-extrabold text-soot "
                      style={{ background: e.voided ? '#d9826f' : e.conditionsMet ? '#b9d27a' : '#c9bca2', boxShadow: '0 0 0 1px #2b1d12' }}
                      initial={{ scale: 1.8, opacity: 0, rotate: -6 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.7, type: 'spring', stiffness: 420, damping: 18 }}
                    >
                      {e.voided ? 'Anulado' : e.conditionsMet ? 'Se aplica' : 'Condición no cumplida'}
                    </motion.span>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Victory / defeat. The story and the 2P battle pass their own text and buttons. */
export function EndBanner({ title, subtitle, tone, children }: { title: string; subtitle?: React.ReactNode; tone: 'win' | 'lose'; children: React.ReactNode }) {
  const win = tone === 'win';
  useEffect(() => gameEvents.emit(win ? 'BATTLE_WON' : 'BATTLE_LOST'), [win]);
  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-night/75 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        className="relative flex w-full flex-col items-center py-8"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        style={{
          background: win
            ? 'var(--grain), linear-gradient(90deg, transparent, rgb(201 151 74 / 0.5) 22%, rgb(232 191 93 / 0.6) 50%, rgb(201 151 74 / 0.5) 78%, transparent)'
            : 'var(--grain), linear-gradient(90deg, transparent, rgb(60 54 50 / 0.75) 22%, rgb(80 72 66 / 0.85) 50%, rgb(60 54 50 / 0.75) 78%, transparent)',
        }}
      >
        <motion.h2
          initial={{ scale: 2.2, opacity: 0, letterSpacing: '0.3em' }}
          animate={{ scale: 1, opacity: 1, letterSpacing: '0.02em' }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 160, damping: 16 }}
          className="font-display text-[110px] leading-none font-black "
          style={{ color: win ? '#fff1c6' : '#e2d6be', textShadow: win ? '0 5px 0 #5e3f1c, 3px 0 0 #2b1d12, -3px 0 0 #2b1d12' : '0 5px 0 #1a120c, 3px 0 0 #1a120c, -3px 0 0 #1a120c' }}
        >
          {title}
        </motion.h2>
        {subtitle && <p className="mt-3 font-display text-[24px] font-semibold text-bone/90">{subtitle}</p>}
      </motion.div>
      <motion.div className="flex gap-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
