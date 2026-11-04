import { cards, CROSS_EFFECT_LABEL } from '../../engine/cards/db';
import type { DigimonCard } from '../../engine/cards/types';
import { playerDp } from '../../engine/game/digivolve';
import { legalActions } from '../../engine/game/turn';
import type { Action, GameState, PlayerId } from '../../engine/game/types';
import { count } from '../../engine/game/zones';
import { SLOT_GLYPH } from '../theme';
import { activeRef, cardAt } from './util';
import { useEffect } from 'react';
import { useSession } from '../../game/useSession';

const PHASE_TITLE: Record<string, string> = {
  mulligan: 'Preparación: revisa tu mano',
  entrance: 'Preparación: elige tu Digimon',
  armorDigivolve: 'Preparación: ¿Armor-digievolucionar?',
  dp: 'Digivolución: cargar DP',
  digivolveOption: 'Digivolución: Digivolve Option',
  digivolve: 'Digivolución: digievolucionar',
  attack: 'Batalla: elige tu ataque',
  support: 'Batalla: elige tu soporte',
  gameOver: 'Partida terminada',
};

const HINT: Record<string, string> = {
  mulligan: 'Puedes quedarte con estas cartas o descartar la mano entera y robar 4 nuevas.',
  entrance: 'Toca una carta Digimon de tu mano. Si entra un C su HP y ataques quedan a la mitad; un U, a un cuarto.',
  armorDigivolve: 'Tu compañero tiene un Digi-Egg equipado: puede convertirse ahora en su forma Armor, con su HP y sus ataques.',
  dp: 'Puedes poner UNA carta Digimon de tu mano en el DP Slot. Suma su +P.',
  digivolveOption: 'Puedes jugar una Digivolve Option antes de digievolucionar.',
  digivolve: 'Las cartas resaltadas son digievoluciones válidas. Al digievolucionar, todo el DP Slot va al descarte.',
  support: 'Toca una carta de tu mano, apuesta con la carta de arriba de tu mazo, o no uses soporte.',
};

function Button({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${primary ? 'bg-ink text-abyss hover:bg-white' : 'border border-grid hover:bg-deep'}`}
    >
      {children}
    </button>
  );
}

export interface Seats {
  /** The player the board is asking now (always player 1 against the CPU). */
  me: PlayerId;
  names: [string, string];
  twoPlayer: boolean;
}

export function PhasePanel({ game, act, seats }: { game: GameState; act: (a: Action) => void; seats: Seats }) {
  const { me: who, names, twoPlayer } = seats;
  const them: PlayerId = who === 0 ? 1 : 0;
  const actions = legalActions(game, who);
  const ph = game.phase;
  const find = (t: Action['type']) => actions.find((a) => a.type === t);
  const waitingCpu = actions.length === 0 && ph.name !== 'gameOver';
  const me = game.players[who];
  const rival = game.players[them];
  const rivalName = twoPlayer ? names[them] : 'La CPU';

  return (
    <section aria-live="polite" className="flex flex-col gap-3 rounded-2xl border border-grid bg-panel/80 p-4">
      {twoPlayer && ph.name !== 'gameOver' && (
        <p className="font-display text-sm font-semibold" style={{ color: who === 0 ? 'var(--color-ice)' : 'var(--color-fire)' }}>
          Le toca a {names[who]}
        </p>
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-semibold">{waitingCpu ? 'Turno de la CPU' : (PHASE_TITLE[ph.name] ?? ph.name)}</h2>
        <span className="text-xs text-haze">
          Turno {game.turnNumber}, {twoPlayer ? `${names[game.turn]} ataca primero` : game.turn === who ? 'atacas primero' : 'la CPU ataca primero'}
        </span>
      </div>
      {!waitingCpu && HINT[ph.name] && <p className="text-sm text-haze">{HINT[ph.name]}</p>}

      {ph.name === 'mulligan' && !waitingCpu && (
        <div className="flex flex-wrap gap-2">
          <Button primary onClick={() => act(find('keepHand')!)}>
            Quedarme con esta mano
          </Button>
          {find('changeHand') && <Button onClick={() => act(find('changeHand')!)}>Cambiar toda la mano</Button>}
        </div>
      )}
      {ph.name === 'armorDigivolve' && !waitingCpu && <ArmorChoice game={game} who={who} act={act} find={find} />}
      {ph.name === 'dp' && !waitingCpu && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm">DP actuales: <strong className="font-display">{playerDp(me)}</strong></span>
          <Button onClick={() => act(find('skipDp')!)}>No cargar DP</Button>
        </div>
      )}
      {ph.name === 'digivolveOption' && !waitingCpu && <Button onClick={() => act(find('skipDigivolveOption')!)}>No usar Digivolve Option</Button>}
      {ph.name === 'digivolve' && !waitingCpu && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm">
            DP actuales: <strong className="font-display">{playerDp(me)}</strong>
            {actions.some((a) => a.type === 'digivolve') ? '' : '. Ahora no hay digievoluciones posibles.'}
          </span>
          <Button primary={!actions.some((a) => a.type === 'digivolve')} onClick={() => act(find('skipDigivolve')!)}>
            {actions.some((a) => a.type === 'digivolve') ? 'No digievolucionar' : 'Ir a la batalla'}
          </Button>
        </div>
      )}
      {ph.name === 'attack' && !waitingCpu && <AttackPicker game={game} who={who} rivalName={rivalName} actions={actions} act={act} />}
      {ph.name === 'support' && ph.chooser === who && (
        <>
          {rival.support && (
            <p className="rounded-lg bg-deep px-3 py-2 text-sm">
              {rivalName} eligió primero:{' '}
              <strong>
                {rival.support.kind === 'none' ? 'sin soporte' : rival.support.kind === 'gamble' ? 'la carta de arriba de su mazo (boca abajo)' : cardAt(game, them, rival.support.card).name}
              </strong>
              .
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {actions.some((a) => a.type === 'chooseSupport' && a.choice.from === 'gamble') && (
              <Button onClick={() => act({ type: 'chooseSupport', player: who, choice: { from: 'gamble' } })}>Apostar: carta del mazo ({count(me.online)})</Button>
            )}
            <Button onClick={() => act({ type: 'chooseSupport', player: who, choice: { from: 'none' } })}>Sin soporte</Button>
          </div>
        </>
      )}
      {waitingCpu && <p className="text-sm text-haze">La CPU está jugando…</p>}
    </section>
  );
}

function ArmorChoice({ game, who, act, find }: { game: GameState; who: PlayerId; act: (a: Action) => void; find: (t: Action['type']) => Action | undefined }) {
  const ref = activeRef(game, who);
  if (ref === null) return null;
  const me = game.players[who];
  const slot = me.partners[me.partnerOf[ref] ?? -1];
  const partner = cardAt(game, who, ref);
  const armor = slot?.armorId != null ? cards[slot.armorId] : null;
  return (
    <div className="flex flex-wrap gap-2">
      <Button primary onClick={() => act(find('armorDigivolve')!)}>
        Armor-digievolucionar{armor ? ` a ${armor.name}` : ''}
      </Button>
      <Button onClick={() => act(find('skipArmorDigivolve')!)}>Seguir con {partner.name}</Button>
    </div>
  );
}

function AttackPicker({ game, who, rivalName, actions, act }: { game: GameState; who: PlayerId; rivalName: string; actions: Action[]; act: (a: Action) => void }) {
  const me = game.players[who];
  const ref = activeRef(game, who);
  const rivalChose = game.players[who === 0 ? 1 : 0].attack !== null;
  const cinematic = useSession((s) => s.scenes.length > 0);
  useEffect(() => {
    if (cinematic) return;
    const keys: Record<string, 'circle' | 'triangle' | 'cross'> = { '1': 'circle', '2': 'triangle', '3': 'cross' };
    const h = (e: KeyboardEvent) => {
      const slot = keys[e.key];
      const a = slot && actions.find((x) => x.type === 'chooseAttack' && x.slot === slot);
      if (a) act(a);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [actions, act, cinematic]);
  if (ref === null) return null;
  const card = cardAt(game, who, ref) as DigimonCard;
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        {(['circle', 'triangle', 'cross'] as const).map((slot, i) => {
          const a = actions.find((x) => x.type === 'chooseAttack' && x.slot === slot);
          return (
            <button
              key={slot}
              type="button"
              disabled={!a}
              onClick={() => a && act(a)}
              className="flex flex-col items-center gap-1 rounded-xl border-2 border-grid bg-deep px-2 py-3 transition-colors hover:border-ink disabled:opacity-40"
            >
              <span className="font-display text-3xl leading-none">{SLOT_GLYPH[slot]}</span>
              <span className="text-[10px] text-haze">tecla {i + 1}</span>
              <span className="font-display text-xl font-bold tabular-nums">{me.powers[i]}</span>
              <span className="w-full truncate text-center text-[11px] text-haze">{card.attacks[slot].name}</span>
              {slot === 'cross' && card.crossEffect !== 'none' && <span className="text-[11px]">{CROSS_EFFECT_LABEL[card.crossEffect]}</span>}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-haze">{rivalChose ? `${rivalName} ya eligió su ataque (oculto hasta después de los soportes).` : `${rivalName} todavía no eligió.`}</p>
    </div>
  );
}
