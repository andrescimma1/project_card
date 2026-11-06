/**
 * Sound settings, opened from the top bar: volumes, mute, interface sounds and the "reduce intense
 * effects" switch. Saved in this browser by the AudioManager.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { emitCues, gameEvents } from '../audio/bus';
import { audio } from '../audio/manager';
import { useAudioSettings, usePanelCue } from '../audio/react';
import type { AudioSettings } from '../audio/settings';
import { m } from '../i18n';

function SpeakerIcon({ muted, level }: { muted: boolean; level: number }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      {muted ? (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      ) : (
        <>
          {level > 0 && <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />}
          {level > 0.5 && <path d="M18.2 6.6a7.6 7.6 0 0 1 0 10.8" />}
        </>
      )}
    </svg>
  );
}

function Volume({ label, value, onChange, onRelease }: { label: string; value: number; onChange: (v: number) => void; onRelease?: () => void }) {
  const pct = Math.round(value * 100);
  return (
    <label className="relative z-[1] flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between font-display text-[17px] font-bold ">
        {label}
        <span className="num text-[16px] text-brass not-italic">{pct}%</span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        onPointerUp={onRelease}
        onKeyUp={onRelease}
        aria-label={m().audio.volume(label)}
        className="vol"
        style={{ '--v': `${pct}%` } as CSSProperties}
      />
    </label>
  );
}

function Switch({ label, hint, on, onToggle }: { label: string; hint?: string; on: boolean; onToggle: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onToggle} data-sfx="nav" className="relative z-[1] flex items-center gap-3 text-left">
      <span className="switch" data-on={on || undefined} aria-hidden>
        <span />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-display text-[16px] font-bold ">{label}</span>
        {hint && <span className="text-[13px] leading-snug text-faded">{hint}</span>}
      </span>
    </button>
  );
}

export function AudioButton() {
  const s = useAudioSettings();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  usePanelCue(open);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', away, true);
    window.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', away, true);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  const set = (patch: Partial<AudioSettings>) => audio.update(patch);
  const A = m().audio;
  const preview = () => emitCues([{ name: 'ATTACK_RESOLVED', data: { action: 'fury' } }, { name: 'HIT_TAKEN', data: { action: 'fury' }, delay: 220 }]);

  return (
    <div ref={root} className="relative flex h-full shrink-0 items-center">
      <button
        type="button"
        data-sfx="none"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={s.muted ? A.buttonMuted : A.button}
        className={`flex items-center gap-2 px-2 font-display text-[15px] font-semibold transition-colors ${open ? 'text-bone' : 'text-faded/80 hover:text-bone'}`}
      >
        <SpeakerIcon muted={s.muted || s.master === 0} level={s.master} />
        <span className="hidden lg:inline">{A.button}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="frame side-player absolute top-[calc(100%+6px)] right-0 z-50 w-[340px]"
            style={{ '--c': '16px', filter: 'drop-shadow(0 18px 30px rgb(0 0 0 / 0.6))' } as CSSProperties}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            role="dialog"
            aria-label={A.dialog}
          >
            <div className="fill flex flex-col gap-4 p-5">
              <h2 className="relative z-[1] font-display text-[24px] leading-none font-black">{A.title}</h2>
              <Volume label={A.master} value={s.master} onChange={(v) => set({ master: v })} onRelease={() => gameEvents.emit('UI_CONFIRM')} />
              <Volume label={A.music} value={s.music} onChange={(v) => set({ music: v })} />
              <Volume label={A.sfx} value={s.sfx} onChange={(v) => set({ sfx: v })} onRelease={preview} />
              <div className="relative z-[1] h-px bg-brass/20" />
              <Switch label={A.muteAll} on={s.muted} onToggle={() => set({ muted: !s.muted })} />
              <Switch label={A.uiSounds} hint={A.uiSoundsHint} on={s.uiSounds} onToggle={() => set({ uiSounds: !s.uiSounds })} />
              <Switch
                label={A.reduce}
                hint={A.reduceHint}
                on={s.reduceIntense}
                onToggle={() => set({ reduceIntense: !s.reduceIntense })}
              />
              <p className="relative z-[1] text-[13px] leading-snug text-faded">{A.footnote}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
