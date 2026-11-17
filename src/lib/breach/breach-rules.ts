/** The line the next pick must come from: a row, then the picked cell's column, and so on. */
export type BreachCursor = { axis: 'row' | 'col'; line: number }

export const BREACH_START: BreachCursor = { axis: 'row', line: 0 }

export const rowOf = (size: number, cell: number) => Math.floor(cell / size)
export const colOf = (size: number, cell: number) => cell % size

export const isPickable = (
  size: number,
  cursor: BreachCursor,
  picked: readonly number[],
  cell: number,
) =>
  !picked.includes(cell) &&
  (cursor.axis === 'row' ? rowOf(size, cell) : colOf(size, cell)) === cursor.line

/** After a pick the axis flips, onto the line that runs through the picked cell. */
export const nextCursor = (
  size: number,
  cursor: BreachCursor,
  cell: number,
): BreachCursor =>
  cursor.axis === 'row'
    ? { axis: 'col', line: colOf(size, cell) }
    : { axis: 'row', line: rowOf(size, cell) }

/** The cursor after a run of picks, from the opening row. */
export const cursorAfter = (size: number, picked: readonly number[]) =>
  picked.reduce((cursor, cell) => nextCursor(size, cursor, cell), BREACH_START)

export const hasPickable = (
  size: number,
  cursor: BreachCursor,
  picked: readonly number[],
) =>
  Array.from({ length: size * size }, (_, cell) => cell).some((cell) =>
    isPickable(size, cursor, picked, cell),
  )

/** A pick whose code repeats the previous buffer code uses its cell but takes no slot. */
export const bufferCodes = (cells: readonly string[], picked: readonly number[]) =>
  picked.reduce<string[]>((codes, cell) => {
    const code = cells[cell]
    return codes.at(-1) === code ? codes : [...codes, code]
  }, [])

/** The sequence must appear in the buffer as one unbroken run. */
export const hasSequence = (codes: readonly string[], sequence: readonly string[]) =>
  codes.some((_, start) => sequence.every((code, k) => codes[start + k] === code))

/** How many codes at the end of the buffer already begin the sequence. */
export const matchedCount = (codes: readonly string[], sequence: readonly string[]) => {
  for (let k = Math.min(codes.length, sequence.length); k > 0; k--) {
    const tail = codes.slice(codes.length - k)
    if (tail.every((code, index) => code === sequence[index])) return k
  }
  return 0
}
