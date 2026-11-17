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

export type BreachDifficulty = {
  size: number
  sequence: number
  buffer: number
  /** Free picks before the sequence starts, so it rarely begins in the top row. */
  lead: number
  /** Extra copies of the sequence's codes scattered off the path, as false starts. */
  decoys: number
}

export type BreachPuzzle = {
  size: number
  cells: string[]
  /** The codes to land in the buffer, in order. */
  sequence: string[]
  buffer: number
  /** The planted solution, lead picks included. */
  path: number[]
}

/**
 * A playable matrix. The sequence is planted along a legal path after `lead` free picks, so every
 * puzzle can be solved within `lead + sequence` picks; decoys never touch that path. Adjacent
 * sequence codes always differ, since a repeated code takes no buffer slot.
 */
export const buildBreachPuzzle = (
  seed: string,
  { size, sequence, buffer, lead, decoys }: BreachDifficulty,
): BreachPuzzle => {
  const { cells, path } = buildBreachCode(seed, size, lead + sequence)
  const planted = path.slice(lead)

  const reroll = mulberry32(hashSeed(`${seed}:sequence`))
  for (let k = 1; k < planted.length; k++) {
    const previous = cells[planted[k - 1]]
    if (cells[planted[k]] !== previous) continue
    const others = HEX.filter((code) => code !== previous)
    cells[planted[k]] = others[Math.floor(reroll() * others.length)]
  }
  const codes = planted.map((cell) => cells[cell])

  const random = mulberry32(hashSeed(`${seed}:decoys`))
  const open = cells.map((_, cell) => cell).filter((cell) => !path.includes(cell))
  for (let k = 0; k < decoys && open.length > 0; k++) {
    const [cell] = open.splice(Math.floor(random() * open.length), 1)
    cells[cell] = codes[Math.floor(random() * codes.length)]
  }

  return { size, cells, sequence: codes, buffer, path }
}
