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

export const hasPickable = (
  size: number,
  cursor: BreachCursor,
  picked: readonly number[],
) =>
  Array.from({ length: size * size }, (_, cell) => cell).some((cell) =>
    isPickable(size, cursor, picked, cell),
  )

/** The sequence must appear in the buffer as one unbroken run. */
export const hasSequence = (codes: readonly string[], sequence: readonly string[]) =>
  codes.some((_, start) => sequence.every((code, k) => codes[start + k] === code))
