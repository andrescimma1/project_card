/**
 * "2 Player Battle" (OPENSEG): two saves face each other on this screen, each with its active deck and
 * partners. The original uses two memory cards and two controllers; here both players share the screen
 * and the board says whose turn it is.
 */
import { useState } from 'react';
import type { GameState } from '../../engine/game/types';
import { useSession } from '../../game/useSession';
import { storyStore, useStory } from '../../game/useStory';
import { BattleBoard } from '../play/PlayScreen';
import { Button, Notice } from './common';

const act = () => storyStore.getState();

function DuelSetup() {
  const slots = useStory((s) => s.slots);
  const used = slots.flatMap((s, i) => (s ? [i] : []));
  const [pair, setPair] = useState<[number, number]>([used[0] ?? 0, used[1] ?? 1]);
  const [notice, setNotice] = useState<string | null>(null);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 py-4">
      <div>
        <h2 className="font-display text-4xl font-bold">Batalla 2P</h2>
        <p className="mt-2 max-w-[62ch] text-haze">
          Dos de tus partidas se enfrentan en esta pantalla, cada una con su mazo activo y sus compañeros. No da EXP ni sobres: cuenta para las victorias 2P,
          el título 2P y los récords de cada mazo y carta.
        </p>
      </div>
      <Notice text={notice} />
      <div className="flex flex-wrap items-end gap-3">
        {(['Jugador 1', 'Jugador 2'] as const).map((label, side) => (
          <label key={label} className="flex flex-col gap-1 text-sm">
            <span className="text-haze">{label}</span>
            <select
              value={pair[side]}
              onChange={(e) => setPair((p) => (side === 0 ? [Number(e.target.value), p[1]] : [p[0], Number(e.target.value)]))}
              className="rounded-lg border border-grid bg-deep px-3 py-2"
            >
              {used.map((i) => (
                <option key={i} value={i}>
                  Partida {'ABC'[i]}: {slots[i]!.name} con {slots[i]!.partner}
                </option>
              ))}
            </select>
          </label>
        ))}
        <Button primary onClick={() => setNotice(act().startDuel(pair[0], pair[1]))}>
          Empezar
        </Button>
        <Button onClick={() => act().toSlots()}>Volver</Button>
      </div>
    </div>
  );
}

function DuelEnd({ game }: { game: GameState }) {
  const duel = useStory((s) => s.duel);
  const log = useSession((s) => s.log);
  const names = useSession((s) => s.names) ?? ['Jugador 1', 'Jugador 2'];
  const winner = game.winner ?? 0;
  const recorded = duel?.winner !== null && duel?.winner !== undefined;
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-abyss/85 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label="Fin de la batalla 2P">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border-2 bg-panel p-8 text-center" style={{ borderColor: 'var(--color-rare)' }}>
        <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--color-rare)' }}>
          Gana {names[winner]}
        </h2>
        <p className="text-haze">
          Rondas: {names[0]} {game.players[0].rounds}, {names[1]} {game.players[1].rounds}.
        </p>
        {recorded ? (
          <>
            <p className="text-sm text-haze">
              Victorias 2P: {duel!.saves[0].name} {duel!.saves[0].wins2p}, {duel!.saves[1].name} {duel!.saves[1].wins2p}. Guardado en las dos partidas.
            </p>
            <Button primary onClick={() => act().closeDuel()}>
              Terminar
            </Button>
          </>
        ) : (
          <Button primary onClick={() => act().finishDuel(game, log.map((l) => l.event))}>
            Guardar el resultado
          </Button>
        )}
      </div>
    </div>
  );
}

export function DuelView() {
  const duel = useStory((s) => s.duel);
  const game = useSession((s) => s.game);
  if (!duel || !game) return <DuelSetup />;
  return <BattleBoard game={game} endScreen={(g) => <DuelEnd game={g} />} onLeave={() => confirm('¿Abandonar la batalla? No se guarda nada.') && act().closeDuel()} />;
}
