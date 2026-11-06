/**
 * "2 Player Battle" (OPENSEG): two saves face each other on this screen, each with its active deck and
 * partners. The original uses two memory cards and two controllers; here both players share the screen
 * and the board says whose turn it is.
 */
import { useState } from 'react';
import type { GameState } from '../../engine/game/types';
import { m } from '../../i18n';
import { TERMS } from '../vocab/terms';
import { useSession } from '../../game/useSession';
import { storyStore, useStory } from '../../game/useStory';
import { BattleBoard } from '../play/PlayScreen';
import { EndBanner } from '../play/Overlays';
import { Button, Notice } from './common';

const act = () => storyStore.getState();

function DuelSetup() {
  const slots = useStory((s) => s.slots);
  const used = slots.flatMap((s, i) => (s ? [i] : []));
  const [pair, setPair] = useState<[number, number]>([used[0] ?? 0, used[1] ?? 1]);
  const [notice, setNotice] = useState<string | null>(null);
  const t = m().story;
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 py-4">
      <div>
        <h2 className="font-display text-5xl font-black ">{t.duel.title}</h2>
        <p className="mt-2 max-w-[62ch] text-faded">{t.duel.intro}</p>
      </div>
      <Notice text={notice} />
      <div className="flex flex-wrap items-end gap-3">
        {t.shared.players.map((label, side) => (
          <label key={side} className="flex flex-col gap-1 text-sm">
            <span className="text-faded">{label}</span>
            <select
              value={pair[side]}
              onChange={(e) => setPair((p) => (side === 0 ? [Number(e.target.value), p[1]] : [p[0], Number(e.target.value)]))}
              className="cut [--c:6px] border border-seam bg-leather px-3 py-2"
            >
              {used.map((i) => (
                <option key={i} value={i}>
                  {t.shared.slotOption('ABC'[i], slots[i]!.name, slots[i]!.partner)}
                </option>
              ))}
            </select>
          </label>
        ))}
        <Button primary onClick={() => setNotice(act().startDuel(pair[0], pair[1]))}>
          {t.shared.start}
        </Button>
        <Button onClick={() => act().toSlots()}>{t.shared.back}</Button>
      </div>
    </div>
  );
}

function DuelEnd({ game }: { game: GameState }) {
  const duel = useStory((s) => s.duel);
  const log = useSession((s) => s.log);
  const t = m().story;
  const names = useSession((s) => s.names) ?? t.shared.players;
  const winner = game.winner ?? 0;
  const recorded = duel?.winner !== null && duel?.winner !== undefined;
  return (
    <EndBanner tone="win" title={t.duel.winner(names[winner])} subtitle={t.duel.rounds(TERMS.rounds, names[0], game.players[0].rounds, names[1], game.players[1].rounds)}>
      {recorded ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-[18px] text-bone/85">{t.duel.wins2p(duel!.saves[0].name, duel!.saves[0].wins2p, duel!.saves[1].name, duel!.saves[1].wins2p)}</p>
          <Button primary onClick={() => act().closeDuel()}>
            {t.shared.finish}
          </Button>
        </div>
      ) : (
        <Button primary onClick={() => act().finishDuel(game, log.map((l) => l.event))}>
          {t.duel.saveResult}
        </Button>
      )}
    </EndBanner>
  );
}

export function DuelView() {
  const duel = useStory((s) => s.duel);
  const game = useSession((s) => s.game);
  if (!duel || !game) return <DuelSetup />;
  return <BattleBoard game={game} endScreen={(g) => <DuelEnd game={g} />} onLeave={() => confirm(m().story.duel.confirmLeave) && act().closeDuel()} />;
}
