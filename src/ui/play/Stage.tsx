/**
 * The board is laid out at a fixed height of 900 units, like a game screen, and scaled to fit the space it
 * gets: nothing on it ever scrolls. The width adapts between 4:3-ish and ultrawide so the board fills 16:9
 * and wider screens instead of leaving bars.
 */
import { useLayoutEffect, useRef, useState } from 'react';

export const STAGE_H = 900;
const MIN_W = 1440;
const MAX_W = 1920;

export function GameStage({ children }: { children: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 1600, s: 1, portrait: false });

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const fit = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      if (!W || !H) return;
      const s = Math.min(H / STAGE_H, W / MIN_W);
      setBox({ w: Math.min(W / s, MAX_W), s, portrait: H > W * 1.15 });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={host} className="board-bg absolute inset-0 z-10 overflow-hidden">
      <div className="circuit pointer-events-none absolute inset-0 opacity-80" aria-hidden />
      <div
        className="absolute top-1/2 left-1/2"
        style={{ width: box.w, height: STAGE_H, transform: `translate(-50%, -50%) scale(${box.s})` }}
      >
        {children}
      </div>
      {box.portrait && (
        <p className="absolute inset-x-4 top-4 z-20 flex items-center justify-center gap-3 bg-abyss/90 px-4 py-3 text-center font-display text-[17px] font-bold italic shadow-[inset_0_0_0_1px_var(--color-cyan)]">
          <span aria-hidden className="text-[22px] text-cyan">⟳</span>
          Gira el dispositivo: el tablero está pensado en horizontal.
        </p>
      )}
    </div>
  );
}
