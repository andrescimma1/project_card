/**
 * Mounted once by the app: installs the audio system and keeps the music in step with the screen and
 * the match. The mood is read from the board being SHOWN (during a battle replay, the board before
 * it), so the music never gives away a result the player has not seen yet.
 */
import { useEffect } from 'react';
import { useStory } from '../game/useStory';
import { useSession } from '../game/useSession';
import { useBrowser } from '../store';
import { installAudio } from './director';
import { audio } from './manager';
import { musicFor, type MatchMood } from './music/select';

export function AudioDirector() {
  useEffect(() => installAudio(), []);

  const view = useBrowser((s) => s.view);
  const game = useSession((s) => s.game);
  const scene = useSession((s) => s.scenes[0] ?? null);
  const twoPlayer = useSession((s) => s.twoPlayer);
  const story = useStory((s) => s.view);
  const won = useStory((s) => s.won);
  const screen = useStory((s) => (s.request?.kind === 'screen' ? s.request.screen : null));

  const shown = scene?.kind === 'battle' && scene.state ? scene.state : game;
  const match: MatchMood | null =
    game && shown
      ? {
          phase: shown.phase.name,
          turnNumber: shown.turnNumber,
          ended: game.phase.name === 'gameOver' && !scene,
          viewerWon: twoPlayer || game.winner === 0,
          rounds: [shown.players[0].rounds, shown.players[1].rounds],
          evolving: scene?.kind === 'digivolve',
        }
      : null;
  const track = musicFor({ view, story, storyWin: won, storyScreen: screen, match, editingDeck: false });

  useEffect(() => audio.setTrack(track), [track]);
  return null;
}
