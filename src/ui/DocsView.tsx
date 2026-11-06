import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useBrowser } from '../store';

const files = import.meta.glob('../../docs/research/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const docs = Object.entries(files)
  .map(([path, body]) => {
    const file = path.split('/').pop()!;
    const id = file.replace(/^\d+-/, '').replace(/\.md$/, '');
    const title = (body.match(/^#\s+(.+)$/m)?.[1] ?? file).replace(/^\d+\s+—\s+/, '');
    return { id, file, title, body };
  })
  .sort((a, b) => a.file.localeCompare(b.file));

const LEGEND = [
  { mark: '✅', label: 'Verificado en el juego', color: 'var(--color-verified)' },
  { mark: '🟡', label: 'Probable', color: 'var(--color-probable)' },
  { mark: '❓', label: 'Desconocido, no se implementa', color: 'var(--color-unknown)' },
  { mark: '⚠️', label: 'Conflicto entre fuentes', color: 'var(--color-conflict)' },
];

export function DocsView() {
  const { docId, setDoc } = useBrowser();
  const doc = docs.find((d) => d.id === docId) ?? docs[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
      <nav aria-label="Documentos" className="flex flex-col gap-1 lg:sticky lg:top-0 lg:self-start">
        {docs.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDoc(d.id)}
            aria-current={d.id === doc.id ? 'page' : undefined}
            className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${d.id === doc.id ? 'bg-hide text-bone' : 'text-faded hover:text-bone'}`}
          >
            {d.title}
          </button>
        ))}
        <ul className="mt-6 flex flex-col gap-2 border-t border-seam pt-4 text-sm">
          {LEGEND.map((l) => (
            <li key={l.mark} className="flex items-center gap-2">
              <span aria-hidden>{l.mark}</span>
              <span style={{ color: l.color }}>{l.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      <article className="prose-doc min-w-0">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href = '', children }) => {
              const target = docs.find((d) => href.endsWith(d.file));
              if (target)
                return (
                  <button type="button" className="text-brass underline underline-offset-4" onClick={() => setDoc(target.id)}>
                    {children}
                  </button>
                );
              if (/^https?:/.test(href))
                return (
                  <a href={href} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                );
              return <code>{children}</code>;
            },
          }}
        >
          {doc.body}
        </Markdown>
      </article>
    </div>
  );
}
