import { byNewest, type Shelf } from '../collections'
import { BREACH_PROTOCOL } from './breach-protocol'

/**
 * Every game, newest first. Add one file per game and list it here; a playable game also needs
 * its component in `GAME_PLAYERS` (`src/pages/games/game-players.ts`).
 */
export const GAMES = byNewest([BREACH_PROTOCOL])

export const GAMES_SHELF: Shelf = {
  spreadId: 'games',
  theme: 'arcade',
  items: GAMES,
  noun: ['cartridge', 'cartridges'],
  kicker: 'Insert coin // free play forever',
  plate: '/assets/art/arcade-cabinets.webp',
  about: [
    'Small games built for this site. Every cabinet runs right here in the browser: no install, no account, no quarters, and nobody yelling that it is their turn.',
    'Pick a cartridge, blow on it twice for luck, then press start on its Play screen. High scores are entirely on the honour system.',
  ],
  empty: 'No cartridges loaded yet. The arcade owner is still untangling the cables.',
}
