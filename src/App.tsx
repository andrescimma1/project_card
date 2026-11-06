import { AudioDirector } from './audio/AudioDirector';
import { cardDb } from './engine/cards/db';
import { useBrowser, type View } from './store';
import { CardBrowser } from './ui/CardBrowser';
import { DocsView } from './ui/DocsView';
import { PlayScreen } from './ui/play/PlayScreen';
import { DeckBuilder } from './ui/decks/DeckBuilder';
import { StoryScreen } from './ui/story/StoryScreen';
import { AudioButton } from './ui/AudioPanel';
import { BackSigil } from './ui/play/glyphs';
import { TERMS } from './ui/vocab/terms';

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
      <header
        className="relative z-30 flex h-11 shrink-0 items-center gap-8 px-5 whitespace-nowrap shadow-[0_2px_0_#6f5638,0_3px_0_#140e09,0_8px_20px_rgb(0_0_0/0.45)]"
        style={{ background: 'var(--grain), linear-gradient(180deg, #2c2118, #1b140f)' }}
      >
        <span className="hidden shrink-0 items-center gap-2 md:flex" title="Motor de reglas, cartas e IA basados en el juego original (SLUS-01328)">
          <BackSigil className="size-[22px] text-brass" />
          <span className="font-display text-[22px] font-black tracking-wide text-bone">{TERMS.game}</span>
        </span>
        <nav className="thin-scroll flex h-full min-w-0 flex-1 items-stretch gap-1 overflow-x-auto" aria-label="Secciones">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              data-sfx="tab"
              onClick={() => setView(t.id)}
              aria-current={view === t.id ? 'page' : undefined}
              className={`relative px-3 font-display text-[16px] font-semibold transition-colors ${view === t.id ? 'text-bone' : 'text-faded/70 hover:text-bone'}`}
            >
              {t.label}
              {view === t.id && <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-gold" />}
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
