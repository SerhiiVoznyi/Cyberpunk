/** Balance for the Breach riddle. The engine resolves one preset when the riddle mounts. */
export type BreachGameConfig = {
  /** Cells per side of the square matrix. */
  size: number
  sequenceLength: number
  /** Buffer slots. Omit to use sequenceLength + BREACH_GAME_DEFAULTS.bufferSpare. */
  buffer?: number
  /** Free picks before the sequence starts on the planted path, so it rarely begins in the top row. */
  lead: number
  /** Copies of sequence codes scattered off the path, as false starts. */
  decoys: number
  /** Time to land the sequence once the first code is picked. */
  timeMs: number
  /** The clock turns urgent once this much time is left. */
  hurryMs?: number
  /** How long ACCESS GRANTED holds before the real page turns in. */
  solvedHoldMs?: number
}

export const BREACH_GAME_DEFAULTS = {
  bufferSpare: 2,
  hurryMs: 5_000,
  solvedHoldMs: 1_100,
} as const

// Phone cells must stay touch-sized, so the phone grid is a size smaller.
export const BREACH_GAME = {
  desktop: { size: 7, sequenceLength: 5, lead: 1, decoys: 8, timeMs: 15_000 },
  phone: { size: 6, sequenceLength: 4, lead: 1, decoys: 6, timeMs: 15_000 },
} as const satisfies Record<'desktop' | 'phone', BreachGameConfig>
