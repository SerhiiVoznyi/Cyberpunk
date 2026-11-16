import { createContext } from 'react'

import type { BreachPuzzle } from './breach-code'
import type { BreachCursor } from './breach-rules'

export type BreachPhase = 'ready' | 'running' | 'solved' | 'failed'
export type BreachFailure = 'timeout' | 'buffer'

export type BreachGameValue = {
  puzzle: BreachPuzzle
  phase: BreachPhase
  /** Picked cells in order; their codes fill the buffer. */
  picked: number[]
  cursor: BreachCursor
  failure: BreachFailure | null
  /** Set once `hurryMs` or less remain. */
  hurry: boolean
  hurryMs: number
  /** Counts runs, so each retry can remount and restart its animations. */
  attempt: number
  timeMs: number
  canPick: (cell: number) => boolean
  pick: (cell: number) => void
  retry: () => void
}

export const BreachGameContext = createContext<BreachGameValue | null>(null)
