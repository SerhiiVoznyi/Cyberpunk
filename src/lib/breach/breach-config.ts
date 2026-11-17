import { BREACH_GAME_DEFAULTS, type BreachGameConfig } from '@/content/breach-game'

import type { BreachDifficulty } from './breach-code'

export type BreachSettings = {
  difficulty: BreachDifficulty
  timeMs: number
  hurryMs: number
  solvedHoldMs: number
}

/** Fills a preset's defaults. Throws on a config no puzzle can satisfy, so a bad edit fails loudly. */
export const resolveBreachSettings = (config: BreachGameConfig): BreachSettings => {
  const {
    size,
    sequenceLength,
    lead,
    decoys,
    timeMs,
    buffer = sequenceLength + BREACH_GAME_DEFAULTS.bufferSpare,
    hurryMs = BREACH_GAME_DEFAULTS.hurryMs,
    solvedHoldMs = BREACH_GAME_DEFAULTS.solvedHoldMs,
  } = config

  if (sequenceLength < 2)
    throw new Error('Breach config: sequenceLength must be at least 2')
  if (buffer < sequenceLength) {
    throw new Error('Breach config: buffer must hold the whole sequence')
  }
  // Past this the alternating path planter can run out of free cells on its line.
  if (lead + sequenceLength > size * 2) {
    throw new Error('Breach config: lead + sequenceLength must not exceed size * 2')
  }
  if (hurryMs >= timeMs) throw new Error('Breach config: hurryMs must be below timeMs')

  return {
    difficulty: { size, sequence: sequenceLength, buffer, lead, decoys },
    timeMs,
    hurryMs,
    solvedHoldMs,
  }
}
