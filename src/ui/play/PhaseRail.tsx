import type { GameState } from '../../engine/game/types';

/** The real sequence of a turn in the original game (state machine SLUS 0x80034260). */
const STEPS = [
  { id: 'prep', label: 'Preparación', phases: ['turnStart', 'mulligan', 'entrance', 'armorDigivolve'] },
  { id: 'dp', label: 'DP', phases: ['dp'] },
  { id: 'option', label: 'Digivolve Option', phases: ['digivolveOption'] },
  { id: 'digivolve', label: 'Digivolución', phases: ['digivolve'] },
  { id: 'battle', label: 'Batalla', phases: ['attack', 'support'] },
];

export function PhaseRail({ game }: { game: GameState }) {
  const current = STEPS.findIndex((s) => s.phases.includes(game.phase.name));
  return (
    <ol className="flex flex-wrap items-center gap-1 text-xs" aria-label="Fases del turno">
      {STEPS.map((s, i) => (
        <li key={s.id} className="flex items-center gap-1">
          <span
            aria-current={i === current ? 'step' : undefined}
            className={`rounded-full px-2.5 py-1 font-display ${i === current ? 'bg-ink font-semibold text-abyss' : i < current ? 'text-ink' : 'text-haze'}`}
          >
            {s.label}
          </span>
          {i < STEPS.length - 1 && <span className="h-px w-3 bg-grid" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}
