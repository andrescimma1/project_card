/** Texts shared by the whole app in English. Same keys as the Spanish file (the compiler checks it). */
import type { common as es } from '../es/common';

export const common: typeof es = {
  tabs: { story: 'Story', play: 'Free battle', decks: 'Decks', cards: (n: number) => `Cards (${n})`, rules: 'Researched rules' },
  sections: 'Sections',
  titleHint: 'Rules engine, cards and AI based on the original game (SLUS-01328)',
  language: 'Language',
  rotate: 'Turn your device: the board is designed for landscape.',
};
