import { motion } from 'motion/react';
import type { Action, ArithOp, Card, Condition, EffectProgram, Operand, VarRef } from '../engine/cards/types';
import { CROSS_EFFECT_LABEL } from '../engine/cards/db';
import { CONFIDENCE_COLOR, CONFIDENCE_LABEL, LEVEL_NAME, SLOT_GLYPH, SPECIALTY_NAME, frameColor } from './theme';
import { CardArt } from './play/CardFace';

const SPEC = ['Fire', 'Ice', 'Nature', 'Darkness', 'Rare'];
const LEVEL = ['R', 'A', 'C', 'U'];
const SLOT = ['◯', '△', '✕'];
const OP: Record<ArithOp, string> = { add: '+', sub: '−', mul: '×', div: '÷', zero: '→0' };
const SPEED_NAME = ['None', 'Low', 'Mid', 'High'];

/** Show enum literals the way the game text does (Fire, U, ◯...), using the variable they are compared with. */
function literalFor(context: string | null, value: number) {
  if (!context) return String(value);
  if (context.endsWith('specialty')) return SPEC[value] ?? String(value);
  if (context.endsWith('level')) return LEVEL[value] ?? String(value);
  if (context.endsWith('attackSlot')) return SLOT[value] ?? String(value);
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
  return (
    <li className={`rounded-md border border-grid px-2.5 py-2 ${c.enabled ? '' : 'opacity-45'}`}>
      <div className="flex flex-wrap items-center gap-1.5 text-sm">
        <span className="font-display text-xs text-haze">Condición {i + 1}</span>
        {!c.enabled && <span className="text-xs text-haze">(desactivada en el ROM)</span>}
      </div>
      {c.enabled && (
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
          <Expr parts={c.operands.slice(0, 3)} ops={c.ops.slice(0, 2)} context={ctx} />
          <span className="font-display font-semibold">{c.cmp === 'never' ? `nunca (código ${c.cmpRaw})` : c.cmp}</span>
          <Expr parts={c.operands.slice(3)} ops={c.ops.slice(2)} context={ctx} />
        </div>
      )}
      <code className="mt-1 block font-code text-[10px] break-all text-haze">{c.raw}</code>
    </li>
  );
}

function ActionRow({ a, i }: { a: Action; i: number }) {
  if (!a.enabled) return null;
  const isCmd = a.target.name?.startsWith('cmd.');
  return (
    <li className="rounded-md border border-grid px-2.5 py-2">
      <span className="font-display text-xs text-haze">Acción {i + 1}</span>
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
        <VarChip v={a.target} />
        <span className="font-display">{isCmd ? 'cantidad =' : ':='}</span>
        <Expr parts={[a.operands[2], a.operands[1], a.operands[0]]} ops={[a.opInner, a.opOuter]} context={a.target.name} />
      </div>
      <code className="mt-1 block font-code text-[10px] break-all text-haze">{a.raw}</code>
    </li>
  );
}

function Program({ p }: { p: EffectProgram }) {
  const hasAny = p.conditions.some((c) => c.enabled) || p.actions.some((a) => a.enabled);
  if (!hasAny) return <p className="text-sm text-haze">El registro no tiene condiciones ni acciones activas.</p>;
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
      <h3 className="font-display text-sm font-semibold text-haze">{title}</h3>
      {children}
    </section>
  );
}

export function CardDetail({ card, onClose }: { card: Card; onClose: () => void }) {
  const color = frameColor(card);
  return (
    <motion.aside
      key={card.id}
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-auto flex max-h-full w-full max-w-[28rem] flex-col gap-5 overflow-y-auto rounded-2xl border bg-panel/95 p-5 shadow-[0_24px_60px_rgb(5_8_25/0.7)] backdrop-blur xl:max-w-none"
      style={{ borderColor: color }}
      aria-label={`Detalle de ${card.name}`}
    >
      <header className="flex items-start justify-between gap-3">
        <CardArt card={card} className="size-20 shrink-0 rounded-xl border border-grid bg-abyss" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm tabular-nums text-haze">
            #{card.number}, id ROM {card.id}
          </p>
          <h2 className="font-display text-3xl leading-tight font-bold" style={{ color }}>
            {card.name}
          </h2>
          {card.kind === 'digimon' && (
            <p className="text-sm text-haze">
              {SPECIALTY_NAME[card.specialty]}, nivel {card.level} ({LEVEL_NAME[card.level]})
            </p>
          )}
        </div>
        <button type="button" onClick={onClose} className="rounded-md border border-grid px-2.5 py-1 text-sm hover:bg-deep">
          Cerrar
        </button>
      </header>

      {card.kind === 'digimon' && (
        <>
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              ['HP', card.hp],
              ['DP requerido', card.dpRequired],
              ['Aporta', `+${card.dpGiven}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-deep px-2 py-2">
                <dt className="text-xs text-haze">{k}</dt>
                <dd className="font-display text-xl font-bold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <Section title="Ataques">
            <ul className="flex flex-col gap-1">
              {(['circle', 'triangle', 'cross'] as const).map((s) => (
                <li key={s} className="flex items-baseline gap-2 rounded-md bg-deep px-3 py-1.5">
                  <span className="w-4 text-haze">{SLOT_GLYPH[s]}</span>
                  <span className="flex-1">{card.attacks[s].name}</span>
                  <span className="font-display text-lg font-semibold tabular-nums">{card.attacks[s].power}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm">
              Efecto ✕: <strong>{CROSS_EFFECT_LABEL[card.crossEffect]}</strong>
            </p>
          </Section>
        </>
      )}

      <Section title={card.kind === 'digivolve' ? 'Texto de la carta' : 'Efecto de soporte (texto del juego)'}>
        <p className="leading-relaxed">{card.kind === 'digivolve' ? card.text : card.support.text || 'Sin texto.'}</p>
        {card.kind !== 'digivolve' && (
          <p className="text-sm text-haze">
            Support Speed: <strong className="text-ink">{SPEED_NAME[card.supportSpeed]}</strong> ({card.supportSpeed}).{' '}
            {card.supportSpeed === 0
              ? 'Con velocidad None el efecto nunca se aplica.'
              : 'Los efectos se aplican de High a Low; a igual velocidad: Option, luego soporte Digimon, luego efecto ✕, y primero el jugador del turno.'}
          </p>
        )}
      </Section>

      {card.kind !== 'digivolve' ? (
        <Section title="Bytecode original decodificado">
          <Program p={card.support.program} />
          <p className="text-xs text-haze">
            El punto de color indica la confianza de cada variable: verde, leída del intérprete del juego; ámbar, inferida; gris, sin decodificar.
          </p>
        </Section>
      ) : (
        <Section title="Comportamiento">
          <p className="text-sm text-haze">
            Las Digivolve Option no traen bytecode: su lógica vive en código del juego (tipo {card.typeRaw}, {card.digivolveType}). El motor necesitará un handler dedicado.
          </p>
        </Section>
      )}

      {card.notes.length > 0 && (
        <Section title="El texto dice una cosa, el juego hace otra">
          <ul className="flex flex-col gap-1.5">
            {card.notes.map((n, i) => (
              <li key={i} className="rounded-md border border-grid bg-deep px-3 py-2 text-sm">
                <code className="font-code text-[11px] text-haze">{n.field}</code>
                <p>{n.note}</p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-haze">El remake reproduce lo que ejecuta el juego, no el texto.</p>
        </Section>
      )}

      {card.issues.length > 0 && (
        <Section title="Puntos a verificar">
          <ul className="flex flex-col gap-1.5">
            {card.issues.map((iss, i) => (
              <li key={i} className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: 'var(--color-conflict)' }}>
                <code className="font-code text-[11px] text-haze">{iss.field}</code>
                <p>{iss.note}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Origen del dato">
        <p className="text-sm text-haze">
          {card.source.file}, offset 0x{card.source.offset.toString(16).toUpperCase()}, {card.source.size} bytes. Valores de fusión (modo historia): {card.fusion.composite} /{' '}
          {card.fusion.result}.
          {Object.keys(card.unknown).length > 0 && (
            <>
              {' '}
              Campos sin decodificar: <code className="font-code text-[11px]">{JSON.stringify(card.unknown)}</code>
            </>
          )}
        </p>
      </Section>
    </motion.aside>
  );
}
