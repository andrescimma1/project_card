import { cardDb } from './engine/cards/db';
import { useBrowser, type View } from './store';
import { CardBrowser } from './ui/CardBrowser';
import { DocsView } from './ui/DocsView';
import { PlayScreen } from './ui/play/PlayScreen';
import { DeckBuilder } from './ui/decks/DeckBuilder';
import { StoryScreen } from './ui/story/StoryScreen';

const TABS: { id: View; label: string }[] = [
  { id: 'story', label: 'Historia' },
  { id: 'play', label: 'Partida libre' },
  { id: 'decks', label: 'Mazos' },
  { id: 'cards', label: `Cartas (${cardDb.cardCount})` },
  { id: 'rules', label: 'Reglas investigadas' },
];

export default function App() {
  const { view, setView } = useBrowser();
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b border-grid bg-abyss/90 backdrop-blur">
        <div className="mx-auto flex max-w-[110rem] flex-wrap items-center gap-x-8 gap-y-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight">Digital Card Battle, remake fiel</h1>
            <p className="text-sm text-haze">Etapa 6: modo historia, IA original de la CPU y mazos propios. Reglas, cartas, mazos, arte e IA leídos del disco original (SLUS-01328).</p>
          </div>
          <nav className="flex gap-1 rounded-full border border-grid p-1" aria-label="Secciones">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setView(t.id)}
                aria-current={view === t.id ? 'page' : undefined}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${view === t.id ? 'bg-ink text-abyss' : 'text-haze hover:text-ink'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[110rem] px-4 py-6 sm:px-6">{view === 'story' ? <StoryScreen /> : view === 'play' ? <PlayScreen /> : view === 'decks' ? <DeckBuilder /> : view === 'cards' ? <CardBrowser /> : <DocsView />}</main>
    </div>
  );
}
