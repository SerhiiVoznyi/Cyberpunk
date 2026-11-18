import { lazy } from 'react'

import type { ItemPlayer } from '../collection-item/collection-item-sheets'

const breachProtocol = () => import('./breach-protocol/breach-protocol-game')

/** The playable part of each game, by slug, loaded only when its page opens. */
export const GAME_PLAYERS: Record<string, ItemPlayer> = {
  'breach-protocol': {
    Session: lazy(() =>
      breachProtocol().then((module) => ({ default: module.BreachProtocolSession })),
    ),
    Play: lazy(() =>
      breachProtocol().then((module) => ({ default: module.BreachProtocolPlay })),
    ),
    Manual: lazy(() =>
      breachProtocol().then((module) => ({ default: module.BreachProtocolManual })),
    ),
  },
}
