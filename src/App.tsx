import { AudioDirector } from './audio/AudioDirector';
import { cardDb } from './engine/cards/db';
import { useBrowser, type View } from './store';
import { CardBrowser } from './ui/CardBrowser';
import { DocsView } from './ui/DocsView';
import { PlayScreen } from './ui/play/PlayScreen';
import { DeckBuilder } from './ui/decks/DeckBuilder';
import { StoryScreen } from './ui/story/StoryScreen';
import { AudioButton } from './ui/AudioPanel';

const TABS: { id: View; label: string }[] = [
  { id: 'story', label: 'Historia' },
  { id: 'play', label: 'Partida libre' },
  { id: 'decks', label: 'Mazos' },
  { id: 'cards', label: `Cartas (${cardDb.cardCount})` },
  { id: 'rules', label: 'Reglas investigadas' },
];

/**
 * A game shell: a slim bar on top and the screen below, filling the window. The page never scrolls;
 * the board scales to fit, and long lists scroll inside their own area.
 */
export default function App() {
  const { view, setView } = useBrowser();
  return (
    <div className="app-bg flex h-full flex-col overflow-hidden">
      <AudioDirector />
      <header className="relative z-30 flex h-11 shrink-0 items-center gap-8 bg-void/85 px-5 whitespace-nowrap shadow-[0_1px_0_rgb(72_228_255/0.25),0_6px_20px_rgb(0_0_0/0.4)]">
        <span className="hidden shrink-0 items-baseline gap-2 md:flex" title="Reglas, cartas, mazos, arte e IA leídos del disco original (SLUS-01328)">
          <span className="font-display text-[21px] font-black tracking-tight italic">Digital Card Battle</span>
          <span className="font-display text-[14px] font-semibold text-cyan italic">remake</span>
        </span>
        <nav className="thin-scroll flex h-full min-w-0 flex-1 items-stretch gap-1 overflow-x-auto" aria-label="Secciones">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              data-sfx="tab"
              onClick={() => setView(t.id)}
              aria-current={view === t.id ? 'page' : undefined}
              className={`relative px-3 font-display text-[15px] font-semibold italic transition-colors ${view === t.id ? 'text-ink' : 'text-haze/70 hover:text-ink'}`}
            >
              {t.label}
              {view === t.id && <span className="absolute inset-x-2 bottom-0 h-[3px] bg-cyan shadow-[0_0_10px_var(--color-cyan)]" />}
            </button>
          ))}
        </nav>
        <AudioButton />
      </header>
      <main className="relative min-h-0 flex-1">
        <div className="thin-scroll h-full overflow-y-auto">
          <div className="mx-auto max-w-[110rem] px-4 py-6 sm:px-6">
            {view === 'story' ? <StoryScreen /> : view === 'play' ? <PlayScreen /> : view === 'decks' ? <DeckBuilder /> : view === 'cards' ? <CardBrowser /> : <DocsView />}
          </div>
        </div>
      </main>
    </div>
  );
}
