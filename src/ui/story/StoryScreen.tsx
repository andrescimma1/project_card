import { useEffect, useState } from 'react';
import { cards } from '../../engine/cards/db';
import { TERMS } from '../vocab/terms';
import { m } from '../../i18n';
import { keywordIndex } from '../../story/own/world';
import { percentages } from '../../engine/progression/ranks';
import { rankNames } from '../../game/titles';
import { progression } from '../../engine/progression/tables';
import { STARTER_DECK, type SaveData } from '../../engine/progression/save';
import { deckLabel } from '../../story/own/decks';
import type { StoryRequest } from '../../story/cityHost';
import { useSession } from '../../game/useSession';
import { storyStore, useStory } from '../../game/useStory';
import { CardFace } from '../play/CardFace';
import { BattleBoard } from '../play/PlayScreen';
import { EndBanner } from '../play/Overlays';
import type { GameState } from '../../engine/game/types';
import { Button, PartName } from './common';
import { PartnerGet, StoryMenu } from './StoryMenus';
import { FusionShop } from './FusionShop';
import { CompleteStats } from './CompleteStats';
import { cleanName } from '../../game/storyStore';
import { TradeView } from './TradeView';
import { DuelView } from './DuelView';
import { MapStage, TownStage } from './StoryStage';
import { AVATARS, avatarFace } from './visuals';

const act = () => storyStore.getState();
const permille = (v: number) => `${Math.floor(v / 10)}.${v % 10} %`;

function ErrorNote() {
  const error = useStory((s) => s.error);
  return error ? (
    <p role="alert" className="cut [--c:6px] border px-3 py-2 text-sm" style={{ borderColor: 'var(--color-conflict)' }}>
      {error}
    </p>
  ) : null;
}

/* ---------- slots and new game ---------- */

function SlotsView() {
  const slots = useStory((s) => s.slots);
  useEffect(() => act().refreshSlots(), []);
  const t = m().story;
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-4">
      <div>
        <h2 className="font-display text-5xl font-black ">{t.slots.title}</h2>
        <p className="mt-2 max-w-[62ch] text-faded">{t.slots.intro}</p>
      </div>
      <ErrorNote />
      <ol className="flex flex-col gap-3">
        {slots.map((s, i) => (
          <li key={i} className="flex flex-wrap items-center justify-between gap-3 cut [--c:16px] border border-seam bg-gradient-to-b from-hide/80 to-leather/80 p-4">
            <div>
              <p className="font-display text-xl font-bold ">{t.shared.slot('ABC'[i])}</p>
              <p className="text-sm text-faded">{s ? t.slots.summary(s.name, s.partner, s.tamer, s.winsCom, permille(Math.floor((s.storyPoints * 1000) / 166))) : t.slots.empty}</p>
            </div>
            <div className="flex gap-2">
              {s && (
                <Button primary onClick={() => act().continueGame(i)}>
                  {t.shared.continue}
                </Button>
              )}
              <Button onClick={() => act().chooseNewGame(i)}>{s ? t.slots.restart : t.slots.newGame}</Button>
              {s && <Button onClick={() => act().deleteSlot(i)}>{t.slots.delete}</Button>}
            </div>
          </li>
        ))}
      </ol>
      {slots.filter(Boolean).length >= 2 && (
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => act().openTrade()}>{t.slots.trade}</Button>
          <Button onClick={() => act().openDuel()}>{t.slots.duel}</Button>
          <span className="text-sm text-faded">{t.slots.betweenSlots}</span>
        </div>
      )}
    </div>
  );
}

/** Starter card ids, in the order of their decks (STARTER_DECK). */
const STARTERS = [175, 182, 190];

function NewGameView() {
  const slot = useStory((s) => s.slot);
  const t = m().story;
  // OPENSEG: User Registration (NAME ENTRY, 12 letters) comes before STARTER SELECT
  const [name, setName] = useState(() => t.newGame.defaultName);
  const [named, setNamed] = useState(false);
  const [avatar, setAvatar] = useState(0);
  const [error, setError] = useState<string | null>(null);
  if (!named)
    return (
      <form
        className="mx-auto flex max-w-xl flex-col gap-5 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!cleanName(name)) return setError(m().game.story.nameRequired);
          setError(null);
          setNamed(true);
        }}
      >
        <div>
          <h2 className="font-display text-5xl font-black ">{t.newGame.title}</h2>
          <p className="mt-2 text-faded">{t.newGame.intro}</p>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-faded">{t.newGame.nameLabel}</span>
          <input
            value={name}
            maxLength={12}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            className="cut [--c:6px] border border-seam bg-leather px-3 py-2 font-display text-xl"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm" style={{ color: 'var(--color-probable)' }}>
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button type="submit" data-primary className="cmd">
            <span>{t.newGame.nameOk}</span>
          </button>
          <Button onClick={() => act().toSlots()}>{t.shared.back}</Button>
        </div>
      </form>
    );
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-4">
      <div>
        <h2 className="font-display text-3xl font-black ">{t.newGame.faceTitle}</h2>
        <p className="mt-1 text-faded">{t.newGame.faceHint}</p>
      </div>
      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={t.newGame.faceTitle}>
        {Array.from({ length: AVATARS }, (_, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={avatar === i}
            onClick={() => setAvatar(i)}
            className="relative h-28 w-24 overflow-hidden rounded-md bg-hide transition-shadow"
            style={{ boxShadow: avatar === i ? '0 0 0 3px var(--color-gold)' : '0 0 0 2px var(--color-seam)' }}
          >
            <span aria-hidden="true" className="absolute inset-0 grid place-items-center font-display text-3xl font-extrabold text-bone/70">{name.slice(0, 1).toUpperCase()}</span>
            <span className="absolute inset-0 bg-cover bg-[center_30%]" style={{ backgroundImage: `url(${avatarFace(i).src})` }} />
          </button>
        ))}
      </div>
      <div>
        <h2 className="font-display text-3xl font-black ">{t.newGame.partnerTitle}</h2>
        <p className="mt-1 text-faded">{t.newGame.partnerIntro}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {STARTERS.map((id, i) => (
          <button
            key={id}
            type="button"
            onClick={() => void act().newGame(slot ?? 0, i as 0 | 1 | 2, name, avatar)}
            className="flex flex-col items-center gap-3 cut [--c:16px] border border-seam bg-gradient-to-b from-hide/80 to-leather/80 p-4 transition-colors hover:border-bone"
          >
            <CardFace card={cards[id]} size="md" />
            <span className="font-display text-xl font-bold ">{cards[id].name}</span>
            <span className="text-sm text-faded">{deckLabel(STARTER_DECK[i])}</span>
          </button>
        ))}
      </div>
      <Button onClick={() => setNamed(false)}>{t.shared.back}</Button>
    </div>
  );
}

/* ---------- player data and map ---------- */

function PlayerPanel({ save }: { save: SaveData }) {
  const t = rankNames(save.ranks);
  const p = percentages({ storyPoints: save.story.points, collection: save.collection, ownedParts: save.ownedParts });
  const s = m().story;
  return (
    <section className="flex flex-col gap-3 cut [--c:16px] border border-seam bg-gradient-to-b from-hide/80 to-leather/80 p-4" aria-label={s.player.label}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-bold ">{save.name}</h3>
        <span className="text-sm text-faded">{s.shared.record(save.winsCom, save.lossesCom)}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        <div><dt className="text-faded">{s.player.battleTitle}</dt><dd>{t.tamer}</dd></div>
        <div><dt className="text-faded">{s.player.collector}</dt><dd>{t.collector}</dd></div>
        <div><dt className="text-faded">{s.player.completion}</dt><dd>{permille(p.game)}</dd></div>
        <div><dt className="text-faded">{s.player.cards}</dt><dd>{permille(p.cards)}</dd></div>
        <div><dt className="text-faded">{TERMS.parts}</dt><dd>{permille(p.parts)}</dd></div>
      </dl>
      <ul className="flex flex-wrap gap-3">
        {save.partners.map((pt) => (
          <li key={pt.slot.id} className="flex items-center gap-2 cut [--c:10px] bg-leather px-3 py-2 text-sm">
            <strong>{cards[pt.slot.id].name}</strong>
            <span className="text-faded">{s.player.partnerLevel(pt.slot.level, pt.exp)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MapView() {
  const save = useStory((s) => s.save)!;
  const [saved, setSaved] = useState(false);
  const [menu, setMenu] = useState(false);
  const [details, setDetails] = useState(false);
  const t = m().story;
  if (menu)
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-5 py-4">
        <h2 className="font-display text-4xl font-black ">{t.map.decksAndPartners}</h2>
        <StoryMenu
          onClose={() => {
            setMenu(false);
            setSaved(false);
          }}
        />
      </div>
    );
  return (
    <div className="flex flex-col gap-3">
      <ErrorNote />
      <MapStage
        details={details ? (
          <div className="flex flex-col gap-2">
            <PlayerPanel save={save} />
            <div><Button onClick={() => setDetails(false)}>{t.shared.back}</Button></div>
          </div>
        ) : null}
        onDetails={() => setDetails((v) => !v)}
        toolbar={
          <>
            <Button onClick={() => setMenu(true)}>{t.map.decksAndPartners}</Button>
            <Button
              onClick={() => {
                act().saveNow();
                setSaved(true);
              }}
            >
              {saved ? t.shared.saved : t.shared.save}
            </Button>
            <Button onClick={() => act().toSlots()}>{t.shared.exit}</Button>
          </>
        }
      />
    </div>
  );
}

/* ---------- city ---------- */

function Reward({ req }: { req: Extract<StoryRequest, { kind: 'reward' }> }) {
  const t = m().story;
  return (
    <div className="flex flex-col gap-4 cut [--c:16px] border-2 bg-leather p-5" style={{ borderColor: 'var(--color-rare)' }}>
      {req.pack !== undefined && <p className="font-display text-2xl font-bold ">{t.city.gotPack(progression.packs[req.pack].name)}</p>}
      {req.part !== undefined && (
        <p className="font-display text-2xl font-bold ">
          {TERMS.part}: <PartName id={req.part} />
        </p>
      )}
      {req.cards.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {req.cards.map((id, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <CardFace card={cards[id]} size="sm" />
              <span className="text-xs text-faded">{req.results[i] === -2 || req.results[i] === -1 ? t.shared.fullSet : req.results[i] === 1 ? t.shared.newCard : t.shared.copies(req.results[i])}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Button primary onClick={() => act().reply({ kind: 'ack' })}>
          {t.shared.continue}
        </Button>
      </div>
    </div>
  );
}

function Keyword() {
  const [word, setWord] = useState('');
  const submit = () => {
    act().reply({ kind: 'choice', value: keywordIndex(word) });
  };
  const t = m().story;
  return (
    <form
      className="flex flex-wrap items-end gap-3 cut [--c:16px] border-2 border-seam bg-leather p-5"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-faded">{t.city.keyword}</span>
        <input value={word} onChange={(e) => setWord(e.target.value)} maxLength={12} className="cut [--c:6px] border border-seam bg-soot px-3 py-2 uppercase" autoFocus />
      </label>
      <Button primary onClick={submit}>
        {t.city.say}
      </Button>
      <Button onClick={() => act().reply({ kind: 'choice', value: -1 })}>{t.shared.cancel}</Button>
    </form>
  );
}

function PlayerDataScreen({ save, onDone }: { save: SaveData; onDone: () => void }) {
  // SAISEG 0x801E186C: with story flag v15 the ◯ button opens the Complete Stats (ENDSEG mode 2)
  const cleared = useStory((s) => (s.host?.vm.vars[15] ?? 0) !== 0);
  const [stats, setStats] = useState(false);
  const t = m().story;
  if (stats)
    return (
      <CompleteStats
        save={save}
        autoScroll={false}
        onClose={() => {
          act().closeStats();
          setStats(false);
        }}
      />
    );
  return (
    <div className="flex flex-col gap-3">
      <PlayerPanel save={save} />
      <div className="flex flex-wrap gap-2">
        <Button primary onClick={onDone}>
          {t.shared.back}
        </Button>
        {cleared && <Button onClick={() => setStats(true)}>{t.player.fullStats}</Button>}
      </div>
    </div>
  );
}

/** CMD11.19(0): the final ending. The game plays its ending video (not reproduced) and returns to the title. */
function Ending() {
  const [saved, setSaved] = useState(false);
  const t = m().story;
  return (
    <div className="flex flex-col items-center gap-5 cut [--c:24px] border-2 bg-leather px-6 py-12 text-center" style={{ borderColor: 'var(--color-rare)' }}>
      <h3 className="font-display text-5xl font-bold" style={{ color: 'var(--color-rare)' }}>
        {t.ending.title}
      </h3>
      <p className="max-w-[52ch] text-faded">{t.ending.text}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          onClick={() => {
            act().saveNow();
            setSaved(true);
          }}
        >
          {saved ? t.shared.saved : t.shared.save}
        </Button>
        <Button primary onClick={() => act().toSlots()}>
          {t.ending.backToSlots}
        </Button>
      </div>
    </div>
  );
}

function ScreenRequest({ req, save }: { req: Extract<StoryRequest, { kind: 'screen' }>; save: SaveData }) {
  const done = () => act().reply({ kind: 'ack' });
  if (req.screen === 'playerData') return <PlayerDataScreen save={save} onDone={done} />;
  if (req.screen === 'deckEdit') return <StoryMenu onClose={done} />;
  if (req.screen === 'fusion') return <FusionShop shop={req.arg} />;
  if (req.screen === 'ending') return req.arg === 0 ? <Ending /> : <CompleteStats save={save} autoScroll={req.arg === 1} onClose={() => act().closeStats()} />;
  return null;
}

function CityView() {
  const req = useStory((s) => s.request);
  const save = useStory((s) => s.save)!;
  if (!req) return null;
  if (req.kind === 'screen')
    return (
      <div className={`mx-auto flex ${req.screen !== 'playerData' ? 'max-w-6xl' : 'max-w-3xl'} flex-col gap-4 py-4`}>
        <ErrorNote />
        <ScreenRequest req={req} save={save} />
      </div>
    );
  const overlay =
    req.kind === 'reward' ? <Reward req={req} /> : req.kind === 'keyword' ? <Keyword /> : req.kind === 'partnerGet' ? <PartnerGet candidates={req.candidates} /> : undefined;
  return (
    <div className="flex flex-col gap-3">
      <ErrorNote />
      <TownStage req={req} overlay={overlay} />
    </div>
  );
}

/* ---------- battle and result ---------- */

function BattleEnd({ game }: { game: GameState }) {
  const won = game.winner === 0;
  const log = useSession((s) => s.log);
  const t = m().story;
  return (
    <EndBanner tone={won ? 'win' : 'lose'} title={won ? t.result.win : t.shared.defeat} subtitle={t.result.rounds(TERMS.rounds, game.players[0].rounds, game.players[1].rounds)}>
      <Button primary onClick={() => act().finishBattle(game, log.map((l) => l.event))}>
        {t.result.seeResults}
      </Button>
    </EndBanner>
  );
}

function BattleView() {
  const game = useSession((s) => s.game);
  return game ? <BattleBoard game={game} endScreen={(g) => <BattleEnd game={g} />} hideLeave /> : null;
}

function ResultView() {
  const result = useStory((s) => s.result);
  const save = useStory((s) => s.save)!;
  const won = useStory((s) => s.won);
  const t = m().story;
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 py-4">
      <h2 className="font-display text-5xl font-black ">{won ? t.shared.victory : t.shared.defeat}</h2>
      {!result && <p className="text-faded">{t.result.tutorialEnd}</p>}
      {result && (
        <>
          <section className="flex flex-col gap-2 cut [--c:16px] border border-seam bg-gradient-to-b from-hide/80 to-leather/80 p-4">
            <h3 className="font-display text-xl font-bold ">{t.result.experience}</h3>
            <ul className="flex flex-col gap-1 text-sm">
              {result.bonuses.granted.map((b) => (
                <li key={b.id} className="flex justify-between gap-3">
                  <span>{b.name}</span>
                  <span className="tabular-nums">+{b.exp}</span>
                </li>
              ))}
              <li className="flex justify-between gap-3 border-t border-seam pt-1 font-semibold">
                <span>{t.result.total}</span>
                <span className="tabular-nums">{result.bonuses.exp}</span>
              </li>
            </ul>
            <ul className="flex flex-col gap-1 text-sm">
              {save.partners.map((p, i) => (
                <li key={p.slot.id}>
                  {cards[p.slot.id].name}: {result.inDeck[i] ? t.result.exp(result.expGained[i]) : t.result.notInDeck}
                  {result.levelsGained[i] ? t.result.levelUp(p.slot.level) : ''}
                </li>
              ))}
              {result.learned.map((id) => (
                <li key={id}>
                  {t.result.learnsPart(TERMS.part)} <PartName id={id} />
                </li>
              ))}
            </ul>
          </section>
          {result.pack.length > 0 && (
            <section className="flex flex-col gap-3 cut [--c:16px] border-2 bg-leather p-4" style={{ borderColor: 'var(--color-rare)' }}>
              <h3 className="font-display text-xl font-bold ">{t.result.prizePack}</h3>
              <div className="flex flex-wrap gap-3">
                {result.pack.map((id, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <CardFace card={cards[id]} size="sm" />
                    <span className="text-xs text-faded">{result.packResults[i] < 0 ? t.shared.fullSet : result.packResults[i] === 1 ? t.shared.newCard : t.shared.copies(result.packResults[i])}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
      <Button primary onClick={() => act().closeResult()}>
        {t.shared.continue}
      </Button>
    </div>
  );
}

export function StoryScreen() {
  const view = useStory((s) => s.view);
  if (view === 'slots') return <SlotsView />;
  if (view === 'newGame') return <NewGameView />;
  if (view === 'map') return <MapView />;
  if (view === 'battle') return <BattleView />;
  if (view === 'result') return <ResultView />;
  if (view === 'trade') return <TradeView />;
  if (view === 'duel') return <DuelView />;
  return <CityView />;
}
