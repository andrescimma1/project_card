import { useStore } from 'zustand';
import { createStoryStore, fetchCityScript, type StoryState } from './storyStore';
import { sessionStore } from './useSession';

function safeStorage() {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/** The single story-mode store of the app. */
export const storyStore = createStoryStore({ loadScript: fetchCityScript, storage: safeStorage(), session: sessionStore, seed: Date.now() >>> 0 });

if (import.meta.env.DEV && typeof window !== 'undefined') Object.assign(window, { __dcbStory: storyStore });

export function useStory<T>(selector: (s: StoryState) => T): T {
  return useStore(storyStore, selector);
}
