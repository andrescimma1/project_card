/**
 * The story as a stage: a 16:9 scene that scales with the window (the page never scrolls).
 * - The map of the Tierras Quietas: each town is a card, face down until its pass is won. Your partner's
 *   token walks the road, and the town's card grows into the town.
 * - A town: its painting, its name plate, the places as cards, and the dialogue box with the faces of who
 *   is talking (yours on the left, theirs on the right).
 * Pictures come from /story-art (see visuals.ts); a missing one falls back to a painted gradient or a monogram.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { cards } from '../../engine/cards/db';
import type { SaveData } from '../../engine/progression/save';
import { m, useLocale } from '../../i18n';
import type { StoryRequest } from '../../story/cityHost';
import { decodeScriptString, menuLabel, storySegments, visibleCities, type Segment } from '../../story/present';
import { AREAS, CITIES } from '../../story/own/world';
import { rankNames } from '../../game/titles';
import { storyStore, useStory } from '../../game/useStory';
import { Text } from './common';
import { AREA_LABELS, avatarFace, CARD_BACK, faceOf, foggedAreas, LEAVE_IMAGE, MAP_IMAGE, MAP_ROUTE, placeImage, SEA_ROUTE, speakerKey, TOWNS, townBackground, type Face } from './visuals';

const act = () => storyStore.getState();
/** Place ids of the city menu (CMD11.1 0..7). */
const isPlaceMenu = (options: number[]) => options.length > 0 && options.every((id) => id >= 0 && id <= 7);

/* ---------- stage, pictures and faces ---------- */

/** A 16:9 scene that fits the space under the top bar; sizes inside use cqw (1% of its width). */
export function Stage({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section
      aria-label={label}
      className="relative mx-auto aspect-video w-full max-w-[calc((100dvh-6.5rem)*16/9)] overflow-hidden bg-soot shadow-[0_0_0_1px_var(--color-seam),0_10px_40px_rgb(0_0_0/0.5)] [container-type:inline-size]"
    >
      {children}
    </section>
  );
}

/** A painting with a painted fallback underneath (shown while the picture is missing or loading). */
function Painting({ src, tint, className = 'absolute inset-0', position = 'center' }: { src: string; tint: string; className?: string; position?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundImage: `url(${src}), linear-gradient(180deg, color-mix(in srgb, ${tint} 55%, #e8b07a) 0%, color-mix(in srgb, ${tint} 60%, #2b1d16) 58%, #17110c 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: position,
      }}
    />
  );
}

type Who = { face: Face | null; name: string; mono: string };

const playerWho = (save: SaveData): Who => ({ face: avatarFace(save.avatar ?? 0), name: save.name, mono: save.name.slice(0, 1).toUpperCase() });
const npcWho = (name: string): Who => {
  const key = speakerKey(name);
  return { face: key ? faceOf(key) : null, name, mono: name.replace(/[^\p{L}?]/gu, '').slice(0, 1).toUpperCase() || '?' };
};

/**
 * A framed face; the monogram shows underneath until the picture loads (or when there is none).
 * `speaking` lifts and lights it, `quiet` dims it, `idle` shows it plain.
 */
function Portrait({ who, state, className = '' }: { who: Who | null; state: 'speaking' | 'quiet' | 'idle'; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[0.6cqw] bg-hide transition-[transform,filter,box-shadow] duration-200 ${className}`}
      style={{
        boxShadow: state === 'speaking' ? '0 0 0 0.3cqw var(--color-gold)' : '0 0 0 0.2cqw var(--color-seam)',
        transform: state === 'speaking' ? 'translateY(-1.2cqw)' : undefined,
        filter: state === 'quiet' ? 'grayscale(0.6) brightness(0.55)' : undefined,
      }}
    >
      {who && (
        <>
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_38%,#5a4634_0_22%,transparent_23%),radial-gradient(ellipse_48%_36%_at_50%_100%,#5a4634_0_98%,transparent_100%)] font-display text-[2.4cqw] font-extrabold text-bone/80">
            {who.mono}
          </span>
          {who.face && (
            <span
              role="img"
              aria-label={who.name}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${who.face.src})`,
                backgroundSize: who.face.size,
                backgroundPosition: who.face.position,
                backgroundRepeat: 'no-repeat',
                filter: who.face.dark ? 'grayscale(0.4) brightness(0.45) sepia(0.3) hue-rotate(200deg)' : undefined,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

/* ---------- typed text ---------- */

/** The first `n` characters of a page, keeping each line's colours. */
function slicePage(lines: Segment[][], n: number): Segment[][] {
  let left = n;
  return lines.map((segs) => {
    const out: Segment[] = [];
    for (const s of segs) {
      if (left <= 0) break;
      out.push({ ...s, text: s.text.slice(0, left) });
      left -= s.text.length;
    }
    left -= 1; // the line break
    return out;
  });
}

function useTyping(total: number, key: string) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? total : 0);
  useEffect(() => {
    if (reduce) return setN(total);
    setN(0);
    const id = setInterval(() => setN((v) => (v >= total ? (clearInterval(id), v) : v + 1)), 18);
    return () => clearInterval(id);
  }, [key, total, reduce]);
  return { shown: n, done: n >= total, finish: () => setN(total) };
}

/* ---------- the dialogue box ---------- */

function DialogueBox({ left, right, speaker, children, onNext }: { left: Who; right: Who | null; speaker: 'left' | 'right' | null; children: ReactNode; onNext?: () => void }) {
  return (
    <div className="absolute inset-x-[2.5cqw] bottom-[2cqw] grid h-[14.5cqw] grid-cols-[11cqw_1fr_11cqw] bg-soot/95 shadow-[inset_0_0_0_0.2cqw_var(--color-brass)]" onClick={onNext} role="presentation">
      <div className="grid place-items-center">
        <Portrait who={left} state={speaker === 'left' ? 'speaking' : 'quiet'} className="h-[11.2cqw] w-[9.6cqw]" />
      </div>
      <div className="flex min-w-0 flex-col py-[1.2cqw]">{children}</div>
      <div className="grid place-items-center">
        {right && <Portrait who={right} state={speaker === 'right' ? 'speaking' : 'quiet'} className="h-[11.2cqw] w-[9.6cqw]" />}
      </div>
    </div>
  );
}

function NamePlate({ name, side }: { name: string; side: 'left' | 'right' }) {
  return (
    <span className={`-mt-[2.6cqw] mb-[0.6cqw] px-[1.4cqw] py-[0.2cqw] font-display text-[1.8cqw] font-extrabold text-ink ${side === 'right' ? 'self-end' : 'self-start'}`} style={{ background: 'var(--color-brass)' }}>
      {name}
    </span>
  );
}

/**
 * A page of the script (say) or the question before a menu: speaker header, then typed lines.
 * `lines` are script strings, or plain text when `plain` is set.
 */
function Page({ lines, plain, save, lastNpc, onSpeaker, footer, onNext }: { lines: string[]; plain?: boolean; save: SaveData; lastNpc: Who | null; onSpeaker: (w: Who) => void; footer?: ReactNode; onNext?: () => void }) {
  const decoded = plain ? lines : lines.map(decodeScriptString);
  const header = decoded[0]?.startsWith('*c') && decoded.length > 1 ? decoded[0] : null;
  const body = header ? decoded.slice(1) : decoded;
  const headerName = header ? storySegments(header, save.name).map((s) => s.text).join('') : null;
  const isPlayer = header !== null && header.includes('*h0');
  const npc = header && !isPlayer ? npcWho(headerName!) : null;
  useEffect(() => {
    if (npc) onSpeaker(npc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerName]);
  const segs = useMemo(() => body.map((l) => storySegments(l, save.name)), [lines.join('\n'), save.name]); // eslint-disable-line react-hooks/exhaustive-deps
  const total = segs.reduce((n, l) => n + l.reduce((k, s) => k + s.text.length, 0) + 1, 0);
  const typing = useTyping(total, lines.join('\n'));
  const next = () => (typing.done ? onNext?.() : typing.finish());
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });
  const right = npc ?? lastNpc;
  return (
    <DialogueBox left={playerWho(save)} right={right} speaker={isPlayer ? 'left' : npc ? 'right' : null} onNext={footer && typing.done ? undefined : next}>
      {header && <NamePlate name={isPlayer ? save.name : headerName!} side={isPlayer ? 'left' : 'right'} />}
      <div className="flex-1 overflow-hidden px-[0.6cqw] text-[1.95cqw] leading-[1.35]">
        {slicePage(segs, typing.shown).map((l, i) => (
          <p key={i} className="min-h-[1.35em]">
            <Text segments={l} />
          </p>
        ))}
      </div>
      {typing.done && footer}
      {typing.done && !footer && onNext && (
        <span aria-label={m().story.city.next} role="button" tabIndex={0} className="absolute right-[12.5cqw] bottom-[1cqw] h-0 w-0 animate-bounce border-x-[0.7cqw] border-t-[0.9cqw] border-x-transparent" style={{ borderTopColor: 'var(--color-gold)' }} />
      )}
    </DialogueBox>
  );
}

function Choices({ items, onBack, backLabel }: { items: { label: string; onClick: () => void }[]; onBack?: () => void; backLabel?: string }) {
  return (
    <div className="flex flex-wrap gap-[0.8cqw] px-[0.6cqw] text-[1.6cqw]">
      {items.map((it, i) => (
        <button key={i} type="button" data-primary={i === 0 || undefined} className="cmd !px-[1.6cqw] !py-[0.4cqw]" onClick={(e) => (e.stopPropagation(), it.onClick())}>
          <span>{it.label}</span>
        </button>
      ))}
      {onBack && (
        <button type="button" className="cmd !px-[1.6cqw] !py-[0.4cqw]" onClick={(e) => (e.stopPropagation(), onBack())}>
          <span>{backLabel}</span>
        </button>
      )}
    </div>
  );
}

/* ---------- a town ---------- */

function PlaceCards({ options, city }: { options: number[]; city: number }) {
  const t = m().story;
  const cardsList = [...options.map((id, i) => ({ id, label: menuLabel(id, city), img: placeImage(id), value: i + 1 })), { id: -1, label: t.city.leaveCity, img: LEAVE_IMAGE, value: -1 }];
  return (
    <nav aria-label={m().game.places[0] ?? ''} className="absolute top-[10cqw] left-[2.5cqw] flex flex-col gap-[0.8cqw]">
      {cardsList.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => act().reply({ kind: 'choice', value: p.value })}
          className="group flex h-[4.8cqw] w-[23cqw] items-center gap-[1cqw] bg-leather/95 pr-[1.2cqw] pl-[0.6cqw] text-left font-display text-[1.9cqw] font-bold shadow-[inset_0_0_0_0.15cqw_var(--color-seam)] transition-[transform,box-shadow] hover:translate-x-[0.8cqw] hover:shadow-[inset_0_0_0_0.2cqw_var(--color-gold)] focus-visible:translate-x-[0.8cqw]"
        >
          <Painting src={p.img} tint={TOWNS[city].tint} className="h-[3.8cqw] w-[2.7cqw] shrink-0 rounded-[0.3cqw] shadow-[0_0_0_0.15cqw_var(--color-brass)]" />
          {p.label}
        </button>
      ))}
    </nav>
  );
}

function RivalPanel({ req, save }: { req: Extract<StoryRequest, { kind: 'rival' }>; save: SaveData }) {
  const name = storySegments(decodeScriptString(req.name), save.name).map((s) => s.text).join('');
  const labels = m().story.city.rivalLabels;
  return (
    <div className="absolute top-[2cqw] right-[2.5cqw] flex w-[33cqw] gap-[1.2cqw] bg-leather/95 p-[1.2cqw] shadow-[inset_0_0_0_0.2cqw_var(--color-fire)]">
      <Portrait who={npcWho(name)} state="idle" className="h-[8.4cqw] w-[7.2cqw] shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-[0.3cqw] text-[1.45cqw]">
        <p className="font-display text-[2.4cqw] leading-none font-extrabold">{name}</p>
        {[req.attack, req.defense, req.speed].map((v, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="text-faded">{labels[i]}</span>
            <span className="flex gap-[0.35cqw]" aria-label={`${v}`}>
              {Array.from({ length: 5 }, (_, k) => (
                <i key={k} className="size-[0.9cqw] rounded-full" style={{ background: k < v ? 'var(--color-fire)' : 'var(--color-seam)' }} />
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The town scene for everything the script asks in a town, except the full screens (decks, shop, stats). */
export function TownStage({ req, overlay }: { req: StoryRequest; overlay?: ReactNode }) {
  const locale = useLocale();
  const host = useStory((s) => s.host);
  const save = useStory((s) => s.save)!;
  const npcs = useStory((s) => s.npcs);
  const city = host?.city ?? save.story.city;
  const [lastNpc, setLastNpc] = useState<Who | null>(null);
  const t = m().story;
  const area = AREAS.find((a) => a.cities.includes(city));
  const placeName = host?.place === 1 ? m().game.places[2] : host?.place === 2 ? menuLabel(3, city) : null;
  const ack = () => act().reply({ kind: 'ack' });

  let box: ReactNode = null;
  if (req.kind === 'say') box = <Page key={req.lines.join('\n')} lines={req.lines} save={save} lastNpc={lastNpc} onSpeaker={setLastNpc} onNext={ack} />;
  if (req.kind === 'menu' && isPlaceMenu(req.options) && req.big) box = <Page key="places" lines={req.prompt} save={save} lastNpc={null} onSpeaker={() => {}} />;
  else if (req.kind === 'menu')
    box = (
      <Page
        key={`menu-${req.prompt.join('\n')}`}
        lines={req.prompt.length ? req.prompt : [t.city.talkTo]}
        save={save}
        lastNpc={lastNpc}
        onSpeaker={setLastNpc}
        footer={<Choices items={req.options.map((id, i) => ({ label: menuLabel(id, city), onClick: () => act().reply({ kind: 'choice', value: i + 1 }) }))} onBack={() => act().reply({ kind: 'choice', value: -1 })} backLabel={req.big ? t.city.leaveCity : t.shared.back} />}
      />
    );
  if (req.kind === 'talkTo')
    box = (
      <DialogueBox left={playerWho(save)} right={null} speaker={null}>
        <p className="px-[0.6cqw] text-[1.95cqw]">{t.city.talkTo}</p>
        <div className="mt-[0.6cqw] flex flex-wrap items-end gap-[1.2cqw] px-[0.6cqw]">
          {req.npcs.map((n) => {
            const who = npcWho(npcs[n] ?? t.city.npc(n));
            return (
              <button key={n} type="button" className="group flex flex-col items-center gap-[0.2cqw] text-[1.3cqw] font-medium" onClick={() => (setLastNpc(who), act().reply({ kind: 'choice', value: n }))}>
                <Portrait who={who} state="idle" className="h-[6.4cqw] w-[5.6cqw] group-hover:-translate-y-[0.3cqw]" />
                {who.name}
              </button>
            );
          })}
          <Choices items={[]} onBack={() => act().reply({ kind: 'choice', value: -1 })} backLabel={t.city.leaveCafe(m().game.places[2])} />
        </div>
      </DialogueBox>
    );
  if (req.kind === 'rival') {
    const name = storySegments(decodeScriptString(req.name), save.name).map((s) => s.text).join('');
    box = <Page key={`rival-${name}`} plain lines={[`*c4${name}*c7`, t.city.rivalIntro]} save={save} lastNpc={null} onSpeaker={setLastNpc} onNext={ack} />;
  }

  return (
    <Stage label={CITIES[city][locale]}>
      <Painting src={townBackground(city)} tint={TOWNS[city].tint} />
      <div className="absolute top-[2cqw] left-[2.5cqw] bg-leather/95 px-[2cqw] pt-[0.8cqw] pb-[0.9cqw] shadow-[inset_0_0_0_0.2cqw_var(--color-brass)]">
        <h2 className="font-display text-[3.2cqw] leading-none font-extrabold">{CITIES[city][locale]}</h2>
        <p className="mt-[0.3cqw] text-[1.35cqw] text-faded">{placeName ?? area?.name[locale]}</p>
      </div>
      {req.kind === 'menu' && req.big && isPlaceMenu(req.options) && <PlaceCards options={req.options} city={city} />}
      {req.kind === 'rival' && <RivalPanel req={req} save={save} />}
      {overlay && <div className="absolute inset-x-[12cqw] top-[9cqw] bottom-[18cqw] overflow-y-auto">{overlay}</div>}
      {box}
    </Stage>
  );
}

/* ---------- the map ---------- */

const pct = (v: number) => `${v * 100}%`;

function PlayerChip({ save, onClick }: { save: SaveData; onClick: () => void }) {
  const titles = rankNames(save.ranks);
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-[1cqw] bg-leather/90 py-[0.5cqw] pr-[1.4cqw] pl-[0.5cqw] text-left shadow-[inset_0_0_0_0.15cqw_var(--color-seam)] hover:shadow-[inset_0_0_0_0.2cqw_var(--color-gold)]">
      <Portrait who={playerWho(save)} state="idle" className="h-[4.6cqw] w-[4cqw]" />
      <span className="flex flex-col text-[1.3cqw] leading-tight">
        <strong className="font-display text-[1.8cqw]">{save.name}</strong>
        <span className="text-faded">{titles.tamer}</span>
        <span className="text-faded">{m().story.shared.record(save.winsCom, save.lossesCom)}</span>
      </span>
    </button>
  );
}

export function MapStage({ toolbar, details, onDetails }: { toolbar: ReactNode; details: ReactNode | null; onDetails: () => void }) {
  const locale = useLocale();
  const save = useStory((s) => s.save)!;
  const reduce = useReducedMotion();
  const open = visibleCities(save);
  const fog = foggedAreas(save);
  const here = save.story.city;
  const t = m().story;
  const [token, setToken] = useState<[number, number]>(TOWNS[here].at);
  const [zoom, setZoom] = useState<{ city: number; full: boolean } | null>(null);
  const busy = useRef(false);
  const partner = cards[save.partners[0].slot.id];
  const partnerFace = faceOf(partner.name);
  const newest = [...MAP_ROUTE].reverse().find((c) => open.includes(c));

  const go = (c: number) => {
    if (busy.current) return;
    busy.current = true;
    const enter = () => {
      if (reduce) return void act().enterCity(c);
      setZoom({ city: c, full: false });
      requestAnimationFrame(() => requestAnimationFrame(() => setZoom({ city: c, full: true })));
      setTimeout(() => void act().enterCity(c), 520);
    };
    if (c === here || reduce) return enter();
    const [a, b] = [TOWNS[here].at, TOWNS[c].at];
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 900);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const hop = Math.sin(k * Math.PI * 4) * -0.012 * (1 - k);
      setToken([a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e + hop]);
      if (k < 1) requestAnimationFrame(step);
      else enter();
    };
    requestAnimationFrame(step);
  };

  const road = MAP_ROUTE.map((c, i) => `${i ? 'L' : 'M'}${TOWNS[c].at[0] * 160} ${TOWNS[c].at[1] * 90}`).join(' ');
  const [sa, sb] = SEA_ROUTE.map((c) => TOWNS[c].at);

  return (
    <Stage label={t.map.world}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${MAP_IMAGE}), radial-gradient(ellipse 60% 45% at 25% 75%, #4b5a33 0%, transparent 70%), radial-gradient(ellipse 45% 40% at 55% 35%, #6b5a3e 0%, transparent 70%), radial-gradient(ellipse 35% 45% at 88% 30%, #4a4f5a 0%, transparent 70%), radial-gradient(ellipse 25% 20% at 78% 82%, #2f4d5e 0%, transparent 75%), linear-gradient(180deg, #2a2219, #1a140f)`,
          backgroundSize: 'cover',
        }}
      />
      <svg viewBox="0 0 160 90" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={road} fill="none" stroke="rgb(232 217 180 / 0.45)" strokeWidth="0.45" strokeDasharray="0.35 1.2" strokeLinecap="round" />
        <path d={`M${sa[0] * 160} ${sa[1] * 90} Q${(sa[0] + sb[0]) * 80} ${(sa[1] + sb[1]) * 45 + 9} ${sb[0] * 160} ${sb[1] * 90}`} fill="none" stroke="rgb(111 159 194 / 0.55)" strokeWidth="0.4" strokeDasharray="1.4 1.4" />
      </svg>
      {AREAS.map((a, i) => (
        <span key={a.name.en} className="absolute -translate-x-1/2 -translate-y-1/2 font-display text-[1.5cqw] tracking-[0.3em] whitespace-nowrap text-bone/55" style={{ left: pct(AREA_LABELS[i][0]), top: pct(AREA_LABELS[i][1]) }}>
          {a.name[locale].toUpperCase()}
        </span>
      ))}
      {TOWNS.map((town, c) => {
        const up = open.includes(c);
        return (
          <button
            key={c}
            type="button"
            disabled={!up}
            onClick={() => go(c)}
            aria-label={up ? `${CITIES[c][locale]}${c === here ? ` (${t.map.here})` : ''}` : t.map.locked}
            className="group absolute h-[7.3cqw] w-[5.2cqw] -translate-x-1/2 -translate-y-1/2 transition-transform enabled:hover:-rotate-3 enabled:hover:-translate-y-[60%]"
            style={{ left: pct(town.at[0]), top: pct(town.at[1]) }}
          >
            <Painting
              src={up ? townBackground(c) : CARD_BACK}
              tint={up ? town.tint : '#3a2c20'}
              className={`absolute inset-0 rounded-[0.5cqw] shadow-[0_0_0_0.2cqw_var(--color-brass),0_0.4cqw_1cqw_rgb(0_0_0/0.5)] ${c === newest && c !== here ? 'animate-pulse' : ''}`}
            />
            {!up && <span aria-hidden="true" className="absolute top-1/2 left-1/2 size-[1.4cqw] -translate-x-1/2 -translate-y-1/2 rotate-45 border-[0.2cqw] border-brass" />}
            {up && (
              <span className="absolute top-[7.9cqw] left-1/2 -translate-x-1/2 text-[1.35cqw] font-medium whitespace-nowrap [text-shadow:0_1px_2px_#000]">{CITIES[c][locale]}</span>
            )}
            {up && c === newest && c !== here && (
              <span className="absolute -top-[1cqw] -right-[1.4cqw] rotate-12 rounded-[0.3cqw] px-[0.6cqw] text-[1.1cqw] font-bold" style={{ background: 'var(--color-fire)' }}>
                {t.map.newPass}
              </span>
            )}
          </button>
        );
      })}
      {fog.map((i) => {
        const at = AREAS[i].cities.map((c) => TOWNS[c].at);
        const cx = at.reduce((s, p) => s + p[0], 0) / at.length;
        const cy = at.reduce((s, p) => s + p[1], 0) / at.length;
        return (
          <span
            key={i}
            aria-hidden="true"
            className="fog pointer-events-none absolute h-[30cqw] w-[38cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(170_170_165/0.78),rgb(150_150_145/0.42)_45%,transparent_72%)] blur-[0.6cqw]"
            style={{ left: pct(cx), top: pct(cy) }}
          />
        );
      })}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 size-[5.4cqw] -translate-x-1/2 -translate-y-[150%] overflow-hidden rounded-full bg-hide shadow-[0_0_0_0.3cqw_var(--color-gold),0_0.4cqw_1cqw_rgb(0_0_0/0.6)]"
        style={{ left: pct(token[0]), top: pct(token[1]) }}
      >
        {partnerFace && <span className="block size-full" style={{ backgroundImage: `url(${partnerFace.src})`, backgroundSize: '300%', backgroundPosition: partnerFace.position }} />}
      </div>
      <div className="absolute top-[2cqw] left-[2.5cqw] flex flex-col items-start gap-[1cqw]">
        <div>
          <h2 className="font-display text-[3.4cqw] leading-none font-extrabold">{t.map.world}</h2>
          <p className="mt-[0.5cqw] text-[1.4cqw] text-faded">{t.map.hint}</p>
        </div>
        <PlayerChip save={save} onClick={onDetails} />
        <div className="flex gap-[0.6cqw] text-[1.3cqw]">{toolbar}</div>
      </div>
      {details && <div className="absolute inset-x-[14cqw] top-[12cqw] bottom-[4cqw] overflow-y-auto">{details}</div>}
      {zoom && <ZoomFrame city={zoom.city} full={zoom.full} />}
    </Stage>
  );
}

/** The card that grows from its spot on the map to the whole scene. */
function ZoomFrame({ city, full }: { city: number; full: boolean }) {
  const [x, y] = TOWNS[city].at;
  const style: CSSProperties = full
    ? { left: 0, top: 0, width: '100%', height: '100%', borderRadius: 0 }
    : { left: `calc(${x * 100}% - 2.6cqw)`, top: `calc(${y * 100}% - 3.65cqw)`, width: '5.2cqw', height: '7.3cqw', borderRadius: '0.5cqw' };
  return (
    <div className="absolute z-30 overflow-hidden transition-all duration-500 ease-[cubic-bezier(.6,0,.2,1)]" style={style}>
      <Painting src={townBackground(city)} tint={TOWNS[city].tint} />
    </div>
  );
}
