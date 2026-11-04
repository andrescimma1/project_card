import { progression } from '../../engine/progression/tables';
import { storySegments, type Segment } from '../../story/present';

const COLOR: Record<number, string> = {
  2: 'var(--color-fire)',
  4: 'var(--color-nature)',
  5: 'var(--color-ice)',
  6: 'var(--color-rare)',
  8: 'var(--color-darkness)',
};

export function Button({ children, onClick, primary, disabled, label }: { children: React.ReactNode; onClick: () => void; primary?: boolean; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40 ${primary ? 'bg-ink text-abyss hover:bg-white' : 'border border-grid hover:bg-deep'}`}
    >
      {children}
    </button>
  );
}

/** Script text with its colour codes (*cN). */
export function Text({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((s, i) => (
        <span key={i} style={COLOR[s.color] ? { color: COLOR[s.color] } : undefined}>
          {s.text}
        </span>
      ))}
    </>
  );
}

export function PartName({ id }: { id: number }) {
  return <Text segments={storySegments(progression.digiParts[id].name, '')} />;
}

export function Notice({ text }: { text: string | null }) {
  return text ? (
    <p role="alert" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--color-probable)' }}>
      {text}
    </p>
  ) : null;
}
