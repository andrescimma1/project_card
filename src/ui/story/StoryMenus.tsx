/**
 * Story-mode menus: the three decks (SUBSEG deck edit with the collection), the partners (Digi-Parts and
 * Digi-Eggs) and the PARTNER GET screen (SAISEG 0x801F2ABC).
 */
import { useState } from 'react';
import { cards } from '../../engine/cards/db';
import type { Specialty } from '../../engine/cards/types';
import { TERMS } from '../vocab/terms';
import { SPECIALTY_NAME } from '../theme';
import { m } from '../../i18n';
import { deckLabel, ownerName } from '../../story/own/decks';
import { PARTNER_IDS, partnerCards } from '../../engine/game/partner';
import { expNeeded, MAX_LEVEL } from '../../engine/progression/partnerExp';
import type { SaveData } from '../../engine/progression/save';
import { availableCopies, canAddStoryCard } from '../../engine/progression/storyDecks';
import { storyStore, useStory } from '../../game/useStory';
import { Chip, DeckEditor } from '../decks/DeckEditor';
import { CardFace } from '../play/CardFace';
import { Button, Notice, PartName } from './common';

const act = () => storyStore.getState();

/** Auto Deck's specialty choice, in the original's order (its index is the option's value). */
const SPECIALTIES: Specialty[] = ['fire', 'ice', 'nature', 'darkness', 'rare'];

/** SUBSEG 0x801F0024: Specialty, Offensive / Defensive, Option Cards Many / Few → Create. */
function AutoDeckForm({ onCreate, onCancel }: { onCreate: (ids: number[]) => void; onCancel: () => void }) {
  const [o, setO] = useState({ specialty: 0, defensive: false, few: false });
  const t = m().story;
  return (
    <div className="flex flex-col gap-3 cut [--c:16px] border border-seam bg-gradient-to-b from-hide/80 to-leather/80 p-4" aria-label={t.menus.autoDeck}>
      <h4 className="font-display text-xl font-bold ">{t.menus.autoDeck}</h4>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-sm text-faded">{TERMS.faction}</span>
        {SPECIALTIES.map((s, i) => (
          <Chip key={s} on={o.specialty === i} onClick={() => setO({ ...o, specialty: i })}>
            {SPECIALTY_NAME[s]}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-sm text-faded">{t.menus.supportCards}</span>
        <Chip on={!o.defensive} onClick={() => setO({ ...o, defensive: false })}>
          {t.menus.offensive}
        </Chip>
        <Chip on={o.defensive} onClick={() => setO({ ...o, defensive: true })}>
          {t.menus.defensive}
        </Chip>
        <span className="mx-1 text-faded">·</span>
        <Chip on={!o.few} onClick={() => setO({ ...o, few: false })}>
          {t.menus.many}
        </Chip>
        <Chip on={o.few} onClick={() => setO({ ...o, few: true })}>
          {t.menus.few}
        </Chip>
      </div>
      <div className="flex gap-2">
        <Button primary onClick={() => onCreate(act().autoDeck(o))}>
          {t.menus.create}
        </Button>
        <Button onClick={onCancel}>{t.shared.cancel}</Button>
      </div>
    </div>
  );
}

/** SUBSEG 0x801E11D4: start from a known deck you have every card of. */
function BaseDeckPicker({ onPick, onCancel }: { onPick: (ids: number[]) => void; onCancel: () => void }) {
  const [list] = useState(() => act().baseDecks());
  const t = m().story;
  return (
    <div className="flex flex-col gap-3 cut [--c:16px] border border-seam bg-gradient-to-b from-hide/80 to-leather/80 p-4" aria-label={t.menus.baseDeck}>
      <h4 className="font-display text-xl font-bold ">{t.menus.baseDeckTitle}</h4>
      {list.length === 0 ? (
        <p className="text-sm text-faded">{t.menus.baseDeckEmpty(TERMS.partner)}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {list.map((d) => (
            <li key={d.index}>
              <Button onClick={() => onPick(d.cards)}>
                {ownerName(d.owner)}: {deckLabel(d.index)}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <Button onClick={onCancel}>{t.shared.cancel}</Button>
      </div>
    </div>
  );
}

function StoryDeckEditor({ k, onClose }: { k: number; onClose: () => void }) {
  const save = useStory((s) => s.save)!;
  const [draft, setDraft] = useState(() => ({ name: save.decks[k].name || m().game.deck.defaultName(k + 1), cards: [...save.decks[k].cards] }));
  const [notice, setNotice] = useState<string | null>(null);
  const [tool, setTool] = useState<'auto' | 'base' | null>(null);
  const dirty = draft.name !== save.decks[k].name || draft.cards.join() !== save.decks[k].cards.join();
  const fill = (ids: number[]) => {
    setDraft({ ...draft, cards: [...ids].sort((a, b) => a - b) });
    setTool(null);
    setNotice(null);
  };
  const t = m().story;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setTool(tool === 'auto' ? null : 'auto')}>{t.menus.autoDeck}</Button>
        <Button onClick={() => setTool(tool === 'base' ? null : 'base')}>{t.menus.baseDeck}</Button>
        <Button disabled={!draft.cards.length} onClick={() => fill([])}>
          {t.menus.clear}
        </Button>
      </div>
      {tool === 'auto' && <AutoDeckForm onCreate={fill} onCancel={() => setTool(null)} />}
      {tool === 'base' && <BaseDeckPicker onPick={fill} onCancel={() => setTool(null)} />}
      <DeckEditor
        name={draft.name}
        cards={draft.cards}
        nameMaxLength={12}
        onChange={(name, ids) => {
          setNotice(null);
          setDraft({ name, cards: ids });
        }}
        canAdd={(ids, id) => canAddStoryCard(save, ids, id)}
        offered={(id) => availableCopies(save, id) > 0}
        owned={(id) => availableCopies(save, id)}
        notice={notice}
        footer={
          <>
            <Button primary disabled={!dirty} onClick={() => setNotice(act().saveDeck(k, draft.name, draft.cards))}>
              {dirty ? t.menus.saveDeck : t.shared.saved}
            </Button>
            <Button onClick={() => (!dirty || confirm(t.menus.unsaved)) && onClose()}>{t.shared.back}</Button>
          </>
        }
      />
    </div>
  );
}

function DeckSlots({ save, onEdit }: { save: SaveData; onEdit: (k: number) => void }) {
  const [notice, setNotice] = useState<string | null>(null);
  const t = m().story;
  return (
    <section className="flex flex-col gap-3" aria-label={t.menus.decks}>
      <h3 className="font-display text-2xl font-bold ">{t.menus.decks}</h3>
      <Notice text={notice} />
      <ul className="grid gap-3 sm:grid-cols-3">
        {save.decks.map((d, k) => {
          const active = save.selectedDeck === k;
          return (
            <li key={k} className="flex flex-col gap-2 cut [--c:16px] border-2 bg-leather p-4" style={{ borderColor: active ? 'var(--color-rare)' : 'var(--color-seam)' }}>
              <span className="font-display text-xl font-bold ">{d.cards.length ? d.name : t.menus.empty}</span>
              <span className="text-sm text-faded">{t.menus.deckInfo(d.cards.length, d.wins, d.losses)}</span>
              <div className="mt-auto flex flex-wrap gap-2">
                <Button onClick={() => onEdit(k)}>{d.cards.length ? t.menus.edit : t.menus.build}</Button>
                {active ? (
                  <span className="self-center text-sm" style={{ color: 'var(--color-rare)' }}>
                    {t.menus.activeDeck}
                  </span>
                ) : (
                  <Button disabled={d.cards.length !== 30} onClick={() => setNotice(act().selectDeck(k))}>
                    {t.menus.use}
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PartnerCard({ save, k }: { save: SaveData; k: number }) {
  const p = save.partners[k];
  const [notice, setNotice] = useState<string | null>(null);
  const { card, armor } = partnerCards(p.slot);
  const free = save.ownedParts.flatMap((owned, id) => (owned && !save.partners.some((q) => q.slot.parts.includes(id)) ? [id] : []));
  const max = p.slot.level >= MAX_LEVEL;
  const t = m().story;
  return (
    <li className="flex flex-col gap-4 cut [--c:16px] border border-seam bg-gradient-to-b from-hide/80 to-leather/80 p-4 md:flex-row">
      <div className="flex shrink-0 gap-2">
        <CardFace card={card} size="sm" />
        {armor && <CardFace card={armor} size="sm" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="font-display text-xl font-bold ">{cards[p.slot.id].name}</h4>
          <span className="text-sm text-faded tabular-nums">
            {t.menus.level(p.slot.level)} · {max ? t.shared.rankMax : t.menus.expProgress(p.exp, expNeeded(p.slot.level))}
          </span>
        </div>
        <Notice text={notice} />
        <div className="flex flex-col gap-1">
          <span className="text-sm text-faded">{t.menus.equipped(TERMS.parts, p.slot.parts.length)}</span>
          {p.slot.parts.length === 0 && <span className="text-sm">{t.menus.noParts}</span>}
          <ul className="flex flex-wrap gap-2">
            {p.slot.parts.map((id) => (
              <li key={id} className="flex items-center gap-2 cut [--c:10px] bg-leather py-1 pr-1 pl-3 text-sm">
                <PartName id={id} />
                <button
                  type="button"
                  onClick={() => setNotice(act().partnerAction({ kind: 'unequip', partner: k, part: id }))}
                  aria-label={t.menus.unequip(TERMS.part)}
                  className="grid size-7 place-items-center cut [--c:6px] border border-seam hover:bg-hide"
                >
                  −
                </button>
              </li>
            ))}
          </ul>
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer text-faded">{t.menus.equip(TERMS.part, free.length)}</summary>
          <ul className="mt-2 flex max-h-56 flex-wrap gap-2 overflow-y-auto">
            {free.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  disabled={p.slot.parts.length >= 3}
                  onClick={() => setNotice(act().partnerAction({ kind: 'equip', partner: k, part: id }))}
                  className="cut [--c:10px] border border-seam px-3 py-1 text-left enabled:hover:bg-leather disabled:opacity-40"
                >
                  <PartName id={id} />
                </button>
              </li>
            ))}
          </ul>
        </details>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-faded">{TERMS.eggs}</span>
          {p.eggs.every((e) => !e) && <span>{t.menus.noEggs}</span>}
          {p.eggs.map((armorId, egg) =>
            armorId ? (
              <button
                key={egg}
                type="button"
                aria-pressed={p.slot.armorId === armorId}
                onClick={() => setNotice(act().partnerAction({ kind: 'egg', partner: k, egg }))}
                className="cut border px-3 py-1 font-display font-semibold [--c:6px]"
                style={{ borderColor: p.slot.armorId === armorId ? 'var(--color-rare)' : 'var(--color-seam)' }}
              >
                {cards[armorId].name}
              </button>
            ) : null,
          )}
        </div>
      </div>
    </li>
  );
}

/** Decks and partners, opened from the map or by the city script (10.9 / 10.17). */
export function StoryMenu({ onClose }: { onClose: () => void }) {
  const save = useStory((s) => s.save)!;
  const [editing, setEditing] = useState<number | null>(null);
  if (editing !== null) return <StoryDeckEditor k={editing} onClose={() => setEditing(null)} />;
  const t = m().story;
  return (
    <div className="flex flex-col gap-6">
      <DeckSlots save={save} onEdit={setEditing} />
      <section className="flex flex-col gap-3" aria-label={t.menus.partners}>
        <h3 className="font-display text-2xl font-bold ">{t.menus.partners}</h3>
        <ul className="flex flex-col gap-3">
          {save.partners.map((p, k) => (
            <PartnerCard key={p.slot.id} save={save} k={k} />
          ))}
        </ul>
      </section>
      <div>
        <Button primary onClick={onClose}>
          {t.shared.back}
        </Button>
      </div>
    </div>
  );
}

/** PARTNER GET / Is this Partner OK? (SAISEG 0x801F2ABC). Candidates are indices in SLUS order. */
export function PartnerGet({ candidates }: { candidates: number[] }) {
  const [pick, setPick] = useState<number | null>(null);
  const t = m().story;
  return (
    <div className="flex flex-col gap-4 cut [--c:16px] border-2 bg-leather p-5" style={{ borderColor: 'var(--color-rare)' }}>
      <h3 className="font-display text-2xl font-bold">{t.menus.partnerGet}</h3>
      <div className="flex flex-wrap gap-4">
        {candidates.map((idx) => {
          const id = PARTNER_IDS[idx];
          return (
            <button
              key={idx}
              type="button"
              aria-pressed={pick === idx}
              onClick={() => setPick(idx)}
              className="flex flex-col items-center gap-2 cut [--c:16px] border-2 p-3 transition-colors"
              style={{ borderColor: pick === idx ? 'var(--color-rare)' : 'var(--color-seam)' }}
            >
              <CardFace card={cards[id]} size="sm" />
              <span className="font-display font-semibold">{cards[id].name}</span>
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <div className="flex flex-wrap items-center gap-3">
          <span>{t.menus.confirmPartner}</span>
          <Button primary onClick={() => act().reply({ kind: 'choice', value: pick })}>
            {t.shared.yes}
          </Button>
          <Button onClick={() => setPick(null)}>{t.shared.no}</Button>
        </div>
      )}
    </div>
  );
}
