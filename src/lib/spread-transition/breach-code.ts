// The six canonical Breach Protocol codes, plus six more so a dense grid does not
// read as the same handful of pairs tiled over and over.
const HEX = [
  '1C',
  '55',
  '7A',
  'BD',
  'E9',
  'FF',
  '2B',
  '3D',
  '4A',
  '6F',
  '8C',
  'D4',
] as const

export type BreachCode = { size: number; cells: string[]; path: number[] }

const hashSeed = (seed: string) => {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const mulberry32 = (seed: number) => {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * A deterministic matrix for a destination, so re-renders never reshuffle it. The path follows
 * the Breach Protocol rule: a cell in row 0, then alternately a free cell in the current column
 * and in the current row.
 */
export const buildBreachCode = (
  seed: string,
  size: number,
  steps: number,
): BreachCode => {
  const random = mulberry32(hashSeed(seed))
  const pick = <T>(items: readonly T[]) => items[Math.floor(random() * items.length)]

  const cells = Array.from({ length: size * size }, () => pick(HEX))
  const path: number[] = []
  let row = 0
  let col = 0

  for (let step = 0; step < steps; step++) {
    const alongRow = step % 2 === 0
    const free = Array.from({ length: size }, (_, k) =>
      alongRow ? row * size + k : k * size + col,
    ).filter((cell) => !path.includes(cell))
    if (free.length === 0) break
    const cell = pick(free)
    path.push(cell)
    row = Math.floor(cell / size)
    col = cell % size
  }

  return { size, cells, path }
}
