import { motion } from 'motion/react';
import type { Action, ArithOp, Card, Condition, EffectProgram, Operand, VarRef } from '../engine/cards/types';
import { CONFIDENCE_COLOR, CONFIDENCE_LABEL, LEVEL_NAME, SPECIALTY_NAME, frameColor } from './theme';
import { ACTIONS, slotOf } from './vocab/actions';
import { crossEffectLabel, TERMS } from './vocab/terms';
import { ActionIcon } from './play/glyphs';
import { CardArt } from './play/CardFace';
import { m } from '../i18n';

const SPEC = ['Fire', 'Ice', 'Nature', 'Darkness', 'Rare'];
/** Level and attack slot names by their value in the bytecode, in the current language. */
const levelAt = (v: number): string | undefined => [TERMS.levels.R, TERMS.levels.A, TERMS.levels.C, TERMS.levels.U][v];
const slotAt = (v: number): string | undefined => [TERMS.actions.fury, TERMS.actions.technique, TERMS.actions.instinct][v];
const OP: Record<ArithOp, string> = { add: '+', sub: '−', mul: '×', div: '÷', zero: '→0' };

/** Show enum literals the way the game text does (Fire, U, ◯...), using the variable they are compared with. */
function literalFor(context: string | null, value: number) {
  if (!context) return String(value);
  if (context.endsWith('specialty')) return SPEC[value] ?? String(value);
  if (context.endsWith('level')) return levelAt(value) ?? String(value);
  if (context.endsWith('attackSlot')) return slotAt(value) ?? String(value);
  return String(value);
}

function VarChip({ v }: { v: VarRef }) {
  return (
    <span className="inline-flex items-center gap-1">
      <code className="font-code text-[12px]">{v.name ?? `var ${v.id}`}</code>
      <span className="size-1.5 rounded-full" style={{ background: CONFIDENCE_COLOR[v.confidence] }} title={CONFIDENCE_LABEL[v.confidence]} />
    </span>
  );
}

function Opnd({ o, context }: { o: Operand; context: string | null }) {
  return o.ref ? <VarChip v={o.ref} /> : <code className="font-code text-[12px]">{literalFor(context, o.value)}</code>;
}

const isZero = (o: Operand) => !o.ref && o.value === 0;

/** Render `a op b`, hiding the "+ 0" padding the game stores in unused operands. */
function Expr({ parts, ops, context }: { parts: Operand[]; ops: ArithOp[]; context: string | null }) {
  const out: React.ReactNode[] = [<Opnd key="o0" o={parts[0]} context={context} />];
  parts.slice(1).forEach((p, i) => {
    if ((ops[i] === 'add' || ops[i] === 'sub') && isZero(p)) return;
    out.push(
      <span key={`op${i}`} className="font-display">
        {OP[ops[i]]}
      </span>,
      <Opnd key={`o${i + 1}`} o={p} context={context} />,
    );
  });
  return <>{out}</>;
}

function ConditionRow({ c, i }: { c: Condition; i: number }) {
  const ctx = c.operands[0].ref?.name ?? c.operands[3].ref?.name ?? null;
  const t = m().research.detail.program;
  return (
    <li className={`rounded-md border border-seam px-2.5 py-2 ${c.enabled ? '' : 'opacity-45'}`}>
      <div className="flex flex-wrap items-center gap-1.5 text-sm">
        <span className="font-display text-xs text-faded">{t.condition(i + 1)}</span>
        {!c.enabled && <span className="text-xs text-faded">{t.disabled}</span>}
      </div>
      {c.enabled && (
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
          <Expr parts={c.operands.slice(0, 3)} ops={c.ops.slice(0, 2)} context={ctx} />
          <span className="font-display font-semibold">{c.cmp === 'never' ? t.never(c.cmpRaw) : c.cmp}</span>
          <Expr parts={c.operands.slice(3)} ops={c.ops.slice(2)} context={ctx} />
        </div>
      )}
      <code className="mt-1 block font-code text-[10px] break-all text-faded">{c.raw}</code>
    </li>
  );
}

function ActionRow({ a, i }: { a: Action; i: number }) {
  if (!a.enabled) return null;
  const isCmd = a.target.name?.startsWith('cmd.');
  const t = m().research.detail.program;
  return (
    <li className="rounded-md border border-seam px-2.5 py-2">
      <span className="font-display text-xs text-faded">{t.action(i + 1)}</span>
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
        <VarChip v={a.target} />
        <span className="font-display">{isCmd ? t.amount : ':='}</span>
        <Expr parts={[a.operands[2], a.operands[1], a.operands[0]]} ops={[a.opInner, a.opOuter]} context={a.target.name} />
      </div>
      <code className="mt-1 block font-code text-[10px] break-all text-faded">{a.raw}</code>
    </li>
  );
}

function Program({ p }: { p: EffectProgram }) {
  const hasAny = p.conditions.some((c) => c.enabled) || p.actions.some((a) => a.enabled);
  if (!hasAny) return <p className="text-sm text-faded">{m().research.detail.program.empty}</p>;
  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-1.5">
        {p.conditions.map((c, i) => (
          <ConditionRow key={i} c={c} i={i} />
        ))}
      </ul>
      <ul className="flex flex-col gap-1.5">
        {p.actions.map((a, i) => (
          <ActionRow key={i} a={a} i={i} />
        ))}
      </ul>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="font-display text-sm font-semibold text-faded">{title}</h3>
      {children}
    </section>
  );
}

export function CardDetail({ card, onClose }: { card: Card; onClose: () => void }) {
  const color = frameColor(card);
  const t = m().research.detail;
  return (
    <motion.aside
      key={card.id}
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-auto flex max-h-full w-full max-w-[28rem] flex-col gap-5 overflow-y-auto rounded-2xl border bg-hide/95 p-5 shadow-[0_24px_60px_rgb(5_8_25/0.7)] backdrop-blur xl:max-w-none"
      style={{ borderColor: color }}
      aria-label={t.label(card.name)}
    >
      <header className="flex items-start justify-between gap-3">
        <CardArt card={card} className="size-20 shrink-0 rounded-xl border border-seam bg-soot" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm tabular-nums text-faded">{t.ids(card.number, card.id)}</p>
          <h2 className="font-display text-3xl leading-tight font-bold" style={{ color }}>
            {card.name}
          </h2>
          {card.kind === 'digimon' && (
            <p className="text-sm text-faded">{t.factionLevel(TERMS.faction, SPECIALTY_NAME[card.specialty], LEVEL_NAME[card.level])}</p>
          )}
        </div>
        <button type="button" onClick={onClose} className="rounded-md border border-seam px-2.5 py-1 text-sm hover:bg-leather">
          {t.close}
        </button>
      </header>

      {card.kind === 'digimon' && (
        <>
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              [TERMS.hp, card.hp],
              [t.dpToEvolve(TERMS.dp), card.dpRequired],
              [t.dpGiven(TERMS.dp), `+${card.dpGiven}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-leather px-2 py-2">
                <dt className="text-xs text-faded">{k}</dt>
                <dd className="font-display text-xl font-bold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <Section title={t.attacks}>
            <ul className="flex flex-col gap-1">
              {ACTIONS.map((a) => (
                <li key={a} data-action={a} className="flex items-center gap-2 rounded-md bg-leather px-3 py-1.5">
                  <ActionIcon action={a} className="size-4 shrink-0 text-[color:var(--a)]" />
                  <span className="w-20 shrink-0 font-display text-sm font-semibold text-faded">{TERMS.actions[a]}</span>
                  <span className="flex-1">{card.attacks[slotOf(a)].name}</span>
                  <span className="font-display text-lg font-semibold tabular-nums">{card.attacks[slotOf(a)].power}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm">
              {TERMS.instinctEffect}: <strong>{crossEffectLabel(card.crossEffect)}</strong>
            </p>
          </Section>
        </>
      )}

      <Section title={card.kind === 'digivolve' ? t.cardText : t.supportText(TERMS.supportEffect)}>
        <p className="leading-relaxed">{card.kind === 'digivolve' ? card.text : card.support.text || t.noText}</p>
        {card.kind !== 'digivolve' && (
          <p className="text-sm text-faded">
            {t.speed}: <strong className="text-bone">{TERMS.speed[card.supportSpeed]}</strong> ({card.supportSpeed}).{' '}
            {card.supportSpeed === 0
              ? t.speedNone(TERMS.speed[0])
              : t.speedOrder(TERMS.supportCard.toLowerCase(), TERMS.creature.toLowerCase(), TERMS.instinctEffect.toLowerCase())}
          </p>
        )}
      </Section>

      {card.kind !== 'digivolve' ? (
        <Section title={t.bytecode}>
          <Program p={card.support.program} />
          <p className="text-xs text-faded">{t.confidenceHint}</p>
        </Section>
      ) : (
        <Section title={t.behaviour}>
          <p className="text-sm text-faded">{t.noBytecode(card.typeRaw, card.digivolveType)}</p>
        </Section>
      )}

      {card.notes.length > 0 && (
        <Section title={t.notes}>
          <ul className="flex flex-col gap-1.5">
            {card.notes.map((n, i) => (
              <li key={i} className="rounded-md border border-seam bg-leather px-3 py-2 text-sm">
                <code className="font-code text-[11px] text-faded">{n.field}</code>
                <p>{n.note}</p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-faded">{t.notesHint}</p>
        </Section>
      )}

      {card.issues.length > 0 && (
        <Section title={t.issues}>
          <ul className="flex flex-col gap-1.5">
            {card.issues.map((iss, i) => (
              <li key={i} className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: 'var(--color-conflict)' }}>
                <code className="font-code text-[11px] text-faded">{iss.field}</code>
                <p>{iss.note}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={t.source}>
        <p className="text-sm text-faded">
          {t.sourceText(card.source.file, card.source.offset.toString(16).toUpperCase(), card.source.size, card.fusion.composite, card.fusion.result)}
          {Object.keys(card.unknown).length > 0 && (
            <>
              {' '}
              {t.unknownFields} <code className="font-code text-[11px]">{JSON.stringify(card.unknown)}</code>
            </>
          )}
        </p>
      </Section>
    </motion.aside>
  );
}
